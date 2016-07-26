/* eslint-disable */

var assert = require('chai').assert;
var app = require('../app');
var eris = require(__libs+'/eris/eris-wrapper');
var taskManager = require('../js/taskManager');

var refAddr;
var testTask = {
    id: "test0",
    title: "TestTitle",
    desc: "Test Description",
    status: "To Do",
    complete: "0/?",
    reward: "200"
};

describe("Task Manager", function () {

    describe("addTask", function () {
        it("adds the given task to the chain and returns true if a record was overwritten, false otherwise", function(done) {
            taskManager.addTask(testTask, function (error, result) {
                assert.isNull(error);
                // TODO reactivate this and the inverse when deletion is implemented
                // assert.equal(result, false, "no overwrite on first pass => false");
                done();
            });
        });
    });

    describe("getTaskAtIndex", function () {
        it("returns the address of the task at the passed index and its `nextIndex` indicator", function (done) {
            taskManager.getTaskAtIndex(0, function (error, data) {
                assert.isNull(error);
                assert.notEqual(data[0], null, "returned address should never be null");
                assert.notEqual(data[1], null, "returned nextIdx should never be null");
                done();
            })
        })
    })

    describe("getTaskListSize", function () {
        it("returns the current total size of the task list map", function (done) {
            taskManager.getTaskListSize(function (error, size) {
                assert.isNull(error);
                assert.notEqual(size, null, "`size` should return 0 or greater");
                done();
            })
        })
    });

    describe("getAllTasks", function () {
       it("retrieves all tasks from the given start index onwards", function (done) {
           taskManager.getAllTaskAddresses(function (err, addresses) {
               assert.isNull(err);
               assert.isNotNull(addresses, "`addresses` array should not be null");
               assert.isAtLeast(addresses.length, 1, "There should be at least 1 element from running the `addTask` test");
               refAddr = addresses[0];
               done();
           });
       })
    });

    describe("getTaskAtAddress", function () {
        it("retrieves the task contract registered at the passed address and transforms it into a task object", function (done) {
            var taskType = [ 'address', 'status', 'reward', 'title', 'complete', 'desc', 'id' ];

            taskManager.getTaskAtAddress(refAddr, function (err, task) {
                assert.isNull(err);
                assert.notDeepEqual(task, {}, "returned task object should not be empty");
                assert.sameMembers(Object.keys(task), taskType, "returned task object's keys should adhere to Task type");
                assert.strictEqual(task.id, "test0")
                done();
            });
        });
    });

});
