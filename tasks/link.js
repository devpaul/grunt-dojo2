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
    return function (grunt, packageJson) {
        var execa = require('execa');
        var fs = require('fs');
        var path = require('path');
        var process = require('process');
        var pkgDir = require('pkg-dir');
        grunt.registerTask('_link', '', function () {
            var done = this.async();
            var packagePath = pkgDir.sync(process.cwd());
            var targetPath = grunt.config('distDirectory');
            fs.symlink(path.join(packagePath, 'node_modules'), path.join(targetPath, 'node_modules'), 'junction', function () { });
            fs.symlink(path.join(packagePath, 'package.json'), path.join(targetPath, 'package.json'), 'file', function () { });
            execa.shell('npm link', { cwd: targetPath })
                .then(function (result) { return grunt.log.ok(result.stdout); })
                .then(done);
        });
        grunt.registerTask('link', 'link', function () {
            var targetPath = grunt.config('distDirectory');
            var dirExists = grunt.file.isDir(targetPath);
            var tasks = ['_link'];
            if (!dirExists) {
                tasks.unshift('dist');
            }
            grunt.task.run(tasks);
        });
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGluay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImxpbmsudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztJQUVBLE9BQVMsVUFBUyxLQUFhLEVBQUUsV0FBZ0I7UUFDaEQsSUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQy9CLElBQU0sRUFBRSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN6QixJQUFNLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDN0IsSUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ25DLElBQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUVsQyxLQUFLLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxFQUFFLEVBQUU7WUFDL0IsSUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQzFCLElBQU0sV0FBVyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7WUFDL0MsSUFBTSxVQUFVLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUMsQ0FBQztZQUVqRCxFQUFFLENBQUMsT0FBTyxDQUNULElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLGNBQWMsQ0FBQyxFQUN0QyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxjQUFjLENBQUMsRUFDckMsVUFBVSxFQUNWLGNBQU8sQ0FBQyxDQUNSLENBQUM7WUFDRixFQUFFLENBQUMsT0FBTyxDQUNULElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLGNBQWMsQ0FBQyxFQUN0QyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxjQUFjLENBQUMsRUFDckMsTUFBTSxFQUNOLGNBQU8sQ0FBQyxDQUNSLENBQUM7WUFFRixLQUFLLENBQUMsS0FBSyxDQUFDLFVBQVUsRUFBRSxFQUFFLEdBQUcsRUFBRSxVQUFVLEVBQUUsQ0FBQztpQkFDMUMsSUFBSSxDQUFDLFVBQUMsTUFBVyxJQUFLLE9BQUEsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUEzQixDQUEyQixDQUFDO2lCQUNsRCxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDZCxDQUFDLENBQUMsQ0FBQztRQUVILEtBQUssQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRTtZQUNsQyxJQUFNLFVBQVUsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxDQUFDO1lBQ2pELElBQU0sU0FBUyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQy9DLElBQU0sS0FBSyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDeEIsRUFBRSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO2dCQUNoQixLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3ZCLENBQUM7WUFDRCxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN2QixDQUFDLENBQUMsQ0FBQztJQUNKLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBJVGFzayA9IGdydW50LnRhc2suSVRhc2s7XG5cbmV4cG9ydCA9IGZ1bmN0aW9uKGdydW50OiBJR3J1bnQsIHBhY2thZ2VKc29uOiBhbnkpIHtcblx0Y29uc3QgZXhlY2EgPSByZXF1aXJlKCdleGVjYScpO1xuXHRjb25zdCBmcyA9IHJlcXVpcmUoJ2ZzJyk7XG5cdGNvbnN0IHBhdGggPSByZXF1aXJlKCdwYXRoJyk7XG5cdGNvbnN0IHByb2Nlc3MgPSByZXF1aXJlKCdwcm9jZXNzJyk7XG5cdGNvbnN0IHBrZ0RpciA9IHJlcXVpcmUoJ3BrZy1kaXInKTtcblxuXHRncnVudC5yZWdpc3RlclRhc2soJ19saW5rJywgJycsIGZ1bmN0aW9uICh0aGlzOiBJVGFzaykge1xuXHRcdGNvbnN0IGRvbmUgPSB0aGlzLmFzeW5jKCk7XG5cdFx0Y29uc3QgcGFja2FnZVBhdGggPSBwa2dEaXIuc3luYyhwcm9jZXNzLmN3ZCgpKTtcblx0XHRjb25zdCB0YXJnZXRQYXRoID0gZ3J1bnQuY29uZmlnKCdkaXN0RGlyZWN0b3J5Jyk7XG5cblx0XHRmcy5zeW1saW5rKFxuXHRcdFx0cGF0aC5qb2luKHBhY2thZ2VQYXRoLCAnbm9kZV9tb2R1bGVzJyksXG5cdFx0XHRwYXRoLmpvaW4odGFyZ2V0UGF0aCwgJ25vZGVfbW9kdWxlcycpLFxuXHRcdFx0J2p1bmN0aW9uJyxcblx0XHRcdCgpID0+IHt9XG5cdFx0KTtcblx0XHRmcy5zeW1saW5rKFxuXHRcdFx0cGF0aC5qb2luKHBhY2thZ2VQYXRoLCAncGFja2FnZS5qc29uJyksXG5cdFx0XHRwYXRoLmpvaW4odGFyZ2V0UGF0aCwgJ3BhY2thZ2UuanNvbicpLFxuXHRcdFx0J2ZpbGUnLFxuXHRcdFx0KCkgPT4ge31cblx0XHQpO1xuXG5cdFx0ZXhlY2Euc2hlbGwoJ25wbSBsaW5rJywgeyBjd2Q6IHRhcmdldFBhdGggfSlcblx0XHRcdC50aGVuKChyZXN1bHQ6IGFueSkgPT4gZ3J1bnQubG9nLm9rKHJlc3VsdC5zdGRvdXQpKVxuXHRcdFx0LnRoZW4oZG9uZSk7XG5cdH0pO1xuXG5cdGdydW50LnJlZ2lzdGVyVGFzaygnbGluaycsICdsaW5rJywgZnVuY3Rpb24gKCkge1xuXHRcdGNvbnN0IHRhcmdldFBhdGggPSBncnVudC5jb25maWcoJ2Rpc3REaXJlY3RvcnknKTtcblx0XHRjb25zdCBkaXJFeGlzdHMgPSBncnVudC5maWxlLmlzRGlyKHRhcmdldFBhdGgpO1xuXHRcdGNvbnN0IHRhc2tzID0gWydfbGluayddO1xuXHRcdGlmICghZGlyRXhpc3RzKSB7XG5cdFx0XHR0YXNrcy51bnNoaWZ0KCdkaXN0Jyk7XG5cdFx0fVxuXHRcdGdydW50LnRhc2sucnVuKHRhc2tzKTtcblx0fSk7XG59O1xuIl19