const uuidv4 = require('uuid').v4;
const dbErrors = require('../utils/errors').dbErrors;

class BaseModel {
    constructor(collectionName, schema, key) {
        this.collectionName = collectionName;
        this.schema = schema;
        this.key = key || '_id';
        this.data = {};
    }

    async find(query={}, options={}) {
        let list = [];
        if (query[this.key]) {
            if (this.data[query[this.key]]) list.push(this.data[query[this.key]]);
        }
        else {
            let skipped = 0;
            for (let currKey in this.data) {
                let currData = this.data[currKey];
                let isValid = true;
                for (let field in query) {
                    if (currData[field] != query[field]) {
                        isValid = false;
                        break;
                    }
                }

                if (isValid) {
                    if (options.skip && skipped < options.skip) skipped++;
                    else list.push(currData);
                }

                if (options.limit && list.length == options.limit) break;
            }
        }

        return list;
    }

    async findOne(query={}, options={}) {
        const findRes = await this.find(query, {...options, limit: 1});
        if (!findRes || !findRes[0]) return null;
        return findRes[0];
    }

    async insert(newData) {
        if (!newData) return dbErrors.INVALID_INSERT_DATA;
        if (!newData[this.key]) newData[this.key] = uuidv4();
        const newDataKey = newData[this.key];

        if (!this.data[newDataKey]) {
            let newRecord = {};
            this.copyBySchema(newData, newRecord);
            this.data[newDataKey] = newRecord;
        }
        return this.data[newDataKey];
    }

    async deleteOne(query) {
        const recordToDelete = await this.findOne(query);
        if (!recordToDelete) return;
        delete this.data[recordToDelete[this.key]];
    }

    async updateOne(query, data) {
        const recordToUpdate = await this.findOne(query, {limit: 1});
        if (!recordToUpdate) return dbErrors.UPDATE_RECORD_NOT_FOUND;
        this.copyBySchema(data, recordToUpdate);
        return recordToUpdate;
    }

    async count(query) {
        let count = 0;
        for (let currKey in this.data) {
            let currData = this.data[currKey];
            let isValid = true;
            for (let field in query) {
                if (currData[field] != query[field]) {
                    isValid = false;
                    break;
                }
            }

            if (isValid) count++;
        }

        return count;
    }

    copyBySchema(from, to) {
        for (let field in this.schema) {
            if (from[field] === undefined) continue;
            to[field] = from[field];
        }
    }
}

module.exports = BaseModel;