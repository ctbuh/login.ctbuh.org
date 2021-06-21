import {RedisCache} from "../src/lib/RedisCache";

var assert = require('assert');

/*
describe('Array', function () {
    describe('#indexOf()', function () {
        it('should return -1 when the value is not present', function () {
            assert.equal([1, 2, 3].indexOf(4), -1);
        });
    });
});
*/

describe('RedisCache', () => {

    describe('#objectSetAndGet', function () {

        it('am able to store and retrieve objects', async function () {

            let value = {one: 1, two: 2, three: 3};

            await RedisCache.keySet('key', value);

            let valueGet = await RedisCache.keyGet('key');

            assert.deepStrictEqual(valueGet, value);
        });
    });
});
