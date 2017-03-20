(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "intern!object", "intern/chai!assert", "grunt", "sinon", "../util"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var registerSuite = require("intern!object");
    var assert = require("intern/chai!assert");
    var grunt = require("grunt");
    var sinon_1 = require("sinon");
    var util_1 = require("../util");
    var requireStub = sinon_1.stub();
    registerSuite({
        name: 'tasks/run',
        setup: function () {
            grunt.initConfig({});
            util_1.loadTasks({
                '../lib/load-dojo-loader': {
                    default: function () {
                        return {
                            require: requireStub
                        };
                    }
                }
            });
        },
        teardown: function () {
            util_1.unloadTasks();
        },
        beforeEach: function () {
            requireStub.reset();
        },
        runsDefault: function () {
            var dfd = this.async(1000);
            util_1.runGruntTask('run', function () {
            });
            setTimeout(dfd.callback(function () {
                assert.isTrue(requireStub.calledOnce);
                assert.deepEqual(requireStub.firstCall.args[0], ['src/main']);
            }), 100);
        },
        runsArgument: function () {
            var dfd = this.async(1000);
            grunt.option('main', 'my-main');
            util_1.runGruntTask('run', function () {
            });
            setTimeout(dfd.callback(function () {
                assert.isTrue(requireStub.calledOnce);
                assert.deepEqual(requireStub.firstCall.args[0], ['my-main']);
            }), 100);
        },
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVuLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicnVuLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0lBQUEsNkNBQStDO0lBQy9DLDJDQUE2QztJQUM3Qyw2QkFBK0I7SUFDL0IsK0JBQTZCO0lBQzdCLGdDQUErRDtJQUcvRCxJQUFNLFdBQVcsR0FBRyxZQUFJLEVBQUUsQ0FBQztJQUUzQixhQUFhLENBQUM7UUFDYixJQUFJLEVBQUUsV0FBVztRQUNqQixLQUFLO1lBQ0osS0FBSyxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUVyQixnQkFBUyxDQUFDO2dCQUNULHlCQUF5QixFQUFFO29CQUMxQixPQUFPLEVBQUU7d0JBQ1IsTUFBTSxDQUFDOzRCQUNOLE9BQU8sRUFBRSxXQUFXO3lCQUNwQixDQUFDO29CQUNILENBQUM7aUJBQ0Q7YUFDRCxDQUFDLENBQUM7UUFDSixDQUFDO1FBQ0QsUUFBUTtZQUNQLGtCQUFXLEVBQUUsQ0FBQztRQUNmLENBQUM7UUFDRCxVQUFVO1lBQ1QsV0FBVyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ3JCLENBQUM7UUFDRCxXQUFXO1lBQ1YsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUUzQixtQkFBWSxDQUFDLEtBQUssRUFBRTtZQUNwQixDQUFDLENBQUMsQ0FBQztZQUVILFVBQVUsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDO2dCQUN2QixNQUFNLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQztnQkFDdEMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBRSxDQUFDLENBQUUsRUFBRSxDQUFFLFVBQVUsQ0FBRSxDQUFDLENBQUM7WUFDbkUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDVixDQUFDO1FBQ0QsWUFBWTtZQUNYLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFM0IsS0FBSyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsU0FBUyxDQUFDLENBQUM7WUFFaEMsbUJBQVksQ0FBQyxLQUFLLEVBQUU7WUFDcEIsQ0FBQyxDQUFDLENBQUM7WUFFSCxVQUFVLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQztnQkFDdkIsTUFBTSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLENBQUM7Z0JBQ3RDLE1BQU0sQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUUsQ0FBQyxDQUFFLEVBQUUsQ0FBRSxTQUFTLENBQUUsQ0FBQyxDQUFDO1lBQ2xFLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ1YsQ0FBQztLQUNELENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIHJlZ2lzdGVyU3VpdGUgZnJvbSAnaW50ZXJuIW9iamVjdCc7XG5pbXBvcnQgKiBhcyBhc3NlcnQgZnJvbSAnaW50ZXJuL2NoYWkhYXNzZXJ0JztcbmltcG9ydCAqIGFzIGdydW50IGZyb20gJ2dydW50JztcbmltcG9ydCB7IHN0dWIgfSBmcm9tICdzaW5vbic7XG5pbXBvcnQgeyBsb2FkVGFza3MsIHVubG9hZFRhc2tzLCBydW5HcnVudFRhc2sgfSBmcm9tICcuLi91dGlsJztcbmltcG9ydCBUZXN0ID0gcmVxdWlyZShcImludGVybi9saWIvVGVzdFwiKTtcblxuY29uc3QgcmVxdWlyZVN0dWIgPSBzdHViKCk7XG5cbnJlZ2lzdGVyU3VpdGUoe1xuXHRuYW1lOiAndGFza3MvcnVuJyxcblx0c2V0dXAoKSB7XG5cdFx0Z3J1bnQuaW5pdENvbmZpZyh7fSk7XG5cblx0XHRsb2FkVGFza3Moe1xuXHRcdFx0Jy4uL2xpYi9sb2FkLWRvam8tbG9hZGVyJzoge1xuXHRcdFx0XHRkZWZhdWx0OiAoKSA9PiB7XG5cdFx0XHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XHRcdHJlcXVpcmU6IHJlcXVpcmVTdHViXG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pO1xuXHR9LFxuXHR0ZWFyZG93bigpIHtcblx0XHR1bmxvYWRUYXNrcygpO1xuXHR9LFxuXHRiZWZvcmVFYWNoKCkge1xuXHRcdHJlcXVpcmVTdHViLnJlc2V0KCk7XG5cdH0sXG5cdHJ1bnNEZWZhdWx0KHRoaXM6IFRlc3QpIHtcblx0XHR2YXIgZGZkID0gdGhpcy5hc3luYygxMDAwKTtcblxuXHRcdHJ1bkdydW50VGFzaygncnVuJywgKCkgPT4ge1xuXHRcdH0pO1xuXG5cdFx0c2V0VGltZW91dChkZmQuY2FsbGJhY2soKCkgPT4ge1xuXHRcdFx0YXNzZXJ0LmlzVHJ1ZShyZXF1aXJlU3R1Yi5jYWxsZWRPbmNlKTtcblx0XHRcdGFzc2VydC5kZWVwRXF1YWwocmVxdWlyZVN0dWIuZmlyc3RDYWxsLmFyZ3NbIDAgXSwgWyAnc3JjL21haW4nIF0pO1xuXHRcdH0pLCAxMDApO1xuXHR9LFxuXHRydW5zQXJndW1lbnQodGhpczogVGVzdCkge1xuXHRcdHZhciBkZmQgPSB0aGlzLmFzeW5jKDEwMDApO1xuXG5cdFx0Z3J1bnQub3B0aW9uKCdtYWluJywgJ215LW1haW4nKTtcblxuXHRcdHJ1bkdydW50VGFzaygncnVuJywgKCkgPT4ge1xuXHRcdH0pO1xuXG5cdFx0c2V0VGltZW91dChkZmQuY2FsbGJhY2soKCkgPT4ge1xuXHRcdFx0YXNzZXJ0LmlzVHJ1ZShyZXF1aXJlU3R1Yi5jYWxsZWRPbmNlKTtcblx0XHRcdGFzc2VydC5kZWVwRXF1YWwocmVxdWlyZVN0dWIuZmlyc3RDYWxsLmFyZ3NbIDAgXSwgWyAnbXktbWFpbicgXSk7XG5cdFx0fSksIDEwMCk7XG5cdH0sXG59KTtcbiJdfQ==