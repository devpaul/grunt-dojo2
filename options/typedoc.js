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
    return function (_grunt) {
        return {
            options: {
                // All options but publishOptions are passed directly to the typedoc command line.
                mode: 'modules',
                externalPattern: '**/+(example|examples|node_modules|tests|typings)/**/*.ts',
                // TODO: A dummy exclude pattern is required for typedoc 0.5.6
                exclude: '_',
                excludeExternals: true,
                excludeNotExported: true,
                includeDeclarations: true,
                // publishOptions are only used when publishing the generate API docs
                publishOptions: {
                    branch: 'gh-pages',
                    deployKey: 'deploy_key',
                    subDirectory: 'api',
                    publishMode: function () {
                        // Require that the API doc deployment is explicitly requested in an environment variable
                        // this allows us to turn it off without needing to make a commit and allows forking repos
                        // to select their own settings without changing code
                        var deploy = process.env.DEPLOY_DOCS;
                        return process.env.TRAVIS_BRANCH === 'master' && deploy;
                    }
                }
            }
        };
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZWRvYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInR5cGVkb2MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztJQUFBLE9BQVMsVUFBVSxNQUFjO1FBQ2hDLE1BQU0sQ0FBQztZQUNOLE9BQU8sRUFBRTtnQkFDUixrRkFBa0Y7Z0JBQ2xGLElBQUksRUFBRSxTQUFTO2dCQUNmLGVBQWUsRUFBRSwyREFBMkQ7Z0JBQzVFLDhEQUE4RDtnQkFDOUQsT0FBTyxFQUFFLEdBQUc7Z0JBQ1osZ0JBQWdCLEVBQUUsSUFBSTtnQkFDdEIsa0JBQWtCLEVBQUUsSUFBSTtnQkFDeEIsbUJBQW1CLEVBQUUsSUFBSTtnQkFFekIscUVBQXFFO2dCQUNyRSxjQUFjLEVBQUU7b0JBQ2YsTUFBTSxFQUFFLFVBQVU7b0JBQ2xCLFNBQVMsRUFBRSxZQUFZO29CQUN2QixZQUFZLEVBQUUsS0FBSztvQkFDbkIsV0FBVzt3QkFDVix5RkFBeUY7d0JBQ3pGLDBGQUEwRjt3QkFDMUYscURBQXFEO3dCQUNyRCxJQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQzt3QkFDdkMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsYUFBYSxLQUFLLFFBQVEsSUFBSSxNQUFNLENBQUM7b0JBQ3pELENBQUM7aUJBQ0Q7YUFDRDtTQUNELENBQUM7SUFDSCxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgPSBmdW5jdGlvbiAoX2dydW50OiBJR3J1bnQpIHtcblx0cmV0dXJuIHtcblx0XHRvcHRpb25zOiB7XG5cdFx0XHQvLyBBbGwgb3B0aW9ucyBidXQgcHVibGlzaE9wdGlvbnMgYXJlIHBhc3NlZCBkaXJlY3RseSB0byB0aGUgdHlwZWRvYyBjb21tYW5kIGxpbmUuXG5cdFx0XHRtb2RlOiAnbW9kdWxlcycsXG5cdFx0XHRleHRlcm5hbFBhdHRlcm46ICcqKi8rKGV4YW1wbGV8ZXhhbXBsZXN8bm9kZV9tb2R1bGVzfHRlc3RzfHR5cGluZ3MpLyoqLyoudHMnLFxuXHRcdFx0Ly8gVE9ETzogQSBkdW1teSBleGNsdWRlIHBhdHRlcm4gaXMgcmVxdWlyZWQgZm9yIHR5cGVkb2MgMC41LjZcblx0XHRcdGV4Y2x1ZGU6ICdfJyxcblx0XHRcdGV4Y2x1ZGVFeHRlcm5hbHM6IHRydWUsXG5cdFx0XHRleGNsdWRlTm90RXhwb3J0ZWQ6IHRydWUsXG5cdFx0XHRpbmNsdWRlRGVjbGFyYXRpb25zOiB0cnVlLFxuXG5cdFx0XHQvLyBwdWJsaXNoT3B0aW9ucyBhcmUgb25seSB1c2VkIHdoZW4gcHVibGlzaGluZyB0aGUgZ2VuZXJhdGUgQVBJIGRvY3Ncblx0XHRcdHB1Ymxpc2hPcHRpb25zOiB7XG5cdFx0XHRcdGJyYW5jaDogJ2doLXBhZ2VzJyxcblx0XHRcdFx0ZGVwbG95S2V5OiAnZGVwbG95X2tleScsXG5cdFx0XHRcdHN1YkRpcmVjdG9yeTogJ2FwaScsXG5cdFx0XHRcdHB1Ymxpc2hNb2RlKCkge1xuXHRcdFx0XHRcdC8vIFJlcXVpcmUgdGhhdCB0aGUgQVBJIGRvYyBkZXBsb3ltZW50IGlzIGV4cGxpY2l0bHkgcmVxdWVzdGVkIGluIGFuIGVudmlyb25tZW50IHZhcmlhYmxlXG5cdFx0XHRcdFx0Ly8gdGhpcyBhbGxvd3MgdXMgdG8gdHVybiBpdCBvZmYgd2l0aG91dCBuZWVkaW5nIHRvIG1ha2UgYSBjb21taXQgYW5kIGFsbG93cyBmb3JraW5nIHJlcG9zXG5cdFx0XHRcdFx0Ly8gdG8gc2VsZWN0IHRoZWlyIG93biBzZXR0aW5ncyB3aXRob3V0IGNoYW5naW5nIGNvZGVcblx0XHRcdFx0XHRjb25zdCBkZXBsb3kgPSBwcm9jZXNzLmVudi5ERVBMT1lfRE9DUztcblx0XHRcdFx0XHRyZXR1cm4gcHJvY2Vzcy5lbnYuVFJBVklTX0JSQU5DSCA9PT0gJ21hc3RlcicgJiYgZGVwbG95O1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xufTtcbiJdfQ==