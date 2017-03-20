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
    var outputPath = util_1.getOutputDirectory();
    var run;
    var loadNpmTasks;
    var write;
    registerSuite({
        name: 'tasks/ts',
        setup: function () {
            util_1.loadTasks();
            run = sinon_1.stub(grunt.task, 'run');
            loadNpmTasks = sinon_1.stub(grunt, 'loadNpmTasks');
            write = sinon_1.stub(grunt.file, 'write');
            util_1.prepareOutputDirectory();
        },
        teardown: function () {
            run.restore();
            loadNpmTasks.restore();
            write.restore();
            util_1.unloadTasks();
            util_1.cleanOutputDirectory();
        },
        beforeEach: function () {
            grunt.initConfig({
                distDirectory: outputPath,
                tsconfig: {
                    "compilerOptions": {
                        "inlineSourceMap": true,
                        "inlineSources": true,
                        "listFiles": true,
                        "module": "commonjs",
                        "noImplicitAny": true,
                        "pretty": true,
                        "target": "es6"
                    }
                },
                ts: {
                    custom: {
                        compilerOptions: {
                            target: 'custom'
                        }
                    }
                }
            });
            run.reset();
            write.reset();
        },
        default: function () {
            util_1.runGruntTask('dojo-ts');
            assert.deepEqual(grunt.config('ts.dev'), {
                tsconfig: {
                    passThrough: true,
                    tsconfig: 'tsconfig.json'
                }
            });
            assert.isTrue(run.calledOnce);
            assert.deepEqual(run.firstCall.args[0], ['ts:dev']);
        },
        dev: function () {
            util_1.runGruntTask('dojo-ts:dev');
            assert.deepEqual(grunt.config('ts.dev'), {
                tsconfig: {
                    passThrough: true,
                    tsconfig: 'tsconfig.json'
                }
            });
            assert.isTrue(run.calledOnce);
            assert.deepEqual(run.firstCall.args[0], ['ts:dev']);
        },
        dist: function () {
            util_1.runGruntTask('dojo-ts:dist');
            assert.deepEqual(grunt.config('ts.dist'), {
                tsconfig: {
                    passThrough: true,
                    tsconfig: '.tsconfigdist.json'
                }
            });
            assert.isTrue(run.calledOnce);
            assert.deepEqual(run.firstCall.args[0], ['ts:dist', 'clean:distTsconfig']);
            assert.isTrue(write.calledOnce);
            assert.isTrue(write.calledWith('.tsconfigdist.json'));
        },
        esm: function () {
            grunt.initConfig({
                distDirectory: outputPath,
                tsconfig: {
                    "compilerOptions": {
                        "inlineSourceMap": true,
                        "inlineSources": true,
                        "listFiles": true,
                        "module": "commonjs",
                        "noImplicitAny": true,
                        "pretty": true,
                        "target": "es6"
                    }
                }
            });
            util_1.runGruntTask('dojo-ts:esm');
            assert.deepEqual(grunt.config('ts.esm'), {
                tsconfig: {
                    passThrough: true,
                    tsconfig: '.tsconfigesm.json'
                }
            });
            assert.isTrue(run.calledOnce);
            assert.deepEqual(run.firstCall.args[0], ['ts:esm', 'clean:esmTsconfig']);
            assert.isTrue(write.calledOnce);
            assert.isTrue(write.calledWith('.tsconfigesm.json'));
        },
        custom: function () {
            util_1.runGruntTask('dojo-ts:custom');
            assert.deepEqual(grunt.config('ts.custom'), {
                tsconfig: {
                    passThrough: true,
                    tsconfig: '.tsconfigcustom.json'
                }
            });
            assert.isTrue(run.calledOnce);
            assert.deepEqual(run.firstCall.args[0], ['ts:custom', 'clean:customTsconfig']);
            assert.isTrue(write.calledOnce);
            assert.isTrue(write.calledWith('.tsconfigcustom.json'));
            assert.equal(JSON.parse(write.firstCall.args[1]).compilerOptions.target, 'custom');
        }
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ0cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztJQUFBLDZDQUErQztJQUMvQywyQ0FBNkM7SUFDN0MsNkJBQStCO0lBQy9CLCtCQUF3QztJQUN4QyxnQ0FHaUI7SUFFakIsSUFBSSxVQUFVLEdBQUcseUJBQWtCLEVBQUUsQ0FBQztJQUN0QyxJQUFJLEdBQWMsQ0FBQztJQUNuQixJQUFJLFlBQXVCLENBQUM7SUFDNUIsSUFBSSxLQUFnQixDQUFDO0lBRXJCLGFBQWEsQ0FBQztRQUNiLElBQUksRUFBRSxVQUFVO1FBQ2hCLEtBQUs7WUFDSixnQkFBUyxFQUFFLENBQUM7WUFFWixHQUFHLEdBQUcsWUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDOUIsWUFBWSxHQUFHLFlBQUksQ0FBQyxLQUFLLEVBQUUsY0FBYyxDQUFDLENBQUM7WUFDM0MsS0FBSyxHQUFHLFlBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBRWxDLDZCQUFzQixFQUFFLENBQUM7UUFDMUIsQ0FBQztRQUNELFFBQVE7WUFDUCxHQUFHLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDZCxZQUFZLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDdkIsS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBRWhCLGtCQUFXLEVBQUUsQ0FBQztZQUNkLDJCQUFvQixFQUFFLENBQUM7UUFDeEIsQ0FBQztRQUVELFVBQVU7WUFDVCxLQUFLLENBQUMsVUFBVSxDQUFDO2dCQUNoQixhQUFhLEVBQUUsVUFBVTtnQkFDekIsUUFBUSxFQUFFO29CQUNULGlCQUFpQixFQUFFO3dCQUNsQixpQkFBaUIsRUFBRSxJQUFJO3dCQUN2QixlQUFlLEVBQUUsSUFBSTt3QkFDckIsV0FBVyxFQUFFLElBQUk7d0JBQ2pCLFFBQVEsRUFBRSxVQUFVO3dCQUNwQixlQUFlLEVBQUUsSUFBSTt3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QUUsUUFBUSxDQUFDLENBQUM7UUFDcEYsQ0FBQztLQUNELENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIHJlZ2lzdGVyU3VpdGUgZnJvbSAnaW50ZXJuIW9iamVjdCc7XG5pbXBvcnQgKiBhcyBhc3NlcnQgZnJvbSAnaW50ZXJuL2NoYWkhYXNzZXJ0JztcbmltcG9ydCAqIGFzIGdydW50IGZyb20gJ2dydW50JztcbmltcG9ydCB7IFNpbm9uU3R1Yiwgc3R1YiB9IGZyb20gJ3Npbm9uJztcbmltcG9ydCB7XG5cdGxvYWRUYXNrcywgcHJlcGFyZU91dHB1dERpcmVjdG9yeSwgdW5sb2FkVGFza3MsIGNsZWFuT3V0cHV0RGlyZWN0b3J5LCBydW5HcnVudFRhc2ssXG5cdGdldE91dHB1dERpcmVjdG9yeVxufSBmcm9tICcuLi91dGlsJztcblxudmFyIG91dHB1dFBhdGggPSBnZXRPdXRwdXREaXJlY3RvcnkoKTtcbmxldCBydW46IFNpbm9uU3R1YjtcbmxldCBsb2FkTnBtVGFza3M6IFNpbm9uU3R1YjtcbmxldCB3cml0ZTogU2lub25TdHViO1xuXG5yZWdpc3RlclN1aXRlKHtcblx0bmFtZTogJ3Rhc2tzL3RzJyxcblx0c2V0dXAoKSB7XG5cdFx0bG9hZFRhc2tzKCk7XG5cblx0XHRydW4gPSBzdHViKGdydW50LnRhc2ssICdydW4nKTtcblx0XHRsb2FkTnBtVGFza3MgPSBzdHViKGdydW50LCAnbG9hZE5wbVRhc2tzJyk7XG5cdFx0d3JpdGUgPSBzdHViKGdydW50LmZpbGUsICd3cml0ZScpO1xuXG5cdFx0cHJlcGFyZU91dHB1dERpcmVjdG9yeSgpO1xuXHR9LFxuXHR0ZWFyZG93bigpIHtcblx0XHRydW4ucmVzdG9yZSgpO1xuXHRcdGxvYWROcG1UYXNrcy5yZXN0b3JlKCk7XG5cdFx0d3JpdGUucmVzdG9yZSgpO1xuXG5cdFx0dW5sb2FkVGFza3MoKTtcblx0XHRjbGVhbk91dHB1dERpcmVjdG9yeSgpO1xuXHR9LFxuXG5cdGJlZm9yZUVhY2goKSB7XG5cdFx0Z3J1bnQuaW5pdENvbmZpZyh7XG5cdFx0XHRkaXN0RGlyZWN0b3J5OiBvdXRwdXRQYXRoLFxuXHRcdFx0dHNjb25maWc6IHtcblx0XHRcdFx0XCJjb21waWxlck9wdGlvbnNcIjoge1xuXHRcdFx0XHRcdFwiaW5saW5lU291cmNlTWFwXCI6IHRydWUsXG5cdFx0XHRcdFx0XCJpbmxpbmVTb3VyY2VzXCI6IHRydWUsXG5cdFx0XHRcdFx0XCJsaXN0RmlsZXNcIjogdHJ1ZSxcblx0XHRcdFx0XHRcIm1vZHVsZVwiOiBcImNvbW1vbmpzXCIsXG5cdFx0XHRcdFx0XCJub0ltcGxpY2l0QW55XCI6IHRydWUsXG5cdFx0XHRcdFx0XCJwcmV0dHlcIjogdHJ1ZSxcblx0XHRcdFx0XHRcInRhcmdldFwiOiBcImVzNlwiXG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHR0czoge1xuXHRcdFx0XHRjdXN0b206IHtcblx0XHRcdFx0XHRjb21waWxlck9wdGlvbnM6IHtcblx0XHRcdFx0XHRcdHRhcmdldDogJ2N1c3RvbSdcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdHJ1bi5yZXNldCgpO1xuXHRcdHdyaXRlLnJlc2V0KCk7XG5cdH0sXG5cblx0ZGVmYXVsdCgpIHtcblx0XHRydW5HcnVudFRhc2soJ2Rvam8tdHMnKTtcblxuXHRcdGFzc2VydC5kZWVwRXF1YWwoZ3J1bnQuY29uZmlnKCd0cy5kZXYnKSwge1xuXHRcdFx0dHNjb25maWc6IHtcblx0XHRcdFx0cGFzc1Rocm91Z2g6IHRydWUsXG5cdFx0XHRcdHRzY29uZmlnOiAndHNjb25maWcuanNvbidcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdGFzc2VydC5pc1RydWUocnVuLmNhbGxlZE9uY2UpO1xuXHRcdGFzc2VydC5kZWVwRXF1YWwocnVuLmZpcnN0Q2FsbC5hcmdzWyAwIF0sIFsgJ3RzOmRldicgXSk7XG5cdH0sXG5cblx0ZGV2KCkge1xuXG5cdFx0cnVuR3J1bnRUYXNrKCdkb2pvLXRzOmRldicpO1xuXG5cdFx0YXNzZXJ0LmRlZXBFcXVhbChncnVudC5jb25maWcoJ3RzLmRldicpLCB7XG5cdFx0XHR0c2NvbmZpZzoge1xuXHRcdFx0XHRwYXNzVGhyb3VnaDogdHJ1ZSxcblx0XHRcdFx0dHNjb25maWc6ICd0c2NvbmZpZy5qc29uJ1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0YXNzZXJ0LmlzVHJ1ZShydW4uY2FsbGVkT25jZSk7XG5cdFx0YXNzZXJ0LmRlZXBFcXVhbChydW4uZmlyc3RDYWxsLmFyZ3NbIDAgXSwgWyAndHM6ZGV2JyBdKTtcblx0fSxcblxuXHRkaXN0KCkge1xuXHRcdHJ1bkdydW50VGFzaygnZG9qby10czpkaXN0Jyk7XG5cblx0XHRhc3NlcnQuZGVlcEVxdWFsKGdydW50LmNvbmZpZygndHMuZGlzdCcpLCB7XG5cdFx0XHR0c2NvbmZpZzoge1xuXHRcdFx0XHRwYXNzVGhyb3VnaDogdHJ1ZSxcblx0XHRcdFx0dHNjb25maWc6ICcudHNjb25maWdkaXN0Lmpzb24nXG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHRhc3NlcnQuaXNUcnVlKHJ1bi5jYWxsZWRPbmNlKTtcblx0XHRhc3NlcnQuZGVlcEVxdWFsKHJ1bi5maXJzdENhbGwuYXJnc1sgMCBdLCBbICd0czpkaXN0JywgJ2NsZWFuOmRpc3RUc2NvbmZpZycgXSk7XG5cblx0XHRhc3NlcnQuaXNUcnVlKHdyaXRlLmNhbGxlZE9uY2UpO1xuXHRcdGFzc2VydC5pc1RydWUod3JpdGUuY2FsbGVkV2l0aCgnLnRzY29uZmlnZGlzdC5qc29uJykpO1xuXHR9LFxuXG5cdGVzbSgpIHtcblx0XHRncnVudC5pbml0Q29uZmlnKHtcblx0XHRcdGRpc3REaXJlY3Rvcnk6IG91dHB1dFBhdGgsXG5cdFx0XHR0c2NvbmZpZzoge1xuXHRcdFx0XHRcImNvbXBpbGVyT3B0aW9uc1wiOiB7XG5cdFx0XHRcdFx0XCJpbmxpbmVTb3VyY2VNYXBcIjogdHJ1ZSxcblx0XHRcdFx0XHRcImlubGluZVNvdXJjZXNcIjogdHJ1ZSxcblx0XHRcdFx0XHRcImxpc3RGaWxlc1wiOiB0cnVlLFxuXHRcdFx0XHRcdFwibW9kdWxlXCI6IFwiY29tbW9uanNcIixcblx0XHRcdFx0XHRcIm5vSW1wbGljaXRBbnlcIjogdHJ1ZSxcblx0XHRcdFx0XHRcInByZXR0eVwiOiB0cnVlLFxuXHRcdFx0XHRcdFwidGFyZ2V0XCI6IFwiZXM2XCJcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0cnVuR3J1bnRUYXNrKCdkb2pvLXRzOmVzbScpO1xuXG5cdFx0YXNzZXJ0LmRlZXBFcXVhbChncnVudC5jb25maWcoJ3RzLmVzbScpLCB7XG5cdFx0XHR0c2NvbmZpZzoge1xuXHRcdFx0XHRwYXNzVGhyb3VnaDogdHJ1ZSxcblx0XHRcdFx0dHNjb25maWc6ICcudHNjb25maWdlc20uanNvbidcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdGFzc2VydC5pc1RydWUocnVuLmNhbGxlZE9uY2UpO1xuXHRcdGFzc2VydC5kZWVwRXF1YWwocnVuLmZpcnN0Q2FsbC5hcmdzWyAwIF0sIFsgJ3RzOmVzbScsICdjbGVhbjplc21Uc2NvbmZpZycgXSk7XG5cblx0XHRhc3NlcnQuaXNUcnVlKHdyaXRlLmNhbGxlZE9uY2UpO1xuXHRcdGFzc2VydC5pc1RydWUod3JpdGUuY2FsbGVkV2l0aCgnLnRzY29uZmlnZXNtLmpzb24nKSk7XG5cdH0sXG5cblx0Y3VzdG9tKCkge1xuXHRcdHJ1bkdydW50VGFzaygnZG9qby10czpjdXN0b20nKTtcblxuXHRcdGFzc2VydC5kZWVwRXF1YWwoZ3J1bnQuY29uZmlnKCd0cy5jdXN0b20nKSwge1xuXHRcdFx0dHNjb25maWc6IHtcblx0XHRcdFx0cGFzc1Rocm91Z2g6IHRydWUsXG5cdFx0XHRcdHRzY29uZmlnOiAnLnRzY29uZmlnY3VzdG9tLmpzb24nXG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHRhc3NlcnQuaXNUcnVlKHJ1bi5jYWxsZWRPbmNlKTtcblx0XHRhc3NlcnQuZGVlcEVxdWFsKHJ1bi5maXJzdENhbGwuYXJnc1sgMCBdLCBbICd0czpjdXN0b20nLCAnY2xlYW46Y3VzdG9tVHNjb25maWcnIF0pO1xuXG5cdFx0YXNzZXJ0LmlzVHJ1ZSh3cml0ZS5jYWxsZWRPbmNlKTtcblx0XHRhc3NlcnQuaXNUcnVlKHdyaXRlLmNhbGxlZFdpdGgoJy50c2NvbmZpZ2N1c3RvbS5qc29uJykpO1xuXHRcdGFzc2VydC5lcXVhbChKU09OLnBhcnNlKHdyaXRlLmZpcnN0Q2FsbC5hcmdzWzFdKS5jb21waWxlck9wdGlvbnMudGFyZ2V0LCAnY3VzdG9tJyk7XG5cdH1cbn0pO1xuIl19