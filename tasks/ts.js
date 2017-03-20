(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "lodash"], factory);
    }
})(function (require, exports) {
    "use strict";
    var _ = require("lodash");
    return function (grunt) {
        var distDirectory = grunt.config.get('distDirectory');
        var defaultOptions = {
            dist: {
                exclude: ['tests/**/*.ts', 'src/*/tests/**/*.ts', 'src/*/example/**/*.ts'],
                compilerOptions: {
                    outDir: distDirectory,
                    declaration: true,
                    sourceMap: true,
                    inlineSources: true
                }
            },
            esm: {
                exclude: ['tests/**/*.ts', 'src/*/tests/**/*.ts', 'src/*/example/**/*.ts'],
                compilerOptions: {
                    target: 'es6',
                    module: 'es6',
                    sourceMap: false,
                    outDir: 'dist/esm',
                    inlineSourceMap: true,
                    inlineSources: true
                }
            }
        };
        grunt.registerTask('dojo-ts', function () {
            grunt.loadNpmTasks('grunt-ts');
            var flags = this.args && this.args.length ? this.args : ['dev'];
            var tsconfig = grunt.config.get('tsconfig');
            var tsOptions = grunt.config.get('ts') || {};
            var baseOptions = {
                failOnTypeErrors: true,
                fast: 'never'
            };
            grunt.config.set('ts.options', baseOptions);
            var tasks = [];
            flags.forEach(function (target) {
                var tsconfigFileName = 'tsconfig.json';
                tasks.push("ts:" + target);
                // dev task cannot be configured outside of projects tsconfig
                if (target !== 'dev') {
                    var targetTsconfig = _.cloneDeep(tsconfig);
                    var targetDefaultOptions = defaultOptions[target] || {};
                    var targetTsOptions = tsOptions[target] || {};
                    _.merge(targetTsconfig, targetDefaultOptions, targetTsOptions);
                    tsconfigFileName = ".tsconfig" + target + ".json";
                    grunt.file.write(tsconfigFileName, JSON.stringify(targetTsconfig));
                    grunt.config.set("clean." + target + "Tsconfig", { src: tsconfigFileName });
                    tasks.push("clean:" + target + "Tsconfig");
                }
                grunt.config.set("ts." + target, { tsconfig: { passThrough: true, tsconfig: tsconfigFileName } });
            });
            grunt.task.run(tasks);
        });
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ0cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0lBQUEsMEJBQTRCO0lBRzVCLE9BQVMsVUFBUyxLQUFhO1FBQzlCLElBQU0sYUFBYSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFTLGVBQWUsQ0FBQyxDQUFDO1FBQ2hFLElBQU0sY0FBYyxHQUFRO1lBQzNCLElBQUksRUFBRTtnQkFDTCxPQUFPLEVBQUUsQ0FBQyxlQUFlLEVBQUUscUJBQXFCLEVBQUUsdUJBQXVCLENBQUM7Z0JBQzFFLGVBQWUsRUFBRTtvQkFDaEIsTUFBTSxFQUFFLGFBQWE7b0JBQ3JCLFdBQVcsRUFBRSxJQUFJO29CQUNqQixTQUFTLEVBQUUsSUFBSTtvQkFDZixhQUFhLEVBQUUsSUFBSTtpQkFDbkI7YUFDRDtZQUNELEdBQUcsRUFBRTtnQkFDSixPQUFPLEVBQUUsQ0FBQyxlQUFlLEVBQUUscUJBQXFCLEVBQUUsdUJBQXVCLENBQUM7Z0JBQzFFLGVBQWUsRUFBRTtvQkFDaEIsTUFBTSxFQUFFLEtBQUs7b0JBQ2IsTUFBTSxFQUFFLEtBQUs7b0JBQ2IsU0FBUyxFQUFFLEtBQUs7b0JBQ2hCLE1BQU0sRUFBRSxVQUFVO29CQUNsQixlQUFlLEVBQUUsSUFBSTtvQkFDckIsYUFBYSxFQUFFLElBQUk7aUJBQ25CO2FBQ0Q7U0FDRCxDQUFDO1FBRUYsS0FBSyxDQUFDLFlBQVksQ0FBQyxTQUFTLEVBQVE7WUFDbkMsS0FBSyxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUUvQixJQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBRSxLQUFLLENBQUUsQ0FBQztZQUNwRSxJQUFNLFFBQVEsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBTSxVQUFVLENBQUMsQ0FBQztZQUNuRCxJQUFNLFNBQVMsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDcEQsSUFBTSxXQUFXLEdBQUc7Z0JBQ25CLGdCQUFnQixFQUFFLElBQUk7Z0JBQ3RCLElBQUksRUFBRSxPQUFPO2FBQ2IsQ0FBQztZQUVGLEtBQUssQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLFlBQVksRUFBRSxXQUFXLENBQUMsQ0FBQztZQUU1QyxJQUFNLEtBQUssR0FBYSxFQUFFLENBQUM7WUFDM0IsS0FBSyxDQUFDLE9BQU8sQ0FBQyxVQUFDLE1BQWM7Z0JBQzVCLElBQUksZ0JBQWdCLEdBQUcsZUFBZSxDQUFDO2dCQUV2QyxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQU0sTUFBUSxDQUFDLENBQUM7Z0JBQzNCLDZEQUE2RDtnQkFDN0QsRUFBRSxDQUFDLENBQUMsTUFBTSxLQUFLLEtBQUssQ0FBQyxDQUFDLENBQUM7b0JBQ3RCLElBQU0sY0FBYyxHQUFHLENBQUMsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUM7b0JBQzdDLElBQU0sb0JBQW9CLEdBQUcsY0FBYyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQztvQkFDMUQsSUFBTSxlQUFlLEdBQUcsU0FBUyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQztvQkFFaEQsQ0FBQyxDQUFDLEtBQUssQ0FBQyxjQUFjLEVBQUUsb0JBQW9CLEVBQUUsZUFBZSxDQUFDLENBQUM7b0JBQy9ELGdCQUFnQixHQUFHLGNBQVksTUFBTSxVQUFPLENBQUM7b0JBQzdDLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLGdCQUFnQixFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztvQkFDbkUsS0FBSyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsV0FBUyxNQUFNLGFBQVUsRUFBRSxFQUFFLEdBQUcsRUFBRSxnQkFBZ0IsRUFBQyxDQUFDLENBQUM7b0JBRXRFLEtBQUssQ0FBQyxJQUFJLENBQUMsV0FBUyxNQUFNLGFBQVUsQ0FBQyxDQUFDO2dCQUN2QyxDQUFDO2dCQUNELEtBQUssQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLFFBQU0sTUFBUSxFQUFFLEVBQUUsUUFBUSxFQUFFLEVBQUUsV0FBVyxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsZ0JBQWdCLEVBQUUsRUFBQyxDQUFDLENBQUM7WUFDbEcsQ0FBQyxDQUFDLENBQUM7WUFDSCxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN2QixDQUFDLENBQUMsQ0FBQztJQUNKLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIF8gZnJvbSAnbG9kYXNoJztcbmltcG9ydCBJVGFzayA9IGdydW50LnRhc2suSVRhc2s7XG5cbmV4cG9ydCA9IGZ1bmN0aW9uKGdydW50OiBJR3J1bnQpIHtcblx0Y29uc3QgZGlzdERpcmVjdG9yeSA9IGdydW50LmNvbmZpZy5nZXQ8c3RyaW5nPignZGlzdERpcmVjdG9yeScpO1xuXHRjb25zdCBkZWZhdWx0T3B0aW9uczogYW55ID0ge1xuXHRcdGRpc3Q6IHtcblx0XHRcdGV4Y2x1ZGU6IFsndGVzdHMvKiovKi50cycsICdzcmMvKi90ZXN0cy8qKi8qLnRzJywgJ3NyYy8qL2V4YW1wbGUvKiovKi50cyddLFxuXHRcdFx0Y29tcGlsZXJPcHRpb25zOiB7XG5cdFx0XHRcdG91dERpcjogZGlzdERpcmVjdG9yeSxcblx0XHRcdFx0ZGVjbGFyYXRpb246IHRydWUsXG5cdFx0XHRcdHNvdXJjZU1hcDogdHJ1ZSxcblx0XHRcdFx0aW5saW5lU291cmNlczogdHJ1ZVxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0ZXNtOiB7XG5cdFx0XHRleGNsdWRlOiBbJ3Rlc3RzLyoqLyoudHMnLCAnc3JjLyovdGVzdHMvKiovKi50cycsICdzcmMvKi9leGFtcGxlLyoqLyoudHMnXSxcblx0XHRcdGNvbXBpbGVyT3B0aW9uczoge1xuXHRcdFx0XHR0YXJnZXQ6ICdlczYnLFxuXHRcdFx0XHRtb2R1bGU6ICdlczYnLFxuXHRcdFx0XHRzb3VyY2VNYXA6IGZhbHNlLFxuXHRcdFx0XHRvdXREaXI6ICdkaXN0L2VzbScsXG5cdFx0XHRcdGlubGluZVNvdXJjZU1hcDogdHJ1ZSxcblx0XHRcdFx0aW5saW5lU291cmNlczogdHJ1ZVxuXHRcdFx0fVxuXHRcdH1cblx0fTtcblxuXHRncnVudC5yZWdpc3RlclRhc2soJ2Rvam8tdHMnLCA8YW55PiBmdW5jdGlvbiAodGhpczogSVRhc2spIHtcblx0XHRncnVudC5sb2FkTnBtVGFza3MoJ2dydW50LXRzJyk7XG5cblx0XHRjb25zdCBmbGFncyA9IHRoaXMuYXJncyAmJiB0aGlzLmFyZ3MubGVuZ3RoID8gdGhpcy5hcmdzIDogWyAnZGV2JyBdO1xuXHRcdGNvbnN0IHRzY29uZmlnID0gZ3J1bnQuY29uZmlnLmdldDxhbnk+KCd0c2NvbmZpZycpO1xuXHRcdGNvbnN0IHRzT3B0aW9ucyA9IGdydW50LmNvbmZpZy5nZXQ8YW55PigndHMnKSB8fCB7fTtcblx0XHRjb25zdCBiYXNlT3B0aW9ucyA9IHtcblx0XHRcdGZhaWxPblR5cGVFcnJvcnM6IHRydWUsXG5cdFx0XHRmYXN0OiAnbmV2ZXInXG5cdFx0fTtcblxuXHRcdGdydW50LmNvbmZpZy5zZXQoJ3RzLm9wdGlvbnMnLCBiYXNlT3B0aW9ucyk7XG5cblx0XHRjb25zdCB0YXNrczogc3RyaW5nW10gPSBbXTtcblx0XHRmbGFncy5mb3JFYWNoKCh0YXJnZXQ6IHN0cmluZykgPT4ge1xuXHRcdFx0bGV0IHRzY29uZmlnRmlsZU5hbWUgPSAndHNjb25maWcuanNvbic7XG5cblx0XHRcdHRhc2tzLnB1c2goYHRzOiR7dGFyZ2V0fWApO1xuXHRcdFx0Ly8gZGV2IHRhc2sgY2Fubm90IGJlIGNvbmZpZ3VyZWQgb3V0c2lkZSBvZiBwcm9qZWN0cyB0c2NvbmZpZ1xuXHRcdFx0aWYgKHRhcmdldCAhPT0gJ2RldicpIHtcblx0XHRcdFx0Y29uc3QgdGFyZ2V0VHNjb25maWcgPSBfLmNsb25lRGVlcCh0c2NvbmZpZyk7XG5cdFx0XHRcdGNvbnN0IHRhcmdldERlZmF1bHRPcHRpb25zID0gZGVmYXVsdE9wdGlvbnNbdGFyZ2V0XSB8fCB7fTtcblx0XHRcdFx0Y29uc3QgdGFyZ2V0VHNPcHRpb25zID0gdHNPcHRpb25zW3RhcmdldF0gfHwge307XG5cblx0XHRcdFx0Xy5tZXJnZSh0YXJnZXRUc2NvbmZpZywgdGFyZ2V0RGVmYXVsdE9wdGlvbnMsIHRhcmdldFRzT3B0aW9ucyk7XG5cdFx0XHRcdHRzY29uZmlnRmlsZU5hbWUgPSBgLnRzY29uZmlnJHt0YXJnZXR9Lmpzb25gO1xuXHRcdFx0XHRncnVudC5maWxlLndyaXRlKHRzY29uZmlnRmlsZU5hbWUsIEpTT04uc3RyaW5naWZ5KHRhcmdldFRzY29uZmlnKSk7XG5cdFx0XHRcdGdydW50LmNvbmZpZy5zZXQoYGNsZWFuLiR7dGFyZ2V0fVRzY29uZmlnYCwgeyBzcmM6IHRzY29uZmlnRmlsZU5hbWV9KTtcblxuXHRcdFx0XHR0YXNrcy5wdXNoKGBjbGVhbjoke3RhcmdldH1Uc2NvbmZpZ2ApO1xuXHRcdFx0fVxuXHRcdFx0Z3J1bnQuY29uZmlnLnNldChgdHMuJHt0YXJnZXR9YCwgeyB0c2NvbmZpZzogeyBwYXNzVGhyb3VnaDogdHJ1ZSwgdHNjb25maWc6IHRzY29uZmlnRmlsZU5hbWUgfX0pO1xuXHRcdH0pO1xuXHRcdGdydW50LnRhc2sucnVuKHRhc2tzKTtcblx0fSk7XG59O1xuIl19