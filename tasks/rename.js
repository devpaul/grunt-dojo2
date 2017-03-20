(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "fs", "path"], factory);
    }
})(function (require, exports) {
    "use strict";
    var fs = require("fs");
    var path = require("path");
    return function (grunt) {
        grunt.registerMultiTask('rename', function () {
            this.files.forEach(function (file) {
                if (grunt.file.isFile(file.src[0])) {
                    grunt.file.mkdir(path.dirname(file.dest));
                }
                fs.renameSync(file.src[0], file.dest);
                grunt['verbose'].writeln('Renamed ' + file.src[0] + ' to ' + file.dest);
            });
            grunt.log.writeln('Moved ' + this.files.length + ' files');
        });
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVuYW1lLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicmVuYW1lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7SUFBQSx1QkFBeUI7SUFDekIsMkJBQTZCO0lBSTdCLE9BQVMsVUFBVSxLQUFhO1FBQy9CLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxRQUFRLEVBQUU7WUFDakMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsVUFBVSxJQUF5QjtnQkFDckQsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDcEMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDM0MsQ0FBQztnQkFDRCxFQUFFLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUMvQixLQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDakYsQ0FBQyxDQUFDLENBQUM7WUFDSCxLQUFLLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsUUFBUSxDQUFDLENBQUM7UUFDNUQsQ0FBQyxDQUFDLENBQUM7SUFDSixDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBmcyBmcm9tICdmcyc7XG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IElUYXNrID0gZ3J1bnQudGFzay5JVGFzaztcbmltcG9ydCBJTXVsdGlUYXNrID0gZ3J1bnQudGFzay5JTXVsdGlUYXNrO1xuXG5leHBvcnQgPSBmdW5jdGlvbiAoZ3J1bnQ6IElHcnVudCkge1xuXHRncnVudC5yZWdpc3Rlck11bHRpVGFzaygncmVuYW1lJywgZnVuY3Rpb24gKHRoaXM6IElNdWx0aVRhc2s8dm9pZD4pIHtcblx0XHR0aGlzLmZpbGVzLmZvckVhY2goZnVuY3Rpb24gKGZpbGU6IGdydW50LmZpbGUuSUZpbGVNYXApIHtcblx0XHRcdGlmIChncnVudC5maWxlLmlzRmlsZShmaWxlLnNyY1swXSkpIHtcblx0XHRcdFx0Z3J1bnQuZmlsZS5ta2RpcihwYXRoLmRpcm5hbWUoZmlsZS5kZXN0KSk7XG5cdFx0XHR9XG5cdFx0XHRmcy5yZW5hbWVTeW5jKGZpbGUuc3JjWzBdLCBmaWxlLmRlc3QpO1xuXHRcdFx0KDxhbnk+IGdydW50KVsndmVyYm9zZSddLndyaXRlbG4oJ1JlbmFtZWQgJyArIGZpbGUuc3JjWzBdICsgJyB0byAnICsgZmlsZS5kZXN0KTtcblx0XHR9KTtcblx0XHRncnVudC5sb2cud3JpdGVsbignTW92ZWQgJyArIHRoaXMuZmlsZXMubGVuZ3RoICsgJyBmaWxlcycpO1xuXHR9KTtcbn07XG4iXX0=