(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "shelljs", "./util/process", "./util/Publisher", "path", "fs"], factory);
    }
})(function (require, exports) {
    "use strict";
    var shelljs_1 = require("shelljs");
    var process_1 = require("./util/process");
    var Publisher_1 = require("./util/Publisher");
    var path_1 = require("path");
    var fs_1 = require("fs");
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
            // Throw when any shelljs command fails
            shelljs_1.config.fatal = true;
            var options = this.options({});
            var publishOptions = Object.assign({
                log: grunt.log,
                subDirectory: ''
            }, options.publishOptions || {});
            options.out = grunt.option('doc-dir') || options.out || grunt.config.get('apiDocDirectory');
            // Use project-local typedoc
            var typedoc = require.resolve('typedoc/bin/typedoc');
            grunt.log.writeln("Building API Docs to \"" + options.out + "\"");
            process_1.exec("node \"" + typedoc + "\" " + typedocOptions(options).join(' '));
            // Publish
            var publishMode = (typeof publishOptions.publishMode === 'function') ? publishOptions.publishMode() :
                publishOptions.publishMode;
            if (publishMode) {
                var cloneDir = grunt.config.get('apiPubDirectory');
                var publisher = new Publisher_1.default(cloneDir, publishOptions);
                publisher.init();
                var apiDocTarget = path_1.join(cloneDir, publishOptions.subDirectory);
                grunt.log.writeln("copying " + options.out + " to " + apiDocTarget);
                shelljs_1.rm('-rf', apiDocTarget);
                shelljs_1.cp('-r', options.out, apiDocTarget);
                // Add a .nojekyll file to prevent GitHub pages from trying to parse files starting with an underscore
                // @see https://github.com/blog/572-bypassing-jekyll-on-github-pages
                var nojekyll = path_1.join(cloneDir, '.nojekyll');
                if (!fs_1.existsSync(nojekyll)) {
                    shelljs_1.touch(nojekyll);
                }
                if (publisher.commit()) {
                    if (publishMode === 'publish') {
                        publisher.publish();
                    }
                    else {
                        grunt.log.writeln('Only committing -- skipping push to repo');
                    }
                }
            }
        });
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZWRvYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInR5cGVkb2MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztJQUNBLG1DQUFnRDtJQUNoRCwwQ0FBc0M7SUFDdEMsOENBQXlDO0lBQ3pDLDZCQUE0QjtJQUM1Qix5QkFBZ0M7SUFFaEM7Ozs7T0FJRztJQUNILHdCQUF3QixPQUFZO1FBQ25DLElBQU0sSUFBSSxHQUFhLEVBQUUsQ0FBQztRQUMxQixNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxVQUFBLEdBQUc7WUFDOUIsTUFBTSxDQUFDLEdBQUcsS0FBSyxnQkFBZ0IsQ0FBQztRQUNqQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQSxHQUFHO1lBQ2IsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDbEIsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFLLEdBQUssQ0FBQyxDQUFDO2dCQUV0QixFQUFFLENBQUMsQ0FBQyxPQUFPLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDO29CQUN2QyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQUksT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFHLENBQUMsQ0FBQztnQkFDaEMsQ0FBQztZQUNGLENBQUM7UUFDRixDQUFDLENBQUMsQ0FBQztRQUNILE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDYixDQUFDO0lBRUQsT0FBUyxVQUFVLEtBQWE7UUFDL0IsS0FBSyxDQUFDLFlBQVksQ0FBQyxTQUFTLEVBQUU7WUFDN0IsdUNBQXVDO1lBQ3ZDLGdCQUFNLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztZQUVwQixJQUFNLE9BQU8sR0FBUSxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ3RDLElBQU0sY0FBYyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUM7Z0JBQ3BDLEdBQUcsRUFBRSxLQUFLLENBQUMsR0FBRztnQkFDZCxZQUFZLEVBQUUsRUFBRTthQUNoQixFQUFFLE9BQU8sQ0FBQyxjQUFjLElBQUksRUFBRSxDQUFDLENBQUM7WUFDakMsT0FBTyxDQUFDLEdBQUcsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFTLFNBQVMsQ0FBQyxJQUFJLE9BQU8sQ0FBQyxHQUFHLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQVMsaUJBQWlCLENBQUMsQ0FBQztZQUU1Ryw0QkFBNEI7WUFDNUIsSUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO1lBQ3ZELEtBQUssQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLDRCQUEwQixPQUFPLENBQUMsR0FBRyxPQUFJLENBQUMsQ0FBQztZQUM3RCxjQUFJLENBQUMsWUFBVSxPQUFPLFdBQU8sY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUksQ0FBQyxDQUFDO1lBRW5FLFVBQVU7WUFDVixJQUFNLFdBQVcsR0FBRyxDQUFDLE9BQU8sY0FBYyxDQUFDLFdBQVcsS0FBSyxVQUFVLENBQUMsR0FBRyxjQUFjLENBQUMsV0FBVyxFQUFFO2dCQUNwRyxjQUFjLENBQUMsV0FBVyxDQUFDO1lBQzVCLEVBQUUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7Z0JBQ2pCLElBQU0sUUFBUSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFTLGlCQUFpQixDQUFDLENBQUM7Z0JBQzdELElBQU0sU0FBUyxHQUFHLElBQUksbUJBQVMsQ0FBQyxRQUFRLEVBQUUsY0FBYyxDQUFDLENBQUM7Z0JBQzFELFNBQVMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztnQkFFakIsSUFBTSxZQUFZLEdBQUcsV0FBSSxDQUFDLFFBQVEsRUFBRSxjQUFjLENBQUMsWUFBWSxDQUFDLENBQUM7Z0JBQ2pFLEtBQUssQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLGFBQVksT0FBTyxDQUFDLEdBQUcsWUFBUyxZQUFlLENBQUMsQ0FBQztnQkFDbkUsWUFBRSxDQUFDLEtBQUssRUFBRSxZQUFZLENBQUMsQ0FBQztnQkFDeEIsWUFBRSxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsR0FBRyxFQUFFLFlBQVksQ0FBQyxDQUFDO2dCQUVwQyxzR0FBc0c7Z0JBQ3RHLG9FQUFvRTtnQkFDcEUsSUFBTSxRQUFRLEdBQUcsV0FBSSxDQUFDLFFBQVEsRUFBRSxXQUFXLENBQUMsQ0FBQztnQkFDN0MsRUFBRSxDQUFDLENBQUMsQ0FBQyxlQUFVLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUMzQixlQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBQ2pCLENBQUM7Z0JBRUQsRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQztvQkFDeEIsRUFBRSxDQUFDLENBQUMsV0FBVyxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUM7d0JBQy9CLFNBQVMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztvQkFDckIsQ0FBQztvQkFDRCxJQUFJLENBQUMsQ0FBQzt3QkFDTCxLQUFLLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQywwQ0FBMEMsQ0FBQyxDQUFDO29CQUMvRCxDQUFDO2dCQUNGLENBQUM7WUFDRixDQUFDO1FBQ0YsQ0FBQyxDQUFDLENBQUM7SUFDSixDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgSVRhc2sgPSBncnVudC50YXNrLklUYXNrO1xuaW1wb3J0IHsgY29uZmlnLCB0b3VjaCwgY3AsIHJtIH0gZnJvbSAnc2hlbGxqcyc7XG5pbXBvcnQgeyBleGVjIH0gZnJvbSAnLi91dGlsL3Byb2Nlc3MnO1xuaW1wb3J0IFB1Ymxpc2hlciBmcm9tICcuL3V0aWwvUHVibGlzaGVyJztcbmltcG9ydCB7IGpvaW4gfSBmcm9tICdwYXRoJztcbmltcG9ydCB7IGV4aXN0c1N5bmMgfSBmcm9tICdmcyc7XG5cbi8qKlxuICogQnVpbGQgY29tbWFuZCBsaW5lIGFyZ3VtZW50cyBmb3IgdHlwZWRvYyBmcm9tIGdydW50IG9wdGlvbnNcbiAqIEBwYXJhbSBvcHRpb25zIGdydW50IG9wdGlvbnNcbiAqIEByZXR1cm4ge3N0cmluZ1tdfSBjb21tYW5kIGxpbmUgYXJndW1lbnRzIGFycmF5XG4gKi9cbmZ1bmN0aW9uIHR5cGVkb2NPcHRpb25zKG9wdGlvbnM6IGFueSkge1xuXHRjb25zdCBhcmdzOiBzdHJpbmdbXSA9IFtdO1xuXHRPYmplY3Qua2V5cyhvcHRpb25zKS5maWx0ZXIoa2V5ID0+IHtcblx0XHRyZXR1cm4ga2V5ICE9PSAncHVibGlzaE9wdGlvbnMnO1xuXHR9KS5mb3JFYWNoKGtleSA9PiB7XG5cdFx0aWYgKG9wdGlvbnNba2V5XSkge1xuXHRcdFx0YXJncy5wdXNoKGAtLSR7a2V5fWApO1xuXG5cdFx0XHRpZiAodHlwZW9mIG9wdGlvbnNba2V5XSAhPT0gJ2Jvb2xlYW4nKSB7XG5cdFx0XHRcdGFyZ3MucHVzaChgXCIke29wdGlvbnNba2V5XX1cImApO1xuXHRcdFx0fVxuXHRcdH1cblx0fSk7XG5cdHJldHVybiBhcmdzO1xufVxuXG5leHBvcnQgPSBmdW5jdGlvbiAoZ3J1bnQ6IElHcnVudCkge1xuXHRncnVudC5yZWdpc3RlclRhc2soJ3R5cGVkb2MnLCBmdW5jdGlvbiAodGhpczogSVRhc2spIHtcblx0XHQvLyBUaHJvdyB3aGVuIGFueSBzaGVsbGpzIGNvbW1hbmQgZmFpbHNcblx0XHRjb25maWcuZmF0YWwgPSB0cnVlO1xuXG5cdFx0Y29uc3Qgb3B0aW9uczogYW55ID0gdGhpcy5vcHRpb25zKHt9KTtcblx0XHRjb25zdCBwdWJsaXNoT3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe1xuXHRcdFx0bG9nOiBncnVudC5sb2csXG5cdFx0XHRzdWJEaXJlY3Rvcnk6ICcnXG5cdFx0fSwgb3B0aW9ucy5wdWJsaXNoT3B0aW9ucyB8fCB7fSk7XG5cdFx0b3B0aW9ucy5vdXQgPSBncnVudC5vcHRpb248c3RyaW5nPignZG9jLWRpcicpIHx8IG9wdGlvbnMub3V0IHx8IGdydW50LmNvbmZpZy5nZXQ8c3RyaW5nPignYXBpRG9jRGlyZWN0b3J5Jyk7XG5cblx0XHQvLyBVc2UgcHJvamVjdC1sb2NhbCB0eXBlZG9jXG5cdFx0Y29uc3QgdHlwZWRvYyA9IHJlcXVpcmUucmVzb2x2ZSgndHlwZWRvYy9iaW4vdHlwZWRvYycpO1xuXHRcdGdydW50LmxvZy53cml0ZWxuKGBCdWlsZGluZyBBUEkgRG9jcyB0byBcIiR7IG9wdGlvbnMub3V0IH1cImApO1xuXHRcdGV4ZWMoYG5vZGUgXCIkeyB0eXBlZG9jIH1cIiAkeyB0eXBlZG9jT3B0aW9ucyhvcHRpb25zKS5qb2luKCcgJykgfWApO1xuXG5cdFx0Ly8gUHVibGlzaFxuXHRcdGNvbnN0IHB1Ymxpc2hNb2RlID0gKHR5cGVvZiBwdWJsaXNoT3B0aW9ucy5wdWJsaXNoTW9kZSA9PT0gJ2Z1bmN0aW9uJykgPyBwdWJsaXNoT3B0aW9ucy5wdWJsaXNoTW9kZSgpIDpcblx0XHRcdHB1Ymxpc2hPcHRpb25zLnB1Ymxpc2hNb2RlO1xuXHRcdGlmIChwdWJsaXNoTW9kZSkge1xuXHRcdFx0Y29uc3QgY2xvbmVEaXIgPSBncnVudC5jb25maWcuZ2V0PHN0cmluZz4oJ2FwaVB1YkRpcmVjdG9yeScpO1xuXHRcdFx0Y29uc3QgcHVibGlzaGVyID0gbmV3IFB1Ymxpc2hlcihjbG9uZURpciwgcHVibGlzaE9wdGlvbnMpO1xuXHRcdFx0cHVibGlzaGVyLmluaXQoKTtcblxuXHRcdFx0Y29uc3QgYXBpRG9jVGFyZ2V0ID0gam9pbihjbG9uZURpciwgcHVibGlzaE9wdGlvbnMuc3ViRGlyZWN0b3J5KTtcblx0XHRcdGdydW50LmxvZy53cml0ZWxuKGBjb3B5aW5nICR7IG9wdGlvbnMub3V0IH0gdG8gJHsgYXBpRG9jVGFyZ2V0IH1gKTtcblx0XHRcdHJtKCctcmYnLCBhcGlEb2NUYXJnZXQpO1xuXHRcdFx0Y3AoJy1yJywgb3B0aW9ucy5vdXQsIGFwaURvY1RhcmdldCk7XG5cblx0XHRcdC8vIEFkZCBhIC5ub2pla3lsbCBmaWxlIHRvIHByZXZlbnQgR2l0SHViIHBhZ2VzIGZyb20gdHJ5aW5nIHRvIHBhcnNlIGZpbGVzIHN0YXJ0aW5nIHdpdGggYW4gdW5kZXJzY29yZVxuXHRcdFx0Ly8gQHNlZSBodHRwczovL2dpdGh1Yi5jb20vYmxvZy81NzItYnlwYXNzaW5nLWpla3lsbC1vbi1naXRodWItcGFnZXNcblx0XHRcdGNvbnN0IG5vamVreWxsID0gam9pbihjbG9uZURpciwgJy5ub2pla3lsbCcpO1xuXHRcdFx0aWYgKCFleGlzdHNTeW5jKG5vamVreWxsKSkge1xuXHRcdFx0XHR0b3VjaChub2pla3lsbCk7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChwdWJsaXNoZXIuY29tbWl0KCkpIHtcblx0XHRcdFx0aWYgKHB1Ymxpc2hNb2RlID09PSAncHVibGlzaCcpIHtcblx0XHRcdFx0XHRwdWJsaXNoZXIucHVibGlzaCgpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdGdydW50LmxvZy53cml0ZWxuKCdPbmx5IGNvbW1pdHRpbmcgLS0gc2tpcHBpbmcgcHVzaCB0byByZXBvJyk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH0pO1xufTtcbiJdfQ==