(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    return function (grunt) {
        var path = require('path');
        var fs = require('fs');
        var postCssImport = require('postcss-import');
        var postCssNext = require('postcss-cssnext');
        var postCssModules = require('postcss-modules');
        var umdWrapper = require('./util/umdWrapper');
        grunt.loadNpmTasks('grunt-postcss');
        var distDirectory = grunt.config.get('distDirectory') || '';
        var devDirectory = grunt.config.get('devDirectory') || '';
        function moduleProcessors(dest, cwd) {
            if (cwd === void 0) { cwd = ''; }
            var scopedName = dest === devDirectory ? '[name]__[local]__[hash:base64:5]' : '[hash:base64:8]';
            return [
                postCssImport,
                postCssNext({
                    features: {
                        autoprefixer: {
                            browsers: [
                                'last 2 versions',
                                'ie >= 10'
                            ]
                        }
                    }
                }),
                postCssModules({
                    generateScopedName: scopedName,
                    getJSON: function (cssFileName, json) {
                        var outputPath = path.resolve(dest, path.relative(cwd, cssFileName));
                        var newFilePath = outputPath + '.js';
                        var themeKey = ' _key';
                        json[themeKey] = 'dojo-' + path.basename(outputPath, '.css');
                        fs.writeFileSync(newFilePath, umdWrapper(JSON.stringify(json)));
                    }
                })
            ];
        }
        var variablesProcessors = [
            postCssImport,
            postCssNext({
                features: {
                    customProperties: {
                        preserve: 'computed'
                    }
                }
            })
        ];
        function moduleFiles(dest) {
            return [{
                    expand: true,
                    src: ['**/*.css', '!**/variables.css', '!common/styles/widgets.css'],
                    dest: dest,
                    cwd: 'src'
                }];
        }
        var variableFiles = [{
                expand: true,
                src: '**/variables.css',
                dest: distDirectory,
                cwd: 'src'
            }];
        grunt.config.set('postcss', {
            options: {
                map: true
            },
            'modules-dev': {
                files: moduleFiles(devDirectory),
                options: {
                    processors: moduleProcessors(devDirectory, 'src')
                }
            },
            'modules-dist': {
                files: moduleFiles(distDirectory),
                options: {
                    processors: moduleProcessors(distDirectory, 'src')
                }
            },
            variables: {
                files: variableFiles,
                options: {
                    processors: variablesProcessors
                }
            }
        });
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9zdGNzcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInBvc3Rjc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztJQUFBLE9BQVMsVUFBUyxLQUFhO1FBQzlCLElBQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUM3QixJQUFNLEVBQUUsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDekIsSUFBTSxhQUFhLEdBQUcsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUM7UUFDaEQsSUFBTSxXQUFXLEdBQUcsT0FBTyxDQUFDLGlCQUFpQixDQUFDLENBQUM7UUFDL0MsSUFBTSxjQUFjLEdBQUcsT0FBTyxDQUFDLGlCQUFpQixDQUFDLENBQUM7UUFDbEQsSUFBTSxVQUFVLEdBQUcsT0FBTyxDQUFDLG1CQUFtQixDQUFDLENBQUM7UUFFaEQsS0FBSyxDQUFDLFlBQVksQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUVwQyxJQUFNLGFBQWEsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBUyxlQUFlLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDdEUsSUFBTSxZQUFZLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQVMsY0FBYyxDQUFDLElBQUksRUFBRSxDQUFDO1FBRXBFLDBCQUEwQixJQUFZLEVBQUUsR0FBUTtZQUFSLG9CQUFBLEVBQUEsUUFBUTtZQUMvQyxJQUFNLFVBQVUsR0FBRyxJQUFJLEtBQUssWUFBWSxHQUFHLGtDQUFrQyxHQUFHLGlCQUFpQixDQUFDO1lBQ2xHLE1BQU0sQ0FBQztnQkFDTixhQUFhO2dCQUNiLFdBQVcsQ0FBQztvQkFDWCxRQUFRLEVBQUU7d0JBQ1QsWUFBWSxFQUFFOzRCQUNiLFFBQVEsRUFBRTtnQ0FDVCxpQkFBaUI7Z0NBQ2pCLFVBQVU7NkJBQ1Y7eUJBQ0Q7cUJBQ0Q7aUJBQ0QsQ0FBQztnQkFDRixjQUFjLENBQUM7b0JBQ2Qsa0JBQWtCLEVBQUUsVUFBVTtvQkFDOUIsT0FBTyxFQUFFLFVBQVMsV0FBbUIsRUFBRSxJQUFTO3dCQUMvQyxJQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxXQUFXLENBQUMsQ0FBQyxDQUFDO3dCQUN2RSxJQUFNLFdBQVcsR0FBRyxVQUFVLEdBQUcsS0FBSyxDQUFDO3dCQUN2QyxJQUFNLFFBQVEsR0FBRyxPQUFPLENBQUM7d0JBQ3pCLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxPQUFPLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLEVBQUUsTUFBTSxDQUFDLENBQUM7d0JBQzdELEVBQUUsQ0FBQyxhQUFhLENBQUMsV0FBVyxFQUFFLFVBQVUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDakUsQ0FBQztpQkFDRCxDQUFDO2FBQ0YsQ0FBQztRQUNILENBQUM7UUFFRCxJQUFNLG1CQUFtQixHQUFRO1lBQ2hDLGFBQWE7WUFDYixXQUFXLENBQUM7Z0JBQ1gsUUFBUSxFQUFFO29CQUNULGdCQUFnQixFQUFFO3dCQUNqQixRQUFRLEVBQUUsVUFBVTtxQkFDcEI7aUJBQ0Q7YUFDRCxDQUFDO1NBQ0YsQ0FBQztRQUVGLHFCQUFxQixJQUFZO1lBQ2hDLE1BQU0sQ0FBQyxDQUFDO29CQUNQLE1BQU0sRUFBRSxJQUFJO29CQUNaLEdBQUcsRUFBRSxDQUFDLFVBQVUsRUFBRSxtQkFBbUIsRUFBRSw0QkFBNEIsQ0FBQztvQkFDcEUsSUFBSSxFQUFFLElBQUk7b0JBQ1YsR0FBRyxFQUFFLEtBQUs7aUJBQ1YsQ0FBQyxDQUFDO1FBQ0osQ0FBQztRQUVELElBQU0sYUFBYSxHQUFHLENBQUM7Z0JBQ3RCLE1BQU0sRUFBRSxJQUFJO2dCQUNaLEdBQUcsRUFBRSxrQkFBa0I7Z0JBQ3ZCLElBQUksRUFBRSxhQUFhO2dCQUNuQixHQUFHLEVBQUUsS0FBSzthQUNWLENBQUMsQ0FBQztRQUVILEtBQUssQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRTtZQUMzQixPQUFPLEVBQUU7Z0JBQ1IsR0FBRyxFQUFFLElBQUk7YUFDVDtZQUNELGFBQWEsRUFBRTtnQkFDZCxLQUFLLEVBQUUsV0FBVyxDQUFDLFlBQVksQ0FBQztnQkFDaEMsT0FBTyxFQUFFO29CQUNSLFVBQVUsRUFBRSxnQkFBZ0IsQ0FBQyxZQUFZLEVBQUUsS0FBSyxDQUFDO2lCQUNqRDthQUNEO1lBQ0QsY0FBYyxFQUFFO2dCQUNmLEtBQUssRUFBRSxXQUFXLENBQUMsYUFBYSxDQUFDO2dCQUNqQyxPQUFPLEVBQUU7b0JBQ1IsVUFBVSxFQUFFLGdCQUFnQixDQUFDLGFBQWEsRUFBRSxLQUFLLENBQUM7aUJBQ2xEO2FBQ0Q7WUFDRCxTQUFTLEVBQUU7Z0JBQ1YsS0FBSyxFQUFFLGFBQWE7Z0JBQ3BCLE9BQU8sRUFBRTtvQkFDUixVQUFVLEVBQUUsbUJBQW1CO2lCQUMvQjthQUNEO1NBQ0QsQ0FBQyxDQUFDO0lBQ0osQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0ID0gZnVuY3Rpb24oZ3J1bnQ6IElHcnVudCkge1xuXHRjb25zdCBwYXRoID0gcmVxdWlyZSgncGF0aCcpO1xuXHRjb25zdCBmcyA9IHJlcXVpcmUoJ2ZzJyk7XG5cdGNvbnN0IHBvc3RDc3NJbXBvcnQgPSByZXF1aXJlKCdwb3N0Y3NzLWltcG9ydCcpO1xuXHRjb25zdCBwb3N0Q3NzTmV4dCA9IHJlcXVpcmUoJ3Bvc3Rjc3MtY3NzbmV4dCcpO1xuXHRjb25zdCBwb3N0Q3NzTW9kdWxlcyA9IHJlcXVpcmUoJ3Bvc3Rjc3MtbW9kdWxlcycpO1xuXHRjb25zdCB1bWRXcmFwcGVyID0gcmVxdWlyZSgnLi91dGlsL3VtZFdyYXBwZXInKTtcblxuXHRncnVudC5sb2FkTnBtVGFza3MoJ2dydW50LXBvc3Rjc3MnKTtcblxuXHRjb25zdCBkaXN0RGlyZWN0b3J5ID0gZ3J1bnQuY29uZmlnLmdldDxzdHJpbmc+KCdkaXN0RGlyZWN0b3J5JykgfHwgJyc7XG5cdGNvbnN0IGRldkRpcmVjdG9yeSA9IGdydW50LmNvbmZpZy5nZXQ8c3RyaW5nPignZGV2RGlyZWN0b3J5JykgfHwgJyc7XG5cblx0ZnVuY3Rpb24gbW9kdWxlUHJvY2Vzc29ycyhkZXN0OiBzdHJpbmcsIGN3ZCA9ICcnKSB7XG5cdFx0Y29uc3Qgc2NvcGVkTmFtZSA9IGRlc3QgPT09IGRldkRpcmVjdG9yeSA/ICdbbmFtZV1fX1tsb2NhbF1fX1toYXNoOmJhc2U2NDo1XScgOiAnW2hhc2g6YmFzZTY0OjhdJztcblx0XHRyZXR1cm4gW1xuXHRcdFx0cG9zdENzc0ltcG9ydCxcblx0XHRcdHBvc3RDc3NOZXh0KHtcblx0XHRcdFx0ZmVhdHVyZXM6IHtcblx0XHRcdFx0XHRhdXRvcHJlZml4ZXI6IHtcblx0XHRcdFx0XHRcdGJyb3dzZXJzOiBbXG5cdFx0XHRcdFx0XHRcdCdsYXN0IDIgdmVyc2lvbnMnLFxuXHRcdFx0XHRcdFx0XHQnaWUgPj0gMTAnXG5cdFx0XHRcdFx0XHRdXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KSxcblx0XHRcdHBvc3RDc3NNb2R1bGVzKHtcblx0XHRcdFx0Z2VuZXJhdGVTY29wZWROYW1lOiBzY29wZWROYW1lLFxuXHRcdFx0XHRnZXRKU09OOiBmdW5jdGlvbihjc3NGaWxlTmFtZTogc3RyaW5nLCBqc29uOiBhbnkpIHtcblx0XHRcdFx0XHRjb25zdCBvdXRwdXRQYXRoID0gcGF0aC5yZXNvbHZlKGRlc3QsIHBhdGgucmVsYXRpdmUoY3dkLCBjc3NGaWxlTmFtZSkpO1xuXHRcdFx0XHRcdGNvbnN0IG5ld0ZpbGVQYXRoID0gb3V0cHV0UGF0aCArICcuanMnO1xuXHRcdFx0XHRcdGNvbnN0IHRoZW1lS2V5ID0gJyBfa2V5Jztcblx0XHRcdFx0XHRqc29uW3RoZW1lS2V5XSA9ICdkb2pvLScgKyBwYXRoLmJhc2VuYW1lKG91dHB1dFBhdGgsICcuY3NzJyk7XG5cdFx0XHRcdFx0ZnMud3JpdGVGaWxlU3luYyhuZXdGaWxlUGF0aCwgdW1kV3JhcHBlcihKU09OLnN0cmluZ2lmeShqc29uKSkpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdF07XG5cdH1cblxuXHRjb25zdCB2YXJpYWJsZXNQcm9jZXNzb3JzOiBhbnkgPSBbXG5cdFx0cG9zdENzc0ltcG9ydCxcblx0XHRwb3N0Q3NzTmV4dCh7XG5cdFx0XHRmZWF0dXJlczoge1xuXHRcdFx0XHRjdXN0b21Qcm9wZXJ0aWVzOiB7XG5cdFx0XHRcdFx0cHJlc2VydmU6ICdjb21wdXRlZCdcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pXG5cdF07XG5cblx0ZnVuY3Rpb24gbW9kdWxlRmlsZXMoZGVzdDogc3RyaW5nKSB7XG5cdFx0cmV0dXJuIFt7XG5cdFx0XHRleHBhbmQ6IHRydWUsXG5cdFx0XHRzcmM6IFsnKiovKi5jc3MnLCAnISoqL3ZhcmlhYmxlcy5jc3MnLCAnIWNvbW1vbi9zdHlsZXMvd2lkZ2V0cy5jc3MnXSxcblx0XHRcdGRlc3Q6IGRlc3QsXG5cdFx0XHRjd2Q6ICdzcmMnXG5cdFx0fV07XG5cdH1cblxuXHRjb25zdCB2YXJpYWJsZUZpbGVzID0gW3tcblx0XHRleHBhbmQ6IHRydWUsXG5cdFx0c3JjOiAnKiovdmFyaWFibGVzLmNzcycsXG5cdFx0ZGVzdDogZGlzdERpcmVjdG9yeSxcblx0XHRjd2Q6ICdzcmMnXG5cdH1dO1xuXG5cdGdydW50LmNvbmZpZy5zZXQoJ3Bvc3Rjc3MnLCB7XG5cdFx0b3B0aW9uczoge1xuXHRcdFx0bWFwOiB0cnVlXG5cdFx0fSxcblx0XHQnbW9kdWxlcy1kZXYnOiB7XG5cdFx0XHRmaWxlczogbW9kdWxlRmlsZXMoZGV2RGlyZWN0b3J5KSxcblx0XHRcdG9wdGlvbnM6IHtcblx0XHRcdFx0cHJvY2Vzc29yczogbW9kdWxlUHJvY2Vzc29ycyhkZXZEaXJlY3RvcnksICdzcmMnKVxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0J21vZHVsZXMtZGlzdCc6IHtcblx0XHRcdGZpbGVzOiBtb2R1bGVGaWxlcyhkaXN0RGlyZWN0b3J5KSxcblx0XHRcdG9wdGlvbnM6IHtcblx0XHRcdFx0cHJvY2Vzc29yczogbW9kdWxlUHJvY2Vzc29ycyhkaXN0RGlyZWN0b3J5LCAnc3JjJylcblx0XHRcdH1cblx0XHR9LFxuXHRcdHZhcmlhYmxlczoge1xuXHRcdFx0ZmlsZXM6IHZhcmlhYmxlRmlsZXMsXG5cdFx0XHRvcHRpb25zOiB7XG5cdFx0XHRcdHByb2Nlc3NvcnM6IHZhcmlhYmxlc1Byb2Nlc3NvcnNcblx0XHRcdH1cblx0XHR9XG5cdH0pO1xufTtcbiJdfQ==