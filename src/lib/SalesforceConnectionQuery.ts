import {Connection} from "jsforce";
import {DescribeSObjectResult} from "jsforce/describe-result";

export class SalesforceConnectionQuery {

    protected connection: Connection;

    constructor(connection: Connection) {
        this.connection = connection;
    }

    async getAllFieldNamesFor(type: string): Promise<Array<string>> {

        let result: DescribeSObjectResult = await this.connection.describe(type);

        let fields = [];

        for (let i = 0; i < result.fields.length; i++) {
            fields.push(result.fields[i].name);
        }

        return fields;
    }

    protected async findContactRow(id: string): Promise<any> {
        let names = await this.getAllFieldNamesFor('Contact');

        let query = /** @text text */ `SELECT ${names.join(', ')} FROM Contact WHERE Id = '${id}'`;

        let result = await this.connection.query(query);

        if (result.totalSize > 0) {
            return result.records[0];
        }

        return null;
    }

    async findContact(id: string): Promise<any> {
        return this.connection.retrieve('Contact', id);
    }

    async findAccount(id: string) {
        return this.connection.retrieve('Account', id);
    }
}