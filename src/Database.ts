import mysql, {FieldInfo, MysqlError, Pool, PoolConnection} from "mysql";
import {DatabaseConfig} from "./config";

export class Database {

    private static instance: Database;
    protected pool: Pool;

    public static queryLog: Array<string> = new Array<string>();

    constructor() {

        const config: DatabaseConfig = DatabaseConfig.getInstance();

        this.pool = mysql.createPool({
            host: config.host,
            user: config.username,
            password: config.password,
            database: config.database
        });
    }

    async query(query: string, params?: Array<any>): Promise<Array<Object>> {

        return new Promise((resolve, reject) => {

            this.pool.getConnection(async function (err: MysqlError, connection: PoolConnection) {

                if (err) {

                    if (connection) {
                        connection.release();
                    }

                    return reject(err);
                }

                connection.query(query, params, function (err: MysqlError | null, results?: any, fields?: FieldInfo[]) {
                    connection.release();

                    if (err) {
                        console.log(err?.sql);

                        return reject(err);
                    }

                    let json = JSON.parse(JSON.stringify(results));
                    resolve(json);
                });

            });
        });
    }
}
