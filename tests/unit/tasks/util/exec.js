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
    var exec;
    var execStub = sinon_1.stub();
    registerSuite({
        name: 'tasks/util/exec',
        setup: function () {
            var mocks = {
                'child_process': {
                    'execSync': execStub
                }
            };
            exec = util_1.loadModule('grunt-dojo2/tasks/util/exec', mocks);
        },
        teardown: function () {
            util_1.unloadTasks();
        },
        'default': function () {
            var command = 'cmd';
            exec(command);
            assert.strictEqual(execStub.lastCall.args[0], command);
            var options = execStub.lastCall.args[1];
            assert.strictEqual(options.encoding, 'utf8');
            assert.strictEqual(options.stdio, 'inherit');
        },
        'set encoding': function () {
            var command = 'cmd';
            exec(command, {
                encoding: 'pizza'
            });
            assert.strictEqual(execStub.lastCall.args[0], command);
            var options = execStub.lastCall.args[1];
            assert.strictEqual(options.encoding, 'pizza');
            assert.strictEqual(options.stdio, 'inherit');
        },
        'silent true': function () {
            var command = 'cmd';
            exec(command, {
                silent: true
            });
            assert.strictEqual(execStub.lastCall.args[0], command);
            var options = execStub.lastCall.args[1];
            assert.strictEqual(options.encoding, 'utf8');
            assert.strictEqual(options.stdio, 'pipe');
        },
        'stdio set': function () {
            var command = 'cmd';
            exec(command, {
                stdio: 'pizza'
            });
            assert.strictEqual(execStub.lastCall.args[0], command);
            var options = execStub.lastCall.args[1];
            assert.strictEqual(options.encoding, 'utf8');
            assert.strictEqual(options.stdio, 'pizza');
        }
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImV4ZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7SUFBQSw2Q0FBK0M7SUFDL0MsMkNBQTZDO0lBQzdDLCtCQUE2QjtJQUM3QixvREFBc0U7SUFFdEUsSUFBSSxJQUFTLENBQUM7SUFDZCxJQUFNLFFBQVEsR0FBRyxZQUFJLEVBQUUsQ0FBQztJQUV4QixhQUFhLENBQUM7UUFDYixJQUFJLEVBQUUsaUJBQWlCO1FBRXZCLEtBQUs7WUFDSixJQUFNLEtBQUssR0FBRztnQkFDYixlQUFlLEVBQUU7b0JBQ2hCLFVBQVUsRUFBRSxRQUFRO2lCQUNwQjthQUNELENBQUM7WUFFRixJQUFJLEdBQUcsaUJBQVUsQ0FBQyw2QkFBNkIsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUN6RCxDQUFDO1FBRUQsUUFBUTtZQUNQLGtCQUFXLEVBQUUsQ0FBQztRQUNmLENBQUM7UUFFRCxTQUFTO1lBQ1IsSUFBTSxPQUFPLEdBQUcsS0FBSyxDQUFDO1lBQ3RCLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUNkLE1BQU0sQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDdkQsSUFBTSxPQUFPLEdBQUcsUUFBUSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDMUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBQzdDLE1BQU0sQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxTQUFTLENBQUMsQ0FBQztRQUM5QyxDQUFDO1FBRUQsY0FBYztZQUNiLElBQU0sT0FBTyxHQUFHLEtBQUssQ0FBQztZQUN0QixJQUFJLENBQUMsT0FBTyxFQUFFO2dCQUNiLFFBQVEsRUFBRSxPQUFPO2FBQ2pCLENBQUMsQ0FBQztZQUNILE1BQU0sQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDdkQsSUFBTSxPQUFPLEdBQUcsUUFBUSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDMUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQzlDLE1BQU0sQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxTQUFTLENBQUMsQ0FBQztRQUM5QyxDQUFDO1FBRUQsYUFBYTtZQUNaLElBQU0sT0FBTyxHQUFHLEtBQUssQ0FBQztZQUN0QixJQUFJLENBQUMsT0FBTyxFQUFFO2dCQUNiLE1BQU0sRUFBRSxJQUFJO2FBQ1osQ0FBQyxDQUFDO1lBQ0gsTUFBTSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztZQUN2RCxJQUFNLE9BQU8sR0FBRyxRQUFRLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMxQyxNQUFNLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFDN0MsTUFBTSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQzNDLENBQUM7UUFFRCxXQUFXO1lBQ1YsSUFBTSxPQUFPLEdBQUcsS0FBSyxDQUFDO1lBQ3RCLElBQUksQ0FBQyxPQUFPLEVBQUU7Z0JBQ2IsS0FBSyxFQUFFLE9BQU87YUFDZCxDQUFDLENBQUM7WUFDSCxNQUFNLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQ3ZELElBQU0sT0FBTyxHQUFHLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQztZQUM3QyxNQUFNLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDNUMsQ0FBQztLQUNELENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIHJlZ2lzdGVyU3VpdGUgZnJvbSAnaW50ZXJuIW9iamVjdCc7XG5pbXBvcnQgKiBhcyBhc3NlcnQgZnJvbSAnaW50ZXJuL2NoYWkhYXNzZXJ0JztcbmltcG9ydCB7IHN0dWIgfSBmcm9tICdzaW5vbic7XG5pbXBvcnQgeyB1bmxvYWRUYXNrcywgbG9hZE1vZHVsZSB9IGZyb20gJ2dydW50LWRvam8yL3Rlc3RzL3VuaXQvdXRpbCc7XG5cbmxldCBleGVjOiBhbnk7XG5jb25zdCBleGVjU3R1YiA9IHN0dWIoKTtcblxucmVnaXN0ZXJTdWl0ZSh7XG5cdG5hbWU6ICd0YXNrcy91dGlsL2V4ZWMnLFxuXG5cdHNldHVwKCkge1xuXHRcdGNvbnN0IG1vY2tzID0ge1xuXHRcdFx0J2NoaWxkX3Byb2Nlc3MnOiB7XG5cdFx0XHRcdCdleGVjU3luYyc6IGV4ZWNTdHViXG5cdFx0XHR9XG5cdFx0fTtcblxuXHRcdGV4ZWMgPSBsb2FkTW9kdWxlKCdncnVudC1kb2pvMi90YXNrcy91dGlsL2V4ZWMnLCBtb2Nrcyk7XG5cdH0sXG5cblx0dGVhcmRvd24oKSB7XG5cdFx0dW5sb2FkVGFza3MoKTtcblx0fSxcblxuXHQnZGVmYXVsdCcoKSB7XG5cdFx0Y29uc3QgY29tbWFuZCA9ICdjbWQnO1xuXHRcdGV4ZWMoY29tbWFuZCk7XG5cdFx0YXNzZXJ0LnN0cmljdEVxdWFsKGV4ZWNTdHViLmxhc3RDYWxsLmFyZ3NbMF0sIGNvbW1hbmQpO1xuXHRcdGNvbnN0IG9wdGlvbnMgPSBleGVjU3R1Yi5sYXN0Q2FsbC5hcmdzWzFdO1xuXHRcdGFzc2VydC5zdHJpY3RFcXVhbChvcHRpb25zLmVuY29kaW5nLCAndXRmOCcpO1xuXHRcdGFzc2VydC5zdHJpY3RFcXVhbChvcHRpb25zLnN0ZGlvLCAnaW5oZXJpdCcpO1xuXHR9LFxuXG5cdCdzZXQgZW5jb2RpbmcnKCkge1xuXHRcdGNvbnN0IGNvbW1hbmQgPSAnY21kJztcblx0XHRleGVjKGNvbW1hbmQsIHtcblx0XHRcdGVuY29kaW5nOiAncGl6emEnXG5cdFx0fSk7XG5cdFx0YXNzZXJ0LnN0cmljdEVxdWFsKGV4ZWNTdHViLmxhc3RDYWxsLmFyZ3NbMF0sIGNvbW1hbmQpO1xuXHRcdGNvbnN0IG9wdGlvbnMgPSBleGVjU3R1Yi5sYXN0Q2FsbC5hcmdzWzFdO1xuXHRcdGFzc2VydC5zdHJpY3RFcXVhbChvcHRpb25zLmVuY29kaW5nLCAncGl6emEnKTtcblx0XHRhc3NlcnQuc3RyaWN0RXF1YWwob3B0aW9ucy5zdGRpbywgJ2luaGVyaXQnKTtcblx0fSxcblxuXHQnc2lsZW50IHRydWUnKCkge1xuXHRcdGNvbnN0IGNvbW1hbmQgPSAnY21kJztcblx0XHRleGVjKGNvbW1hbmQsIHtcblx0XHRcdHNpbGVudDogdHJ1ZVxuXHRcdH0pO1xuXHRcdGFzc2VydC5zdHJpY3RFcXVhbChleGVjU3R1Yi5sYXN0Q2FsbC5hcmdzWzBdLCBjb21tYW5kKTtcblx0XHRjb25zdCBvcHRpb25zID0gZXhlY1N0dWIubGFzdENhbGwuYXJnc1sxXTtcblx0XHRhc3NlcnQuc3RyaWN0RXF1YWwob3B0aW9ucy5lbmNvZGluZywgJ3V0ZjgnKTtcblx0XHRhc3NlcnQuc3RyaWN0RXF1YWwob3B0aW9ucy5zdGRpbywgJ3BpcGUnKTtcblx0fSxcblxuXHQnc3RkaW8gc2V0JygpIHtcblx0XHRjb25zdCBjb21tYW5kID0gJ2NtZCc7XG5cdFx0ZXhlYyhjb21tYW5kLCB7XG5cdFx0XHRzdGRpbzogJ3BpenphJ1xuXHRcdH0pO1xuXHRcdGFzc2VydC5zdHJpY3RFcXVhbChleGVjU3R1Yi5sYXN0Q2FsbC5hcmdzWzBdLCBjb21tYW5kKTtcblx0XHRjb25zdCBvcHRpb25zID0gZXhlY1N0dWIubGFzdENhbGwuYXJnc1sxXTtcblx0XHRhc3NlcnQuc3RyaWN0RXF1YWwob3B0aW9ucy5lbmNvZGluZywgJ3V0ZjgnKTtcblx0XHRhc3NlcnQuc3RyaWN0RXF1YWwob3B0aW9ucy5zdGRpbywgJ3BpenphJyk7XG5cdH1cbn0pO1xuIl19