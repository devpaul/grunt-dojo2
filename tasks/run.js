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
    var load_dojo_loader_1 = require("../lib/load-dojo-loader");
    return function (grunt, packageJson) {
        grunt.registerTask('run', 'Bootstrap dojo-loader and run the given --main', function () {
            this.async(); // Ensure Grunt doesn't exit the process.
            var main = grunt.option('main') || 'src/main';
            grunt.log.ok(main);
            var require = load_dojo_loader_1.default(packageJson).require;
            require([main]);
        });
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVuLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicnVuLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7SUFBQSw0REFBcUQ7SUFHckQsT0FBUyxVQUFTLEtBQWEsRUFBRSxXQUFnQjtRQUNoRCxLQUFLLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRSxnREFBZ0QsRUFBRTtZQUMzRSxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyx5Q0FBeUM7WUFFdkQsSUFBTSxJQUFJLEdBQVksS0FBSyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxVQUFVLENBQUM7WUFDekQsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFWCxJQUFBLHlEQUFPLENBQWlDO1lBQ2hELE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDakIsQ0FBQyxDQUFDLENBQUM7SUFDSixDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgbG9hZERvam9Mb2FkZXIgZnJvbSAnLi4vbGliL2xvYWQtZG9qby1sb2FkZXInO1xuaW1wb3J0IElUYXNrID0gZ3J1bnQudGFzay5JVGFzaztcblxuZXhwb3J0ID0gZnVuY3Rpb24oZ3J1bnQ6IElHcnVudCwgcGFja2FnZUpzb246IGFueSkge1xuXHRncnVudC5yZWdpc3RlclRhc2soJ3J1bicsICdCb290c3RyYXAgZG9qby1sb2FkZXIgYW5kIHJ1biB0aGUgZ2l2ZW4gLS1tYWluJywgZnVuY3Rpb24gKHRoaXM6IElUYXNrKSB7XG5cdFx0dGhpcy5hc3luYygpOyAvLyBFbnN1cmUgR3J1bnQgZG9lc24ndCBleGl0IHRoZSBwcm9jZXNzLlxuXG5cdFx0Y29uc3QgbWFpbiA9IDxzdHJpbmc+IGdydW50Lm9wdGlvbignbWFpbicpIHx8ICdzcmMvbWFpbic7XG5cdFx0Z3J1bnQubG9nLm9rKG1haW4pO1xuXG5cdFx0Y29uc3QgeyByZXF1aXJlIH0gPSBsb2FkRG9qb0xvYWRlcihwYWNrYWdlSnNvbik7XG5cdFx0cmVxdWlyZShbbWFpbl0pO1xuXHR9KTtcbn07XG4iXX0=