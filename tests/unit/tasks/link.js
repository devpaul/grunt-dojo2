(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "intern!object", "intern/chai!assert", "grunt", "fs", "path", "sinon", "../util"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var registerSuite = require("intern!object");
    var assert = require("intern/chai!assert");
    var grunt = require("grunt");
    var fs = require("fs");
    var path = require("path");
    var sinon_1 = require("sinon");
    var util_1 = require("../util");
    var outputPath = util_1.getOutputDirectory();
    var cwd = process.cwd();
    var symlink;
    var shell = sinon_1.stub();
    var run;
    registerSuite({
        name: 'tasks/link',
        setup: function () {
            grunt.initConfig({
                distDirectory: outputPath
            });
            symlink = sinon_1.stub(fs, 'symlink');
            shell.withArgs('npm link', {
                cwd: outputPath
            }).returns(Promise.resolve({
                stdout: ''
            }));
            util_1.loadTasks({
                fs: fs,
                execa: {
                    shell: shell
                }
            });
        },
        teardown: function () {
            symlink.restore();
            util_1.unloadTasks();
        },
        beforeEach: function () {
            symlink.reset();
            shell.reset();
        },
        _link: function () {
            util_1.runGruntTask('_link');
            assert.isTrue(symlink.calledTwice);
            assert.isTrue(symlink.firstCall.calledWith(path.join(cwd, 'node_modules'), path.join(outputPath, 'node_modules'), 'junction'));
            assert.isTrue(symlink.secondCall.calledWith(path.join(cwd, 'package.json'), path.join(outputPath, 'package.json'), 'file'));
            assert.isTrue(shell.calledOnce);
            assert.isTrue(shell.calledWith('npm link', { cwd: outputPath }));
        },
        link: {
            beforeEach: function () {
                run = sinon_1.stub(grunt.task, 'run');
            },
            afterEach: function () {
                run.restore();
            },
            withDir: function () {
                util_1.prepareOutputDirectory();
                util_1.runGruntTask('link');
                util_1.cleanOutputDirectory();
                assert.isTrue(run.calledOnce);
                assert.deepEqual(run.firstCall.args[0], ['_link']);
            },
            withoutDir: function () {
                util_1.cleanOutputDirectory();
                util_1.runGruntTask('link');
                assert.isTrue(run.calledOnce);
                assert.deepEqual(run.firstCall.args[0], ['dist', '_link']);
            }
        }
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGluay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImxpbmsudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7SUFBQSw2Q0FBK0M7SUFDL0MsMkNBQTZDO0lBQzdDLDZCQUErQjtJQUMvQix1QkFBeUI7SUFDekIsMkJBQTZCO0lBQzdCLCtCQUF3QztJQUN4QyxnQ0FHaUI7SUFFakIsSUFBTSxVQUFVLEdBQUcseUJBQWtCLEVBQUUsQ0FBQztJQUN4QyxJQUFNLEdBQUcsR0FBRyxPQUFPLENBQUMsR0FBRyxFQUFFLENBQUM7SUFFMUIsSUFBSSxPQUFrQixDQUFDO0lBQ3ZCLElBQUksS0FBSyxHQUFjLFlBQUksRUFBRSxDQUFDO0lBQzlCLElBQUksR0FBYyxDQUFDO0lBRW5CLGFBQWEsQ0FBQztRQUNiLElBQUksRUFBRSxZQUFZO1FBQ2xCLEtBQUs7WUFDSixLQUFLLENBQUMsVUFBVSxDQUFDO2dCQUNoQixhQUFhLEVBQUUsVUFBVTthQUN6QixDQUFDLENBQUM7WUFFSCxPQUFPLEdBQUcsWUFBSSxDQUFDLEVBQUUsRUFBRSxTQUFTLENBQUMsQ0FBQztZQUU5QixLQUFLLENBQUMsUUFBUSxDQUNiLFVBQVUsRUFDVjtnQkFDQyxHQUFHLEVBQUUsVUFBVTthQUNmLENBQ0QsQ0FBQyxPQUFPLENBQ1IsT0FBTyxDQUFDLE9BQU8sQ0FBQztnQkFDZixNQUFNLEVBQUUsRUFBRTthQUNWLENBQUMsQ0FDRixDQUFDO1lBRUYsZ0JBQVMsQ0FBQztnQkFDVCxFQUFFLEVBQUUsRUFBRTtnQkFDTixLQUFLLEVBQUU7b0JBQ04sS0FBSyxFQUFFLEtBQUs7aUJBQ1o7YUFDRCxDQUFDLENBQUM7UUFDSixDQUFDO1FBQ0QsUUFBUTtZQUNQLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUNsQixrQkFBVyxFQUFFLENBQUM7UUFDZixDQUFDO1FBRUQsVUFBVTtZQUNULE9BQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUNoQixLQUFLLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDZixDQUFDO1FBRUQsS0FBSztZQUNKLG1CQUFZLENBQUMsT0FBTyxDQUFDLENBQUM7WUFFdEIsTUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDbkMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxjQUFjLENBQUMsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxjQUFjLENBQUMsRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDO1lBQy9ILE1BQU0sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsY0FBYyxDQUFDLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsY0FBYyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUM1SCxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUNoQyxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsVUFBVSxFQUFFLEVBQUUsR0FBRyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNsRSxDQUFDO1FBRUQsSUFBSSxFQUFFO1lBQ0wsVUFBVTtnQkFDVCxHQUFHLEdBQUcsWUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDL0IsQ0FBQztZQUNELFNBQVM7Z0JBQ1IsR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQ2YsQ0FBQztZQUVELE9BQU87Z0JBQ04sNkJBQXNCLEVBQUUsQ0FBQztnQkFFekIsbUJBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFFckIsMkJBQW9CLEVBQUUsQ0FBQztnQkFFdkIsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7Z0JBQzlCLE1BQU0sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUUsQ0FBQyxDQUFFLEVBQUUsQ0FBRSxPQUFPLENBQUUsQ0FBQyxDQUFDO1lBQ3hELENBQUM7WUFFRCxVQUFVO2dCQUNULDJCQUFvQixFQUFFLENBQUM7Z0JBRXZCLG1CQUFZLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBRXJCLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDO2dCQUM5QixNQUFNLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFFLENBQUMsQ0FBRSxFQUFFLENBQUUsTUFBTSxFQUFFLE9BQU8sQ0FBRSxDQUFDLENBQUM7WUFDaEUsQ0FBQztTQUNEO0tBQ0QsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgcmVnaXN0ZXJTdWl0ZSBmcm9tICdpbnRlcm4hb2JqZWN0JztcbmltcG9ydCAqIGFzIGFzc2VydCBmcm9tICdpbnRlcm4vY2hhaSFhc3NlcnQnO1xuaW1wb3J0ICogYXMgZ3J1bnQgZnJvbSAnZ3J1bnQnO1xuaW1wb3J0ICogYXMgZnMgZnJvbSAnZnMnO1xuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7IFNpbm9uU3R1Yiwgc3R1YiB9IGZyb20gXCJzaW5vblwiO1xuaW1wb3J0IHtcblx0Z2V0T3V0cHV0RGlyZWN0b3J5LCBsb2FkVGFza3MsIHVubG9hZFRhc2tzLCBydW5HcnVudFRhc2ssIHByZXBhcmVPdXRwdXREaXJlY3RvcnksXG5cdGNsZWFuT3V0cHV0RGlyZWN0b3J5XG59IGZyb20gJy4uL3V0aWwnO1xuXG5jb25zdCBvdXRwdXRQYXRoID0gZ2V0T3V0cHV0RGlyZWN0b3J5KCk7XG5jb25zdCBjd2QgPSBwcm9jZXNzLmN3ZCgpO1xuXG5sZXQgc3ltbGluazogU2lub25TdHViO1xubGV0IHNoZWxsOiBTaW5vblN0dWIgPSBzdHViKCk7XG5sZXQgcnVuOiBTaW5vblN0dWI7XG5cbnJlZ2lzdGVyU3VpdGUoe1xuXHRuYW1lOiAndGFza3MvbGluaycsXG5cdHNldHVwKCkge1xuXHRcdGdydW50LmluaXRDb25maWcoe1xuXHRcdFx0ZGlzdERpcmVjdG9yeTogb3V0cHV0UGF0aFxuXHRcdH0pO1xuXG5cdFx0c3ltbGluayA9IHN0dWIoZnMsICdzeW1saW5rJyk7XG5cblx0XHRzaGVsbC53aXRoQXJncyhcblx0XHRcdCducG0gbGluaycsXG5cdFx0XHR7XG5cdFx0XHRcdGN3ZDogb3V0cHV0UGF0aFxuXHRcdFx0fVxuXHRcdCkucmV0dXJucyhcblx0XHRcdFByb21pc2UucmVzb2x2ZSh7XG5cdFx0XHRcdHN0ZG91dDogJydcblx0XHRcdH0pXG5cdFx0KTtcblxuXHRcdGxvYWRUYXNrcyh7XG5cdFx0XHRmczogZnMsXG5cdFx0XHRleGVjYToge1xuXHRcdFx0XHRzaGVsbDogc2hlbGxcblx0XHRcdH1cblx0XHR9KTtcblx0fSxcblx0dGVhcmRvd24oKSB7XG5cdFx0c3ltbGluay5yZXN0b3JlKCk7XG5cdFx0dW5sb2FkVGFza3MoKTtcblx0fSxcblxuXHRiZWZvcmVFYWNoKCkge1xuXHRcdHN5bWxpbmsucmVzZXQoKTtcblx0XHRzaGVsbC5yZXNldCgpO1xuXHR9LFxuXG5cdF9saW5rKCkge1xuXHRcdHJ1bkdydW50VGFzaygnX2xpbmsnKTtcblxuXHRcdGFzc2VydC5pc1RydWUoc3ltbGluay5jYWxsZWRUd2ljZSk7XG5cdFx0YXNzZXJ0LmlzVHJ1ZShzeW1saW5rLmZpcnN0Q2FsbC5jYWxsZWRXaXRoKHBhdGguam9pbihjd2QsICdub2RlX21vZHVsZXMnKSwgcGF0aC5qb2luKG91dHB1dFBhdGgsICdub2RlX21vZHVsZXMnKSwgJ2p1bmN0aW9uJykpO1xuXHRcdGFzc2VydC5pc1RydWUoc3ltbGluay5zZWNvbmRDYWxsLmNhbGxlZFdpdGgocGF0aC5qb2luKGN3ZCwgJ3BhY2thZ2UuanNvbicpLCBwYXRoLmpvaW4ob3V0cHV0UGF0aCwgJ3BhY2thZ2UuanNvbicpLCAnZmlsZScpKTtcblx0XHRhc3NlcnQuaXNUcnVlKHNoZWxsLmNhbGxlZE9uY2UpO1xuXHRcdGFzc2VydC5pc1RydWUoc2hlbGwuY2FsbGVkV2l0aCgnbnBtIGxpbmsnLCB7IGN3ZDogb3V0cHV0UGF0aCB9KSk7XG5cdH0sXG5cblx0bGluazoge1xuXHRcdGJlZm9yZUVhY2goKSB7XG5cdFx0XHRydW4gPSBzdHViKGdydW50LnRhc2ssICdydW4nKTtcblx0XHR9LFxuXHRcdGFmdGVyRWFjaCgpIHtcblx0XHRcdHJ1bi5yZXN0b3JlKCk7XG5cdFx0fSxcblxuXHRcdHdpdGhEaXIoKSB7XG5cdFx0XHRwcmVwYXJlT3V0cHV0RGlyZWN0b3J5KCk7XG5cblx0XHRcdHJ1bkdydW50VGFzaygnbGluaycpO1xuXG5cdFx0XHRjbGVhbk91dHB1dERpcmVjdG9yeSgpO1xuXG5cdFx0XHRhc3NlcnQuaXNUcnVlKHJ1bi5jYWxsZWRPbmNlKTtcblx0XHRcdGFzc2VydC5kZWVwRXF1YWwocnVuLmZpcnN0Q2FsbC5hcmdzWyAwIF0sIFsgJ19saW5rJyBdKTtcblx0XHR9LFxuXG5cdFx0d2l0aG91dERpcigpIHtcblx0XHRcdGNsZWFuT3V0cHV0RGlyZWN0b3J5KCk7XG5cblx0XHRcdHJ1bkdydW50VGFzaygnbGluaycpO1xuXG5cdFx0XHRhc3NlcnQuaXNUcnVlKHJ1bi5jYWxsZWRPbmNlKTtcblx0XHRcdGFzc2VydC5kZWVwRXF1YWwocnVuLmZpcnN0Q2FsbC5hcmdzWyAwIF0sIFsgJ2Rpc3QnLCAnX2xpbmsnIF0pO1xuXHRcdH1cblx0fVxufSk7XG4iXX0=