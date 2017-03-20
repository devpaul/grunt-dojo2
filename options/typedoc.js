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
                    subdir: 'api',
                    deployKey: 'deploy_key'
                }
            }
        };
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZWRvYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInR5cGVkb2MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztJQUFBLE9BQVMsVUFBVSxNQUFjO1FBQ2hDLE1BQU0sQ0FBQztZQUNOLE9BQU8sRUFBRTtnQkFDUixrRkFBa0Y7Z0JBQ2xGLElBQUksRUFBRSxTQUFTO2dCQUNmLGVBQWUsRUFBRSwyREFBMkQ7Z0JBQzVFLDhEQUE4RDtnQkFDOUQsT0FBTyxFQUFFLEdBQUc7Z0JBQ1osZ0JBQWdCLEVBQUUsSUFBSTtnQkFDdEIsa0JBQWtCLEVBQUUsSUFBSTtnQkFDeEIsbUJBQW1CLEVBQUUsSUFBSTtnQkFFekIscUVBQXFFO2dCQUNyRSxjQUFjLEVBQUU7b0JBQ2YsTUFBTSxFQUFFLFVBQVU7b0JBQ2xCLE1BQU0sRUFBRSxLQUFLO29CQUNiLFNBQVMsRUFBRSxZQUFZO2lCQUN2QjthQUNEO1NBQ0QsQ0FBQztJQUNILENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCA9IGZ1bmN0aW9uIChfZ3J1bnQ6IElHcnVudCkge1xuXHRyZXR1cm4ge1xuXHRcdG9wdGlvbnM6IHtcblx0XHRcdC8vIEFsbCBvcHRpb25zIGJ1dCBwdWJsaXNoT3B0aW9ucyBhcmUgcGFzc2VkIGRpcmVjdGx5IHRvIHRoZSB0eXBlZG9jIGNvbW1hbmQgbGluZS5cblx0XHRcdG1vZGU6ICdtb2R1bGVzJyxcblx0XHRcdGV4dGVybmFsUGF0dGVybjogJyoqLysoZXhhbXBsZXxleGFtcGxlc3xub2RlX21vZHVsZXN8dGVzdHN8dHlwaW5ncykvKiovKi50cycsXG5cdFx0XHQvLyBUT0RPOiBBIGR1bW15IGV4Y2x1ZGUgcGF0dGVybiBpcyByZXF1aXJlZCBmb3IgdHlwZWRvYyAwLjUuNlxuXHRcdFx0ZXhjbHVkZTogJ18nLFxuXHRcdFx0ZXhjbHVkZUV4dGVybmFsczogdHJ1ZSxcblx0XHRcdGV4Y2x1ZGVOb3RFeHBvcnRlZDogdHJ1ZSxcblx0XHRcdGluY2x1ZGVEZWNsYXJhdGlvbnM6IHRydWUsXG5cblx0XHRcdC8vIHB1Ymxpc2hPcHRpb25zIGFyZSBvbmx5IHVzZWQgd2hlbiBwdWJsaXNoaW5nIHRoZSBnZW5lcmF0ZSBBUEkgZG9jc1xuXHRcdFx0cHVibGlzaE9wdGlvbnM6IHtcblx0XHRcdFx0YnJhbmNoOiAnZ2gtcGFnZXMnLFxuXHRcdFx0XHRzdWJkaXI6ICdhcGknLFxuXHRcdFx0XHRkZXBsb3lLZXk6ICdkZXBsb3lfa2V5J1xuXHRcdFx0fVxuXHRcdH1cblx0fTtcbn07XG4iXX0=