const Redis = require("ioredis");

const client = new Redis({
    // use defaults
})

type Callback = () => any;

interface RateLimitResponse {
    success: boolean;
    remaining: number;
}

export class RedisCache {

    static client() {
        return client;
    }

    public static async keySet(key: string, value: any, seconds?: number): Promise<any> {

        if (seconds) {
            return await client.setex(key, seconds, JSON.stringify(value));
        }

        return await client.set(key, JSON.stringify(value));
    }

    public static async keyGet(key: string): Promise<any> {
        let val = await client.get(key);
        return JSON.parse(val);
    }

    public static async forget(key: string): Promise<void> {
        await client.del(key);
    }

    static async remember(key: string, seconds: number, callback: Callback): Promise<any> {

        const existing = await this.keyGet(key);

        if (existing) {
            return existing;
        }

        let result = await callback();

        await this.keySet(key, result, seconds);

        return await this.keyGet(key);
    }

    static async rateLimit(key: string, decayInSeconds: number, maxAttempts: number): Promise<RateLimitResponse> {

        // has to be milliseconds,
        // otherwise if you use seconds and you call this multiple times per second,
        // only one timestamp item will be added to the list
        const time = Date.now(); //timestampInSeconds();

        const removeBefore = (time - (decayInSeconds * 1000));

        // TODO: this all belongs in multi()
        await client.zremrangebyscore(key, 0, removeBefore);
        const count = await client.zcount(key, 0, '+inf');

        if (count < maxAttempts) {
            await client.zadd(key, time, `${time}`);

            return {
                success: true,
                remaining: (maxAttempts - count - 1),
            }
        }

        return {
            success: false,
            remaining: 0
        }
    }
}