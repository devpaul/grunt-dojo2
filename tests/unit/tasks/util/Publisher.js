(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "intern!object", "intern/chai!assert", "sinon", "grunt-dojo2/tests/unit/util"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var registerSuite = require("intern!object");
    var assert = require("intern/chai!assert");
    var sinon_1 = require("sinon");
    var util_1 = require("grunt-dojo2/tests/unit/util");
    var cachedTravisBranchEnv = process.env.TRAVIS_BRANCH;
    var cloneDir = '_tests/cloneDir';
    var generatedDocsDir = '_tests/generatedDocsDir';
    var cpStub = sinon_1.stub();
    var rmStub = sinon_1.stub();
    var chmodStub = sinon_1.stub();
    var execStub = sinon_1.stub();
    var existsStub = sinon_1.stub();
    var Publisher;
    function assertCommit() {
        assert.isTrue(execStub.called);
        assert.isTrue(rmStub.called);
        assert.isTrue(cpStub.called);
    }
    registerSuite({
        name: 'tasks/util/Publisher',
        setup: function () {
            var mocks = {
                'shelljs': {
                    config: {},
                    cp: cpStub,
                    rm: rmStub
                },
                fs: {
                    chmodSync: chmodStub,
                    existsSync: existsStub
                },
                './exec': {
                    'default': execStub
                }
            };
            Publisher = util_1.loadModule('grunt-dojo2/tasks/util/Publisher', mocks);
        },
        beforeEach: function () {
            cpStub.reset();
            execStub.reset();
            rmStub.reset();
            chmodStub.reset();
            existsStub.reset();
        },
        teardown: function () {
            util_1.unloadTasks();
        },
        construct: {
            'no overrides': function () {
                var publisher = new Publisher(cloneDir, generatedDocsDir);
                assert.strictEqual(publisher.branch, 'gh-pages');
                assert.strictEqual(publisher.cloneDir, cloneDir);
                assert.strictEqual(publisher.deployKey, false);
                assert.strictEqual(publisher.generatedDocsDirectory, generatedDocsDir);
                assert.isDefined(publisher.log);
                assert.isFalse(publisher.skipPublish);
                assert.strictEqual(publisher.subDirectory, 'api');
                assert.isTrue(publisher.url.indexOf('git@github.com') >= 0);
                assert.strictEqual(publisher.shouldPush, Publisher.prototype.shouldPush);
            },
            'with overrides': function () {
                var overrides = {
                    branch: 'branch',
                    deployKey: 'deployKey',
                    log: { writeln: sinon_1.stub() },
                    skipPublish: true,
                    shouldPush: function () { return false; },
                    subDirectory: 'subDirectory',
                    url: 'tacos'
                };
                var publisher = new Publisher(cloneDir, generatedDocsDir, overrides);
                assert.strictEqual(publisher.branch, overrides.branch);
                assert.strictEqual(publisher.cloneDir, cloneDir);
                assert.strictEqual(publisher.deployKey, overrides.deployKey);
                assert.strictEqual(publisher.generatedDocsDirectory, generatedDocsDir);
                assert.deepEqual(publisher.log, overrides.log);
                assert.isTrue(publisher.skipPublish);
                assert.strictEqual(publisher.subDirectory, overrides.subDirectory);
                assert.strictEqual(publisher.url, overrides.url);
                assert.strictEqual(publisher.shouldPush, overrides.shouldPush);
            },
            'default logger': function () {
                var publisher = new Publisher(cloneDir, generatedDocsDir);
                publisher.log.writeln('hi');
            }
        },
        hasDeployCredentials: {
            'deployKey false; returns false': function () {
                var publisher = new Publisher(cloneDir, generatedDocsDir, {
                    deployKey: false
                });
                assert.isFalse(publisher.hasDeployCredentials());
            },
            'missing deployKeyTag; returns false': function () {
                existsStub.returns(false);
                var publisher = new Publisher(cloneDir, generatedDocsDir, {
                    deployKey: 'does not exist'
                });
                assert.isFalse(publisher.hasDeployCredentials());
            },
            'missing keyFile; returns false': function () {
                existsStub.returns(true);
                var publisher = new Publisher(cloneDir, generatedDocsDir, {
                    deployKey: 'deploy_key'
                });
                assert.isTrue(publisher.hasDeployCredentials());
            }
        },
        publish: {
            beforeEach: function () {
                existsStub.onFirstCall().returns(false);
            },
            'skipPublish; commit only': function () {
                var log = { writeln: sinon_1.stub() };
                var publisher = new Publisher(cloneDir, generatedDocsDir, {
                    log: log,
                    skipPublish: true
                });
                var canPublishSpy = sinon_1.spy(publisher, 'canPublish');
                publisher.publish();
                assertCommit();
                assert.isFalse(canPublishSpy.called);
                assert.strictEqual(log.writeln.lastCall.args[0], 'Only committing -- skipping push to repo');
            },
            'shouldPush false; commit only': function () {
                var log = { writeln: sinon_1.stub() };
                var publisher = new Publisher(cloneDir, generatedDocsDir, {
                    log: log,
                    shouldPush: function () { return false; }
                });
                var canPublishSpy = sinon_1.spy(publisher, 'canPublish');
                publisher.publish();
                assertCommit();
                assert.isFalse(canPublishSpy.called);
                assert.strictEqual(log.writeln.lastCall.args[0], 'Only committing -- skipping push to repo');
            },
            'canPublish false; logs error': function () {
                var log = { writeln: sinon_1.stub() };
                var publisher = new Publisher(cloneDir, generatedDocsDir, {
                    log: log,
                    shouldPush: function () { return true; }
                });
                var canPublish = sinon_1.stub(publisher, 'canPublish');
                canPublish.returns(false);
                publisher.publish();
                assertCommit();
                assert.strictEqual(log.writeln.lastCall.args[0], 'Push check failed -- not publishing API docs');
            },
            'working case': function () {
                existsStub.returns(true);
                var log = { writeln: sinon_1.stub() };
                var publisher = new Publisher(cloneDir, generatedDocsDir, {
                    log: log,
                    shouldPush: function () { return true; },
                    deployKey: 'deploy_key'
                });
                publisher.publish();
                assertCommit();
                assert.strictEqual(log.writeln.lastCall.args[0], 'Pushed gh-pages to origin');
            }
        },
        shouldPush: {
            setup: function () {
                process.env.TRAVIS_BRANCH = '';
            },
            teardown: function () {
                process.env.TRAVIS_BRANCH = cachedTravisBranchEnv;
            },
            'not master; returns false': function () {
                execStub.returns('branch');
                var publisher = new Publisher(cloneDir, generatedDocsDir);
                assert.isFalse(publisher.shouldPush());
            },
            'branch is master; returns true': function () {
                execStub.returns('master');
                var publisher = new Publisher(cloneDir, generatedDocsDir);
                assert.isTrue(publisher.shouldPush());
            },
            'travis env is master; returns true': function () {
                process.env.TRAVIS_BRANCH = 'master';
                execStub.returns('branch');
                var publisher = new Publisher(cloneDir, generatedDocsDir);
                assert.isTrue(publisher.shouldPush());
            }
        }
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUHVibGlzaGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiUHVibGlzaGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0lBQUEsNkNBQStDO0lBQy9DLDJDQUE2QztJQUM3QywrQkFBNkM7SUFFN0Msb0RBQXNFO0lBR3RFLElBQU0scUJBQXFCLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUM7SUFDeEQsSUFBTSxRQUFRLEdBQUcsaUJBQWlCLENBQUM7SUFDbkMsSUFBTSxnQkFBZ0IsR0FBRyx5QkFBeUIsQ0FBQztJQUNuRCxJQUFNLE1BQU0sR0FBYyxZQUFJLEVBQUUsQ0FBQztJQUNqQyxJQUFNLE1BQU0sR0FBYyxZQUFJLEVBQUUsQ0FBQztJQUNqQyxJQUFNLFNBQVMsR0FBYyxZQUFJLEVBQUUsQ0FBQztJQUNwQyxJQUFNLFFBQVEsR0FBYyxZQUFJLEVBQUUsQ0FBQztJQUNuQyxJQUFNLFVBQVUsR0FBYyxZQUFJLEVBQUUsQ0FBQztJQUNyQyxJQUFJLFNBQW1DLENBQUM7SUFFeEM7UUFDQyxNQUFNLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUMvQixNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUM3QixNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUM5QixDQUFDO0lBQ0QsYUFBYSxDQUFDO1FBQ2IsSUFBSSxFQUFFLHNCQUFzQjtRQUU1QixLQUFLO1lBQ0osSUFBTSxLQUFLLEdBQUc7Z0JBQ2IsU0FBUyxFQUFFO29CQUNWLE1BQU0sRUFBRSxFQUFFO29CQUNWLEVBQUUsRUFBRSxNQUFNO29CQUNWLEVBQUUsRUFBRSxNQUFNO2lCQUNWO2dCQUNELEVBQUUsRUFBRTtvQkFDSCxTQUFTLEVBQUUsU0FBUztvQkFDcEIsVUFBVSxFQUFFLFVBQVU7aUJBQ3RCO2dCQUNELFFBQVEsRUFBRTtvQkFDVCxTQUFT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WUFDdkMsQ0FBQztTQUNEO0tBQ0QsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgcmVnaXN0ZXJTdWl0ZSBmcm9tICdpbnRlcm4hb2JqZWN0JztcbmltcG9ydCAqIGFzIGFzc2VydCBmcm9tICdpbnRlcm4vY2hhaSFhc3NlcnQnO1xuaW1wb3J0IHsgU2lub25TdHViLCBzdHViLCBzcHkgfSBmcm9tICdzaW5vbic7XG5pbXBvcnQgeyBPcHRpb25zLCBkZWZhdWx0IGFzIFB1Ymxpc2hlckluc3RhbmNlIH0gZnJvbSAnZ3J1bnQtZG9qbzIvdGFza3MvdXRpbC9QdWJsaXNoZXInO1xuaW1wb3J0IHsgdW5sb2FkVGFza3MsIGxvYWRNb2R1bGUgfSBmcm9tICdncnVudC1kb2pvMi90ZXN0cy91bml0L3V0aWwnO1xuaW1wb3J0IHsgZXhpc3RzU3luYyB9IGZyb20gJ2ZzJztcblxuY29uc3QgY2FjaGVkVHJhdmlzQnJhbmNoRW52ID0gcHJvY2Vzcy5lbnYuVFJBVklTX0JSQU5DSDtcbmNvbnN0IGNsb25lRGlyID0gJ190ZXN0cy9jbG9uZURpcic7XG5jb25zdCBnZW5lcmF0ZWREb2NzRGlyID0gJ190ZXN0cy9nZW5lcmF0ZWREb2NzRGlyJztcbmNvbnN0IGNwU3R1YjogU2lub25TdHViID0gc3R1YigpO1xuY29uc3Qgcm1TdHViOiBTaW5vblN0dWIgPSBzdHViKCk7XG5jb25zdCBjaG1vZFN0dWI6IFNpbm9uU3R1YiA9IHN0dWIoKTtcbmNvbnN0IGV4ZWNTdHViOiBTaW5vblN0dWIgPSBzdHViKCk7XG5jb25zdCBleGlzdHNTdHViOiBTaW5vblN0dWIgPSBzdHViKCk7XG5sZXQgUHVibGlzaGVyOiB0eXBlb2YgUHVibGlzaGVySW5zdGFuY2U7XG5cbmZ1bmN0aW9uIGFzc2VydENvbW1pdCgpIHtcblx0YXNzZXJ0LmlzVHJ1ZShleGVjU3R1Yi5jYWxsZWQpO1xuXHRhc3NlcnQuaXNUcnVlKHJtU3R1Yi5jYWxsZWQpO1xuXHRhc3NlcnQuaXNUcnVlKGNwU3R1Yi5jYWxsZWQpO1xufVxucmVnaXN0ZXJTdWl0ZSh7XG5cdG5hbWU6ICd0YXNrcy91dGlsL1B1Ymxpc2hlcicsXG5cblx0c2V0dXAoKSB7XG5cdFx0Y29uc3QgbW9ja3MgPSB7XG5cdFx0XHQnc2hlbGxqcyc6IHtcblx0XHRcdFx0Y29uZmlnOiB7fSxcblx0XHRcdFx0Y3A6IGNwU3R1Yixcblx0XHRcdFx0cm06IHJtU3R1YlxuXHRcdFx0fSxcblx0XHRcdGZzOiB7XG5cdFx0XHRcdGNobW9kU3luYzogY2htb2RTdHViLFxuXHRcdFx0XHRleGlzdHNTeW5jOiBleGlzdHNTdHViXG5cdFx0XHR9LFxuXHRcdFx0Jy4vZXhlYyc6IHtcblx0XHRcdFx0J2RlZmF1bHQnOiBleGVjU3R1YlxuXHRcdFx0fVxuXHRcdH07XG5cdFx0UHVibGlzaGVyID0gbG9hZE1vZHVsZSgnZ3J1bnQtZG9qbzIvdGFza3MvdXRpbC9QdWJsaXNoZXInLCBtb2Nrcyk7XG5cdH0sXG5cblx0YmVmb3JlRWFjaCgpIHtcblx0XHRjcFN0dWIucmVzZXQoKTtcblx0XHRleGVjU3R1Yi5yZXNldCgpO1xuXHRcdHJtU3R1Yi5yZXNldCgpO1xuXHRcdGNobW9kU3R1Yi5yZXNldCgpO1xuXHRcdGV4aXN0c1N0dWIucmVzZXQoKTtcblx0fSxcblxuXHR0ZWFyZG93bigpIHtcblx0XHR1bmxvYWRUYXNrcygpO1xuXHR9LFxuXG5cdGNvbnN0cnVjdDoge1xuXHRcdCdubyBvdmVycmlkZXMnKCkge1xuXHRcdFx0Y29uc3QgcHVibGlzaGVyID0gbmV3IFB1Ymxpc2hlcihjbG9uZURpciwgZ2VuZXJhdGVkRG9jc0Rpcik7XG5cblx0XHRcdGFzc2VydC5zdHJpY3RFcXVhbChwdWJsaXNoZXIuYnJhbmNoLCAnZ2gtcGFnZXMnKTtcblx0XHRcdGFzc2VydC5zdHJpY3RFcXVhbChwdWJsaXNoZXIuY2xvbmVEaXIsIGNsb25lRGlyKTtcblx0XHRcdGFzc2VydC5zdHJpY3RFcXVhbChwdWJsaXNoZXIuZGVwbG95S2V5LCBmYWxzZSk7XG5cdFx0XHRhc3NlcnQuc3RyaWN0RXF1YWwocHVibGlzaGVyLmdlbmVyYXRlZERvY3NEaXJlY3RvcnksIGdlbmVyYXRlZERvY3NEaXIpO1xuXHRcdFx0YXNzZXJ0LmlzRGVmaW5lZChwdWJsaXNoZXIubG9nKTtcblx0XHRcdGFzc2VydC5pc0ZhbHNlKHB1Ymxpc2hlci5za2lwUHVibGlzaCk7XG5cdFx0XHRhc3NlcnQuc3RyaWN0RXF1YWwocHVibGlzaGVyLnN1YkRpcmVjdG9yeSwgJ2FwaScpO1xuXHRcdFx0YXNzZXJ0LmlzVHJ1ZShwdWJsaXNoZXIudXJsLmluZGV4T2YoJ2dpdEBnaXRodWIuY29tJykgPj0gMCk7XG5cdFx0XHRhc3NlcnQuc3RyaWN0RXF1YWwocHVibGlzaGVyLnNob3VsZFB1c2gsIFB1Ymxpc2hlci5wcm90b3R5cGUuc2hvdWxkUHVzaCk7XG5cdFx0fSxcblxuXHRcdCd3aXRoIG92ZXJyaWRlcycoKSB7XG5cdFx0XHRjb25zdCBvdmVycmlkZXM6IE9wdGlvbnMgPSB7XG5cdFx0XHRcdGJyYW5jaDogJ2JyYW5jaCcsXG5cdFx0XHRcdGRlcGxveUtleTogJ2RlcGxveUtleScsXG5cdFx0XHRcdGxvZzogeyB3cml0ZWxuOiBzdHViKCkgfSxcblx0XHRcdFx0c2tpcFB1Ymxpc2g6IHRydWUsXG5cdFx0XHRcdHNob3VsZFB1c2g6ICgpID0+IGZhbHNlLFxuXHRcdFx0XHRzdWJEaXJlY3Rvcnk6ICdzdWJEaXJlY3RvcnknLFxuXHRcdFx0XHR1cmw6ICd0YWNvcydcblx0XHRcdH07XG5cdFx0XHRjb25zdCBwdWJsaXNoZXIgPSBuZXcgUHVibGlzaGVyKGNsb25lRGlyLCBnZW5lcmF0ZWREb2NzRGlyLCBvdmVycmlkZXMpO1xuXG5cdFx0XHRhc3NlcnQuc3RyaWN0RXF1YWwocHVibGlzaGVyLmJyYW5jaCwgb3ZlcnJpZGVzLmJyYW5jaCk7XG5cdFx0XHRhc3NlcnQuc3RyaWN0RXF1YWwocHVibGlzaGVyLmNsb25lRGlyLCBjbG9uZURpcik7XG5cdFx0XHRhc3NlcnQuc3RyaWN0RXF1YWwocHVibGlzaGVyLmRlcGxveUtleSwgb3ZlcnJpZGVzLmRlcGxveUtleSk7XG5cdFx0XHRhc3NlcnQuc3RyaWN0RXF1YWwocHVibGlzaGVyLmdlbmVyYXRlZERvY3NEaXJlY3RvcnksIGdlbmVyYXRlZERvY3NEaXIpO1xuXHRcdFx0YXNzZXJ0LmRlZXBFcXVhbChwdWJsaXNoZXIubG9nLCBvdmVycmlkZXMubG9nKTtcblx0XHRcdGFzc2VydC5pc1RydWUocHVibGlzaGVyLnNraXBQdWJsaXNoKTtcblx0XHRcdGFzc2VydC5zdHJpY3RFcXVhbChwdWJsaXNoZXIuc3ViRGlyZWN0b3J5LCBvdmVycmlkZXMuc3ViRGlyZWN0b3J5KTtcblx0XHRcdGFzc2VydC5zdHJpY3RFcXVhbChwdWJsaXNoZXIudXJsLCBvdmVycmlkZXMudXJsKTtcblx0XHRcdGFzc2VydC5zdHJpY3RFcXVhbChwdWJsaXNoZXIuc2hvdWxkUHVzaCwgb3ZlcnJpZGVzLnNob3VsZFB1c2gpO1xuXHRcdH0sXG5cblx0XHQnZGVmYXVsdCBsb2dnZXInKCkge1xuXHRcdFx0Y29uc3QgcHVibGlzaGVyID0gbmV3IFB1Ymxpc2hlcihjbG9uZURpciwgZ2VuZXJhdGVkRG9jc0Rpcik7XG5cdFx0XHRwdWJsaXNoZXIubG9nLndyaXRlbG4oJ2hpJyk7XG5cdFx0fVxuXHR9LFxuXG5cdGhhc0RlcGxveUNyZWRlbnRpYWxzOiB7XG5cdFx0J2RlcGxveUtleSBmYWxzZTsgcmV0dXJucyBmYWxzZScoKSB7XG5cdFx0XHRjb25zdCBwdWJsaXNoZXIgPSBuZXcgUHVibGlzaGVyKGNsb25lRGlyLCBnZW5lcmF0ZWREb2NzRGlyLCB7XG5cdFx0XHRcdGRlcGxveUtleTogZmFsc2Vcblx0XHRcdH0pO1xuXHRcdFx0YXNzZXJ0LmlzRmFsc2UocHVibGlzaGVyLmhhc0RlcGxveUNyZWRlbnRpYWxzKCkpO1xuXHRcdH0sXG5cblx0XHQnbWlzc2luZyBkZXBsb3lLZXlUYWc7IHJldHVybnMgZmFsc2UnKCkge1xuXHRcdFx0ZXhpc3RzU3R1Yi5yZXR1cm5zKGZhbHNlKTtcblx0XHRcdGNvbnN0IHB1Ymxpc2hlciA9IG5ldyBQdWJsaXNoZXIoY2xvbmVEaXIsIGdlbmVyYXRlZERvY3NEaXIsIHtcblx0XHRcdFx0ZGVwbG95S2V5OiAnZG9lcyBub3QgZXhpc3QnXG5cdFx0XHR9KTtcblx0XHRcdGFzc2VydC5pc0ZhbHNlKHB1Ymxpc2hlci5oYXNEZXBsb3lDcmVkZW50aWFscygpKTtcblx0XHR9LFxuXG5cdFx0J21pc3Npbmcga2V5RmlsZTsgcmV0dXJucyBmYWxzZScoKSB7XG5cdFx0XHRleGlzdHNTdHViLnJldHVybnModHJ1ZSk7XG5cdFx0XHRjb25zdCBwdWJsaXNoZXIgPSBuZXcgUHVibGlzaGVyKGNsb25lRGlyLCBnZW5lcmF0ZWREb2NzRGlyLCB7XG5cdFx0XHRcdGRlcGxveUtleTogJ2RlcGxveV9rZXknXG5cdFx0XHR9KTtcblx0XHRcdGFzc2VydC5pc1RydWUocHVibGlzaGVyLmhhc0RlcGxveUNyZWRlbnRpYWxzKCkpO1xuXHRcdH1cblx0fSxcblxuXHRwdWJsaXNoOiB7XG5cdFx0YmVmb3JlRWFjaCgpIHtcblx0XHRcdGV4aXN0c1N0dWIub25GaXJzdENhbGwoKS5yZXR1cm5zKGZhbHNlKTtcblx0XHR9LFxuXG5cdFx0J3NraXBQdWJsaXNoOyBjb21taXQgb25seScoKSB7XG5cdFx0XHRjb25zdCBsb2cgPSB7IHdyaXRlbG46IHN0dWIoKSB9O1xuXHRcdFx0Y29uc3QgcHVibGlzaGVyID0gbmV3IFB1Ymxpc2hlcihjbG9uZURpciwgZ2VuZXJhdGVkRG9jc0Rpciwge1xuXHRcdFx0XHRsb2csXG5cdFx0XHRcdHNraXBQdWJsaXNoOiB0cnVlXG5cdFx0XHR9KTtcblx0XHRcdGNvbnN0IGNhblB1Ymxpc2hTcHkgPSBzcHkocHVibGlzaGVyLCAnY2FuUHVibGlzaCcpO1xuXHRcdFx0cHVibGlzaGVyLnB1Ymxpc2goKTtcblxuXHRcdFx0YXNzZXJ0Q29tbWl0KCk7XG5cdFx0XHRhc3NlcnQuaXNGYWxzZShjYW5QdWJsaXNoU3B5LmNhbGxlZCk7XG5cdFx0XHRhc3NlcnQuc3RyaWN0RXF1YWwobG9nLndyaXRlbG4ubGFzdENhbGwuYXJnc1swXSwgJ09ubHkgY29tbWl0dGluZyAtLSBza2lwcGluZyBwdXNoIHRvIHJlcG8nKTtcblx0XHR9LFxuXG5cdFx0J3Nob3VsZFB1c2ggZmFsc2U7IGNvbW1pdCBvbmx5JygpIHtcblx0XHRcdGNvbnN0IGxvZyA9IHsgd3JpdGVsbjogc3R1YigpIH07XG5cdFx0XHRjb25zdCBwdWJsaXNoZXIgPSBuZXcgUHVibGlzaGVyKGNsb25lRGlyLCBnZW5lcmF0ZWREb2NzRGlyLCB7XG5cdFx0XHRcdGxvZyxcblx0XHRcdFx0c2hvdWxkUHVzaCgpIHsgcmV0dXJuIGZhbHNlOyB9XG5cdFx0XHR9KTtcblx0XHRcdGNvbnN0IGNhblB1Ymxpc2hTcHkgPSBzcHkocHVibGlzaGVyLCAnY2FuUHVibGlzaCcpO1xuXHRcdFx0cHVibGlzaGVyLnB1Ymxpc2goKTtcblxuXHRcdFx0YXNzZXJ0Q29tbWl0KCk7XG5cdFx0XHRhc3NlcnQuaXNGYWxzZShjYW5QdWJsaXNoU3B5LmNhbGxlZCk7XG5cdFx0XHRhc3NlcnQuc3RyaWN0RXF1YWwobG9nLndyaXRlbG4ubGFzdENhbGwuYXJnc1swXSwgJ09ubHkgY29tbWl0dGluZyAtLSBza2lwcGluZyBwdXNoIHRvIHJlcG8nKTtcblx0XHR9LFxuXG5cdFx0J2NhblB1Ymxpc2ggZmFsc2U7IGxvZ3MgZXJyb3InKCkge1xuXHRcdFx0Y29uc3QgbG9nID0geyB3cml0ZWxuOiBzdHViKCkgfTtcblx0XHRcdGNvbnN0IHB1Ymxpc2hlciA9IG5ldyBQdWJsaXNoZXIoY2xvbmVEaXIsIGdlbmVyYXRlZERvY3NEaXIsIHtcblx0XHRcdFx0bG9nLFxuXHRcdFx0XHRzaG91bGRQdXNoKCkgeyByZXR1cm4gdHJ1ZTsgfVxuXHRcdFx0fSk7XG5cdFx0XHRjb25zdCBjYW5QdWJsaXNoID0gc3R1YihwdWJsaXNoZXIsICdjYW5QdWJsaXNoJyk7XG5cdFx0XHRjYW5QdWJsaXNoLnJldHVybnMoZmFsc2UpO1xuXHRcdFx0cHVibGlzaGVyLnB1Ymxpc2goKTtcblxuXHRcdFx0YXNzZXJ0Q29tbWl0KCk7XG5cdFx0XHRhc3NlcnQuc3RyaWN0RXF1YWwobG9nLndyaXRlbG4ubGFzdENhbGwuYXJnc1swXSwgJ1B1c2ggY2hlY2sgZmFpbGVkIC0tIG5vdCBwdWJsaXNoaW5nIEFQSSBkb2NzJyk7XG5cdFx0fSxcblxuXHRcdCd3b3JraW5nIGNhc2UnKCkge1xuXHRcdFx0ZXhpc3RzU3R1Yi5yZXR1cm5zKHRydWUpO1xuXHRcdFx0Y29uc3QgbG9nID0geyB3cml0ZWxuOiBzdHViKCkgfTtcblx0XHRcdGNvbnN0IHB1Ymxpc2hlciA9IG5ldyBQdWJsaXNoZXIoY2xvbmVEaXIsIGdlbmVyYXRlZERvY3NEaXIsIHtcblx0XHRcdFx0bG9nLFxuXHRcdFx0XHRzaG91bGRQdXNoKCkgeyByZXR1cm4gdHJ1ZTsgfSxcblx0XHRcdFx0ZGVwbG95S2V5OiAnZGVwbG95X2tleSdcblx0XHRcdH0pO1xuXHRcdFx0cHVibGlzaGVyLnB1Ymxpc2goKTtcblxuXHRcdFx0YXNzZXJ0Q29tbWl0KCk7XG5cdFx0XHRhc3NlcnQuc3RyaWN0RXF1YWwobG9nLndyaXRlbG4ubGFzdENhbGwuYXJnc1swXSwgJ1B1c2hlZCBnaC1wYWdlcyB0byBvcmlnaW4nKTtcblx0XHR9XG5cdH0sXG5cblx0c2hvdWxkUHVzaDoge1xuXHRcdHNldHVwKCkge1xuXHRcdFx0cHJvY2Vzcy5lbnYuVFJBVklTX0JSQU5DSCA9ICcnO1xuXHRcdH0sXG5cblx0XHR0ZWFyZG93bigpIHtcblx0XHRcdHByb2Nlc3MuZW52LlRSQVZJU19CUkFOQ0ggPSBjYWNoZWRUcmF2aXNCcmFuY2hFbnY7XG5cdFx0fSxcblxuXHRcdCdub3QgbWFzdGVyOyByZXR1cm5zIGZhbHNlJygpIHtcblx0XHRcdGV4ZWNTdHViLnJldHVybnMoJ2JyYW5jaCcpO1xuXHRcdFx0Y29uc3QgcHVibGlzaGVyID0gbmV3IFB1Ymxpc2hlcihjbG9uZURpciwgZ2VuZXJhdGVkRG9jc0Rpcik7XG5cdFx0XHRhc3NlcnQuaXNGYWxzZShwdWJsaXNoZXIuc2hvdWxkUHVzaCgpKTtcblx0XHR9LFxuXG5cdFx0J2JyYW5jaCBpcyBtYXN0ZXI7IHJldHVybnMgdHJ1ZScoKSB7XG5cdFx0XHRleGVjU3R1Yi5yZXR1cm5zKCdtYXN0ZXInKTtcblx0XHRcdGNvbnN0IHB1Ymxpc2hlciA9IG5ldyBQdWJsaXNoZXIoY2xvbmVEaXIsIGdlbmVyYXRlZERvY3NEaXIpO1xuXHRcdFx0YXNzZXJ0LmlzVHJ1ZShwdWJsaXNoZXIuc2hvdWxkUHVzaCgpKTtcblx0XHR9LFxuXG5cdFx0J3RyYXZpcyBlbnYgaXMgbWFzdGVyOyByZXR1cm5zIHRydWUnKCkge1xuXHRcdFx0cHJvY2Vzcy5lbnYuVFJBVklTX0JSQU5DSCA9ICdtYXN0ZXInO1xuXHRcdFx0ZXhlY1N0dWIucmV0dXJucygnYnJhbmNoJyk7XG5cdFx0XHRjb25zdCBwdWJsaXNoZXIgPSBuZXcgUHVibGlzaGVyKGNsb25lRGlyLCBnZW5lcmF0ZWREb2NzRGlyKTtcblx0XHRcdGFzc2VydC5pc1RydWUocHVibGlzaGVyLnNob3VsZFB1c2goKSk7XG5cdFx0fVxuXHR9XG59KTtcbiJdfQ==