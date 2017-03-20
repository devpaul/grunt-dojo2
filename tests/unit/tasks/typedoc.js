(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "intern!object", "chai", "grunt", "path", "sinon", "../util"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var registerSuite = require("intern!object");
    var chai_1 = require("chai");
    var grunt = require("grunt");
    var path_1 = require("path");
    var sinon_1 = require("sinon");
    var util_1 = require("../util");
    var cachedDeployDocsEnv = process.env.DEPLOY_DOCS;
    var outputPath = util_1.getOutputDirectory();
    var tsconfigPath = path_1.join(outputPath, 'tsconfig.json');
    var apiDocDirectory = path_1.join(outputPath, 'doc');
    var apiPubDirectory = path_1.join(outputPath, 'pub');
    var loadNpmTasks;
    var run;
    var write;
    var readJSON;
    var expandMapping;
    var execSync;
    var cp;
    var rm;
    var touch;
    var shouldPush;
    var shouldPushValue;
    var failInitialCheckout;
    var publisherConstructor;
    var publisher;
    registerSuite({
        name: 'tasks/typedoc',
        setup: function () {
            cp = sinon_1.spy(function () { });
            rm = sinon_1.spy(function () { });
            touch = sinon_1.spy(function () { });
            execSync = sinon_1.spy(function (command) {
                if (/git checkout/.test(command) && failInitialCheckout) {
                    failInitialCheckout = false;
                    throw new Error('Failing checkout');
                }
            });
            publisher = {
                publish: sinon_1.stub()
            };
            publisherConstructor = sinon_1.spy(function () {
                return publisher;
            });
            util_1.loadTasks({
                'shelljs': {
                    config: {},
                    cp: cp,
                    rm: rm,
                    touch: touch
                },
                './util/exec': {
                    'default': execSync
                },
                './util/Publisher': {
                    'default': publisherConstructor
                }
            });
            loadNpmTasks = sinon_1.stub(grunt, 'loadNpmTasks');
            run = sinon_1.stub(grunt.task, 'run');
            write = sinon_1.spy(grunt.file, 'write');
            expandMapping = sinon_1.stub(grunt.file, 'expandMapping', function (patterns, base) {
                return ['foo'];
            });
            readJSON = sinon_1.stub(grunt.file, 'readJSON', function (filename) {
                return {};
            });
            shouldPush = sinon_1.spy(function () { return shouldPushValue; });
            util_1.prepareOutputDirectory();
        },
        teardown: function () {
            loadNpmTasks.restore();
            write.restore();
            run.restore();
            readJSON.restore();
            expandMapping.restore();
            util_1.unloadTasks();
            util_1.cleanOutputDirectory();
            process.env.DEPLOY_DOCS = '';
        },
        beforeEach: function () {
            grunt.initConfig({
                apiDocDirectory: apiDocDirectory,
                apiPubDirectory: apiPubDirectory,
                tsconfig: {
                    compilerOptions: {
                        inlineSourceMap: true,
                        inlineSources: true,
                        listFiles: true,
                        module: 'commonjs',
                        noImplicitAny: true,
                        pretty: true,
                        target: 'es5'
                    }
                },
                typedoc: {
                    options: {
                        mode: 'modules',
                        excludeExternals: true,
                        excludeNotExported: true,
                        tsconfig: tsconfigPath,
                        logger: 'none',
                        publishOptions: {
                            subDirectory: 'api',
                            shouldPush: shouldPush
                        }
                    }
                }
            });
            write.reset();
            execSync.reset();
            shouldPush.reset();
            publisher.publish.reset();
            publisherConstructor.reset();
            shouldPushValue = false;
            failInitialCheckout = false;
        },
        default: function () {
            util_1.runGruntTask('typedoc');
            var command = execSync.args[0][0];
            var matcher = new RegExp("node \"[^\"]+/typedoc\" --mode \"modules\" --excludeExternals --excludeNotExported " +
                ("--tsconfig \"" + path_1.join(outputPath, 'tsconfig.json') + "\" ") +
                ("--logger \"none\" --out \"" + apiDocDirectory + "\""));
            chai_1.assert.match(command, matcher, 'Unexpected typedoc command line');
            chai_1.assert.strictEqual(shouldPush.callCount, 0, 'Push check should not have been called');
            chai_1.assert.strictEqual(write.callCount, 0, 'Nothing should have been written');
            chai_1.assert.strictEqual(execSync.callCount, 1, 'Unexpected number of exec calls');
            chai_1.assert.isFalse(publisherConstructor.called);
        },
        publish: {
            setup: function () {
                process.env.DEPLOY_DOCS = 'publish';
            },
            teardown: function () {
                process.env.DEPLOY_DOCS = cachedDeployDocsEnv;
            },
            test: function () {
                util_1.runGruntTask('typedoc');
                chai_1.assert.isTrue(publisherConstructor.calledOnce);
                chai_1.assert.isFalse(publisherConstructor.firstCall.args[2].skipPublish);
                chai_1.assert.isDefined(publisherConstructor.firstCall.args[2].log);
                chai_1.assert.isTrue(publisher.publish.calledOnce);
            }
        },
        commit: {
            setup: function () {
                process.env.DEPLOY_DOCS = 'commit';
            },
            teardown: function () {
                process.env.DEPLOY_DOCS = cachedDeployDocsEnv;
            },
            test: function () {
                util_1.runGruntTask('typedoc');
                chai_1.assert.isTrue(publisherConstructor.calledOnce);
                chai_1.assert.isTrue(publisherConstructor.firstCall.args[2].skipPublish);
                chai_1.assert.isDefined(publisherConstructor.firstCall.args[2].log);
                chai_1.assert.isTrue(publisher.publish.calledOnce);
            }
        }
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZWRvYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInR5cGVkb2MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7SUFBQSw2Q0FBZ0Q7SUFDaEQsNkJBQThCO0lBQzlCLDZCQUErQjtJQUMvQiw2QkFBNEI7SUFDNUIsK0JBQXVEO0lBQ3ZELGdDQU9pQjtJQUVqQixJQUFNLG1CQUFtQixHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDO0lBQ3BELElBQU0sVUFBVSxHQUFHLHlCQUFrQixFQUFFLENBQUM7SUFDeEMsSUFBTSxZQUFZLEdBQUcsV0FBSSxDQUFDLFVBQVUsRUFBRSxlQUFlLENBQUMsQ0FBQztJQUN2RCxJQUFNLGVBQWUsR0FBRyxXQUFJLENBQUMsVUFBVSxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ2hELElBQU0sZUFBZSxHQUFHLFdBQUksQ0FBQyxVQUFVLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFFaEQsSUFBSSxZQUF1QixDQUFDO0lBQzVCLElBQUksR0FBYyxDQUFDO0lBQ25CLElBQUksS0FBZSxDQUFDO0lBQ3BCLElBQUksUUFBbUIsQ0FBQztJQUN4QixJQUFJLGFBQXdCLENBQUM7SUFDN0IsSUFBSSxRQUFrQixDQUFDO0lBQ3ZCLElBQUksRUFBWSxDQUFDO0lBQ2pCLElBQUksRUFBWSxDQUFDO0lBQ2pCLElBQUksS0FBZSxDQUFDO0lBQ3BCLElBQUksVUFBb0IsQ0FBQztJQUN6QixJQUFJLGVBQXdCLENBQUM7SUFDN0IsSUFBSSxtQkFBNEIsQ0FBQztJQUNqQyxJQUFJLG9CQUE4QixDQUFDO0lBQ25DLElBQUksU0FJSCxDQUFDO0lBRUYsYUFBYSxDQUFDO1FBQ2IsSUFBSSxFQUFFLGVBQWU7UUFFckIsS0FBSztZQUNKLEVBQUUsR0FBRyxXQUFHLENBQUMsY0FBTyxDQUFDLENBQUMsQ0FBQztZQUNuQixFQUFFLEdBQUcsV0FBRyxDQUFDLGNBQU8sQ0FBQyxDQUFDLENBQUM7WUFDbkIsS0FBSyxHQUFH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QUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUM3RCxhQUFNLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDN0MsQ0FBQztTQUNEO0tBQ0QsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHJlZ2lzdGVyU3VpdGUgPSByZXF1aXJlKCdpbnRlcm4hb2JqZWN0Jyk7XG5pbXBvcnQgeyBhc3NlcnQgfSBmcm9tICdjaGFpJztcbmltcG9ydCAqIGFzIGdydW50IGZyb20gJ2dydW50JztcbmltcG9ydCB7IGpvaW4gfSBmcm9tICdwYXRoJztcbmltcG9ydCB7IFNpbm9uU3B5LCBzcHksIFNpbm9uU3R1Yiwgc3R1YiB9IGZyb20gJ3Npbm9uJztcbmltcG9ydCB7XG5cdGxvYWRUYXNrcyxcblx0cHJlcGFyZU91dHB1dERpcmVjdG9yeSxcblx0dW5sb2FkVGFza3MsXG5cdGNsZWFuT3V0cHV0RGlyZWN0b3J5LFxuXHRydW5HcnVudFRhc2ssXG5cdGdldE91dHB1dERpcmVjdG9yeVxufSBmcm9tICcuLi91dGlsJztcblxuY29uc3QgY2FjaGVkRGVwbG95RG9jc0VudiA9IHByb2Nlc3MuZW52LkRFUExPWV9ET0NTO1xuY29uc3Qgb3V0cHV0UGF0aCA9IGdldE91dHB1dERpcmVjdG9yeSgpO1xuY29uc3QgdHNjb25maWdQYXRoID0gam9pbihvdXRwdXRQYXRoLCAndHNjb25maWcuanNvbicpO1xuY29uc3QgYXBpRG9jRGlyZWN0b3J5ID0gam9pbihvdXRwdXRQYXRoLCAnZG9jJyk7XG5jb25zdCBhcGlQdWJEaXJlY3RvcnkgPSBqb2luKG91dHB1dFBhdGgsICdwdWInKTtcblxubGV0IGxvYWROcG1UYXNrczogU2lub25TdHViO1xubGV0IHJ1bjogU2lub25TdHViO1xubGV0IHdyaXRlOiBTaW5vblNweTtcbmxldCByZWFkSlNPTjogU2lub25TdHViO1xubGV0IGV4cGFuZE1hcHBpbmc6IFNpbm9uU3R1YjtcbmxldCBleGVjU3luYzogU2lub25TcHk7XG5sZXQgY3A6IFNpbm9uU3B5O1xubGV0IHJtOiBTaW5vblNweTtcbmxldCB0b3VjaDogU2lub25TcHk7XG5sZXQgc2hvdWxkUHVzaDogU2lub25TcHk7XG5sZXQgc2hvdWxkUHVzaFZhbHVlOiBib29sZWFuO1xubGV0IGZhaWxJbml0aWFsQ2hlY2tvdXQ6IGJvb2xlYW47XG5sZXQgcHVibGlzaGVyQ29uc3RydWN0b3I6IFNpbm9uU3B5O1xubGV0IHB1Ymxpc2hlcjoge1xuXHRsb2c/OiBhbnk7XG5cdHB1Ymxpc2g6IFNpbm9uU3R1Yjtcblx0c2tpcFB1Ymxpc2g/OiBib29sZWFuO1xufTtcblxucmVnaXN0ZXJTdWl0ZSh7XG5cdG5hbWU6ICd0YXNrcy90eXBlZG9jJyxcblxuXHRzZXR1cCgpIHtcblx0XHRjcCA9IHNweSgoKSA9PiB7fSk7XG5cdFx0cm0gPSBzcHkoKCkgPT4ge30pO1xuXHRcdHRvdWNoID0gc3B5KCgpID0+IHt9KTtcblx0XHRleGVjU3luYyA9IHNweSgoY29tbWFuZDogc3RyaW5nKSA9PiB7XG5cdFx0XHRpZiAoL2dpdCBjaGVja291dC8udGVzdChjb21tYW5kKSAmJiBmYWlsSW5pdGlhbENoZWNrb3V0KSB7XG5cdFx0XHRcdGZhaWxJbml0aWFsQ2hlY2tvdXQgPSBmYWxzZTtcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKCdGYWlsaW5nIGNoZWNrb3V0Jyk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0cHVibGlzaGVyID0ge1xuXHRcdFx0cHVibGlzaDogc3R1YigpXG5cdFx0fTtcblx0XHRwdWJsaXNoZXJDb25zdHJ1Y3RvciA9IHNweShmdW5jdGlvbiAoKSB7XG5cdFx0XHRyZXR1cm4gcHVibGlzaGVyO1xuXHRcdH0pO1xuXG5cdFx0bG9hZFRhc2tzKHtcblx0XHRcdCdzaGVsbGpzJzoge1xuXHRcdFx0XHRjb25maWc6IHt9LFxuXHRcdFx0XHRjcCxcblx0XHRcdFx0cm0sXG5cdFx0XHRcdHRvdWNoXG5cdFx0XHR9LFxuXHRcdFx0Jy4vdXRpbC9leGVjJzoge1xuXHRcdFx0XHQnZGVmYXVsdCc6IGV4ZWNTeW5jXG5cdFx0XHR9LFxuXHRcdFx0Jy4vdXRpbC9QdWJsaXNoZXInOiB7XG5cdFx0XHRcdCdkZWZhdWx0JzogcHVibGlzaGVyQ29uc3RydWN0b3Jcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdGxvYWROcG1UYXNrcyA9IHN0dWIoZ3J1bnQsICdsb2FkTnBtVGFza3MnKTtcblx0XHRydW4gPSBzdHViKGdydW50LnRhc2ssICdydW4nKTtcblx0XHR3cml0ZSA9IHNweShncnVudC5maWxlLCAnd3JpdGUnKTtcblx0XHRleHBhbmRNYXBwaW5nID0gc3R1YihncnVudC5maWxlLCAnZXhwYW5kTWFwcGluZycsIChwYXR0ZXJuczogc3RyaW5nW10sIGJhc2U6IHN0cmluZykgPT4ge1xuXHRcdFx0cmV0dXJuIFsgJ2ZvbycgXTtcblx0XHR9KTtcblx0XHRyZWFkSlNPTiA9IHN0dWIoZ3J1bnQuZmlsZSwgJ3JlYWRKU09OJywgKGZpbGVuYW1lOiBzdHJpbmcpID0+IHtcblx0XHRcdHJldHVybiB7fTtcblx0XHR9KTtcblx0XHRzaG91bGRQdXNoID0gc3B5KCgpID0+IHNob3VsZFB1c2hWYWx1ZSk7XG5cblx0XHRwcmVwYXJlT3V0cHV0RGlyZWN0b3J5KCk7XG5cdH0sXG5cblx0dGVhcmRvd24oKSB7XG5cdFx0bG9hZE5wbVRhc2tzLnJlc3RvcmUoKTtcblx0XHR3cml0ZS5yZXN0b3JlKCk7XG5cdFx0cnVuLnJlc3RvcmUoKTtcblx0XHRyZWFkSlNPTi5yZXN0b3JlKCk7XG5cdFx0ZXhwYW5kTWFwcGluZy5yZXN0b3JlKCk7XG5cblx0XHR1bmxvYWRUYXNrcygpO1xuXHRcdGNsZWFuT3V0cHV0RGlyZWN0b3J5KCk7XG5cblx0XHRwcm9jZXNzLmVudi5ERVBMT1lfRE9DUyA9ICcnO1xuXHR9LFxuXG5cdGJlZm9yZUVhY2goKSB7XG5cdFx0Z3J1bnQuaW5pdENvbmZpZyh7XG5cdFx0XHRhcGlEb2NEaXJlY3RvcnksXG5cdFx0XHRhcGlQdWJEaXJlY3RvcnksXG5cdFx0XHR0c2NvbmZpZzoge1xuXHRcdFx0XHRjb21waWxlck9wdGlvbnM6IHtcblx0XHRcdFx0XHRpbmxpbmVTb3VyY2VNYXA6IHRydWUsXG5cdFx0XHRcdFx0aW5saW5lU291cmNlczogdHJ1ZSxcblx0XHRcdFx0XHRsaXN0RmlsZXM6IHRydWUsXG5cdFx0XHRcdFx0bW9kdWxlOiAnY29tbW9uanMnLFxuXHRcdFx0XHRcdG5vSW1wbGljaXRBbnk6IHRydWUsXG5cdFx0XHRcdFx0cHJldHR5OiB0cnVlLFxuXHRcdFx0XHRcdHRhcmdldDogJ2VzNSdcblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdHR5cGVkb2M6IHtcblx0XHRcdFx0b3B0aW9uczoge1xuXHRcdFx0XHRcdG1vZGU6ICdtb2R1bGVzJyxcblx0XHRcdFx0XHRleGNsdWRlRXh0ZXJuYWxzOiB0cnVlLFxuXHRcdFx0XHRcdGV4Y2x1ZGVOb3RFeHBvcnRlZDogdHJ1ZSxcblx0XHRcdFx0XHR0c2NvbmZpZzogdHNjb25maWdQYXRoLFxuXHRcdFx0XHRcdGxvZ2dlcjogJ25vbmUnLFxuXHRcdFx0XHRcdHB1Ymxpc2hPcHRpb25zOiB7XG5cdFx0XHRcdFx0XHRzdWJEaXJlY3Rvcnk6ICdhcGknLFxuXHRcdFx0XHRcdFx0c2hvdWxkUHVzaFxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0d3JpdGUucmVzZXQoKTtcblx0XHRleGVjU3luYy5yZXNldCgpO1xuXHRcdHNob3VsZFB1c2gucmVzZXQoKTtcblx0XHRwdWJsaXNoZXIucHVibGlzaC5yZXNldCgpO1xuXHRcdHB1Ymxpc2hlckNvbnN0cnVjdG9yLnJlc2V0KCk7XG5cblx0XHRzaG91bGRQdXNoVmFsdWUgPSBmYWxzZTtcblx0XHRmYWlsSW5pdGlhbENoZWNrb3V0ID0gZmFsc2U7XG5cdH0sXG5cblx0ZGVmYXVsdCgpIHtcblx0XHRydW5HcnVudFRhc2soJ3R5cGVkb2MnKTtcblx0XHRjb25zdCBjb21tYW5kID0gZXhlY1N5bmMuYXJnc1swXVswXTtcblx0XHRjb25zdCBtYXRjaGVyID0gbmV3IFJlZ0V4cChcblx0XHRcdGBub2RlIFwiW15cIl0rL3R5cGVkb2NcIiAtLW1vZGUgXCJtb2R1bGVzXCIgLS1leGNsdWRlRXh0ZXJuYWxzIC0tZXhjbHVkZU5vdEV4cG9ydGVkIGAgK1xuXHRcdFx0YC0tdHNjb25maWcgXCIke2pvaW4ob3V0cHV0UGF0aCwgJ3RzY29uZmlnLmpzb24nKX1cIiBgICtcblx0XHRcdGAtLWxvZ2dlciBcIm5vbmVcIiAtLW91dCBcIiR7YXBpRG9jRGlyZWN0b3J5fVwiYCk7XG5cdFx0YXNzZXJ0Lm1hdGNoKGNvbW1hbmQsIG1hdGNoZXIsICdVbmV4cGVjdGVkIHR5cGVkb2MgY29tbWFuZCBsaW5lJyk7XG5cdFx0YXNzZXJ0LnN0cmljdEVxdWFsKHNob3VsZFB1c2guY2FsbENvdW50LCAwLCAnUHVzaCBjaGVjayBzaG91bGQgbm90IGhhdmUgYmVlbiBjYWxsZWQnKTtcblx0XHRhc3NlcnQuc3RyaWN0RXF1YWwod3JpdGUuY2FsbENvdW50LCAwLCAnTm90aGluZyBzaG91bGQgaGF2ZSBiZWVuIHdyaXR0ZW4nKTtcblx0XHRhc3NlcnQuc3RyaWN0RXF1YWwoZXhlY1N5bmMuY2FsbENvdW50LCAxLCAnVW5leHBlY3RlZCBudW1iZXIgb2YgZXhlYyBjYWxscycpO1xuXHRcdGFzc2VydC5pc0ZhbHNlKHB1Ymxpc2hlckNvbnN0cnVjdG9yLmNhbGxlZCk7XG5cdH0sXG5cblx0cHVibGlzaDoge1xuXHRcdHNldHVwKCkge1xuXHRcdFx0cHJvY2Vzcy5lbnYuREVQTE9ZX0RPQ1MgPSAncHVibGlzaCc7XG5cdFx0fSxcblxuXHRcdHRlYXJkb3duKCkge1xuXHRcdFx0cHJvY2Vzcy5lbnYuREVQTE9ZX0RPQ1MgPSBjYWNoZWREZXBsb3lEb2NzRW52O1xuXHRcdH0sXG5cblx0XHR0ZXN0KCkge1xuXHRcdFx0cnVuR3J1bnRUYXNrKCd0eXBlZG9jJyk7XG5cdFx0XHRhc3NlcnQuaXNUcnVlKHB1Ymxpc2hlckNvbnN0cnVjdG9yLmNhbGxlZE9uY2UpO1xuXHRcdFx0YXNzZXJ0LmlzRmFsc2UocHVibGlzaGVyQ29uc3RydWN0b3IuZmlyc3RDYWxsLmFyZ3NbMl0uc2tpcFB1Ymxpc2gpO1xuXHRcdFx0YXNzZXJ0LmlzRGVmaW5lZChwdWJsaXNoZXJDb25zdHJ1Y3Rvci5maXJzdENhbGwuYXJnc1syXS5sb2cpO1xuXHRcdFx0YXNzZXJ0LmlzVHJ1ZShwdWJsaXNoZXIucHVibGlzaC5jYWxsZWRPbmNlKTtcblx0XHR9XG5cdH0sXG5cblx0Y29tbWl0OiB7XG5cdFx0c2V0dXAoKSB7XG5cdFx0XHRwcm9jZXNzLmVudi5ERVBMT1lfRE9DUyA9ICdjb21taXQnO1xuXHRcdH0sXG5cblx0XHR0ZWFyZG93bigpIHtcblx0XHRcdHByb2Nlc3MuZW52LkRFUExPWV9ET0NTID0gY2FjaGVkRGVwbG95RG9jc0Vudjtcblx0XHR9LFxuXG5cdFx0dGVzdCgpIHtcblx0XHRcdHJ1bkdydW50VGFzaygndHlwZWRvYycpO1xuXHRcdFx0YXNzZXJ0LmlzVHJ1ZShwdWJsaXNoZXJDb25zdHJ1Y3Rvci5jYWxsZWRPbmNlKTtcblx0XHRcdGFzc2VydC5pc1RydWUocHVibGlzaGVyQ29uc3RydWN0b3IuZmlyc3RDYWxsLmFyZ3NbMl0uc2tpcFB1Ymxpc2gpO1xuXHRcdFx0YXNzZXJ0LmlzRGVmaW5lZChwdWJsaXNoZXJDb25zdHJ1Y3Rvci5maXJzdENhbGwuYXJnc1syXS5sb2cpO1xuXHRcdFx0YXNzZXJ0LmlzVHJ1ZShwdWJsaXNoZXIucHVibGlzaC5jYWxsZWRPbmNlKTtcblx0XHR9XG5cdH1cbn0pO1xuIl19