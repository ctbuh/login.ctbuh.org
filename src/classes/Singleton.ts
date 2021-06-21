export abstract class Singleton {

    protected constructor() {
        // do nothing
    }

    public static getInstance<T>(): T {
        let instance = (<any>this)._instance;

        if (!instance) {
            instance = (<any>this)._instance = new (<any>this)();
        }

        return instance;
    }
}