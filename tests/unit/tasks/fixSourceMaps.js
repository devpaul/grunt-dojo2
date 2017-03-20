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
    var inputDirectory = util_1.getInputDirectory();
    registerSuite({
        name: 'tasks/fixSourceMaps',
        setup: function () {
            grunt.initConfig({
                distDirectory: inputDirectory
            });
            util_1.loadTasks();
            util_1.prepareInputDirectory();
        },
        teardown: function () {
            util_1.unloadTasks();
            util_1.cleanInputDirectory();
        },
        sourcMaps: function () {
            util_1.createDummyFile('test/sourcemap.js.map', JSON.stringify({
                "version": 3,
                "file": "global.js",
                "sourceRoot": "",
                "sources": ["../../src/global.ts"],
                "names": []
            }));
            util_1.runGruntTask('fixSourceMaps');
            assert.isTrue(util_1.fileExistsInInputDirectory('test/sourcemap.js.map'), 'Source map should still exist');
            var sourceMap = grunt.file.readJSON(inputDirectory + '/test/sourcemap.js.map');
            assert.deepEqual(sourceMap, {
                "version": 3,
                "file": "global.js",
                "sourceRoot": "",
                "sources": ["global.ts"],
                "names": []
            });
        }
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZml4U291cmNlTWFwcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImZpeFNvdXJjZU1hcHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7SUFBQSw2Q0FBK0M7SUFDL0MsMkNBQTZDO0lBQzdDLDZCQUErQjtJQUMvQixnQ0FHaUI7SUFFakIsSUFBTSxjQUFjLEdBQUcsd0JBQWlCLEVBQUUsQ0FBQztJQUUzQyxhQUFhLENBQUM7UUFDYixJQUFJLEVBQUUscUJBQXFCO1FBQzNCLEtBQUs7WUFDSixLQUFLLENBQUMsVUFBVSxDQUFDO2dCQUNoQixhQUFhLEVBQUUsY0FBYzthQUM3QixDQUFDLENBQUM7WUFFSCxnQkFBUyxFQUFFLENBQUM7WUFDWiw0QkFBcUIsRUFBRSxDQUFDO1FBQ3pCLENBQUM7UUFDRCxRQUFRO1lBQ1Asa0JBQVcsRUFBRSxDQUFDO1lBQ2QsMEJBQW1CLEVBQUUsQ0FBQztRQUN2QixDQUFDO1FBRUQsU0FBUztZQUNSLHNCQUFlLENBQUMsdUJBQXVCLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FDdEQ7Z0JBQ0MsU0FBUyxFQUFFLENBQUM7Z0JBQ1osTUFBTSxFQUFFLFdBQVc7Z0JBQ25CLFlBQVksRUFBRSxFQUFFO2dCQUNoQixTQUFTLEVBQUUsQ0FBRSxxQkFBcUIsQ0FBRTtnQkFDcEMsT0FBTyxFQUFFLEVBQUU7YUFDWCxDQUNELENBQUMsQ0FBQztZQUVILG1CQUFZLENBQUMsZUFBZSxDQUFDLENBQUM7WUFFOUIsTUFBTSxDQUFDLE1BQU0sQ0FBQyxpQ0FBMEIsQ0FBQyx1QkFBdUIsQ0FBQyxFQUFFLCtCQUErQixDQUFDLENBQUM7WUFFcEcsSUFBTSxTQUFTLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsY0FBYyxHQUFHLHdCQUF3QixDQUFDLENBQUM7WUFFakYsTUFBTSxDQUFDLFNBQVMsQ0FBQyxTQUFTLEVBQUU7Z0JBQzNCLFNBQVMsRUFBRSxDQUFDO2dCQUNaLE1BQU0sRUFBRSxXQUFXO2dCQUNuQixZQUFZLEVBQUUsRUFBRTtnQkFDaEIsU0FBUyxFQUFFLENBQUUsV0FBVyxDQUFFO2dCQUMxQixPQUFPLEVBQUUsRUFBRTthQUNYLENBQUMsQ0FBQztRQUNKLENBQUM7S0FDRCxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyByZWdpc3RlclN1aXRlIGZyb20gJ2ludGVybiFvYmplY3QnO1xuaW1wb3J0ICogYXMgYXNzZXJ0IGZyb20gJ2ludGVybi9jaGFpIWFzc2VydCc7XG5pbXBvcnQgKiBhcyBncnVudCBmcm9tICdncnVudCc7XG5pbXBvcnQge1xuXHRnZXRJbnB1dERpcmVjdG9yeSwgbG9hZFRhc2tzLCBwcmVwYXJlSW5wdXREaXJlY3RvcnksIHVubG9hZFRhc2tzLCBjbGVhbklucHV0RGlyZWN0b3J5LFxuXHRjcmVhdGVEdW1teUZpbGUsIHJ1bkdydW50VGFzaywgZmlsZUV4aXN0c0luSW5wdXREaXJlY3Rvcnlcbn0gZnJvbSAnLi4vdXRpbCc7XG5cbmNvbnN0IGlucHV0RGlyZWN0b3J5ID0gZ2V0SW5wdXREaXJlY3RvcnkoKTtcblxucmVnaXN0ZXJTdWl0ZSh7XG5cdG5hbWU6ICd0YXNrcy9maXhTb3VyY2VNYXBzJyxcblx0c2V0dXAoKSB7XG5cdFx0Z3J1bnQuaW5pdENvbmZpZyh7XG5cdFx0XHRkaXN0RGlyZWN0b3J5OiBpbnB1dERpcmVjdG9yeVxuXHRcdH0pO1xuXG5cdFx0bG9hZFRhc2tzKCk7XG5cdFx0cHJlcGFyZUlucHV0RGlyZWN0b3J5KCk7XG5cdH0sXG5cdHRlYXJkb3duKCkge1xuXHRcdHVubG9hZFRhc2tzKCk7XG5cdFx0Y2xlYW5JbnB1dERpcmVjdG9yeSgpO1xuXHR9LFxuXG5cdHNvdXJjTWFwcygpIHtcblx0XHRjcmVhdGVEdW1teUZpbGUoJ3Rlc3Qvc291cmNlbWFwLmpzLm1hcCcsIEpTT04uc3RyaW5naWZ5KFxuXHRcdFx0e1xuXHRcdFx0XHRcInZlcnNpb25cIjogMyxcblx0XHRcdFx0XCJmaWxlXCI6IFwiZ2xvYmFsLmpzXCIsXG5cdFx0XHRcdFwic291cmNlUm9vdFwiOiBcIlwiLFxuXHRcdFx0XHRcInNvdXJjZXNcIjogWyBcIi4uLy4uL3NyYy9nbG9iYWwudHNcIiBdLFxuXHRcdFx0XHRcIm5hbWVzXCI6IFtdXG5cdFx0XHR9XG5cdFx0KSk7XG5cblx0XHRydW5HcnVudFRhc2soJ2ZpeFNvdXJjZU1hcHMnKTtcblxuXHRcdGFzc2VydC5pc1RydWUoZmlsZUV4aXN0c0luSW5wdXREaXJlY3RvcnkoJ3Rlc3Qvc291cmNlbWFwLmpzLm1hcCcpLCAnU291cmNlIG1hcCBzaG91bGQgc3RpbGwgZXhpc3QnKTtcblxuXHRcdGNvbnN0IHNvdXJjZU1hcCA9IGdydW50LmZpbGUucmVhZEpTT04oaW5wdXREaXJlY3RvcnkgKyAnL3Rlc3Qvc291cmNlbWFwLmpzLm1hcCcpO1xuXG5cdFx0YXNzZXJ0LmRlZXBFcXVhbChzb3VyY2VNYXAsIHtcblx0XHRcdFwidmVyc2lvblwiOiAzLFxuXHRcdFx0XCJmaWxlXCI6IFwiZ2xvYmFsLmpzXCIsXG5cdFx0XHRcInNvdXJjZVJvb3RcIjogXCJcIixcblx0XHRcdFwic291cmNlc1wiOiBbIFwiZ2xvYmFsLnRzXCIgXSxcblx0XHRcdFwibmFtZXNcIjogW11cblx0XHR9KTtcblx0fVxufSk7XG4iXX0=