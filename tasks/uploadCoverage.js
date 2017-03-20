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
    var sendToCodeCov = require('codecov.io/lib/sendToCodeCov.io');
    return function (grunt) {
        grunt.registerTask('uploadCoverage', function () {
            var done = this.async();
            var contents = grunt.file.read('coverage-final.lcov');
            sendToCodeCov(contents, function (err) {
                done(err);
            });
        });
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBsb2FkQ292ZXJhZ2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ1cGxvYWRDb3ZlcmFnZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0lBQ0EsSUFBTSxhQUFhLEdBQUcsT0FBTyxDQUFDLGlDQUFpQyxDQUFDLENBQUM7SUFFakUsT0FBUyxVQUFVLEtBQWE7UUFDL0IsS0FBSyxDQUFDLFlBQVksQ0FBQyxnQkFBZ0IsRUFBUTtZQUMxQyxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7WUFFeEIsSUFBSSxRQUFRLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMscUJBQXFCLENBQUMsQ0FBQztZQUN0RCxhQUFhLENBQUMsUUFBUSxFQUFFLFVBQVUsR0FBVTtnQkFDM0MsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ1gsQ0FBQyxDQUFDLENBQUM7UUFDSixDQUFDLENBQUMsQ0FBQztJQUNKLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBJVGFzayA9IGdydW50LnRhc2suSVRhc2s7XG5jb25zdCBzZW5kVG9Db2RlQ292ID0gcmVxdWlyZSgnY29kZWNvdi5pby9saWIvc2VuZFRvQ29kZUNvdi5pbycpO1xuXG5leHBvcnQgPSBmdW5jdGlvbiAoZ3J1bnQ6IElHcnVudCkge1xuXHRncnVudC5yZWdpc3RlclRhc2soJ3VwbG9hZENvdmVyYWdlJywgPGFueT4gZnVuY3Rpb24gKHRoaXM6IElUYXNrKSB7XG5cdFx0dmFyIGRvbmUgPSB0aGlzLmFzeW5jKCk7XG5cblx0XHR2YXIgY29udGVudHMgPSBncnVudC5maWxlLnJlYWQoJ2NvdmVyYWdlLWZpbmFsLmxjb3YnKTtcblx0XHRzZW5kVG9Db2RlQ292KGNvbnRlbnRzLCBmdW5jdGlvbiAoZXJyOiBFcnJvcikge1xuXHRcdFx0ZG9uZShlcnIpO1xuXHRcdH0pO1xuXHR9KTtcbn07XG4iXX0=