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
    var outputPath = util_1.getOutputDirectory();
    registerSuite({
        name: 'tasks/rename',
        setup: function () {
            grunt.initConfig({
                rename: {
                    textFiles: {
                        expand: true,
                        cwd: inputDirectory,
                        src: ['**/*.txt'],
                        dest: outputPath
                    }
                }
            });
            util_1.loadTasks();
        },
        teardown: function () {
            util_1.unloadTasks();
        },
        basic: {
            beforeEach: function () {
                util_1.prepareInputDirectory();
                util_1.prepareOutputDirectory();
            },
            afterEach: function () {
                util_1.cleanInputDirectory();
                util_1.cleanOutputDirectory();
            },
            textFilesOnly: function () {
                util_1.createDummyFile('file1.txt');
                util_1.createDummyFile('file2');
                util_1.createDummyDirectory('dir.txt');
                util_1.runGruntTask('rename:textFiles');
                assert.isFalse(util_1.fileExistsInInputDirectory('file1.txt'), 'file1.txt should not be in input directory');
                assert.isTrue(util_1.fileExistsInOutputDirectory('file1.txt'), 'file1.txt should have been moved to output directory');
                assert.isTrue(util_1.fileExistsInInputDirectory('file2'), 'file2 should still be in input directory');
                assert.isFalse(util_1.fileExistsInOutputDirectory('file2'), 'file2 should not be in output directory');
                assert.isFalse(util_1.fileExistsInInputDirectory('dir.txt'), 'dir.txt directory should not be in input directory');
                assert.isTrue(util_1.fileExistsInOutputDirectory('dir.txt'), 'dir.txt directory should be in output directory');
            }
        }
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVuYW1lLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicmVuYW1lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0lBQUEsNkNBQStDO0lBQy9DLDJDQUE2QztJQUM3Qyw2QkFBK0I7SUFDL0IsZ0NBWWlCO0lBRWpCLElBQU0sY0FBYyxHQUFHLHdCQUFpQixFQUFFLENBQUM7SUFDM0MsSUFBTSxVQUFVLEdBQUcseUJBQWtCLEVBQUUsQ0FBQztJQUV4QyxhQUFhLENBQUM7UUFDYixJQUFJLEVBQUUsY0FBYztRQUNwQixLQUFLO1lBQ0osS0FBSyxDQUFDLFVBQVUsQ0FBQztnQkFDaEIsTUFBTSxFQUFFO29CQUNQLFNBQVMsRUFBRTt3QkFDVixNQUFNLEVBQUUsSUFBSTt3QkFDWixHQUFHLEVBQUUsY0FBYzt3QkFDbkIsR0FBRyxFQUFFLENBQUMsVUFBVSxDQUFDO3dCQUNqQixJQUFJLEVBQUUsVUFBVTtxQkFDaEI7aUJBQ0Q7YUFDRCxDQUFDLENBQUM7WUFFSCxnQkFBUyxFQUFFLENBQUM7UUFDYixDQUFDO1FBQ0QsUUFBUTtZQUNQLGtCQUFXLEVBQUUsQ0FBQztRQUNmLENBQUM7UUFDRCxLQUFLLEVBQUU7WUFDTixVQUFVO2dCQUNULDRCQUFxQixFQUFFLENBQUM7Z0JBQ3hCLDZCQUFzQixFQUFFLENBQUM7WUFDMUIsQ0FBQztZQUVELFNBQVM7Z0JBQ1IsMEJBQW1CLEVBQUUsQ0FBQztnQkFDdEIsMkJBQW9CLEVBQUUsQ0FBQztZQUN4QixDQUFDO1lBRUQsYUFBYTtnQkFDWixzQkFBZSxDQUFDLFdBQVcsQ0FBQyxDQUFDO2dCQUM3QixzQkFBZSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUN6QiwyQkFBb0IsQ0FBQyxTQUFTLENBQUMsQ0FBQztnQkFFaEMsbUJBQVksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO2dCQUVqQyxNQUFNLENBQUMsT0FBTyxDQUFDLGlDQUEwQixDQUFDLFdBQVcsQ0FBQyxFQUFFLDRDQUE0QyxDQUFDLENBQUM7Z0JBQ3RHLE1BQU0sQ0FBQyxNQUFNLENBQUMsa0NBQTJCLENBQUMsV0FBVyxDQUFDLEVBQUUsc0RBQXNELENBQUMsQ0FBQztnQkFDaEgsTUFBTSxDQUFDLE1BQU0sQ0FBQyxpQ0FBMEIsQ0FBQyxPQUFPLENBQUMsRUFBRSwwQ0FBMEMsQ0FBQyxDQUFDO2dCQUMvRixNQUFNLENBQUMsT0FBTyxDQUFDLGtDQUEyQixDQUFDLE9BQU8sQ0FBQyxFQUFFLHlDQUF5QyxDQUFDLENBQUM7Z0JBQ2hHLE1BQU0sQ0FBQyxPQUFPLENBQUMsaUNBQTBCLENBQUMsU0FBUyxDQUFDLEVBQUUsb0RBQW9ELENBQUMsQ0FBQztnQkFDNUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxrQ0FBMkIsQ0FBQyxTQUFTLENBQUMsRUFBRSxpREFBaUQsQ0FBQyxDQUFDO1lBQzFHLENBQUM7U0FDRDtLQUNELENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIHJlZ2lzdGVyU3VpdGUgZnJvbSAnaW50ZXJuIW9iamVjdCc7XG5pbXBvcnQgKiBhcyBhc3NlcnQgZnJvbSAnaW50ZXJuL2NoYWkhYXNzZXJ0JztcbmltcG9ydCAqIGFzIGdydW50IGZyb20gJ2dydW50JztcbmltcG9ydCB7XG5cdGdldElucHV0RGlyZWN0b3J5LFxuXHRnZXRPdXRwdXREaXJlY3RvcnksXG5cdGxvYWRUYXNrcyxcblx0dW5sb2FkVGFza3MsXG5cdHByZXBhcmVJbnB1dERpcmVjdG9yeSxcblx0cHJlcGFyZU91dHB1dERpcmVjdG9yeSxcblx0cnVuR3J1bnRUYXNrLFxuXHRjcmVhdGVEdW1teUZpbGUsXG5cdGNyZWF0ZUR1bW15RGlyZWN0b3J5LFxuXHRmaWxlRXhpc3RzSW5JbnB1dERpcmVjdG9yeSxcblx0ZmlsZUV4aXN0c0luT3V0cHV0RGlyZWN0b3J5LCBjbGVhbklucHV0RGlyZWN0b3J5LCBjbGVhbk91dHB1dERpcmVjdG9yeVxufSBmcm9tICcuLi91dGlsJztcblxuY29uc3QgaW5wdXREaXJlY3RvcnkgPSBnZXRJbnB1dERpcmVjdG9yeSgpO1xuY29uc3Qgb3V0cHV0UGF0aCA9IGdldE91dHB1dERpcmVjdG9yeSgpO1xuXG5yZWdpc3RlclN1aXRlKHtcblx0bmFtZTogJ3Rhc2tzL3JlbmFtZScsXG5cdHNldHVwKCkge1xuXHRcdGdydW50LmluaXRDb25maWcoe1xuXHRcdFx0cmVuYW1lOiB7XG5cdFx0XHRcdHRleHRGaWxlczoge1xuXHRcdFx0XHRcdGV4cGFuZDogdHJ1ZSxcblx0XHRcdFx0XHRjd2Q6IGlucHV0RGlyZWN0b3J5LFxuXHRcdFx0XHRcdHNyYzogWycqKi8qLnR4dCddLFxuXHRcdFx0XHRcdGRlc3Q6IG91dHB1dFBhdGhcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0bG9hZFRhc2tzKCk7XG5cdH0sXG5cdHRlYXJkb3duKCkge1xuXHRcdHVubG9hZFRhc2tzKCk7XG5cdH0sXG5cdGJhc2ljOiB7XG5cdFx0YmVmb3JlRWFjaCgpIHtcblx0XHRcdHByZXBhcmVJbnB1dERpcmVjdG9yeSgpO1xuXHRcdFx0cHJlcGFyZU91dHB1dERpcmVjdG9yeSgpO1xuXHRcdH0sXG5cblx0XHRhZnRlckVhY2goKSB7XG5cdFx0XHRjbGVhbklucHV0RGlyZWN0b3J5KCk7XG5cdFx0XHRjbGVhbk91dHB1dERpcmVjdG9yeSgpO1xuXHRcdH0sXG5cblx0XHR0ZXh0RmlsZXNPbmx5KCkge1xuXHRcdFx0Y3JlYXRlRHVtbXlGaWxlKCdmaWxlMS50eHQnKTtcblx0XHRcdGNyZWF0ZUR1bW15RmlsZSgnZmlsZTInKTtcblx0XHRcdGNyZWF0ZUR1bW15RGlyZWN0b3J5KCdkaXIudHh0Jyk7XG5cblx0XHRcdHJ1bkdydW50VGFzaygncmVuYW1lOnRleHRGaWxlcycpO1xuXG5cdFx0XHRhc3NlcnQuaXNGYWxzZShmaWxlRXhpc3RzSW5JbnB1dERpcmVjdG9yeSgnZmlsZTEudHh0JyksICdmaWxlMS50eHQgc2hvdWxkIG5vdCBiZSBpbiBpbnB1dCBkaXJlY3RvcnknKTtcblx0XHRcdGFzc2VydC5pc1RydWUoZmlsZUV4aXN0c0luT3V0cHV0RGlyZWN0b3J5KCdmaWxlMS50eHQnKSwgJ2ZpbGUxLnR4dCBzaG91bGQgaGF2ZSBiZWVuIG1vdmVkIHRvIG91dHB1dCBkaXJlY3RvcnknKTtcblx0XHRcdGFzc2VydC5pc1RydWUoZmlsZUV4aXN0c0luSW5wdXREaXJlY3RvcnkoJ2ZpbGUyJyksICdmaWxlMiBzaG91bGQgc3RpbGwgYmUgaW4gaW5wdXQgZGlyZWN0b3J5Jyk7XG5cdFx0XHRhc3NlcnQuaXNGYWxzZShmaWxlRXhpc3RzSW5PdXRwdXREaXJlY3RvcnkoJ2ZpbGUyJyksICdmaWxlMiBzaG91bGQgbm90IGJlIGluIG91dHB1dCBkaXJlY3RvcnknKTtcblx0XHRcdGFzc2VydC5pc0ZhbHNlKGZpbGVFeGlzdHNJbklucHV0RGlyZWN0b3J5KCdkaXIudHh0JyksICdkaXIudHh0IGRpcmVjdG9yeSBzaG91bGQgbm90IGJlIGluIGlucHV0IGRpcmVjdG9yeScpO1xuXHRcdFx0YXNzZXJ0LmlzVHJ1ZShmaWxlRXhpc3RzSW5PdXRwdXREaXJlY3RvcnkoJ2Rpci50eHQnKSwgJ2Rpci50eHQgZGlyZWN0b3J5IHNob3VsZCBiZSBpbiBvdXRwdXQgZGlyZWN0b3J5Jyk7XG5cdFx0fVxuXHR9XG59KTtcbiJdfQ==