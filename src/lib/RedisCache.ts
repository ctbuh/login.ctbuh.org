const Redis = require("ioredis");

const client = new Redis({
    // use defaults
})

type Callback = () => any;

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

    static async remember(key: string, seconds: number, callback: Callback): Promise<any> {

        const existing = await this.keyGet(key);

        if (existing) {
            return existing;
        }

        let result = await callback();

        await this.keySet(key, result, seconds);

        return await this.keyGet(key);
    }
}