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
    var process;
    var execStub = sinon_1.stub();
    var spawnStub = sinon_1.stub();
    function assertDefaultOptions(options) {
        assert.strictEqual(options.encoding, 'utf8');
        assert.strictEqual(options.stdio, 'inherit');
    }
    registerSuite({
        name: 'tasks/util/process',
        setup: function () {
            var mocks = {
                'child_process': {
                    'execSync': execStub,
                    'spawnSync': spawnStub
                }
            };
            process = util_1.loadModule('grunt-dojo2/tasks/util/process', mocks, false);
        },
        beforeEach: function () {
            execStub.reset();
            spawnStub.reset();
            spawnStub.returns({ stdout: '' });
        },
        teardown: function () {
            util_1.unloadTasks();
        },
        exec: function () {
            var command = 'ls -al';
            process.exec(command);
            assert.strictEqual(execStub.lastCall.args[0], command);
            var options = execStub.lastCall.args[1];
            assertDefaultOptions(options);
        },
        spawn: function () {
            var command = 'ls';
            var args = ['-al'];
            process.spawn(command, args);
            assert.isTrue(spawnStub.calledOnce);
            assert.strictEqual(spawnStub.lastCall.args[0], command);
            assert.deepEqual(spawnStub.lastCall.args[1], args);
            var options = spawnStub.lastCall.args[2];
            assertDefaultOptions(options);
        },
        options: {
            'default': function () {
                var command = 'cmd';
                process.exec(command);
                assert.strictEqual(execStub.lastCall.args[0], command);
                var options = execStub.lastCall.args[1];
                assertDefaultOptions(options);
            },
            'set encoding': function () {
                var command = 'cmd';
                process.exec(command, {
                    encoding: 'pizza'
                });
                assert.strictEqual(execStub.lastCall.args[0], command);
                var options = execStub.lastCall.args[1];
                assert.strictEqual(options.encoding, 'pizza');
                assert.strictEqual(options.stdio, 'inherit');
            },
            'silent true': function () {
                var command = 'cmd';
                process.exec(command, {
                    silent: true
                });
                assert.strictEqual(execStub.lastCall.args[0], command);
                var options = execStub.lastCall.args[1];
                assert.strictEqual(options.encoding, 'utf8');
                assert.strictEqual(options.stdio, 'pipe');
            },
            'stdio set': function () {
                var command = 'cmd';
                process.exec(command, {
                    stdio: 'pizza'
                });
                assert.strictEqual(execStub.lastCall.args[0], command);
                var options = execStub.lastCall.args[1];
                assert.strictEqual(options.encoding, 'utf8');
                assert.strictEqual(options.stdio, 'pizza');
            }
        }
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvY2Vzcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInByb2Nlc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7SUFBQSw2Q0FBK0M7SUFDL0MsMkNBQTZDO0lBQzdDLCtCQUE2QjtJQUM3QixvREFBc0U7SUFFdEUsSUFBSSxPQUFZLENBQUM7SUFDakIsSUFBTSxRQUFRLEdBQUcsWUFBSSxFQUFFLENBQUM7SUFDeEIsSUFBTSxTQUFTLEdBQUcsWUFBSSxFQUFFLENBQUM7SUFFekIsOEJBQThCLE9BQVk7UUFDekMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQzdDLE1BQU0sQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxTQUFTLENBQUMsQ0FBQztJQUM5QyxDQUFDO0lBQ0QsYUFBYSxDQUFDO1FBQ2IsSUFBSSxFQUFFLG9CQUFvQjtRQUUxQixLQUFLO1lBQ0osSUFBTSxLQUFLLEdBQUc7Z0JBQ2IsZUFBZSxFQUFFO29CQUNoQixVQUFVLEVBQUUsUUFBUTtvQkFDcEIsV0FBVyxFQUFFLFNBQVM7aUJBQ3RCO2FBQ0QsQ0FBQztZQUVGLE9BQU8sR0FBRyxpQkFBVSxDQUFDLGdDQUFnQyxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztRQUN0RSxDQUFDO1FBRUQsVUFBVTtZQUNULFFBQVEsQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUNqQixTQUFTLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDbEIsU0FBUyxDQUFDLE9BQU8sQ0FBQyxFQUFFLE1BQU0sRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQ25DLENBQUM7UUFFRCxRQUFRO1lBQ1Asa0JBQVcsRUFBRSxDQUFDO1FBQ2YsQ0FBQztRQUVELElBQUk7WUFDSCxJQUFNLE9BQU8sR0FBRyxRQUFRLENBQUM7WUFDekIsT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUN0QixNQUFNLENB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QixPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRTtvQkFDckIsS0FBSyxFQUFFLE9BQU87aUJBQ2QsQ0FBQyxDQUFDO2dCQUNILE1BQU0sQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUM7Z0JBQ3ZELElBQU0sT0FBTyxHQUFHLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUMxQyxNQUFNLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUM7Z0JBQzdDLE1BQU0sQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQztZQUM1QyxDQUFDO1NBQ0Q7S0FDRCxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyByZWdpc3RlclN1aXRlIGZyb20gJ2ludGVybiFvYmplY3QnO1xuaW1wb3J0ICogYXMgYXNzZXJ0IGZyb20gJ2ludGVybi9jaGFpIWFzc2VydCc7XG5pbXBvcnQgeyBzdHViIH0gZnJvbSAnc2lub24nO1xuaW1wb3J0IHsgdW5sb2FkVGFza3MsIGxvYWRNb2R1bGUgfSBmcm9tICdncnVudC1kb2pvMi90ZXN0cy91bml0L3V0aWwnO1xuXG5sZXQgcHJvY2VzczogYW55O1xuY29uc3QgZXhlY1N0dWIgPSBzdHViKCk7XG5jb25zdCBzcGF3blN0dWIgPSBzdHViKCk7XG5cbmZ1bmN0aW9uIGFzc2VydERlZmF1bHRPcHRpb25zKG9wdGlvbnM6IGFueSkge1xuXHRhc3NlcnQuc3RyaWN0RXF1YWwob3B0aW9ucy5lbmNvZGluZywgJ3V0ZjgnKTtcblx0YXNzZXJ0LnN0cmljdEVxdWFsKG9wdGlvbnMuc3RkaW8sICdpbmhlcml0Jyk7XG59XG5yZWdpc3RlclN1aXRlKHtcblx0bmFtZTogJ3Rhc2tzL3V0aWwvcHJvY2VzcycsXG5cblx0c2V0dXAoKSB7XG5cdFx0Y29uc3QgbW9ja3MgPSB7XG5cdFx0XHQnY2hpbGRfcHJvY2Vzcyc6IHtcblx0XHRcdFx0J2V4ZWNTeW5jJzogZXhlY1N0dWIsXG5cdFx0XHRcdCdzcGF3blN5bmMnOiBzcGF3blN0dWJcblx0XHRcdH1cblx0XHR9O1xuXG5cdFx0cHJvY2VzcyA9IGxvYWRNb2R1bGUoJ2dydW50LWRvam8yL3Rhc2tzL3V0aWwvcHJvY2VzcycsIG1vY2tzLCBmYWxzZSk7XG5cdH0sXG5cblx0YmVmb3JlRWFjaCgpIHtcblx0XHRleGVjU3R1Yi5yZXNldCgpO1xuXHRcdHNwYXduU3R1Yi5yZXNldCgpO1xuXHRcdHNwYXduU3R1Yi5yZXR1cm5zKHsgc3Rkb3V0OiAnJyB9KTtcblx0fSxcblxuXHR0ZWFyZG93bigpIHtcblx0XHR1bmxvYWRUYXNrcygpO1xuXHR9LFxuXG5cdGV4ZWMoKSB7XG5cdFx0Y29uc3QgY29tbWFuZCA9ICdscyAtYWwnO1xuXHRcdHByb2Nlc3MuZXhlYyhjb21tYW5kKTtcblx0XHRhc3NlcnQuc3RyaWN0RXF1YWwoZXhlY1N0dWIubGFzdENhbGwuYXJnc1swXSwgY29tbWFuZCk7XG5cdFx0Y29uc3Qgb3B0aW9ucyA9IGV4ZWNTdHViLmxhc3RDYWxsLmFyZ3NbMV07XG5cdFx0YXNzZXJ0RGVmYXVsdE9wdGlvbnMob3B0aW9ucyk7XG5cdH0sXG5cblx0c3Bhd24oKSB7XG5cdFx0Y29uc3QgY29tbWFuZCA9ICdscyc7XG5cdFx0Y29uc3QgYXJncyA9IFsgJy1hbCcgXTtcblx0XHRwcm9jZXNzLnNwYXduKGNvbW1hbmQsIGFyZ3MpO1xuXHRcdGFzc2VydC5pc1RydWUoc3Bhd25TdHViLmNhbGxlZE9uY2UpO1xuXHRcdGFzc2VydC5zdHJpY3RFcXVhbChzcGF3blN0dWIubGFzdENhbGwuYXJnc1swXSwgY29tbWFuZCk7XG5cdFx0YXNzZXJ0LmRlZXBFcXVhbChzcGF3blN0dWIubGFzdENhbGwuYXJnc1sxXSwgYXJncyk7XG5cdFx0Y29uc3Qgb3B0aW9ucyA9IHNwYXduU3R1Yi5sYXN0Q2FsbC5hcmdzWzJdO1xuXHRcdGFzc2VydERlZmF1bHRPcHRpb25zKG9wdGlvbnMpO1xuXHR9LFxuXG5cdG9wdGlvbnM6IHtcblx0XHQnZGVmYXVsdCcoKSB7XG5cdFx0XHRjb25zdCBjb21tYW5kID0gJ2NtZCc7XG5cdFx0XHRwcm9jZXNzLmV4ZWMoY29tbWFuZCk7XG5cdFx0XHRhc3NlcnQuc3RyaWN0RXF1YWwoZXhlY1N0dWIubGFzdENhbGwuYXJnc1swXSwgY29tbWFuZCk7XG5cdFx0XHRjb25zdCBvcHRpb25zID0gZXhlY1N0dWIubGFzdENhbGwuYXJnc1sxXTtcblx0XHRcdGFzc2VydERlZmF1bHRPcHRpb25zKG9wdGlvbnMpO1xuXHRcdH0sXG5cblx0XHQnc2V0IGVuY29kaW5nJygpIHtcblx0XHRcdGNvbnN0IGNvbW1hbmQgPSAnY21kJztcblx0XHRcdHByb2Nlc3MuZXhlYyhjb21tYW5kLCB7XG5cdFx0XHRcdGVuY29kaW5nOiAncGl6emEnXG5cdFx0XHR9KTtcblx0XHRcdGFzc2VydC5zdHJpY3RFcXVhbChleGVjU3R1Yi5sYXN0Q2FsbC5hcmdzWzBdLCBjb21tYW5kKTtcblx0XHRcdGNvbnN0IG9wdGlvbnMgPSBleGVjU3R1Yi5sYXN0Q2FsbC5hcmdzWzFdO1xuXHRcdFx0YXNzZXJ0LnN0cmljdEVxdWFsKG9wdGlvbnMuZW5jb2RpbmcsICdwaXp6YScpO1xuXHRcdFx0YXNzZXJ0LnN0cmljdEVxdWFsKG9wdGlvbnMuc3RkaW8sICdpbmhlcml0Jyk7XG5cdFx0fSxcblxuXHRcdCdzaWxlbnQgdHJ1ZScoKSB7XG5cdFx0XHRjb25zdCBjb21tYW5kID0gJ2NtZCc7XG5cdFx0XHRwcm9jZXNzLmV4ZWMoY29tbWFuZCwge1xuXHRcdFx0XHRzaWxlbnQ6IHRydWVcblx0XHRcdH0pO1xuXHRcdFx0YXNzZXJ0LnN0cmljdEVxdWFsKGV4ZWNTdHViLmxhc3RDYWxsLmFyZ3NbMF0sIGNvbW1hbmQpO1xuXHRcdFx0Y29uc3Qgb3B0aW9ucyA9IGV4ZWNTdHViLmxhc3RDYWxsLmFyZ3NbMV07XG5cdFx0XHRhc3NlcnQuc3RyaWN0RXF1YWwob3B0aW9ucy5lbmNvZGluZywgJ3V0ZjgnKTtcblx0XHRcdGFzc2VydC5zdHJpY3RFcXVhbChvcHRpb25zLnN0ZGlvLCAncGlwZScpO1xuXHRcdH0sXG5cblx0XHQnc3RkaW8gc2V0JygpIHtcblx0XHRcdGNvbnN0IGNvbW1hbmQgPSAnY21kJztcblx0XHRcdHByb2Nlc3MuZXhlYyhjb21tYW5kLCB7XG5cdFx0XHRcdHN0ZGlvOiAncGl6emEnXG5cdFx0XHR9KTtcblx0XHRcdGFzc2VydC5zdHJpY3RFcXVhbChleGVjU3R1Yi5sYXN0Q2FsbC5hcmdzWzBdLCBjb21tYW5kKTtcblx0XHRcdGNvbnN0IG9wdGlvbnMgPSBleGVjU3R1Yi5sYXN0Q2FsbC5hcmdzWzFdO1xuXHRcdFx0YXNzZXJ0LnN0cmljdEVxdWFsKG9wdGlvbnMuZW5jb2RpbmcsICd1dGY4Jyk7XG5cdFx0XHRhc3NlcnQuc3RyaWN0RXF1YWwob3B0aW9ucy5zdGRpbywgJ3BpenphJyk7XG5cdFx0fVxuXHR9XG59KTtcbiJdfQ==