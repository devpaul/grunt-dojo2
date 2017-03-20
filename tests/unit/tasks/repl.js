(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "intern!object", "intern/chai!assert", "grunt", "../util"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var registerSuite = require("intern!object");
    var assert = require("intern/chai!assert");
    var grunt = require("grunt");
    var util_1 = require("../util");
    var fakeRepl = {};
    var fakeDojoRequire = function () {
    };
    registerSuite({
        name: 'tasks/repl',
        setup: function () {
            grunt.initConfig({});
            util_1.loadTasks({
                repl: {
                    start: function () {
                        return {
                            context: fakeRepl
                        };
                    }
                },
                '../lib/load-dojo-loader': {
                    default: function () {
                        return {
                            baseUrl: './base-url',
                            packages: [
                                {
                                    name: 'package-1'
                                }
                            ],
                            require: fakeDojoRequire
                        };
                    }
                },
                'resolve-from': function (fromDir, moduleId) {
                    return fromDir + '/' + moduleId;
                },
                './base-url/test-package': {
                    hello: 'world'
                }
            });
        },
        teardown: function () {
            util_1.unloadTasks();
        },
        repl: function () {
            var dfd = this.async();
            util_1.runGruntTask('repl');
            setTimeout(dfd.callback(function () {
                assert.isNotNull(fakeRepl.require);
                assert.isNotNull(fakeRepl.nodeRequire);
                assert.equal(fakeRepl.require, fakeDojoRequire);
                assert.notEqual(fakeRepl.nodeRequire, fakeDojoRequire);
                var testPackage = fakeRepl.nodeRequire('test-package');
                assert.deepEqual(testPackage, { hello: 'world' });
                assert.equal(fakeRepl.nodeRequire.resolve('test-package'), './base-url/test-package');
            }), 10);
        }
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVwbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInJlcGwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7SUFBQSw2Q0FBK0M7SUFDL0MsMkNBQTZDO0lBQzdDLDZCQUErQjtJQUMvQixnQ0FBK0Q7SUFHL0QsSUFBSSxRQUFRLEdBQVEsRUFBRSxDQUFDO0lBQ3ZCLElBQU0sZUFBZSxHQUFHO0lBQ3hCLENBQUMsQ0FBQztJQUVGLGFBQWEsQ0FBQztRQUNiLElBQUksRUFBRSxZQUFZO1FBQ2xCLEtBQUs7WUFDSixLQUFLLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBRXJCLGdCQUFTLENBQUM7Z0JBQ1QsSUFBSSxFQUFFO29CQUNMLEtBQUs7d0JBQ0osTUFBTSxDQUFDOzRCQUNOLE9BQU8sRUFBRSxRQUFRO3lCQUNqQixDQUFDO29CQUNILENBQUM7aUJBQ0Q7Z0JBQ0QseUJBQXlCLEVBQUU7b0JBQzFCLE9BQU87d0JBQ04sTUFBTSxDQUFDOzRCQUNOLE9BQU8sRUFBRSxZQUFZOzRCQUNyQixRQUFRLEVBQUU7Z0NBQ1Q7b0NBQ0MsSUFBSSxFQUFFLFdBQVc7aUNBQ2pCOzZCQUNEOzRCQUNELE9BQU8sRUFBRSxlQUFlO3lCQUN4QixDQUFDO29CQUNILENBQUM7aUJBQ0Q7Z0JBRUQsY0FBYyxZQUFDLE9BQWUsRUFBRSxRQUFnQjtvQkFDL0MsTUFBTSxDQUFDLE9BQU8sR0FBRyxHQUFHLEdBQUcsUUFBUSxDQUFDO2dCQUNqQyxDQUFDO2dCQUVELHlCQUF5QixFQUFFO29CQUMxQixLQUFLLEVBQUUsT0FBTztpQkFDZDthQUNELENBQUMsQ0FBQztRQUNKLENBQUM7UUFDRCxRQUFRO1lBQ1Asa0JBQVcsRUFBRSxDQUFDO1FBQ2YsQ0FBQztRQUVELElBQUk7WUFDSCxJQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7WUFFekIsbUJBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUVyQixVQUFVLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQztnQkFDdkIsTUFBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBQ25DLE1BQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDO2dCQUV2QyxNQUFNLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsZUFBZSxDQUFDLENBQUM7Z0JBQ2hELE1BQU0sQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLFdBQVcsRUFBRSxlQUFlLENBQUMsQ0FBQztnQkFFdkQsSUFBSSxXQUFXLEdBQUcsUUFBUSxDQUFDLFdBQVcsQ0FBQyxjQUFjLENBQUMsQ0FBQztnQkFDdkQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxXQUFXLEVBQUUsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQztnQkFDbEQsTUFBTSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsRUFBRSx5QkFBeUIsQ0FBQyxDQUFDO1lBQ3ZGLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQ1QsQ0FBQztLQUNELENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIHJlZ2lzdGVyU3VpdGUgZnJvbSAnaW50ZXJuIW9iamVjdCc7XG5pbXBvcnQgKiBhcyBhc3NlcnQgZnJvbSAnaW50ZXJuL2NoYWkhYXNzZXJ0JztcbmltcG9ydCAqIGFzIGdydW50IGZyb20gJ2dydW50JztcbmltcG9ydCB7IGxvYWRUYXNrcywgdW5sb2FkVGFza3MsIHJ1bkdydW50VGFzayB9IGZyb20gJy4uL3V0aWwnO1xuaW1wb3J0IFRlc3QgPSByZXF1aXJlKFwiaW50ZXJuL2xpYi9UZXN0XCIpO1xuXG5sZXQgZmFrZVJlcGw6IGFueSA9IHt9O1xuY29uc3QgZmFrZURvam9SZXF1aXJlID0gZnVuY3Rpb24gKCkge1xufTtcblxucmVnaXN0ZXJTdWl0ZSh7XG5cdG5hbWU6ICd0YXNrcy9yZXBsJyxcblx0c2V0dXAoKSB7XG5cdFx0Z3J1bnQuaW5pdENvbmZpZyh7fSk7XG5cblx0XHRsb2FkVGFza3Moe1xuXHRcdFx0cmVwbDoge1xuXHRcdFx0XHRzdGFydCgpIHtcblx0XHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdFx0Y29udGV4dDogZmFrZVJlcGxcblx0XHRcdFx0XHR9O1xuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0Jy4uL2xpYi9sb2FkLWRvam8tbG9hZGVyJzoge1xuXHRcdFx0XHRkZWZhdWx0KCkge1xuXHRcdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0XHRiYXNlVXJsOiAnLi9iYXNlLXVybCcsXG5cdFx0XHRcdFx0XHRwYWNrYWdlczogW1xuXHRcdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdFx0bmFtZTogJ3BhY2thZ2UtMSdcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XSxcblx0XHRcdFx0XHRcdHJlcXVpcmU6IGZha2VEb2pvUmVxdWlyZVxuXHRcdFx0XHRcdH07XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cblx0XHRcdCdyZXNvbHZlLWZyb20nKGZyb21EaXI6IHN0cmluZywgbW9kdWxlSWQ6IHN0cmluZykge1xuXHRcdFx0XHRyZXR1cm4gZnJvbURpciArICcvJyArIG1vZHVsZUlkO1xuXHRcdFx0fSxcblxuXHRcdFx0Jy4vYmFzZS11cmwvdGVzdC1wYWNrYWdlJzoge1xuXHRcdFx0XHRoZWxsbzogJ3dvcmxkJ1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9LFxuXHR0ZWFyZG93bigpIHtcblx0XHR1bmxvYWRUYXNrcygpO1xuXHR9LFxuXG5cdHJlcGwodGhpczogVGVzdCkge1xuXHRcdGNvbnN0IGRmZCA9IHRoaXMuYXN5bmMoKTtcblxuXHRcdHJ1bkdydW50VGFzaygncmVwbCcpO1xuXG5cdFx0c2V0VGltZW91dChkZmQuY2FsbGJhY2soKCkgPT4ge1xuXHRcdFx0YXNzZXJ0LmlzTm90TnVsbChmYWtlUmVwbC5yZXF1aXJlKTtcblx0XHRcdGFzc2VydC5pc05vdE51bGwoZmFrZVJlcGwubm9kZVJlcXVpcmUpO1xuXG5cdFx0XHRhc3NlcnQuZXF1YWwoZmFrZVJlcGwucmVxdWlyZSwgZmFrZURvam9SZXF1aXJlKTtcblx0XHRcdGFzc2VydC5ub3RFcXVhbChmYWtlUmVwbC5ub2RlUmVxdWlyZSwgZmFrZURvam9SZXF1aXJlKTtcblxuXHRcdFx0bGV0IHRlc3RQYWNrYWdlID0gZmFrZVJlcGwubm9kZVJlcXVpcmUoJ3Rlc3QtcGFja2FnZScpO1xuXHRcdFx0YXNzZXJ0LmRlZXBFcXVhbCh0ZXN0UGFja2FnZSwgeyBoZWxsbzogJ3dvcmxkJyB9KTtcblx0XHRcdGFzc2VydC5lcXVhbChmYWtlUmVwbC5ub2RlUmVxdWlyZS5yZXNvbHZlKCd0ZXN0LXBhY2thZ2UnKSwgJy4vYmFzZS11cmwvdGVzdC1wYWNrYWdlJyk7XG5cdFx0fSksIDEwKTtcblx0fVxufSk7XG5cbiJdfQ==