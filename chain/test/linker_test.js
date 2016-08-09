/* eslint-disable */

var assert = require('chai').assert;
var linker = require(__js+'/linker');

var username = 'test_usermanager';
var pseudoAddr = '04E981FCA9F0A28AF3631BC01E8DFF1AA1829577';

describe('Linker', function () {
    this.timeout(3000);

    describe('linkTaskToUser()', function () {
        it('links a task address to a user contract', function (done) {
            linker.linkTaskToUser(username, pseudoAddr, function (err, user) {
                assert.isNull(err);
                done();
            })
        })
    });

})