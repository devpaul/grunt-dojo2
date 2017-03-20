(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "intern!object", "intern/chai!assert", "grunt", "../util", "sinon"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var registerSuite = require("intern!object");
    var assert = require("intern/chai!assert");
    var grunt = require("grunt");
    var util_1 = require("../util");
    var sinon_1 = require("sinon");
    var coverageFileName = 'coverage-final.lcov';
    var sendCodeCov = sinon_1.stub().callsArgWith(1, 'error');
    var read;
    registerSuite({
        name: 'tasks/uploadCoverage',
        setup: function () {
            grunt.initConfig({});
            util_1.loadTasks({
                'codecov.io/lib/sendToCodeCov.io': sendCodeCov
            });
            read = sinon_1.stub(grunt.file, 'read').withArgs(coverageFileName).returns(JSON.stringify({
                hello: 'world'
            }));
        },
        teardown: function () {
            util_1.unloadTasks();
        },
        propagatesReturnValue: function () {
            var dfd = this.async();
            util_1.runGruntTask('uploadCoverage', dfd.callback(function () {
                assert.isTrue(sendCodeCov.calledOnce);
                assert.deepEqual(JSON.parse(sendCodeCov.firstCall.args[0]), { hello: 'world' });
            }));
        }
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBsb2FkQ292ZXJhZ2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ1cGxvYWRDb3ZlcmFnZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztJQUFBLDZDQUErQztJQUMvQywyQ0FBNkM7SUFDN0MsNkJBQStCO0lBQy9CLGdDQUErRDtJQUMvRCwrQkFBd0M7SUFHeEMsSUFBTSxnQkFBZ0IsR0FBRyxxQkFBcUIsQ0FBQztJQUUvQyxJQUFJLFdBQVcsR0FBYyxZQUFJLEVBQUUsQ0FBQyxZQUFZLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQzdELElBQUksSUFBZSxDQUFDO0lBRXBCLGFBQWEsQ0FBQztRQUNiLElBQUksRUFBRSxzQkFBc0I7UUFDNUIsS0FBSztZQUNKLEtBQUssQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUM7WUFFckIsZ0JBQVMsQ0FBQztnQkFDVCxpQ0FBaUMsRUFBRSxXQUFXO2FBQzlDLENBQUMsQ0FBQztZQUVILElBQUksR0FBRyxZQUFJLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQyxRQUFRLENBQ3ZDLGdCQUFnQixDQUNoQixDQUFDLE9BQU8sQ0FDUixJQUFJLENBQUMsU0FBUyxDQUFDO2dCQUNkLEtBQUssRUFBRSxPQUFPO2FBQ2QsQ0FBQyxDQUNGLENBQUM7UUFDSCxDQUFDO1FBQ0QsUUFBUTtZQUNQLGtCQUFXLEVBQUUsQ0FBQztRQUNmLENBQUM7UUFDRCxxQkFBcUI7WUFDcEIsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1lBRXZCLG1CQUFZLENBQUMsZ0JBQWdCLEVBQUUsR0FBRyxDQUFDLFFBQVEsQ0FBQztnQkFDM0MsTUFBTSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLENBQUM7Z0JBQ3RDLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBRSxDQUFDLENBQUUsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUM7WUFDbkYsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUM7S0FDRCxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyByZWdpc3RlclN1aXRlIGZyb20gJ2ludGVybiFvYmplY3QnO1xuaW1wb3J0ICogYXMgYXNzZXJ0IGZyb20gJ2ludGVybi9jaGFpIWFzc2VydCc7XG5pbXBvcnQgKiBhcyBncnVudCBmcm9tICdncnVudCc7XG5pbXBvcnQgeyBsb2FkVGFza3MsIHVubG9hZFRhc2tzLCBydW5HcnVudFRhc2sgfSBmcm9tICcuLi91dGlsJztcbmltcG9ydCB7IFNpbm9uU3R1Yiwgc3R1YiB9IGZyb20gJ3Npbm9uJztcbmltcG9ydCBUZXN0ID0gcmVxdWlyZShcImludGVybi9saWIvVGVzdFwiKTtcblxuY29uc3QgY292ZXJhZ2VGaWxlTmFtZSA9ICdjb3ZlcmFnZS1maW5hbC5sY292JztcblxubGV0IHNlbmRDb2RlQ292OiBTaW5vblN0dWIgPSBzdHViKCkuY2FsbHNBcmdXaXRoKDEsICdlcnJvcicpO1xubGV0IHJlYWQ6IFNpbm9uU3R1YjtcblxucmVnaXN0ZXJTdWl0ZSh7XG5cdG5hbWU6ICd0YXNrcy91cGxvYWRDb3ZlcmFnZScsXG5cdHNldHVwKCkge1xuXHRcdGdydW50LmluaXRDb25maWcoe30pO1xuXG5cdFx0bG9hZFRhc2tzKHtcblx0XHRcdCdjb2RlY292LmlvL2xpYi9zZW5kVG9Db2RlQ292LmlvJzogc2VuZENvZGVDb3Zcblx0XHR9KTtcblxuXHRcdHJlYWQgPSBzdHViKGdydW50LmZpbGUsICdyZWFkJykud2l0aEFyZ3MoXG5cdFx0XHRjb3ZlcmFnZUZpbGVOYW1lXG5cdFx0KS5yZXR1cm5zKFxuXHRcdFx0SlNPTi5zdHJpbmdpZnkoe1xuXHRcdFx0XHRoZWxsbzogJ3dvcmxkJ1xuXHRcdFx0fSlcblx0XHQpO1xuXHR9LFxuXHR0ZWFyZG93bigpIHtcblx0XHR1bmxvYWRUYXNrcygpO1xuXHR9LFxuXHRwcm9wYWdhdGVzUmV0dXJuVmFsdWUodGhpczogVGVzdCkge1xuXHRcdHZhciBkZmQgPSB0aGlzLmFzeW5jKCk7XG5cblx0XHRydW5HcnVudFRhc2soJ3VwbG9hZENvdmVyYWdlJywgZGZkLmNhbGxiYWNrKCgpID0+IHtcblx0XHRcdGFzc2VydC5pc1RydWUoc2VuZENvZGVDb3YuY2FsbGVkT25jZSk7XG5cdFx0XHRhc3NlcnQuZGVlcEVxdWFsKEpTT04ucGFyc2Uoc2VuZENvZGVDb3YuZmlyc3RDYWxsLmFyZ3NbIDAgXSksIHsgaGVsbG86ICd3b3JsZCcgfSk7XG5cdFx0fSkpO1xuXHR9XG59KTtcbiJdfQ==