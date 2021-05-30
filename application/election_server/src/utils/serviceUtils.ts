export class ServiceUtils {

    /**
     *
     * deleteMyAsset
     *
     * Deletes a key-value pair from the world state, based on the key given.
     *
     * @param myAssetId - the key of the asset to delete
     * @returns - nothing - but deletes the value in the world state
     */
    static async deleteMyAsset(ctx: any, myAssetId: number) {

        const exists = await this.myAssetExists(ctx, myAssetId);
        if (!exists) {
            throw new Error(`The my asset ${myAssetId} does not exist`);
        }

        await ctx.stub.deleteState(myAssetId);

    }

    /**
     *
     * readMyAsset
     *
     * Reads a key-value pair from the world state, based on the key given.
     *
     * @param myAssetId - the key of the asset to read
     * @returns - nothing - but reads the value in the world state
     */
    static async readMyAsset(ctx: any, myAssetId: string): Promise<any> {

        const exists = await this.myAssetExists(ctx, myAssetId);

        if (!exists) {
            // throw new Error(`The my asset ${myAssetId} does not exist`);
            const response = {
                error: ''
            };
            response.error = `The my asset ${myAssetId} does not exist`;
            return response;
        }

        const buffer = await ctx.stub.getState(myAssetId);
        const asset = JSON.parse(buffer.toString());
        return asset;
    }


    /**
     *
     * myAssetExists
     *
     * Checks to see if a key exists in the world state.
     * @param myAssetId - the key of the asset to read
     * @returns boolean indicating if the asset exists or not.
     */
    static async myAssetExists(ctx, myAssetId) {

        const buffer = await ctx.stub.getState(myAssetId);
        return (!!buffer && buffer.length > 0);

    }


    /**
     * Query and return all key value pairs in the world state.
     *
     * @param {Context} ctx the transaction context
     * @returns - all key-value pairs in the world state
     */
    static async queryAll(ctx) {

        const queryString = {
            selector: {}
        };

        const queryResults = await this.queryWithQueryString(ctx, JSON.stringify(queryString));
        return queryResults;

    }

    /**
     * Evaluate a queryString
     *
     * @param {Context} ctx the transaction context
     * @param {String} queryString the query string to be evaluated
     */
    static async queryWithQueryString(ctx, queryString) {

        console.log('query String');
        console.log(JSON.stringify(queryString));

        const resultsIterator = await ctx.stub.getQueryResult(queryString);

        const allResults = [];

        // eslint-disable-next-line no-constant-condition
        while (true) {
            const res = await resultsIterator.next();

            if (res.value && res.value.value.toString()) {
                const jsonRes = {
                    Key: '',
                    Record: ''
                };

                console.log(res.value.value.toString('utf8'));

                jsonRes.Key = res.value.key;

                try {
                    jsonRes.Record = JSON.parse(res.value.value.toString('utf8'));
                } catch (err) {
                    console.log(err);
                    jsonRes.Record = res.value.value.toString('utf8');
                }

                allResults.push(jsonRes);
            }
            if (res.done) {
                console.log('end of data');
                await resultsIterator.close();
                console.info(allResults);
                console.log(JSON.stringify(allResults));
                return JSON.stringify(allResults);
            }
        }
    }

    /**
     * Query by the main objects in this app: ballot, election, votableItem, and Voter.
     * Return all key-value pairs of a given type.
     *
     * @param {Context} ctx the transaction context
     * @param {String} objectType the type of the object - should be either ballot, election, votableItem, or Voter
     */
    static async queryByObjectType(ctx, objectType) {

        const queryString = {
            selector: {
                type: objectType
            }
        };

        const queryResults = await this.queryWithQueryString(ctx, JSON.stringify(queryString));
        return queryResults;

    }
}
