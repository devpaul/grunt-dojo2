(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "child_process"], factory);
    }
})(function (require, exports) {
    "use strict";
    var child_process_1 = require("child_process");
    return function (grunt, packageJson) {
        grunt.registerTask('peerDepInstall', function () {
            var peerDeps = packageJson.peerDependencies;
            var packageCmd = 'npm install';
            for (var name_1 in peerDeps) {
                grunt.log.write("installing peer dependency " + name_1 + " with version " + peerDeps[name_1] + "...");
                try {
                    var cmd = packageCmd + " " + name_1 + "@\"" + peerDeps[name_1] + "\"";
                    child_process_1.execSync(cmd, { stdio: 'ignore' });
                    grunt.log.ok('complete.');
                }
                catch (error) {
                    grunt.log.verbose.error(error);
                    grunt.log.error('failed.');
                }
            }
        });
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5zdGFsbFBlZXJEZXBlbmRlbmNpZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnN0YWxsUGVlckRlcGVuZGVuY2llcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0lBQUEsK0NBQWlEO0lBRWpELE9BQVMsVUFBUyxLQUFhLEVBQUUsV0FBZ0I7UUFDaEQsS0FBSyxDQUFDLFlBQVksQ0FBQyxnQkFBZ0IsRUFBUTtZQUMxQyxJQUFNLFFBQVEsR0FBRyxXQUFXLENBQUMsZ0JBQWdCLENBQUM7WUFDOUMsSUFBSSxVQUFVLEdBQUcsYUFBYSxDQUFDO1lBRS9CLEdBQUcsQ0FBQyxDQUFDLElBQUksTUFBSSxJQUFJLFFBQVEsQ0FBQyxDQUFDLENBQUM7Z0JBQzNCLEtBQUssQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLGdDQUE4QixNQUFJLHNCQUFpQixRQUFRLENBQUMsTUFBSSxDQUFDLFFBQUssQ0FBQyxDQUFDO2dCQUN4RixJQUFJLENBQUM7b0JBQ0osSUFBSSxHQUFHLEdBQU0sVUFBVSxTQUFJLE1BQUksV0FBSyxRQUFRLENBQUMsTUFBSSxDQUFDLE9BQUcsQ0FBQztvQkFDdEQsd0JBQUksQ0FBQyxHQUFHLEVBQUUsRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQztvQkFDL0IsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsV0FBVyxDQUFDLENBQUM7Z0JBQzNCLENBQUM7Z0JBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztvQkFDaEIsS0FBSyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUMvQixLQUFLLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQztnQkFDNUIsQ0FBQztZQUNGLENBQUM7UUFDRixDQUFDLENBQUMsQ0FBQztJQUNKLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGV4ZWNTeW5jIGFzIGV4ZWMgfSBmcm9tICdjaGlsZF9wcm9jZXNzJztcblxuZXhwb3J0ID0gZnVuY3Rpb24oZ3J1bnQ6IElHcnVudCwgcGFja2FnZUpzb246IGFueSkge1xuXHRncnVudC5yZWdpc3RlclRhc2soJ3BlZXJEZXBJbnN0YWxsJywgPGFueT4gZnVuY3Rpb24gKCkge1xuXHRcdGNvbnN0IHBlZXJEZXBzID0gcGFja2FnZUpzb24ucGVlckRlcGVuZGVuY2llcztcblx0XHRsZXQgcGFja2FnZUNtZCA9ICducG0gaW5zdGFsbCc7XG5cblx0XHRmb3IgKGxldCBuYW1lIGluIHBlZXJEZXBzKSB7XG5cdFx0XHRncnVudC5sb2cud3JpdGUoYGluc3RhbGxpbmcgcGVlciBkZXBlbmRlbmN5ICR7bmFtZX0gd2l0aCB2ZXJzaW9uICR7cGVlckRlcHNbbmFtZV19Li4uYCk7XG5cdFx0XHR0cnkge1xuXHRcdFx0XHRsZXQgY21kID0gYCR7cGFja2FnZUNtZH0gJHtuYW1lfUBcIiR7cGVlckRlcHNbbmFtZV19XCJgO1xuXHRcdFx0XHRleGVjKGNtZCwgeyBzdGRpbzogJ2lnbm9yZScgfSk7XG5cdFx0XHRcdGdydW50LmxvZy5vaygnY29tcGxldGUuJyk7XG5cdFx0XHR9IGNhdGNoIChlcnJvcikge1xuXHRcdFx0XHRncnVudC5sb2cudmVyYm9zZS5lcnJvcihlcnJvcik7XG5cdFx0XHRcdGdydW50LmxvZy5lcnJvcignZmFpbGVkLicpO1xuXHRcdFx0fVxuXHRcdH1cblx0fSk7XG59O1xuIl19