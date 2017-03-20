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
    var cloneDir = '_tests/cloneDir';
    var cpStub = sinon_1.stub();
    var rmStub = sinon_1.stub();
    var chmodStub = sinon_1.stub();
    var spawnStub = sinon_1.stub();
    var execStub = sinon_1.stub();
    var existsStub = sinon_1.stub();
    var log = { writeln: sinon_1.stub() };
    var Publisher;
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
                './process': {
                    'exec': execStub,
                    'spawn': spawnStub
                }
            };
            Publisher = util_1.loadModule('grunt-dojo2/tasks/util/Publisher', mocks);
        },
        beforeEach: function () {
            cpStub.reset();
            execStub.reset();
            spawnStub.reset();
            rmStub.reset();
            chmodStub.reset();
            existsStub.reset();
            log.writeln.reset();
            spawnStub.returns({
                stdout: 'result'
            });
        },
        teardown: function () {
            util_1.unloadTasks();
        },
        construct: {
            'no overrides': function () {
                var publisher = new Publisher(cloneDir);
                assert.strictEqual(publisher.branch, 'gh-pages');
                assert.strictEqual(publisher.cloneDirectory, cloneDir);
                assert.strictEqual(publisher.deployKey, 'deploy_key');
                assert.isDefined(publisher.log);
                assert.isTrue(publisher.url.indexOf('git@github.com') >= 0);
            },
            'with overrides': function () {
                var overrides = {
                    branch: 'branch',
                    deployKey: 'deployKey',
                    log: { writeln: sinon_1.stub() },
                    url: 'tacos'
                };
                var publisher = new Publisher(cloneDir, overrides);
                assert.strictEqual(publisher.branch, overrides.branch);
                assert.strictEqual(publisher.cloneDirectory, cloneDir);
                assert.strictEqual(publisher.deployKey, overrides.deployKey);
                assert.deepEqual(publisher.log, overrides.log);
                assert.strictEqual(publisher.url, overrides.url);
            },
            'default logger': function () {
                var publisher = new Publisher(cloneDir);
                publisher.log.writeln('hi');
            }
        },
        hasDeployCredentials: {
            'missing deployKey; returns false': function () {
                existsStub.returns(false);
                var publisher = new Publisher(cloneDir);
                assert.isFalse(publisher.hasDeployCredentials());
            },
            'deployKey is present; returns true': function () {
                existsStub.returns(true);
                var publisher = new Publisher(cloneDir);
                assert.isTrue(publisher.hasDeployCredentials());
            }
        },
        init: {
            checkout: function () {
                var publisher = new Publisher(cloneDir, { log: log });
                publisher.init();
                assert.include(log.writeln.lastCall.args[0], 'Cloning');
                assert.include(execStub.lastCall.args[0], 'git checkout');
            },
            'create new branch': function () {
                execStub.onCall(5).throws(new Error());
                var publisher = new Publisher(cloneDir, { log: log });
                publisher.init();
                assert.include(execStub.lastCall.args[0], 'git rm');
            },
            'init without deploy key': function () {
                existsStub.returns(false);
                var publisher = new Publisher(cloneDir, { log: log });
                publisher.init();
                assert.isTrue(spawnStub.called);
            },
            'git config is present; does not set config values': function () {
                execStub.onCall(0).returns('user.name');
                execStub.onCall(1).returns('user.email');
                var publisher = new Publisher(cloneDir, { log: log });
                publisher.init();
                assert.include(execStub.getCall(0).args[0], 'git config user.name');
                assert.include(execStub.getCall(1).args[0], 'git config user.email');
                assert.include(execStub.lastCall.args[0], 'git checkout');
                assert.strictEqual(execStub.callCount, 3);
            }
        },
        commit: {
            'no changes; skips commit': function () {
                var publisher = new Publisher(cloneDir, { log: log });
                execStub.onFirstCall().returns('');
                publisher.commit();
                assert.isTrue(execStub.calledOnce);
                assert.include(execStub.getCall(0).args[0], 'git status');
            },
            'changed files; exec commit': function () {
                var publisher = new Publisher(cloneDir, { log: log });
                execStub.onFirstCall().returns('changes');
                publisher.commit();
                assert.isTrue(execStub.calledThrice);
                assert.include(execStub.getCall(0).args[0], 'git status');
                assert.include(execStub.getCall(1).args[0], 'git add');
                assert.include(execStub.lastCall.args[0], 'git commit -m');
            }
        },
        publish: function () {
            existsStub.returns(true);
            var log = { writeln: sinon_1.stub() };
            var publisher = new Publisher(cloneDir, { log: log });
            publisher.publish();
            assert.strictEqual(log.writeln.lastCall.args[0], 'Pushed gh-pages to origin');
        }
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUHVibGlzaGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiUHVibGlzaGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0lBQUEsNkNBQStDO0lBQy9DLDJDQUE2QztJQUM3QywrQkFBdUQ7SUFFdkQsb0RBQXNFO0lBRXRFLElBQU0sUUFBUSxHQUFHLGlCQUFpQixDQUFDO0lBQ25DLElBQU0sTUFBTSxHQUFjLFlBQUksRUFBRSxDQUFDO0lBQ2pDLElBQU0sTUFBTSxHQUFjLFlBQUksRUFBRSxDQUFDO0lBQ2pDLElBQU0sU0FBUyxHQUFjLFlBQUksRUFBRSxDQUFDO0lBQ3BDLElBQU0sU0FBUyxHQUFHLFlBQUksRUFBRSxDQUFDO0lBQ3pCLElBQU0sUUFBUSxHQUFHLFlBQUksRUFBRSxDQUFDO0lBQ3hCLElBQU0sVUFBVSxHQUFjLFlBQUksRUFBRSxDQUFDO0lBQ3JDLElBQU0sR0FBRyxHQUFHLEVBQUUsT0FBTyxFQUFFLFlBQUksRUFBRSxFQUFFLENBQUM7SUFDaEMsSUFBSSxTQUFtQyxDQUFDO0lBRXhDLGFBQWEsQ0FBQztRQUNiLElBQUksRUFBRSxzQkFBc0I7UUFFNUIsS0FBSztZQUNKLElBQU0sS0FBSyxHQUFHO2dCQUNiLFNBQVMsRUFBRTtvQkFDVixNQUFNLEVBQUUsRUFBRTtvQkFDVixFQUFFLEVBQUUsTUFBTTtvQkFDVixFQUFFLEVBQUUsTUFBTTtpQkFDVjtnQkFDRCxFQUFFLEVBQUU7b0JBQ0gsU0FBUyxFQUFFLFNBQVM7b0JBQ3BCLFVBQVUsRUFBRSxVQUFVO2lCQUN0QjtnQkFDRCxXQUFXLEVBQUU7b0JBQ1osTUFBTSxFQUFFLFFBQVE7b0JBQ2hCLE9BQU8sRUFBRSxTQUFTO2lCQUNsQjthQUNELENBQUM7WUFDRixTQUFTLEdBQUcsaUJBQVUsQ0FBQyxrQ0FBa0MsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUNuRSxDQUFDO1FBRUQsVUFBVTtZQUNULE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUNmLFFBQVEs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QUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIHJlZ2lzdGVyU3VpdGUgZnJvbSAnaW50ZXJuIW9iamVjdCc7XG5pbXBvcnQgKiBhcyBhc3NlcnQgZnJvbSAnaW50ZXJuL2NoYWkhYXNzZXJ0JztcbmltcG9ydCB7IFNpbm9uU3R1YiwgU2lub25TcHksIHN0dWIsIHNweSB9IGZyb20gJ3Npbm9uJztcbmltcG9ydCB7IE9wdGlvbnMsIGRlZmF1bHQgYXMgUHVibGlzaGVySW5zdGFuY2UgfSBmcm9tICdncnVudC1kb2pvMi90YXNrcy91dGlsL1B1Ymxpc2hlcic7XG5pbXBvcnQgeyB1bmxvYWRUYXNrcywgbG9hZE1vZHVsZSB9IGZyb20gJ2dydW50LWRvam8yL3Rlc3RzL3VuaXQvdXRpbCc7XG5cbmNvbnN0IGNsb25lRGlyID0gJ190ZXN0cy9jbG9uZURpcic7XG5jb25zdCBjcFN0dWI6IFNpbm9uU3R1YiA9IHN0dWIoKTtcbmNvbnN0IHJtU3R1YjogU2lub25TdHViID0gc3R1YigpO1xuY29uc3QgY2htb2RTdHViOiBTaW5vblN0dWIgPSBzdHViKCk7XG5jb25zdCBzcGF3blN0dWIgPSBzdHViKCk7XG5jb25zdCBleGVjU3R1YiA9IHN0dWIoKTtcbmNvbnN0IGV4aXN0c1N0dWI6IFNpbm9uU3R1YiA9IHN0dWIoKTtcbmNvbnN0IGxvZyA9IHsgd3JpdGVsbjogc3R1YigpIH07XG5sZXQgUHVibGlzaGVyOiB0eXBlb2YgUHVibGlzaGVySW5zdGFuY2U7XG5cbnJlZ2lzdGVyU3VpdGUoe1xuXHRuYW1lOiAndGFza3MvdXRpbC9QdWJsaXNoZXInLFxuXG5cdHNldHVwKCkge1xuXHRcdGNvbnN0IG1vY2tzID0ge1xuXHRcdFx0J3NoZWxsanMnOiB7XG5cdFx0XHRcdGNvbmZpZzoge30sXG5cdFx0XHRcdGNwOiBjcFN0dWIsXG5cdFx0XHRcdHJtOiBybVN0dWJcblx0XHRcdH0sXG5cdFx0XHRmczoge1xuXHRcdFx0XHRjaG1vZFN5bmM6IGNobW9kU3R1Yixcblx0XHRcdFx0ZXhpc3RzU3luYzogZXhpc3RzU3R1YlxuXHRcdFx0fSxcblx0XHRcdCcuL3Byb2Nlc3MnOiB7XG5cdFx0XHRcdCdleGVjJzogZXhlY1N0dWIsXG5cdFx0XHRcdCdzcGF3bic6IHNwYXduU3R1YlxuXHRcdFx0fVxuXHRcdH07XG5cdFx0UHVibGlzaGVyID0gbG9hZE1vZHVsZSgnZ3J1bnQtZG9qbzIvdGFza3MvdXRpbC9QdWJsaXNoZXInLCBtb2Nrcyk7XG5cdH0sXG5cblx0YmVmb3JlRWFjaCgpIHtcblx0XHRjcFN0dWIucmVzZXQoKTtcblx0XHRleGVjU3R1Yi5yZXNldCgpO1xuXHRcdHNwYXduU3R1Yi5yZXNldCgpO1xuXHRcdHJtU3R1Yi5yZXNldCgpO1xuXHRcdGNobW9kU3R1Yi5yZXNldCgpO1xuXHRcdGV4aXN0c1N0dWIucmVzZXQoKTtcblx0XHRsb2cud3JpdGVsbi5yZXNldCgpO1xuXG5cdFx0c3Bhd25TdHViLnJldHVybnMoe1xuXHRcdFx0c3Rkb3V0OiAncmVzdWx0J1xuXHRcdH0pO1xuXHR9LFxuXG5cdHRlYXJkb3duKCkge1xuXHRcdHVubG9hZFRhc2tzKCk7XG5cdH0sXG5cblx0Y29uc3RydWN0OiB7XG5cdFx0J25vIG92ZXJyaWRlcycoKSB7XG5cdFx0XHRjb25zdCBwdWJsaXNoZXIgPSBuZXcgUHVibGlzaGVyKGNsb25lRGlyKTtcblxuXHRcdFx0YXNzZXJ0LnN0cmljdEVxdWFsKHB1Ymxpc2hlci5icmFuY2gsICdnaC1wYWdlcycpO1xuXHRcdFx0YXNzZXJ0LnN0cmljdEVxdWFsKHB1Ymxpc2hlci5jbG9uZURpcmVjdG9yeSwgY2xvbmVEaXIpO1xuXHRcdFx0YXNzZXJ0LnN0cmljdEVxdWFsKHB1Ymxpc2hlci5kZXBsb3lLZXksICdkZXBsb3lfa2V5Jyk7XG5cdFx0XHRhc3NlcnQuaXNEZWZpbmVkKHB1Ymxpc2hlci5sb2cpO1xuXHRcdFx0YXNzZXJ0LmlzVHJ1ZShwdWJsaXNoZXIudXJsLmluZGV4T2YoJ2dpdEBnaXRodWIuY29tJykgPj0gMCk7XG5cdFx0fSxcblxuXHRcdCd3aXRoIG92ZXJyaWRlcycoKSB7XG5cdFx0XHRjb25zdCBvdmVycmlkZXM6IE9wdGlvbnMgPSB7XG5cdFx0XHRcdGJyYW5jaDogJ2JyYW5jaCcsXG5cdFx0XHRcdGRlcGxveUtleTogJ2RlcGxveUtleScsXG5cdFx0XHRcdGxvZzogeyB3cml0ZWxuOiBzdHViKCkgfSxcblx0XHRcdFx0dXJsOiAndGFjb3MnXG5cdFx0XHR9O1xuXHRcdFx0Y29uc3QgcHVibGlzaGVyID0gbmV3IFB1Ymxpc2hlcihjbG9uZURpciwgb3ZlcnJpZGVzKTtcblxuXHRcdFx0YXNzZXJ0LnN0cmljdEVxdWFsKHB1Ymxpc2hlci5icmFuY2gsIG92ZXJyaWRlcy5icmFuY2gpO1xuXHRcdFx0YXNzZXJ0LnN0cmljdEVxdWFsKHB1Ymxpc2hlci5jbG9uZURpcmVjdG9yeSwgY2xvbmVEaXIpO1xuXHRcdFx0YXNzZXJ0LnN0cmljdEVxdWFsKHB1Ymxpc2hlci5kZXBsb3lLZXksIG92ZXJyaWRlcy5kZXBsb3lLZXkpO1xuXHRcdFx0YXNzZXJ0LmRlZXBFcXVhbChwdWJsaXNoZXIubG9nLCBvdmVycmlkZXMubG9nKTtcblx0XHRcdGFzc2VydC5zdHJpY3RFcXVhbChwdWJsaXNoZXIudXJsLCBvdmVycmlkZXMudXJsKTtcblx0XHR9LFxuXG5cdFx0J2RlZmF1bHQgbG9nZ2VyJygpIHtcblx0XHRcdGNvbnN0IHB1Ymxpc2hlciA9IG5ldyBQdWJsaXNoZXIoY2xvbmVEaXIpO1xuXHRcdFx0cHVibGlzaGVyLmxvZy53cml0ZWxuKCdoaScpO1xuXHRcdH1cblx0fSxcblxuXHRoYXNEZXBsb3lDcmVkZW50aWFsczoge1xuXHRcdCdtaXNzaW5nIGRlcGxveUtleTsgcmV0dXJucyBmYWxzZScoKSB7XG5cdFx0XHRleGlzdHNTdHViLnJldHVybnMoZmFsc2UpO1xuXHRcdFx0Y29uc3QgcHVibGlzaGVyID0gbmV3IFB1Ymxpc2hlcihjbG9uZURpcik7XG5cdFx0XHRhc3NlcnQuaXNGYWxzZShwdWJsaXNoZXIuaGFzRGVwbG95Q3JlZGVudGlhbHMoKSk7XG5cdFx0fSxcblxuXHRcdCdkZXBsb3lLZXkgaXMgcHJlc2VudDsgcmV0dXJucyB0cnVlJygpIHtcblx0XHRcdGV4aXN0c1N0dWIucmV0dXJucyh0cnVlKTtcblx0XHRcdGNvbnN0IHB1Ymxpc2hlciA9IG5ldyBQdWJsaXNoZXIoY2xvbmVEaXIpO1xuXHRcdFx0YXNzZXJ0LmlzVHJ1ZShwdWJsaXNoZXIuaGFzRGVwbG95Q3JlZGVudGlhbHMoKSk7XG5cdFx0fVxuXHR9LFxuXG5cdGluaXQ6IHtcblx0XHRjaGVja291dCgpIHtcblx0XHRcdGNvbnN0IHB1Ymxpc2hlciA9IG5ldyBQdWJsaXNoZXIoY2xvbmVEaXIsIHsgbG9nIH0pO1xuXHRcdFx0cHVibGlzaGVyLmluaXQoKTtcblxuXHRcdFx0YXNzZXJ0LmluY2x1ZGUobG9nLndyaXRlbG4ubGFzdENhbGwuYXJnc1swXSwgJ0Nsb25pbmcnKTtcblx0XHRcdGFzc2VydC5pbmNsdWRlKGV4ZWNTdHViLmxhc3RDYWxsLmFyZ3NbMF0sICdnaXQgY2hlY2tvdXQnKTtcblx0XHR9LFxuXG5cdFx0J2NyZWF0ZSBuZXcgYnJhbmNoJygpIHtcblx0XHRcdGV4ZWNTdHViLm9uQ2FsbCg1KS50aHJvd3MobmV3IEVycm9yKCkpO1xuXG5cdFx0XHRjb25zdCBwdWJsaXNoZXIgPSBuZXcgUHVibGlzaGVyKGNsb25lRGlyLCB7IGxvZyB9KTtcblx0XHRcdHB1Ymxpc2hlci5pbml0KCk7XG5cblx0XHRcdGFzc2VydC5pbmNsdWRlKGV4ZWNTdHViLmxhc3RDYWxsLmFyZ3NbMF0sICdnaXQgcm0nKTtcblx0XHR9LFxuXG5cdFx0J2luaXQgd2l0aG91dCBkZXBsb3kga2V5JygpIHtcblx0XHRcdGV4aXN0c1N0dWIucmV0dXJucyhmYWxzZSk7XG5cblx0XHRcdGNvbnN0IHB1Ymxpc2hlciA9IG5ldyBQdWJsaXNoZXIoY2xvbmVEaXIsIHsgbG9nIH0pO1xuXHRcdFx0cHVibGlzaGVyLmluaXQoKTtcblxuXHRcdFx0YXNzZXJ0LmlzVHJ1ZShzcGF3blN0dWIuY2FsbGVkKTtcblx0XHR9LFxuXG5cdFx0J2dpdCBjb25maWcgaXMgcHJlc2VudDsgZG9lcyBub3Qgc2V0IGNvbmZpZyB2YWx1ZXMnKCkge1xuXHRcdFx0ZXhlY1N0dWIub25DYWxsKDApLnJldHVybnMoJ3VzZXIubmFtZScpO1xuXHRcdFx0ZXhlY1N0dWIub25DYWxsKDEpLnJldHVybnMoJ3VzZXIuZW1haWwnKTtcblxuXHRcdFx0Y29uc3QgcHVibGlzaGVyID0gbmV3IFB1Ymxpc2hlcihjbG9uZURpciwgeyBsb2cgfSk7XG5cdFx0XHRwdWJsaXNoZXIuaW5pdCgpO1xuXG5cdFx0XHRhc3NlcnQuaW5jbHVkZShleGVjU3R1Yi5nZXRDYWxsKDApLmFyZ3NbMF0sICdnaXQgY29uZmlnIHVzZXIubmFtZScpO1xuXHRcdFx0YXNzZXJ0LmluY2x1ZGUoZXhlY1N0dWIuZ2V0Q2FsbCgxKS5hcmdzWzBdLCAnZ2l0IGNvbmZpZyB1c2VyLmVtYWlsJyk7XG5cdFx0XHRhc3NlcnQuaW5jbHVkZShleGVjU3R1Yi5sYXN0Q2FsbC5hcmdzWzBdLCAnZ2l0IGNoZWNrb3V0Jyk7XG5cdFx0XHRhc3NlcnQuc3RyaWN0RXF1YWwoZXhlY1N0dWIuY2FsbENvdW50LCAzKTtcblx0XHR9XG5cdH0sXG5cblx0Y29tbWl0OiB7XG5cdFx0J25vIGNoYW5nZXM7IHNraXBzIGNvbW1pdCcoKSB7XG5cdFx0XHRjb25zdCBwdWJsaXNoZXIgPSBuZXcgUHVibGlzaGVyKGNsb25lRGlyLCB7IGxvZyB9KTtcblx0XHRcdGV4ZWNTdHViLm9uRmlyc3RDYWxsKCkucmV0dXJucygnJyk7XG5cdFx0XHRwdWJsaXNoZXIuY29tbWl0KCk7XG5cblx0XHRcdGFzc2VydC5pc1RydWUoZXhlY1N0dWIuY2FsbGVkT25jZSk7XG5cdFx0XHRhc3NlcnQuaW5jbHVkZShleGVjU3R1Yi5nZXRDYWxsKDApLmFyZ3NbMF0sICdnaXQgc3RhdHVzJyk7XG5cdFx0fSxcblxuXHRcdCdjaGFuZ2VkIGZpbGVzOyBleGVjIGNvbW1pdCcoKSB7XG5cdFx0XHRjb25zdCBwdWJsaXNoZXIgPSBuZXcgUHVibGlzaGVyKGNsb25lRGlyLCB7IGxvZyB9KTtcblx0XHRcdGV4ZWNTdHViLm9uRmlyc3RDYWxsKCkucmV0dXJucygnY2hhbmdlcycpO1xuXHRcdFx0cHVibGlzaGVyLmNvbW1pdCgpO1xuXG5cdFx0XHRhc3NlcnQuaXNUcnVlKGV4ZWNTdHViLmNhbGxlZFRocmljZSk7XG5cdFx0XHRhc3NlcnQuaW5jbHVkZShleGVjU3R1Yi5nZXRDYWxsKDApLmFyZ3NbMF0sICdnaXQgc3RhdHVzJyk7XG5cdFx0XHRhc3NlcnQuaW5jbHVkZShleGVjU3R1Yi5nZXRDYWxsKDEpLmFyZ3NbMF0sICdnaXQgYWRkJyk7XG5cdFx0XHRhc3NlcnQuaW5jbHVkZShleGVjU3R1Yi5sYXN0Q2FsbC5hcmdzWzBdLCAnZ2l0IGNvbW1pdCAtbScpO1xuXHRcdH1cblx0fSxcblxuXHRwdWJsaXNoKCkge1xuXHRcdGV4aXN0c1N0dWIucmV0dXJucyh0cnVlKTtcblx0XHRjb25zdCBsb2cgPSB7IHdyaXRlbG46IHN0dWIoKSB9O1xuXHRcdGNvbnN0IHB1Ymxpc2hlciA9IG5ldyBQdWJsaXNoZXIoY2xvbmVEaXIsIHsgbG9nIH0pO1xuXHRcdHB1Ymxpc2hlci5wdWJsaXNoKCk7XG5cblx0XHRhc3NlcnQuc3RyaWN0RXF1YWwobG9nLndyaXRlbG4ubGFzdENhbGwuYXJnc1swXSwgJ1B1c2hlZCBnaC1wYWdlcyB0byBvcmlnaW4nKTtcblx0fVxufSk7XG4iXX0=