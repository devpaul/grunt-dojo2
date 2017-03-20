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
    var cp = sinon_1.stub();
    var rm = sinon_1.stub();
    var spawnStub = sinon_1.stub();
    var touch = sinon_1.stub();
    var publishModeStub = sinon_1.stub();
    var failInitialCheckout;
    var publisherConstructor;
    var publisher;
    registerSuite({
        name: 'tasks/typedoc',
        setup: function () {
            execSync = sinon_1.spy(function (command) {
                if (/git checkout/.test(command) && failInitialCheckout) {
                    failInitialCheckout = false;
                    throw new Error('Failing checkout');
                }
            });
            publisher = {
                init: sinon_1.stub(),
                publish: sinon_1.stub(),
                commit: sinon_1.stub()
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
                './util/process': {
                    'exec': execSync,
                    'spawn': spawnStub
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
            publisher.commit.returns(true);
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
                            publishMode: publishModeStub
                        }
                    }
                }
            });
            write.reset();
            execSync.reset();
            spawnStub.reset();
            publishModeStub.reset();
            publisher.publish.reset();
            publisher.commit.reset();
            publisher.init.reset();
            publisherConstructor.reset();
            spawnStub.returns({ stdout: '' });
            failInitialCheckout = false;
        },
        default: function () {
            publishModeStub.returns(false);
            util_1.runGruntTask('typedoc');
            var command = execSync.args[0][0];
            var matcher = new RegExp("node \"[^\"]+/typedoc\" --mode \"modules\" --excludeExternals --excludeNotExported " +
                ("--tsconfig \"" + path_1.join(outputPath, 'tsconfig.json') + "\" ") +
                ("--logger \"none\" --out \"" + apiDocDirectory + "\""));
            chai_1.assert.match(command, matcher, 'Unexpected typedoc command line');
            chai_1.assert.strictEqual(write.callCount, 0, 'Nothing should have been written');
            chai_1.assert.strictEqual(execSync.callCount, 1, 'Unexpected number of exec calls');
            chai_1.assert.isFalse(publisherConstructor.called);
        },
        publish: function () {
            publishModeStub.returns('publish');
            util_1.runGruntTask('typedoc');
            chai_1.assert.isTrue(publisherConstructor.calledOnce);
            chai_1.assert.isDefined(publisherConstructor.firstCall.args[1].log);
            chai_1.assert.isTrue(publisher.commit.calledOnce);
            chai_1.assert.isTrue(publisher.publish.calledOnce);
        },
        commit: function () {
            publishModeStub.returns('commit');
            util_1.runGruntTask('typedoc');
            chai_1.assert.isTrue(publisherConstructor.calledOnce);
            chai_1.assert.isDefined(publisherConstructor.firstCall.args[1].log);
            chai_1.assert.isTrue(publisher.commit.calledOnce);
            chai_1.assert.isFalse(publisher.publish.called);
        }
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZWRvYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInR5cGVkb2MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7SUFBQSw2Q0FBZ0Q7SUFDaEQsNkJBQThCO0lBQzlCLDZCQUErQjtJQUMvQiw2QkFBNEI7SUFDNUIsK0JBQXVEO0lBQ3ZELGdDQU9pQjtJQUVqQixJQUFNLFVBQVUsR0FBRyx5QkFBa0IsRUFBRSxDQUFDO0lBQ3hDLElBQU0sWUFBWSxHQUFHLFdBQUksQ0FBQyxVQUFVLEVBQUUsZUFBZSxDQUFDLENBQUM7SUFDdkQsSUFBTSxlQUFlLEdBQUcsV0FBSSxDQUFDLFVBQVUsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUNoRCxJQUFNLGVBQWUsR0FBRyxXQUFJLENBQUMsVUFBVSxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBRWhELElBQUksWUFBdUIsQ0FBQztJQUM1QixJQUFJLEdBQWMsQ0FBQztJQUNuQixJQUFJLEtBQWUsQ0FBQztJQUNwQixJQUFJLFFBQW1CLENBQUM7SUFDeEIsSUFBSSxhQUF3QixDQUFDO0lBQzdCLElBQUksUUFBa0IsQ0FBQztJQUN2QixJQUFNLEVBQUUsR0FBRyxZQUFJLEVBQUUsQ0FBQztJQUNsQixJQUFNLEVBQUUsR0FBRyxZQUFJLEVBQUUsQ0FBQztJQUNsQixJQUFNLFNBQVMsR0FBRyxZQUFJLEVBQUUsQ0FBQztJQUN6QixJQUFNLEtBQUssR0FBRyxZQUFJLEVBQUUsQ0FBQztJQUNyQixJQUFNLGVBQWUsR0FBRyxZQUFJLEVBQUUsQ0FBQztJQUMvQixJQUFJLG1CQUE0QixDQUFDO0lBQ2pDLElBQUksb0JBQThCLENBQUM7SUFDbkMsSUFBSSxTQUtILENBQUM7SUFFRixhQUFhLENBQUM7UUFDYixJQUFJLEVBQUUsZUFBZTtRQUVyQixLQUFLO1lBQ0osUUFBUSxHQUFHLFdBQUcsQ0FBQyxVQUFDLE9BQWU7Z0JBQzlCLEVBQUUsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFD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QzdFLGFBQU0sQ0FBQyxPQUFPLENBQUMsb0JBQW9CLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDN0MsQ0FBQztRQUVELE9BQU87WUFDTixlQUFlLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQ25DLG1CQUFZLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDeEIsYUFBTSxDQUFDLE1BQU0sQ0FBQyxvQkFBb0IsQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUMvQyxhQUFNLENBQUMsU0FBUyxDQUFDLG9CQUFvQixDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDN0QsYUFBTSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQzNDLGFBQU0sQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUM3QyxDQUFDO1FBRUQsTUFBTTtZQUNMLGVBQWUsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDbEMsbUJBQVksQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUN4QixhQUFNLENBQUMsTUFBTSxDQUFDLG9CQUFvQixDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQy9DLGFBQU0sQ0FBQyxTQUFTLENBQUMsb0JBQW9CLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUM3RCxhQUFNLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDM0MsYUFBTSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzFDLENBQUM7S0FDRCxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgcmVnaXN0ZXJTdWl0ZSA9IHJlcXVpcmUoJ2ludGVybiFvYmplY3QnKTtcbmltcG9ydCB7IGFzc2VydCB9IGZyb20gJ2NoYWknO1xuaW1wb3J0ICogYXMgZ3J1bnQgZnJvbSAnZ3J1bnQnO1xuaW1wb3J0IHsgam9pbiB9IGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgU2lub25TcHksIHNweSwgU2lub25TdHViLCBzdHViIH0gZnJvbSAnc2lub24nO1xuaW1wb3J0IHtcblx0bG9hZFRhc2tzLFxuXHRwcmVwYXJlT3V0cHV0RGlyZWN0b3J5LFxuXHR1bmxvYWRUYXNrcyxcblx0Y2xlYW5PdXRwdXREaXJlY3RvcnksXG5cdHJ1bkdydW50VGFzayxcblx0Z2V0T3V0cHV0RGlyZWN0b3J5XG59IGZyb20gJy4uL3V0aWwnO1xuXG5jb25zdCBvdXRwdXRQYXRoID0gZ2V0T3V0cHV0RGlyZWN0b3J5KCk7XG5jb25zdCB0c2NvbmZpZ1BhdGggPSBqb2luKG91dHB1dFBhdGgsICd0c2NvbmZpZy5qc29uJyk7XG5jb25zdCBhcGlEb2NEaXJlY3RvcnkgPSBqb2luKG91dHB1dFBhdGgsICdkb2MnKTtcbmNvbnN0IGFwaVB1YkRpcmVjdG9yeSA9IGpvaW4ob3V0cHV0UGF0aCwgJ3B1YicpO1xuXG5sZXQgbG9hZE5wbVRhc2tzOiBTaW5vblN0dWI7XG5sZXQgcnVuOiBTaW5vblN0dWI7XG5sZXQgd3JpdGU6IFNpbm9uU3B5O1xubGV0IHJlYWRKU09OOiBTaW5vblN0dWI7XG5sZXQgZXhwYW5kTWFwcGluZzogU2lub25TdHViO1xubGV0IGV4ZWNTeW5jOiBTaW5vblNweTtcbmNvbnN0IGNwID0gc3R1YigpO1xuY29uc3Qgcm0gPSBzdHViKCk7XG5jb25zdCBzcGF3blN0dWIgPSBzdHViKCk7XG5jb25zdCB0b3VjaCA9IHN0dWIoKTtcbmNvbnN0IHB1Ymxpc2hNb2RlU3R1YiA9IHN0dWIoKTtcbmxldCBmYWlsSW5pdGlhbENoZWNrb3V0OiBib29sZWFuO1xubGV0IHB1Ymxpc2hlckNvbnN0cnVjdG9yOiBTaW5vblNweTtcbmxldCBwdWJsaXNoZXI6IHtcblx0bG9nPzogYW55O1xuXHRpbml0OiBTaW5vblN0dWI7XG5cdGNvbW1pdDogU2lub25TdHViO1xuXHRwdWJsaXNoOiBTaW5vblN0dWI7XG59O1xuXG5yZWdpc3RlclN1aXRlKHtcblx0bmFtZTogJ3Rhc2tzL3R5cGVkb2MnLFxuXG5cdHNldHVwKCkge1xuXHRcdGV4ZWNTeW5jID0gc3B5KChjb21tYW5kOiBzdHJpbmcpID0+IHtcblx0XHRcdGlmICgvZ2l0IGNoZWNrb3V0Ly50ZXN0KGNvbW1hbmQpICYmIGZhaWxJbml0aWFsQ2hlY2tvdXQpIHtcblx0XHRcdFx0ZmFpbEluaXRpYWxDaGVja291dCA9IGZhbHNlO1xuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ0ZhaWxpbmcgY2hlY2tvdXQnKTtcblx0XHRcdH1cblx0XHR9KTtcblx0XHRwdWJsaXNoZXIgPSB7XG5cdFx0XHRpbml0OiBzdHViKCksXG5cdFx0XHRwdWJsaXNoOiBzdHViKCksXG5cdFx0XHRjb21taXQ6IHN0dWIoKVxuXHRcdH07XG5cdFx0cHVibGlzaGVyQ29uc3RydWN0b3IgPSBzcHkoZnVuY3Rpb24gKCkge1xuXHRcdFx0cmV0dXJuIHB1Ymxpc2hlcjtcblx0XHR9KTtcblxuXHRcdGxvYWRUYXNrcyh7XG5cdFx0XHQnc2hlbGxqcyc6IHtcblx0XHRcdFx0Y29uZmlnOiB7fSxcblx0XHRcdFx0Y3AsXG5cdFx0XHRcdHJtLFxuXHRcdFx0XHR0b3VjaFxuXHRcdFx0fSxcblx0XHRcdCcuL3V0aWwvcHJvY2Vzcyc6IHtcblx0XHRcdFx0J2V4ZWMnOiBleGVjU3luYyxcblx0XHRcdFx0J3NwYXduJzogc3Bhd25TdHViXG5cdFx0XHR9LFxuXHRcdFx0Jy4vdXRpbC9QdWJsaXNoZXInOiB7XG5cdFx0XHRcdCdkZWZhdWx0JzogcHVibGlzaGVyQ29uc3RydWN0b3Jcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdGxvYWROcG1UYXNrcyA9IHN0dWIoZ3J1bnQsICdsb2FkTnBtVGFza3MnKTtcblx0XHRydW4gPSBzdHViKGdydW50LnRhc2ssICdydW4nKTtcblx0XHR3cml0ZSA9IHNweShncnVudC5maWxlLCAnd3JpdGUnKTtcblx0XHRleHBhbmRNYXBwaW5nID0gc3R1YihncnVudC5maWxlLCAnZXhwYW5kTWFwcGluZycsIChwYXR0ZXJuczogc3RyaW5nW10sIGJhc2U6IHN0cmluZykgPT4ge1xuXHRcdFx0cmV0dXJuIFsgJ2ZvbycgXTtcblx0XHR9KTtcblx0XHRyZWFkSlNPTiA9IHN0dWIoZ3J1bnQuZmlsZSwgJ3JlYWRKU09OJywgKGZpbGVuYW1lOiBzdHJpbmcpID0+IHtcblx0XHRcdHJldHVybiB7fTtcblx0XHR9KTtcblx0XHRwdWJsaXNoZXIuY29tbWl0LnJldHVybnModHJ1ZSk7XG5cblx0XHRwcmVwYXJlT3V0cHV0RGlyZWN0b3J5KCk7XG5cdH0sXG5cblx0dGVhcmRvd24oKSB7XG5cdFx0bG9hZE5wbVRhc2tzLnJlc3RvcmUoKTtcblx0XHR3cml0ZS5yZXN0b3JlKCk7XG5cdFx0cnVuLnJlc3RvcmUoKTtcblx0XHRyZWFkSlNPTi5yZXN0b3JlKCk7XG5cdFx0ZXhwYW5kTWFwcGluZy5yZXN0b3JlKCk7XG5cblx0XHR1bmxvYWRUYXNrcygpO1xuXHRcdGNsZWFuT3V0cHV0RGlyZWN0b3J5KCk7XG5cblx0XHRwcm9jZXNzLmVudi5ERVBMT1lfRE9DUyA9ICcnO1xuXHR9LFxuXG5cdGJlZm9yZUVhY2goKSB7XG5cdFx0Z3J1bnQuaW5pdENvbmZpZyh7XG5cdFx0XHRhcGlEb2NEaXJlY3RvcnksXG5cdFx0XHRhcGlQdWJEaXJlY3RvcnksXG5cdFx0XHR0c2NvbmZpZzoge1xuXHRcdFx0XHRjb21waWxlck9wdGlvbnM6IHtcblx0XHRcdFx0XHRpbmxpbmVTb3VyY2VNYXA6IHRydWUsXG5cdFx0XHRcdFx0aW5saW5lU291cmNlczogdHJ1ZSxcblx0XHRcdFx0XHRsaXN0RmlsZXM6IHRydWUsXG5cdFx0XHRcdFx0bW9kdWxlOiAnY29tbW9uanMnLFxuXHRcdFx0XHRcdG5vSW1wbGljaXRBbnk6IHRydWUsXG5cdFx0XHRcdFx0cHJldHR5OiB0cnVlLFxuXHRcdFx0XHRcdHRhcmdldDogJ2VzNSdcblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdHR5cGVkb2M6IHtcblx0XHRcdFx0b3B0aW9uczoge1xuXHRcdFx0XHRcdG1vZGU6ICdtb2R1bGVzJyxcblx0XHRcdFx0XHRleGNsdWRlRXh0ZXJuYWxzOiB0cnVlLFxuXHRcdFx0XHRcdGV4Y2x1ZGVOb3RFeHBvcnRlZDogdHJ1ZSxcblx0XHRcdFx0XHR0c2NvbmZpZzogdHNjb25maWdQYXRoLFxuXHRcdFx0XHRcdGxvZ2dlcjogJ25vbmUnLFxuXHRcdFx0XHRcdHB1Ymxpc2hPcHRpb25zOiB7XG5cdFx0XHRcdFx0XHRzdWJEaXJlY3Rvcnk6ICdhcGknLFxuXHRcdFx0XHRcdFx0cHVibGlzaE1vZGU6IHB1Ymxpc2hNb2RlU3R1YlxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0d3JpdGUucmVzZXQoKTtcblx0XHRleGVjU3luYy5yZXNldCgpO1xuXHRcdHNwYXduU3R1Yi5yZXNldCgpO1xuXHRcdHB1Ymxpc2hNb2RlU3R1Yi5yZXNldCgpO1xuXHRcdHB1Ymxpc2hlci5wdWJsaXNoLnJlc2V0KCk7XG5cdFx0cHVibGlzaGVyLmNvbW1pdC5yZXNldCgpO1xuXHRcdHB1Ymxpc2hlci5pbml0LnJlc2V0KCk7XG5cdFx0cHVibGlzaGVyQ29uc3RydWN0b3IucmVzZXQoKTtcblxuXHRcdHNwYXduU3R1Yi5yZXR1cm5zKHsgc3Rkb3V0OiAnJyB9KTtcblx0XHRmYWlsSW5pdGlhbENoZWNrb3V0ID0gZmFsc2U7XG5cdH0sXG5cblx0ZGVmYXVsdCgpIHtcblx0XHRwdWJsaXNoTW9kZVN0dWIucmV0dXJucyhmYWxzZSk7XG5cdFx0cnVuR3J1bnRUYXNrKCd0eXBlZG9jJyk7XG5cdFx0Y29uc3QgY29tbWFuZCA9IGV4ZWNTeW5jLmFyZ3NbMF1bMF07XG5cdFx0Y29uc3QgbWF0Y2hlciA9IG5ldyBSZWdFeHAoXG5cdFx0XHRgbm9kZSBcIlteXCJdKy90eXBlZG9jXCIgLS1tb2RlIFwibW9kdWxlc1wiIC0tZXhjbHVkZUV4dGVybmFscyAtLWV4Y2x1ZGVOb3RFeHBvcnRlZCBgICtcblx0XHRcdGAtLXRzY29uZmlnIFwiJHtqb2luKG91dHB1dFBhdGgsICd0c2NvbmZpZy5qc29uJyl9XCIgYCArXG5cdFx0XHRgLS1sb2dnZXIgXCJub25lXCIgLS1vdXQgXCIke2FwaURvY0RpcmVjdG9yeX1cImApO1xuXHRcdGFzc2VydC5tYXRjaChjb21tYW5kLCBtYXRjaGVyLCAnVW5leHBlY3RlZCB0eXBlZG9jIGNvbW1hbmQgbGluZScpO1xuXHRcdGFzc2VydC5zdHJpY3RFcXVhbCh3cml0ZS5jYWxsQ291bnQsIDAsICdOb3RoaW5nIHNob3VsZCBoYXZlIGJlZW4gd3JpdHRlbicpO1xuXHRcdGFzc2VydC5zdHJpY3RFcXVhbChleGVjU3luYy5jYWxsQ291bnQsIDEsICdVbmV4cGVjdGVkIG51bWJlciBvZiBleGVjIGNhbGxzJyk7XG5cdFx0YXNzZXJ0LmlzRmFsc2UocHVibGlzaGVyQ29uc3RydWN0b3IuY2FsbGVkKTtcblx0fSxcblxuXHRwdWJsaXNoKCkge1xuXHRcdHB1Ymxpc2hNb2RlU3R1Yi5yZXR1cm5zKCdwdWJsaXNoJyk7XG5cdFx0cnVuR3J1bnRUYXNrKCd0eXBlZG9jJyk7XG5cdFx0YXNzZXJ0LmlzVHJ1ZShwdWJsaXNoZXJDb25zdHJ1Y3Rvci5jYWxsZWRPbmNlKTtcblx0XHRhc3NlcnQuaXNEZWZpbmVkKHB1Ymxpc2hlckNvbnN0cnVjdG9yLmZpcnN0Q2FsbC5hcmdzWzFdLmxvZyk7XG5cdFx0YXNzZXJ0LmlzVHJ1ZShwdWJsaXNoZXIuY29tbWl0LmNhbGxlZE9uY2UpO1xuXHRcdGFzc2VydC5pc1RydWUocHVibGlzaGVyLnB1Ymxpc2guY2FsbGVkT25jZSk7XG5cdH0sXG5cblx0Y29tbWl0KCkge1xuXHRcdHB1Ymxpc2hNb2RlU3R1Yi5yZXR1cm5zKCdjb21taXQnKTtcblx0XHRydW5HcnVudFRhc2soJ3R5cGVkb2MnKTtcblx0XHRhc3NlcnQuaXNUcnVlKHB1Ymxpc2hlckNvbnN0cnVjdG9yLmNhbGxlZE9uY2UpO1xuXHRcdGFzc2VydC5pc0RlZmluZWQocHVibGlzaGVyQ29uc3RydWN0b3IuZmlyc3RDYWxsLmFyZ3NbMV0ubG9nKTtcblx0XHRhc3NlcnQuaXNUcnVlKHB1Ymxpc2hlci5jb21taXQuY2FsbGVkT25jZSk7XG5cdFx0YXNzZXJ0LmlzRmFsc2UocHVibGlzaGVyLnB1Ymxpc2guY2FsbGVkKTtcblx0fVxufSk7XG4iXX0=