(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../lib/load-dojo-loader"], factory);
    }
})(function (require, exports) {
    "use strict";
    var repl = require('repl');
    var load_dojo_loader_1 = require("../lib/load-dojo-loader");
    var resolveFrom = require('resolve-from');
    return function (grunt, packageJson) {
        grunt.registerTask('repl', 'Bootstrap dojo-loader and start a Node.js REPL', function () {
            this.async(); // Ensure Grunt doesn't exit the process.
            var _a = load_dojo_loader_1.default(packageJson), baseUrl = _a.baseUrl, packages = _a.packages, dojoRequire = _a.require;
            var nodeRequire = function (mid) {
                // Require relative to the baseUrl, not this module.
                return require(resolveFrom(baseUrl, mid));
            };
            Object.defineProperty(nodeRequire, 'resolve', {
                configurable: false,
                enumerable: true,
                value: function (mid) {
                    return resolveFrom(baseUrl, mid);
                }
            });
            grunt.log.ok("Available packages: " + packages.map(function (_a) {
                var name = _a.name;
                return name;
            }).join(', '));
            grunt.log.ok('require() is now powered by dojo-loader');
            grunt.log.ok('Node.js\' require() is available under nodeRequire()');
            var context = repl.start().context;
            Object.defineProperties(context, {
                nodeRequire: {
                    configurable: false,
                    enumerable: true,
                    value: nodeRequire
                },
                require: {
                    configurable: false,
                    enumerable: true,
                    value: dojoRequire
                }
            });
        });
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVwbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInJlcGwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztJQUVBLElBQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUU3Qiw0REFBcUQ7SUFFckQsSUFBTSxXQUFXLEdBQUcsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0lBRTVDLE9BQVMsVUFBUyxLQUFhLEVBQUUsV0FBZ0I7UUFDaEQsS0FBSyxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUUsZ0RBQWdELEVBQUU7WUFDNUUsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMseUNBQXlDO1lBRWpELElBQUEsNENBQXlFLEVBQXZFLG9CQUFPLEVBQUUsc0JBQVEsRUFBRSx3QkFBb0IsQ0FBaUM7WUFFaEYsSUFBTSxXQUFXLEdBQUcsVUFBVSxHQUFXO2dCQUN4QyxvREFBb0Q7Z0JBQ3BELE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQzNDLENBQUMsQ0FBQztZQUNGLE1BQU0sQ0FBQyxjQUFjLENBQUMsV0FBVyxFQUFFLFNBQVMsRUFBRTtnQkFDN0MsWUFBWSxFQUFFLEtBQUs7Z0JBQ25CLFVBQVUsRUFBRSxJQUFJO2dCQUNoQixLQUFLLFlBQUUsR0FBVztvQkFDakIsTUFBTSxDQUFDLFdBQVcsQ0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLENBQUM7Z0JBQ2xDLENBQUM7YUFDRCxDQUFDLENBQUM7WUFFSCxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyx5QkFBdUIsUUFBUSxDQUFDLEdBQUcsQ0FBQyxVQUFDLEVBQVE7b0JBQU4sY0FBSTtnQkFBTyxPQUFBLElBQUk7WUFBSixDQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFHLENBQUMsQ0FBQztZQUNuRixLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyx5Q0FBeUMsQ0FBQyxDQUFDO1lBQ3hELEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLHNEQUFzRCxDQUFDLENBQUM7WUFFN0QsSUFBQSw4QkFBTyxDQUFrQjtZQUNqQyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFO2dCQUNoQyxXQUFXLEVBQUU7b0JBQ1osWUFBWSxFQUFFLEtBQUs7b0JBQ25CLFVBQVUsRUFBRSxJQUFJO29CQUNoQixLQUFLLEVBQUUsV0FBVztpQkFDbEI7Z0JBQ0QsT0FBTyxFQUFFO29CQUNSLFlBQVksRUFBRSxLQUFLO29CQUNuQixVQUFVLEVBQUUsSUFBSTtvQkFDaEIsS0FBSyxFQUFFLFdBQVc7aUJBQ2xCO2FBQ0QsQ0FBQyxDQUFDO1FBQ0osQ0FBQyxDQUFDLENBQUM7SUFDSixDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgSVRhc2sgPSBncnVudC50YXNrLklUYXNrO1xuXG5jb25zdCByZXBsID0gcmVxdWlyZSgncmVwbCcpO1xuXG5pbXBvcnQgbG9hZERvam9Mb2FkZXIgZnJvbSAnLi4vbGliL2xvYWQtZG9qby1sb2FkZXInO1xuXG5jb25zdCByZXNvbHZlRnJvbSA9IHJlcXVpcmUoJ3Jlc29sdmUtZnJvbScpO1xuXG5leHBvcnQgPSBmdW5jdGlvbihncnVudDogSUdydW50LCBwYWNrYWdlSnNvbjogYW55KSB7XG5cdGdydW50LnJlZ2lzdGVyVGFzaygncmVwbCcsICdCb290c3RyYXAgZG9qby1sb2FkZXIgYW5kIHN0YXJ0IGEgTm9kZS5qcyBSRVBMJywgZnVuY3Rpb24gKHRoaXM6IElUYXNrKSB7XG5cdFx0dGhpcy5hc3luYygpOyAvLyBFbnN1cmUgR3J1bnQgZG9lc24ndCBleGl0IHRoZSBwcm9jZXNzLlxuXG5cdFx0Y29uc3QgeyBiYXNlVXJsLCBwYWNrYWdlcywgcmVxdWlyZTogZG9qb1JlcXVpcmUgfSA9IGxvYWREb2pvTG9hZGVyKHBhY2thZ2VKc29uKTtcblxuXHRcdGNvbnN0IG5vZGVSZXF1aXJlID0gZnVuY3Rpb24gKG1pZDogc3RyaW5nKSB7XG5cdFx0XHQvLyBSZXF1aXJlIHJlbGF0aXZlIHRvIHRoZSBiYXNlVXJsLCBub3QgdGhpcyBtb2R1bGUuXG5cdFx0XHRyZXR1cm4gcmVxdWlyZShyZXNvbHZlRnJvbShiYXNlVXJsLCBtaWQpKTtcblx0XHR9O1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShub2RlUmVxdWlyZSwgJ3Jlc29sdmUnLCB7XG5cdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuXHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcblx0XHRcdHZhbHVlIChtaWQ6IHN0cmluZykge1xuXHRcdFx0XHRyZXR1cm4gcmVzb2x2ZUZyb20oYmFzZVVybCwgbWlkKTtcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdGdydW50LmxvZy5vayhgQXZhaWxhYmxlIHBhY2thZ2VzOiAke3BhY2thZ2VzLm1hcCgoeyBuYW1lIH0pID0+IG5hbWUpLmpvaW4oJywgJyl9YCk7XG5cdFx0Z3J1bnQubG9nLm9rKCdyZXF1aXJlKCkgaXMgbm93IHBvd2VyZWQgYnkgZG9qby1sb2FkZXInKTtcblx0XHRncnVudC5sb2cub2soJ05vZGUuanNcXCcgcmVxdWlyZSgpIGlzIGF2YWlsYWJsZSB1bmRlciBub2RlUmVxdWlyZSgpJyk7XG5cblx0XHRjb25zdCB7IGNvbnRleHQgfSA9IHJlcGwuc3RhcnQoKTtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydGllcyhjb250ZXh0LCB7XG5cdFx0XHRub2RlUmVxdWlyZToge1xuXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuXHRcdFx0XHR2YWx1ZTogbm9kZVJlcXVpcmVcblx0XHRcdH0sXG5cdFx0XHRyZXF1aXJlOiB7XG5cdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG5cdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG5cdFx0XHRcdHZhbHVlOiBkb2pvUmVxdWlyZVxuXHRcdFx0fVxuXHRcdH0pO1xuXHR9KTtcbn07XG4iXX0=