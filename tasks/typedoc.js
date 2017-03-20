(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "shelljs", "./util/exec", "./util/Publisher", "path"], factory);
    }
})(function (require, exports) {
    "use strict";
    var shelljs_1 = require("shelljs");
    var exec_1 = require("./util/exec");
    var Publisher_1 = require("./util/Publisher");
    var path_1 = require("path");
    /**
     * Build command line arguments for typedoc from grunt options
     * @param options grunt options
     * @return {string[]} command line arguments array
     */
    function typedocOptions(options) {
        var args = [];
        Object.keys(options).filter(function (key) {
            return key !== 'publishOptions';
        }).forEach(function (key) {
            if (options[key]) {
                args.push("--" + key);
                if (typeof options[key] !== 'boolean') {
                    args.push("\"" + options[key] + "\"");
                }
            }
        });
        return args;
    }
    return function (grunt) {
        grunt.registerTask('typedoc', function () {
            var deploy = process.env.DEPLOY_DOCS;
            var shouldPublish = deploy === 'publish' || deploy === 'commit';
            // Throw when any shelljs command fails
            shelljs_1.config.fatal = true;
            var options = this.options({});
            var rootApiDocDirectory = grunt.config.get('apiDocDirectory');
            var outOption = grunt.option('doc-dir');
            options.out = outOption || options.out || rootApiDocDirectory;
            // Use project-local typedoc
            var typedoc = require.resolve('typedoc/bin/typedoc');
            exec_1.default("node \"" + typedoc + "\" " + typedocOptions(options).join(' '));
            // Add a .nojekyll file to prevent GitHub pages from trying to parse files starting with an underscore
            // @see https://github.com/blog/572-bypassing-jekyll-on-github-pages
            grunt.log.writeln("writing .nojekyll file to " + rootApiDocDirectory);
            shelljs_1.touch(path_1.join(rootApiDocDirectory, '.nojekyll'));
            if (shouldPublish) {
                var cloneDir = grunt.config.get('apiPubDirectory');
                var publishOptions = Object.assign({
                    log: grunt.log,
                    skipPublish: (deploy !== 'publish')
                }, options.publishOptions || {});
                var publisher = new Publisher_1.default(cloneDir, options.out, publishOptions);
                publisher.publish();
            }
        });
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZWRvYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInR5cGVkb2MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztJQUNBLG1DQUF3QztJQUN4QyxvQ0FBK0I7SUFDL0IsOENBQXlDO0lBQ3pDLDZCQUE0QjtJQUU1Qjs7OztPQUlHO0lBQ0gsd0JBQXdCLE9BQVk7UUFDbkMsSUFBTSxJQUFJLEdBQWEsRUFBRSxDQUFDO1FBQzFCLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsTUFBTSxDQUFDLFVBQUEsR0FBRztZQUM5QixNQUFNLENBQUMsR0FBRyxLQUFLLGdCQUFnQixDQUFDO1FBQ2pDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFBLEdBQUc7WUFDYixFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNsQixJQUFJLENBQUMsSUFBSSxDQUFDLE9BQUssR0FBSyxDQUFDLENBQUM7Z0JBRXRCLEVBQUUsQ0FBQyxDQUFDLE9BQU8sT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUM7b0JBQ3ZDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBSSxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQUcsQ0FBQyxDQUFDO2dCQUNoQyxDQUFDO1lBQ0YsQ0FBQztRQUNGLENBQUMsQ0FBQyxDQUFDO1FBQ0gsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNiLENBQUM7SUFFRCxPQUFTLFVBQVUsS0FBYTtRQUMvQixLQUFLLENBQUMsWUFBWSxDQUFDLFNBQVMsRUFBRTtZQUM3QixJQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQztZQUN2QyxJQUFNLGFBQWEsR0FBRyxNQUFNLEtBQUssU0FBUyxJQUFJLE1BQU0sS0FBSyxRQUFRLENBQUM7WUFFbEUsdUNBQXVDO1lBQ3ZDLGdCQUFNLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztZQUVwQixJQUFNLE9BQU8sR0FBUSxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ3RDLElBQU0sbUJBQW1CLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQVMsaUJBQWlCLENBQUMsQ0FBQztZQUN4RSxJQUFNLFNBQVMsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFTLFNBQVMsQ0FBQyxDQUFDO1lBQ2xELE9BQU8sQ0FBQyxHQUFHLEdBQUcsU0FBUyxJQUFJLE9BQU8sQ0FBQyxHQUFHLElBQUksbUJBQW1CLENBQUM7WUFFOUQsNEJBQTRCO1lBQzVCLElBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMscUJBQXFCLENBQUMsQ0FBQztZQUN2RCxjQUFJLENBQUMsWUFBVSxPQUFPLFdBQU8sY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUksQ0FBQyxDQUFDO1lBRW5FLHNHQUFzRztZQUN0RyxvRUFBb0U7WUFDcEUsS0FBSyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsK0JBQThCLG1CQUFzQixDQUFDLENBQUM7WUFDeEUsZUFBSyxDQUFDLFdBQUksQ0FBQyxtQkFBbUIsRUFBRSxXQUFXLENBQUMsQ0FBQyxDQUFDO1lBRTlDLEVBQUUsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7Z0JBQ25CLElBQU0sUUFBUSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFTLGlCQUFpQixDQUFDLENBQUM7Z0JBQzdELElBQU0sY0FBYyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUM7b0JBQ3BDLEdBQUcsRUFBRSxLQUFLLENBQUMsR0FBRztvQkFDZCxXQUFXLEVBQUUsQ0FBQyxNQUFNLEtBQUssU0FBUyxDQUFDO2lCQUNuQyxFQUFFLE9BQU8sQ0FBQyxjQUFjLElBQUksRUFBRSxDQUFDLENBQUM7Z0JBQ2pDLElBQU0sU0FBUyxHQUFHLElBQUksbUJBQVMsQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLEdBQUcsRUFBRSxjQUFjLENBQUMsQ0FBQztnQkFDdkUsU0FBUyxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQ3JCLENBQUM7UUFDRixDQUFDLENBQUMsQ0FBQztJQUNKLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBJVGFzayA9IGdydW50LnRhc2suSVRhc2s7XG5pbXBvcnQgeyBjb25maWcsIHRvdWNoIH0gZnJvbSAnc2hlbGxqcyc7XG5pbXBvcnQgZXhlYyBmcm9tICcuL3V0aWwvZXhlYyc7XG5pbXBvcnQgUHVibGlzaGVyIGZyb20gJy4vdXRpbC9QdWJsaXNoZXInO1xuaW1wb3J0IHsgam9pbiB9IGZyb20gJ3BhdGgnO1xuXG4vKipcbiAqIEJ1aWxkIGNvbW1hbmQgbGluZSBhcmd1bWVudHMgZm9yIHR5cGVkb2MgZnJvbSBncnVudCBvcHRpb25zXG4gKiBAcGFyYW0gb3B0aW9ucyBncnVudCBvcHRpb25zXG4gKiBAcmV0dXJuIHtzdHJpbmdbXX0gY29tbWFuZCBsaW5lIGFyZ3VtZW50cyBhcnJheVxuICovXG5mdW5jdGlvbiB0eXBlZG9jT3B0aW9ucyhvcHRpb25zOiBhbnkpIHtcblx0Y29uc3QgYXJnczogc3RyaW5nW10gPSBbXTtcblx0T2JqZWN0LmtleXMob3B0aW9ucykuZmlsdGVyKGtleSA9PiB7XG5cdFx0cmV0dXJuIGtleSAhPT0gJ3B1Ymxpc2hPcHRpb25zJztcblx0fSkuZm9yRWFjaChrZXkgPT4ge1xuXHRcdGlmIChvcHRpb25zW2tleV0pIHtcblx0XHRcdGFyZ3MucHVzaChgLS0ke2tleX1gKTtcblxuXHRcdFx0aWYgKHR5cGVvZiBvcHRpb25zW2tleV0gIT09ICdib29sZWFuJykge1xuXHRcdFx0XHRhcmdzLnB1c2goYFwiJHtvcHRpb25zW2tleV19XCJgKTtcblx0XHRcdH1cblx0XHR9XG5cdH0pO1xuXHRyZXR1cm4gYXJncztcbn1cblxuZXhwb3J0ID0gZnVuY3Rpb24gKGdydW50OiBJR3J1bnQpIHtcblx0Z3J1bnQucmVnaXN0ZXJUYXNrKCd0eXBlZG9jJywgZnVuY3Rpb24gKHRoaXM6IElUYXNrKSB7XG5cdFx0Y29uc3QgZGVwbG95ID0gcHJvY2Vzcy5lbnYuREVQTE9ZX0RPQ1M7XG5cdFx0Y29uc3Qgc2hvdWxkUHVibGlzaCA9IGRlcGxveSA9PT0gJ3B1Ymxpc2gnIHx8IGRlcGxveSA9PT0gJ2NvbW1pdCc7XG5cblx0XHQvLyBUaHJvdyB3aGVuIGFueSBzaGVsbGpzIGNvbW1hbmQgZmFpbHNcblx0XHRjb25maWcuZmF0YWwgPSB0cnVlO1xuXG5cdFx0Y29uc3Qgb3B0aW9uczogYW55ID0gdGhpcy5vcHRpb25zKHt9KTtcblx0XHRjb25zdCByb290QXBpRG9jRGlyZWN0b3J5ID0gZ3J1bnQuY29uZmlnLmdldDxzdHJpbmc+KCdhcGlEb2NEaXJlY3RvcnknKTtcblx0XHRjb25zdCBvdXRPcHRpb24gPSBncnVudC5vcHRpb248c3RyaW5nPignZG9jLWRpcicpO1xuXHRcdG9wdGlvbnMub3V0ID0gb3V0T3B0aW9uIHx8IG9wdGlvbnMub3V0IHx8IHJvb3RBcGlEb2NEaXJlY3Rvcnk7XG5cblx0XHQvLyBVc2UgcHJvamVjdC1sb2NhbCB0eXBlZG9jXG5cdFx0Y29uc3QgdHlwZWRvYyA9IHJlcXVpcmUucmVzb2x2ZSgndHlwZWRvYy9iaW4vdHlwZWRvYycpO1xuXHRcdGV4ZWMoYG5vZGUgXCIkeyB0eXBlZG9jIH1cIiAkeyB0eXBlZG9jT3B0aW9ucyhvcHRpb25zKS5qb2luKCcgJykgfWApO1xuXG5cdFx0Ly8gQWRkIGEgLm5vamVreWxsIGZpbGUgdG8gcHJldmVudCBHaXRIdWIgcGFnZXMgZnJvbSB0cnlpbmcgdG8gcGFyc2UgZmlsZXMgc3RhcnRpbmcgd2l0aCBhbiB1bmRlcnNjb3JlXG5cdFx0Ly8gQHNlZSBodHRwczovL2dpdGh1Yi5jb20vYmxvZy81NzItYnlwYXNzaW5nLWpla3lsbC1vbi1naXRodWItcGFnZXNcblx0XHRncnVudC5sb2cud3JpdGVsbihgd3JpdGluZyAubm9qZWt5bGwgZmlsZSB0byAkeyByb290QXBpRG9jRGlyZWN0b3J5IH1gKTtcblx0XHR0b3VjaChqb2luKHJvb3RBcGlEb2NEaXJlY3RvcnksICcubm9qZWt5bGwnKSk7XG5cblx0XHRpZiAoc2hvdWxkUHVibGlzaCkge1xuXHRcdFx0Y29uc3QgY2xvbmVEaXIgPSBncnVudC5jb25maWcuZ2V0PHN0cmluZz4oJ2FwaVB1YkRpcmVjdG9yeScpO1xuXHRcdFx0Y29uc3QgcHVibGlzaE9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHtcblx0XHRcdFx0bG9nOiBncnVudC5sb2csXG5cdFx0XHRcdHNraXBQdWJsaXNoOiAoZGVwbG95ICE9PSAncHVibGlzaCcpXG5cdFx0XHR9LCBvcHRpb25zLnB1Ymxpc2hPcHRpb25zIHx8IHt9KTtcblx0XHRcdGNvbnN0IHB1Ymxpc2hlciA9IG5ldyBQdWJsaXNoZXIoY2xvbmVEaXIsIG9wdGlvbnMub3V0LCBwdWJsaXNoT3B0aW9ucyk7XG5cdFx0XHRwdWJsaXNoZXIucHVibGlzaCgpO1xuXHRcdH1cblx0fSk7XG59O1xuIl19