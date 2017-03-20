(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "path"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var path_1 = require("path");
    var resolveFrom = require('resolve-from');
    function loadDojoLoader(_a) {
        var _b = _a.peerDependencies, peerDependencies = _b === void 0 ? {} : _b;
        var baseUrl = process.cwd();
        var packages = [
            { name: 'src', location: '_build/src' }
        ];
        for (var name_1 in peerDependencies) {
            if (/^dojo-/.test(name_1)) {
                packages.push({ name: name_1, location: path_1.join('node_modules', name_1, 'dist', 'umd') });
            }
            else if (name_1 === '@reactivex/rxjs') {
                packages.push({ name: 'rxjs', location: path_1.join('node_modules', name_1, 'dist', 'amd') });
            }
            else if (name_1 === 'maquette' || name_1 === 'immutable') {
                packages.push({ name: name_1, location: path_1.join('node_modules', name_1, 'dist') });
            }
            else {
                packages.push({ name: name_1, location: path_1.join('node_modules', name_1) });
            }
        }
        // Assume dojo-loader is installed in the parent project.
        var r = require(resolveFrom(baseUrl, 'dojo-loader'));
        r.config({
            baseUrl: baseUrl,
            packages: packages
        });
        return {
            baseUrl: baseUrl,
            packages: packages,
            require: r
        };
    }
    exports.default = loadDojoLoader;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9hZC1kb2pvLWxvYWRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImxvYWQtZG9qby1sb2FkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7SUFBQSw2QkFBNEI7SUFFNUIsSUFBTSxXQUFXLEdBQUcsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0lBRTVDLHdCQUF3QyxFQUE4QjtZQUE1Qix3QkFBcUIsRUFBckIsMENBQXFCO1FBQzlELElBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUM5QixJQUFNLFFBQVEsR0FBRztZQUNoQixFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLFlBQVksRUFBRTtTQUN2QyxDQUFDO1FBRUYsR0FBRyxDQUFDLENBQUMsSUFBTSxNQUFJLElBQUksZ0JBQWdCLENBQUMsQ0FBQyxDQUFDO1lBQ3JDLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN6QixRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxRQUFBLEVBQUUsUUFBUSxFQUFFLFdBQUksQ0FBQyxjQUFjLEVBQUUsTUFBSSxFQUFFLE1BQU0sRUFBRSxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDOUUsQ0FBQztZQUNELElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFJLEtBQUssaUJBQWlCLENBQUMsQ0FBQyxDQUFDO2dCQUNyQyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsV0FBSSxDQUFDLGNBQWMsRUFBRSxNQUFJLEVBQUUsTUFBTSxFQUFFLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUN0RixDQUFDO1lBQ0QsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQUksS0FBSyxVQUFVLElBQUksTUFBSSxLQUFLLFdBQVcsQ0FBQyxDQUFDLENBQUM7Z0JBQ3RELFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRSxJQUFJLFFBQUEsRUFBRSxRQUFRLEVBQUUsV0FBSSxDQUFDLGNBQWMsRUFBRSxNQUFJLEVBQUUsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ3ZFLENBQUM7WUFDRCxJQUFJLENBQUMsQ0FBQztnQkFDTCxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxRQUFBLEVBQUUsUUFBUSxFQUFFLFdBQUksQ0FBQyxjQUFjLEVBQUUsTUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQy9ELENBQUM7UUFDRixDQUFDO1FBRUQseURBQXlEO1FBQ3pELElBQU0sQ0FBQyxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsT0FBTyxFQUFFLGFBQWEsQ0FBQyxDQUFDLENBQUM7UUFDdkQsQ0FBQyxDQUFDLE1BQU0sQ0FBQztZQUNSLE9BQU8sU0FBQTtZQUNQLFFBQVEsVUFBQTtTQUNSLENBQUMsQ0FBQztRQUVILE1BQU0sQ0FBQztZQUNOLE9BQU8sU0FBQTtZQUNQLFFBQVEsVUFBQTtZQUNSLE9BQU8sRUFBRSxDQUFDO1NBQ1YsQ0FBQztJQUNILENBQUM7SUFqQ0QsaUNBaUNDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgam9pbiB9IGZyb20gJ3BhdGgnO1xuXG5jb25zdCByZXNvbHZlRnJvbSA9IHJlcXVpcmUoJ3Jlc29sdmUtZnJvbScpO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBsb2FkRG9qb0xvYWRlciAoeyBwZWVyRGVwZW5kZW5jaWVzID0ge30gfTogYW55KSB7XG5cdGNvbnN0IGJhc2VVcmwgPSBwcm9jZXNzLmN3ZCgpO1xuXHRjb25zdCBwYWNrYWdlcyA9IFtcblx0XHR7IG5hbWU6ICdzcmMnLCBsb2NhdGlvbjogJ19idWlsZC9zcmMnIH1cblx0XTtcblxuXHRmb3IgKGNvbnN0IG5hbWUgaW4gcGVlckRlcGVuZGVuY2llcykge1xuXHRcdGlmICgvXmRvam8tLy50ZXN0KG5hbWUpKSB7XG5cdFx0XHRwYWNrYWdlcy5wdXNoKHsgbmFtZSwgbG9jYXRpb246IGpvaW4oJ25vZGVfbW9kdWxlcycsIG5hbWUsICdkaXN0JywgJ3VtZCcpIH0pO1xuXHRcdH1cblx0XHRlbHNlIGlmIChuYW1lID09PSAnQHJlYWN0aXZleC9yeGpzJykge1xuXHRcdFx0cGFja2FnZXMucHVzaCh7IG5hbWU6ICdyeGpzJywgbG9jYXRpb246IGpvaW4oJ25vZGVfbW9kdWxlcycsIG5hbWUsICdkaXN0JywgJ2FtZCcpIH0pO1xuXHRcdH1cblx0XHRlbHNlIGlmIChuYW1lID09PSAnbWFxdWV0dGUnIHx8IG5hbWUgPT09ICdpbW11dGFibGUnKSB7XG5cdFx0XHRwYWNrYWdlcy5wdXNoKHsgbmFtZSwgbG9jYXRpb246IGpvaW4oJ25vZGVfbW9kdWxlcycsIG5hbWUsICdkaXN0JykgfSk7XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0cGFja2FnZXMucHVzaCh7IG5hbWUsIGxvY2F0aW9uOiBqb2luKCdub2RlX21vZHVsZXMnLCBuYW1lKSB9KTtcblx0XHR9XG5cdH1cblxuXHQvLyBBc3N1bWUgZG9qby1sb2FkZXIgaXMgaW5zdGFsbGVkIGluIHRoZSBwYXJlbnQgcHJvamVjdC5cblx0Y29uc3QgciA9IHJlcXVpcmUocmVzb2x2ZUZyb20oYmFzZVVybCwgJ2Rvam8tbG9hZGVyJykpO1xuXHRyLmNvbmZpZyh7XG5cdFx0YmFzZVVybCxcblx0XHRwYWNrYWdlc1xuXHR9KTtcblxuXHRyZXR1cm4ge1xuXHRcdGJhc2VVcmwsXG5cdFx0cGFja2FnZXMsXG5cdFx0cmVxdWlyZTogclxuXHR9O1xufVxuIl19