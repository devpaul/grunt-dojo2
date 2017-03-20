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
    var spawnStub = sinon_1.spy(function () {
        return { stdout: '' };
    });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUHVibGlzaGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiUHVibGlzaGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0lBQUEsNkNBQStDO0lBQy9DLDJDQUE2QztJQUM3QywrQkFBdUQ7SUFFdkQsb0RBQXNFO0lBRXRFLElBQU0sUUFBUSxHQUFHLGlCQUFpQixDQUFDO0lBQ25DLElBQU0sTUFBTSxHQUFjLFlBQUksRUFBRSxDQUFDO0lBQ2pDLElBQU0sTUFBTSxHQUFjLFlBQUksRUFBRSxDQUFDO0lBQ2pDLElBQU0sU0FBUyxHQUFjLFlBQUksRUFBRSxDQUFDO0lBQ3BDLElBQU0sU0FBUyxHQUFhLFdBQUcsQ0FBRTtRQUNoQyxNQUFNLENBQUMsRUFBRSxNQUFNLEVBQUUsRUFBRSxFQUFFLENBQUM7SUFDdkIsQ0FBQyxDQUFDLENBQUM7SUFDSCxJQUFNLFFBQVEsR0FBRyxZQUFJLEVBQUUsQ0FBQztJQUN4QixJQUFNLFVBQVUsR0FBYyxZQUFJLEVBQUUsQ0FBQztJQUNyQyxJQUFNLEdBQUcsR0FBRyxFQUFFLE9BQU8sRUFBRSxZQUFJLEVBQUUsRUFBRSxDQUFDO0lBQ2hDLElBQUksU0FBbUMsQ0FBQztJQUV4QyxhQUFhLENBQUM7UUFDYixJQUFJLEVBQUUsc0JBQXNCO1FBRTVCLEtBQUs7WUFDSixJQUFNLEtBQUssR0FBRztnQkFDYixTQUFTLEVBQUU7b0JBQ1YsTUFBTSxFQUFFLEVBQUU7b0JBQ1YsRUFBRSxFQUFFLE1BQU07b0JBQ1YsRUFBRSxFQUFFLE1BQU07aUJBQ1Y7Z0JBQ0QsRUFBRSxFQUFFO29CQUNILFNBQVMsRUFBRSxTQUFTO29CQUNwQixVQUFVLEVBQUUsVUFBVTtpQkFDdEI7Z0JBQ0QsV0FBVyxFQUFFO29CQUNaLE1BQU0sRUFBRSxRQUFRO29CQUNoQixPQUFPLEVBQUUsU0FBUztpQkFDbEI7YUFDRCxDQUFDO1lBQ0YsU0FBUyxHQUFHLGlCQUFVLENBQUMsa0NBQWtDLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDbkUsQ0FBQztRQUVELFVBQVU7WUFDVCxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDZixRQUFRLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDakIsU0FBUyxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQ2xCLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUNmLFNBQVMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUNsQixVQUFVLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDbkIsR0FBRyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUNyQixDQUFDO1FBRUQsUUFBUTtZQUNQLGtCQUFXLEVBQUUsQ0FBQztRQUNmLENBQUM7UUFFRCxTQUFTLEVBQUU7WUFDVixjQUFjO2dCQUNiLElBQU0sU0FBUyxHQUFHLElBQUksU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUUxQyxNQUFNLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsVUFBVSxDQUFDLENBQUM7Z0JBQ2pELE1BQU0sQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLGNBQWMsRUFBRSxRQUFRLENBQUMsQ0FBQztnQkFDdkQsTUFBTSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsU0FBUyxFQUFFLFlBQVksQ0FBQyxDQUFDO2dCQUN0RCxNQUFNLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDaEMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQzdELENBQUM7WUFFRCxnQkFBZ0I7Z0JBQ2YsSUFBTSxTQUFTLEdBQVk7b0JBQzFCLE1BQU0sRUFBRSxRQUFRO29CQUNoQixTQUFTLEVBQUUsV0FBVztvQkFDdEIsR0FBRyxFQUFFLEVBQUUsT0FBTyxFQUFFLFlBQUksRUFBRSxFQUFFO29CQUN4QixHQUFHLEVBQUUsT0FBTztpQkFDWixDQUFDO2dCQUNGLElBQU0sU0FBUyxHQUFHLElBQUksU0FBUyxDQUFDLFFBQVEsRUFBRSxTQUFTLENBQUMsQ0FBQztnQkFFckQsTUFBTSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDdkQsTUFBTSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsY0FBYyxFQUFFLFFBQVEsQ0FBQyxDQUFDO2dCQUN2RCxNQUFNLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxTQUFTLEVBQUUsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDO2dCQUM3RCxNQUFNLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUMvQyxNQUFNLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2xELENBQUM7WUFFRCxnQkFBZ0I7Z0JBQ2YsSUFBTSxTQUFTLEdBQUcsSUFBSSxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBQzFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzdCLENBQUM7U0FDRDtRQUVELG9CQUFvQixFQUFFO1lBQ3JCLGtDQUFrQztnQkFDakMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDMUIsSUFBTSxTQUFTLEdBQUcsSUFBSSxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBQzFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLG9CQUFvQixFQUFFLENBQUMsQ0FBQztZQUNsRCxDQUFDO1lBRUQsb0NBQW9DO2dCQUNuQyxVQUFVLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUN6QixJQUFNLFNBQVMsR0FBRyxJQUFJLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDMUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsb0JBQW9CLEVBQUUsQ0FBQyxDQUFDO1lBQ2pELENBQUM7U0FDRDtRQUVELElBQUksRUFBRTtZQUNMLFFBQVE7Z0JBQ1AsSUFBTSxTQUFTLEdBQUcsSUFBSSxTQUFTLENBQUMsUUFBUSxFQUFFLEVBQUUsR0FBRyxLQUFBLEVBQUUsQ0FBQyxDQUFDO2dCQUNuRCxTQUFTLENBQUMsSUFBSSxFQUFFLENBQUM7Z0JBRWpCLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDO2dCQUN4RCxNQUFNLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLGNBQWMsQ0FBQyxDQUFDO1lBQzNELENBQUM7WUFFRCxtQkFBbUI7Z0JBQ2xCLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksS0FBSyxFQUFFLENBQUMsQ0FBQztnQkFFdkMsSUFBTSxTQUFTLEdBQUcsSUFBSSxTQUFTLENBQUMsUUFBUSxFQUFFLEVBQUUsR0FBRyxLQUFBLEVBQUUsQ0FBQyxDQUFDO2dCQUNuRCxTQUFTLENBQUMsSUFBSSxFQUFFLENBQUM7Z0JBRWpCLE1BQU0sQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFDckQsQ0FBQztZQUVELHlCQUF5QjtnQkFDeEIsVUFBVSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFFMUIsSUFBTSxTQUFTLEdBQUcsSUFBSSxTQUFTLENBQUMsUUFBUSxFQUFFLEVBQUUsR0FBRyxLQUFBLEVBQUUsQ0FBQyxDQUFDO2dCQUNuRCxTQUFTLENBQUMsSUFBSSxFQUFFLENBQUM7Z0JBRWpCLE1BQU0sQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ2pDLENBQUM7WUFFRCxtREFBbUQ7Z0JBQ2xELFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDO2dCQUN4QyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQztnQkFFekMsSUFBTSxTQUFTLEdBQUcsSUFBSSxTQUFTLENBQUMsUUFBUSxFQUFFLEVBQUUsR0FBRyxLQUFBLEVBQUUsQ0FBQyxDQUFDO2dCQUNuRCxTQUFTLENBQUMsSUFBSSxFQUFFLENBQUM7Z0JBRWpCLE1BQU0sQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsc0JBQXNCLENBQUMsQ0FBQztnQkFDcEUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSx1QkFBdUIsQ0FBQyxDQUFDO2dCQUNyRSxNQUFNLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLGNBQWMsQ0FBQyxDQUFDO2dCQUMxRCxNQUFNLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDM0MsQ0FBQztTQUNEO1FBRUQsTUFBTSxFQUFFO1lBQ1AsMEJBQTBCO2dCQUN6QixJQUFNLFNBQVMsR0FBRyxJQUFJLFNBQVMsQ0FBQyxRQUFRLEVBQUUsRUFBRSxHQUFHLEtBQUEsRUFBRSxDQUFDLENBQUM7Z0JBQ25ELFFBQVEsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7Z0JBQ25DLFNBQVMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztnQkFFbkIsTUFBTSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUM7Z0JBQ25DLE1BQU0sQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsWUFBWSxDQUFDLENBQUM7WUFDM0QsQ0FBQztZQUVELDRCQUE0QjtnQkFDM0IsSUFBTSxTQUFTLEdBQUcsSUFBSSxTQUFTLENBQUMsUUFBUSxFQUFFLEVBQUUsR0FBRyxLQUFBLEVBQUUsQ0FBQyxDQUFDO2dCQUNuRCxRQUFRLENBQUMsV0FBVyxFQUFFLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO2dCQUMxQyxTQUFTLENBQUMsTUFBTSxFQUFFLENBQUM7Z0JBRW5CLE1BQU0sQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxDQUFDO2dCQUNyQyxNQUFNLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLFlBQVksQ0FBQyxDQUFDO2dCQUMxRCxNQUFNLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDO2dCQUN2RCxNQUFNLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLGVBQWUsQ0FBQyxDQUFDO1lBQzVELENBQUM7U0FDRDtRQUVELE9BQU87WUFDTixVQUFVLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3pCLElBQU0sR0FBRyxHQUFHLEVBQUUsT0FBTyxFQUFFLFlBQUksRUFBRSxFQUFFLENBQUM7WUFDaEMsSUFBTSxTQUFTLEdBQUcsSUFBSSxTQUFTLENBQUMsUUFBUSxFQUFFLEVBQUUsR0FBRyxLQUFBLEVBQUUsQ0FBQyxDQUFDO1lBQ25ELFNBQVMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUVwQixNQUFNLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSwyQkFBMkIsQ0FBQyxDQUFDO1FBQy9FLENBQUM7S0FDRCxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyByZWdpc3RlclN1aXRlIGZyb20gJ2ludGVybiFvYmplY3QnO1xuaW1wb3J0ICogYXMgYXNzZXJ0IGZyb20gJ2ludGVybi9jaGFpIWFzc2VydCc7XG5pbXBvcnQgeyBTaW5vblN0dWIsIFNpbm9uU3B5LCBzdHViLCBzcHkgfSBmcm9tICdzaW5vbic7XG5pbXBvcnQgeyBPcHRpb25zLCBkZWZhdWx0IGFzIFB1Ymxpc2hlckluc3RhbmNlIH0gZnJvbSAnZ3J1bnQtZG9qbzIvdGFza3MvdXRpbC9QdWJsaXNoZXInO1xuaW1wb3J0IHsgdW5sb2FkVGFza3MsIGxvYWRNb2R1bGUgfSBmcm9tICdncnVudC1kb2pvMi90ZXN0cy91bml0L3V0aWwnO1xuXG5jb25zdCBjbG9uZURpciA9ICdfdGVzdHMvY2xvbmVEaXInO1xuY29uc3QgY3BTdHViOiBTaW5vblN0dWIgPSBzdHViKCk7XG5jb25zdCBybVN0dWI6IFNpbm9uU3R1YiA9IHN0dWIoKTtcbmNvbnN0IGNobW9kU3R1YjogU2lub25TdHViID0gc3R1YigpO1xuY29uc3Qgc3Bhd25TdHViOiBTaW5vblNweSA9IHNweSggKCkgPT4ge1xuXHRyZXR1cm4geyBzdGRvdXQ6ICcnIH07XG59KTtcbmNvbnN0IGV4ZWNTdHViID0gc3R1YigpO1xuY29uc3QgZXhpc3RzU3R1YjogU2lub25TdHViID0gc3R1YigpO1xuY29uc3QgbG9nID0geyB3cml0ZWxuOiBzdHViKCkgfTtcbmxldCBQdWJsaXNoZXI6IHR5cGVvZiBQdWJsaXNoZXJJbnN0YW5jZTtcblxucmVnaXN0ZXJTdWl0ZSh7XG5cdG5hbWU6ICd0YXNrcy91dGlsL1B1Ymxpc2hlcicsXG5cblx0c2V0dXAoKSB7XG5cdFx0Y29uc3QgbW9ja3MgPSB7XG5cdFx0XHQnc2hlbGxqcyc6IHtcblx0XHRcdFx0Y29uZmlnOiB7fSxcblx0XHRcdFx0Y3A6IGNwU3R1Yixcblx0XHRcdFx0cm06IHJtU3R1YlxuXHRcdFx0fSxcblx0XHRcdGZzOiB7XG5cdFx0XHRcdGNobW9kU3luYzogY2htb2RTdHViLFxuXHRcdFx0XHRleGlzdHNTeW5jOiBleGlzdHNTdHViXG5cdFx0XHR9LFxuXHRcdFx0Jy4vcHJvY2Vzcyc6IHtcblx0XHRcdFx0J2V4ZWMnOiBleGVjU3R1Yixcblx0XHRcdFx0J3NwYXduJzogc3Bhd25TdHViXG5cdFx0XHR9XG5cdFx0fTtcblx0XHRQdWJsaXNoZXIgPSBsb2FkTW9kdWxlKCdncnVudC1kb2pvMi90YXNrcy91dGlsL1B1Ymxpc2hlcicsIG1vY2tzKTtcblx0fSxcblxuXHRiZWZvcmVFYWNoKCkge1xuXHRcdGNwU3R1Yi5yZXNldCgpO1xuXHRcdGV4ZWNTdHViLnJlc2V0KCk7XG5cdFx0c3Bhd25TdHViLnJlc2V0KCk7XG5cdFx0cm1TdHViLnJlc2V0KCk7XG5cdFx0Y2htb2RTdHViLnJlc2V0KCk7XG5cdFx0ZXhpc3RzU3R1Yi5yZXNldCgpO1xuXHRcdGxvZy53cml0ZWxuLnJlc2V0KCk7XG5cdH0sXG5cblx0dGVhcmRvd24oKSB7XG5cdFx0dW5sb2FkVGFza3MoKTtcblx0fSxcblxuXHRjb25zdHJ1Y3Q6IHtcblx0XHQnbm8gb3ZlcnJpZGVzJygpIHtcblx0XHRcdGNvbnN0IHB1Ymxpc2hlciA9IG5ldyBQdWJsaXNoZXIoY2xvbmVEaXIpO1xuXG5cdFx0XHRhc3NlcnQuc3RyaWN0RXF1YWwocHVibGlzaGVyLmJyYW5jaCwgJ2doLXBhZ2VzJyk7XG5cdFx0XHRhc3NlcnQuc3RyaWN0RXF1YWwocHVibGlzaGVyLmNsb25lRGlyZWN0b3J5LCBjbG9uZURpcik7XG5cdFx0XHRhc3NlcnQuc3RyaWN0RXF1YWwocHVibGlzaGVyLmRlcGxveUtleSwgJ2RlcGxveV9rZXknKTtcblx0XHRcdGFzc2VydC5pc0RlZmluZWQocHVibGlzaGVyLmxvZyk7XG5cdFx0XHRhc3NlcnQuaXNUcnVlKHB1Ymxpc2hlci51cmwuaW5kZXhPZignZ2l0QGdpdGh1Yi5jb20nKSA+PSAwKTtcblx0XHR9LFxuXG5cdFx0J3dpdGggb3ZlcnJpZGVzJygpIHtcblx0XHRcdGNvbnN0IG92ZXJyaWRlczogT3B0aW9ucyA9IHtcblx0XHRcdFx0YnJhbmNoOiAnYnJhbmNoJyxcblx0XHRcdFx0ZGVwbG95S2V5OiAnZGVwbG95S2V5Jyxcblx0XHRcdFx0bG9nOiB7IHdyaXRlbG46IHN0dWIoKSB9LFxuXHRcdFx0XHR1cmw6ICd0YWNvcydcblx0XHRcdH07XG5cdFx0XHRjb25zdCBwdWJsaXNoZXIgPSBuZXcgUHVibGlzaGVyKGNsb25lRGlyLCBvdmVycmlkZXMpO1xuXG5cdFx0XHRhc3NlcnQuc3RyaWN0RXF1YWwocHVibGlzaGVyLmJyYW5jaCwgb3ZlcnJpZGVzLmJyYW5jaCk7XG5cdFx0XHRhc3NlcnQuc3RyaWN0RXF1YWwocHVibGlzaGVyLmNsb25lRGlyZWN0b3J5LCBjbG9uZURpcik7XG5cdFx0XHRhc3NlcnQuc3RyaWN0RXF1YWwocHVibGlzaGVyLmRlcGxveUtleSwgb3ZlcnJpZGVzLmRlcGxveUtleSk7XG5cdFx0XHRhc3NlcnQuZGVlcEVxdWFsKHB1Ymxpc2hlci5sb2csIG92ZXJyaWRlcy5sb2cpO1xuXHRcdFx0YXNzZXJ0LnN0cmljdEVxdWFsKHB1Ymxpc2hlci51cmwsIG92ZXJyaWRlcy51cmwpO1xuXHRcdH0sXG5cblx0XHQnZGVmYXVsdCBsb2dnZXInKCkge1xuXHRcdFx0Y29uc3QgcHVibGlzaGVyID0gbmV3IFB1Ymxpc2hlcihjbG9uZURpcik7XG5cdFx0XHRwdWJsaXNoZXIubG9nLndyaXRlbG4oJ2hpJyk7XG5cdFx0fVxuXHR9LFxuXG5cdGhhc0RlcGxveUNyZWRlbnRpYWxzOiB7XG5cdFx0J21pc3NpbmcgZGVwbG95S2V5OyByZXR1cm5zIGZhbHNlJygpIHtcblx0XHRcdGV4aXN0c1N0dWIucmV0dXJucyhmYWxzZSk7XG5cdFx0XHRjb25zdCBwdWJsaXNoZXIgPSBuZXcgUHVibGlzaGVyKGNsb25lRGlyKTtcblx0XHRcdGFzc2VydC5pc0ZhbHNlKHB1Ymxpc2hlci5oYXNEZXBsb3lDcmVkZW50aWFscygpKTtcblx0XHR9LFxuXG5cdFx0J2RlcGxveUtleSBpcyBwcmVzZW50OyByZXR1cm5zIHRydWUnKCkge1xuXHRcdFx0ZXhpc3RzU3R1Yi5yZXR1cm5zKHRydWUpO1xuXHRcdFx0Y29uc3QgcHVibGlzaGVyID0gbmV3IFB1Ymxpc2hlcihjbG9uZURpcik7XG5cdFx0XHRhc3NlcnQuaXNUcnVlKHB1Ymxpc2hlci5oYXNEZXBsb3lDcmVkZW50aWFscygpKTtcblx0XHR9XG5cdH0sXG5cblx0aW5pdDoge1xuXHRcdGNoZWNrb3V0KCkge1xuXHRcdFx0Y29uc3QgcHVibGlzaGVyID0gbmV3IFB1Ymxpc2hlcihjbG9uZURpciwgeyBsb2cgfSk7XG5cdFx0XHRwdWJsaXNoZXIuaW5pdCgpO1xuXG5cdFx0XHRhc3NlcnQuaW5jbHVkZShsb2cud3JpdGVsbi5sYXN0Q2FsbC5hcmdzWzBdLCAnQ2xvbmluZycpO1xuXHRcdFx0YXNzZXJ0LmluY2x1ZGUoZXhlY1N0dWIubGFzdENhbGwuYXJnc1swXSwgJ2dpdCBjaGVja291dCcpO1xuXHRcdH0sXG5cblx0XHQnY3JlYXRlIG5ldyBicmFuY2gnKCkge1xuXHRcdFx0ZXhlY1N0dWIub25DYWxsKDUpLnRocm93cyhuZXcgRXJyb3IoKSk7XG5cblx0XHRcdGNvbnN0IHB1Ymxpc2hlciA9IG5ldyBQdWJsaXNoZXIoY2xvbmVEaXIsIHsgbG9nIH0pO1xuXHRcdFx0cHVibGlzaGVyLmluaXQoKTtcblxuXHRcdFx0YXNzZXJ0LmluY2x1ZGUoZXhlY1N0dWIubGFzdENhbGwuYXJnc1swXSwgJ2dpdCBybScpO1xuXHRcdH0sXG5cblx0XHQnaW5pdCB3aXRob3V0IGRlcGxveSBrZXknKCkge1xuXHRcdFx0ZXhpc3RzU3R1Yi5yZXR1cm5zKGZhbHNlKTtcblxuXHRcdFx0Y29uc3QgcHVibGlzaGVyID0gbmV3IFB1Ymxpc2hlcihjbG9uZURpciwgeyBsb2cgfSk7XG5cdFx0XHRwdWJsaXNoZXIuaW5pdCgpO1xuXG5cdFx0XHRhc3NlcnQuaXNUcnVlKHNwYXduU3R1Yi5jYWxsZWQpO1xuXHRcdH0sXG5cblx0XHQnZ2l0IGNvbmZpZyBpcyBwcmVzZW50OyBkb2VzIG5vdCBzZXQgY29uZmlnIHZhbHVlcycoKSB7XG5cdFx0XHRleGVjU3R1Yi5vbkNhbGwoMCkucmV0dXJucygndXNlci5uYW1lJyk7XG5cdFx0XHRleGVjU3R1Yi5vbkNhbGwoMSkucmV0dXJucygndXNlci5lbWFpbCcpO1xuXG5cdFx0XHRjb25zdCBwdWJsaXNoZXIgPSBuZXcgUHVibGlzaGVyKGNsb25lRGlyLCB7IGxvZyB9KTtcblx0XHRcdHB1Ymxpc2hlci5pbml0KCk7XG5cblx0XHRcdGFzc2VydC5pbmNsdWRlKGV4ZWNTdHViLmdldENhbGwoMCkuYXJnc1swXSwgJ2dpdCBjb25maWcgdXNlci5uYW1lJyk7XG5cdFx0XHRhc3NlcnQuaW5jbHVkZShleGVjU3R1Yi5nZXRDYWxsKDEpLmFyZ3NbMF0sICdnaXQgY29uZmlnIHVzZXIuZW1haWwnKTtcblx0XHRcdGFzc2VydC5pbmNsdWRlKGV4ZWNTdHViLmxhc3RDYWxsLmFyZ3NbMF0sICdnaXQgY2hlY2tvdXQnKTtcblx0XHRcdGFzc2VydC5zdHJpY3RFcXVhbChleGVjU3R1Yi5jYWxsQ291bnQsIDMpO1xuXHRcdH1cblx0fSxcblxuXHRjb21taXQ6IHtcblx0XHQnbm8gY2hhbmdlczsgc2tpcHMgY29tbWl0JygpIHtcblx0XHRcdGNvbnN0IHB1Ymxpc2hlciA9IG5ldyBQdWJsaXNoZXIoY2xvbmVEaXIsIHsgbG9nIH0pO1xuXHRcdFx0ZXhlY1N0dWIub25GaXJzdENhbGwoKS5yZXR1cm5zKCcnKTtcblx0XHRcdHB1Ymxpc2hlci5jb21taXQoKTtcblxuXHRcdFx0YXNzZXJ0LmlzVHJ1ZShleGVjU3R1Yi5jYWxsZWRPbmNlKTtcblx0XHRcdGFzc2VydC5pbmNsdWRlKGV4ZWNTdHViLmdldENhbGwoMCkuYXJnc1swXSwgJ2dpdCBzdGF0dXMnKTtcblx0XHR9LFxuXG5cdFx0J2NoYW5nZWQgZmlsZXM7IGV4ZWMgY29tbWl0JygpIHtcblx0XHRcdGNvbnN0IHB1Ymxpc2hlciA9IG5ldyBQdWJsaXNoZXIoY2xvbmVEaXIsIHsgbG9nIH0pO1xuXHRcdFx0ZXhlY1N0dWIub25GaXJzdENhbGwoKS5yZXR1cm5zKCdjaGFuZ2VzJyk7XG5cdFx0XHRwdWJsaXNoZXIuY29tbWl0KCk7XG5cblx0XHRcdGFzc2VydC5pc1RydWUoZXhlY1N0dWIuY2FsbGVkVGhyaWNlKTtcblx0XHRcdGFzc2VydC5pbmNsdWRlKGV4ZWNTdHViLmdldENhbGwoMCkuYXJnc1swXSwgJ2dpdCBzdGF0dXMnKTtcblx0XHRcdGFzc2VydC5pbmNsdWRlKGV4ZWNTdHViLmdldENhbGwoMSkuYXJnc1swXSwgJ2dpdCBhZGQnKTtcblx0XHRcdGFzc2VydC5pbmNsdWRlKGV4ZWNTdHViLmxhc3RDYWxsLmFyZ3NbMF0sICdnaXQgY29tbWl0IC1tJyk7XG5cdFx0fVxuXHR9LFxuXG5cdHB1Ymxpc2goKSB7XG5cdFx0ZXhpc3RzU3R1Yi5yZXR1cm5zKHRydWUpO1xuXHRcdGNvbnN0IGxvZyA9IHsgd3JpdGVsbjogc3R1YigpIH07XG5cdFx0Y29uc3QgcHVibGlzaGVyID0gbmV3IFB1Ymxpc2hlcihjbG9uZURpciwgeyBsb2cgfSk7XG5cdFx0cHVibGlzaGVyLnB1Ymxpc2goKTtcblxuXHRcdGFzc2VydC5zdHJpY3RFcXVhbChsb2cud3JpdGVsbi5sYXN0Q2FsbC5hcmdzWzBdLCAnUHVzaGVkIGdoLXBhZ2VzIHRvIG9yaWdpbicpO1xuXHR9XG59KTtcbiJdfQ==