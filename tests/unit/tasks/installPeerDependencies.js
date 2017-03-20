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
    var mockLogger;
    var mockShell;
    registerSuite({
        name: 'tasks/installPeerDependencies',
        afterEach: function () {
            mockLogger.restore();
            util_1.unloadTasks();
        },
        'npm': {
            beforeEach: function () {
                grunt.initConfig({});
                mockLogger = sinon_1.stub(grunt.log, 'error');
                mockShell = sinon_1.stub();
                mockShell
                    .withArgs('npm install my-dep@"1.0"').returns(Promise.resolve({}))
                    .withArgs('npm install error-dep@"1.0"').throws();
                util_1.loadTasks({
                    child_process: {
                        execSync: mockShell
                    }
                }, {
                    peerDependencies: {
                        'my-dep': '1.0',
                        'error-dep': '1.0'
                    }
                });
            },
            runsCommands: function () {
                util_1.runGruntTask('peerDepInstall');
                assert.isTrue(mockShell.calledTwice);
                assert.isTrue(mockShell.calledWith('npm install my-dep@"1.0"'));
                assert.isTrue(mockShell.calledWith('npm install error-dep@"1.0"'));
                assert.isTrue(mockLogger.called);
                assert.isTrue(mockLogger.calledWith('failed.'));
            }
        }
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5zdGFsbFBlZXJEZXBlbmRlbmNpZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnN0YWxsUGVlckRlcGVuZGVuY2llcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztJQUFBLDZDQUErQztJQUMvQywyQ0FBNkM7SUFDN0MsNkJBQStCO0lBQy9CLCtCQUF3QztJQUN4QyxnQ0FBK0Q7SUFFL0QsSUFBSSxVQUFxQixDQUFDO0lBQzFCLElBQUksU0FBb0IsQ0FBQztJQUV6QixhQUFhLENBQUM7UUFDYixJQUFJLEVBQUUsK0JBQStCO1FBQ3JDLFNBQVM7WUFDUixVQUFVLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDckIsa0JBQVcsRUFBRSxDQUFDO1FBQ2YsQ0FBQztRQUNELEtBQUssRUFBRTtZQUNOLFVBQVU7Z0JBQ1QsS0FBSyxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFDckIsVUFBVSxHQUFHLFlBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFDO2dCQUN0QyxTQUFTLEdBQUcsWUFBSSxFQUFFLENBQUM7Z0JBRW5CLFNBQVM7cUJBQ1IsUUFBUSxDQUFDLDBCQUEwQixDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7cUJBQ2pFLFFBQVEsQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDO2dCQUVsRCxnQkFBUyxDQUFDO29CQUNULGFBQWEsRUFBRTt3QkFDZCxRQUFRLEVBQUUsU0FBUztxQkFDbkI7aUJBQ0QsRUFBRTtvQkFDRixnQkFBZ0IsRUFBRTt3QkFDakIsUUFBUSxFQUFFLEtBQUs7d0JBQ2YsV0FBVyxFQUFFLEtBQUs7cUJBQ2xCO2lCQUNELENBQUMsQ0FBQztZQUNKLENBQUM7WUFDRCxZQUFZO2dCQUNYLG1CQUFZLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztnQkFFL0IsTUFBTSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLENBQUM7Z0JBQ3JDLE1BQU0sQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQywwQkFBMEIsQ0FBQyxDQUFDLENBQUM7Z0JBQ2hFLE1BQU0sQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDLENBQUM7Z0JBQ25FLE1BQU0sQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUNqQyxNQUFNLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztZQUNqRCxDQUFDO1NBQ0Q7S0FDRCxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyByZWdpc3RlclN1aXRlIGZyb20gJ2ludGVybiFvYmplY3QnO1xuaW1wb3J0ICogYXMgYXNzZXJ0IGZyb20gJ2ludGVybi9jaGFpIWFzc2VydCc7XG5pbXBvcnQgKiBhcyBncnVudCBmcm9tICdncnVudCc7XG5pbXBvcnQgeyBTaW5vblN0dWIsIHN0dWIgfSBmcm9tICdzaW5vbic7XG5pbXBvcnQgeyBsb2FkVGFza3MsIHVubG9hZFRhc2tzLCBydW5HcnVudFRhc2sgfSBmcm9tICcuLi91dGlsJztcblxubGV0IG1vY2tMb2dnZXI6IFNpbm9uU3R1YjtcbmxldCBtb2NrU2hlbGw6IFNpbm9uU3R1YjtcblxucmVnaXN0ZXJTdWl0ZSh7XG5cdG5hbWU6ICd0YXNrcy9pbnN0YWxsUGVlckRlcGVuZGVuY2llcycsXG5cdGFmdGVyRWFjaCgpIHtcblx0XHRtb2NrTG9nZ2VyLnJlc3RvcmUoKTtcblx0XHR1bmxvYWRUYXNrcygpO1xuXHR9LFxuXHQnbnBtJzoge1xuXHRcdGJlZm9yZUVhY2goKSB7XG5cdFx0XHRncnVudC5pbml0Q29uZmlnKHt9KTtcblx0XHRcdG1vY2tMb2dnZXIgPSBzdHViKGdydW50LmxvZywgJ2Vycm9yJyk7XG5cdFx0XHRtb2NrU2hlbGwgPSBzdHViKCk7XG5cblx0XHRcdG1vY2tTaGVsbFxuXHRcdFx0LndpdGhBcmdzKCducG0gaW5zdGFsbCBteS1kZXBAXCIxLjBcIicpLnJldHVybnMoUHJvbWlzZS5yZXNvbHZlKHt9KSlcblx0XHRcdC53aXRoQXJncygnbnBtIGluc3RhbGwgZXJyb3ItZGVwQFwiMS4wXCInKS50aHJvd3MoKTtcblxuXHRcdFx0bG9hZFRhc2tzKHtcblx0XHRcdFx0Y2hpbGRfcHJvY2Vzczoge1xuXHRcdFx0XHRcdGV4ZWNTeW5jOiBtb2NrU2hlbGxcblx0XHRcdFx0fVxuXHRcdFx0fSwge1xuXHRcdFx0XHRwZWVyRGVwZW5kZW5jaWVzOiB7XG5cdFx0XHRcdFx0J215LWRlcCc6ICcxLjAnLFxuXHRcdFx0XHRcdCdlcnJvci1kZXAnOiAnMS4wJ1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9LFxuXHRcdHJ1bnNDb21tYW5kcygpIHtcblx0XHRcdHJ1bkdydW50VGFzaygncGVlckRlcEluc3RhbGwnKTtcblxuXHRcdFx0YXNzZXJ0LmlzVHJ1ZShtb2NrU2hlbGwuY2FsbGVkVHdpY2UpO1xuXHRcdFx0YXNzZXJ0LmlzVHJ1ZShtb2NrU2hlbGwuY2FsbGVkV2l0aCgnbnBtIGluc3RhbGwgbXktZGVwQFwiMS4wXCInKSk7XG5cdFx0XHRhc3NlcnQuaXNUcnVlKG1vY2tTaGVsbC5jYWxsZWRXaXRoKCducG0gaW5zdGFsbCBlcnJvci1kZXBAXCIxLjBcIicpKTtcblx0XHRcdGFzc2VydC5pc1RydWUobW9ja0xvZ2dlci5jYWxsZWQpO1xuXHRcdFx0YXNzZXJ0LmlzVHJ1ZShtb2NrTG9nZ2VyLmNhbGxlZFdpdGgoJ2ZhaWxlZC4nKSk7XG5cdFx0fVxuXHR9XG59KTtcbiJdfQ==