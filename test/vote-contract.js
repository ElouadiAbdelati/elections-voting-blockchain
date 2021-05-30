/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { ChaincodeStub, ClientIdentity } = require('fabric-shim');
const { VoteContract } = require('..');
const winston = require('winston');

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

chai.should();
chai.use(chaiAsPromised);
chai.use(sinonChai);

class TestContext {

    constructor() {
        this.stub = sinon.createStubInstance(ChaincodeStub);
        this.clientIdentity = sinon.createStubInstance(ClientIdentity);
        this.logger = {
            getLogger: sinon.stub().returns(sinon.createStubInstance(winston.createLogger().constructor)),
            setLevel: sinon.stub(),
        };
    }

}

describe('VoteContract', () => {

    let contract;
    let ctx;

    beforeEach(() => {
        contract = new VoteContract();
        ctx = new TestContext();
        ctx.stub.getState.withArgs('1001').resolves(Buffer.from('{"value":"vote 1001 value"}'));
        ctx.stub.getState.withArgs('1002').resolves(Buffer.from('{"value":"vote 1002 value"}'));
    });

    describe('#voteExists', () => {

        it('should return true for a vote', async () => {
            await contract.voteExists(ctx, '1001').should.eventually.be.true;
        });

        it('should return false for a vote that does not exist', async () => {
            await contract.voteExists(ctx, '1003').should.eventually.be.false;
        });

    });

    describe('#createVote', () => {

        it('should create a vote', async () => {
            await contract.createVote(ctx, '1003', 'vote 1003 value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1003', Buffer.from('{"value":"vote 1003 value"}'));
        });

        it('should throw an error for a vote that already exists', async () => {
            await contract.createVote(ctx, '1001', 'myvalue').should.be.rejectedWith(/The vote 1001 already exists/);
        });

    });

    describe('#readVote', () => {

        it('should return a vote', async () => {
            await contract.readVote(ctx, '1001').should.eventually.deep.equal({ value: 'vote 1001 value' });
        });

        it('should throw an error for a vote that does not exist', async () => {
            await contract.readVote(ctx, '1003').should.be.rejectedWith(/The vote 1003 does not exist/);
        });

    });

    describe('#updateVote', () => {

        it('should update a vote', async () => {
            await contract.updateVote(ctx, '1001', 'vote 1001 new value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1001', Buffer.from('{"value":"vote 1001 new value"}'));
        });

        it('should throw an error for a vote that does not exist', async () => {
            await contract.updateVote(ctx, '1003', 'vote 1003 new value').should.be.rejectedWith(/The vote 1003 does not exist/);
        });

    });

    describe('#deleteVote', () => {

        it('should delete a vote', async () => {
            await contract.deleteVote(ctx, '1001');
            ctx.stub.deleteState.should.have.been.calledOnceWithExactly('1001');
        });

        it('should throw an error for a vote that does not exist', async () => {
            await contract.deleteVote(ctx, '1003').should.be.rejectedWith(/The vote 1003 does not exist/);
        });

    });

});
