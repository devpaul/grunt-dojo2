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
    return function (grunt) {
        grunt.loadNpmTasks('grunt-contrib-clean');
        return {
            typings: {
                src: ['typings/']
            },
            dist: {
                src: ['dist/umd/*'],
                filter: function (path) {
                    return grunt.option('remove-links') ? true : !grunt.file.isLink(path);
                }
            },
            dev: {
                src: ['<%= devDirectory %>']
            },
            src: {
                src: ['{src,tests}/**/*.js'],
                filter: function (path) {
                    // Only clean the .js file if a .js.map file also exists
                    var mapPath = path + '.map';
                    if (grunt.file.exists(mapPath)) {
                        grunt.file.delete(mapPath);
                        return true;
                    }
                    return false;
                }
            },
            coverage: {
                src: ['coverage-unmapped.json']
            },
            typedoc: {
                src: ['<%= apiDocDirectory %>', '<%= apiPubDirectory %>']
            },
            ghpages: {
                src: ['<%= apiPubDirectory %>']
            }
        };
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xlYW4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjbGVhbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0lBQUEsT0FBUyxVQUFVLEtBQWE7UUFDL0IsS0FBSyxDQUFDLFlBQVksQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO1FBRTFDLE1BQU0sQ0FBQztZQUNOLE9BQU8sRUFBRTtnQkFDUixHQUFHLEVBQUUsQ0FBRSxVQUFVLENBQUU7YUFDbkI7WUFDRCxJQUFJLEVBQUU7Z0JBQ0wsR0FBRyxFQUFFLENBQUUsWUFBWSxDQUFFO2dCQUNyQixNQUFNLEVBQUUsVUFBVSxJQUFZO29CQUM3QixNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDdkUsQ0FBQzthQUNEO1lBQ0QsR0FBRyxFQUFFO2dCQUNKLEdBQUcsRUFBRSxDQUFFLHFCQUFxQixDQUFFO2FBQzlCO1lBQ0QsR0FBRyxFQUFFO2dCQUNKLEdBQUcsRUFBRSxDQUFFLHFCQUFxQixDQUFFO2dCQUM5QixNQUFNLEVBQUUsVUFBVSxJQUFZO29CQUM3Qix3REFBd0Q7b0JBQ3hELElBQU0sT0FBTyxHQUFHLElBQUksR0FBRyxNQUFNLENBQUM7b0JBQzlCLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDaEMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7d0JBQzNCLE1BQU0sQ0FBQyxJQUFJLENBQUM7b0JBQ2IsQ0FBQztvQkFDRCxNQUFNLENBQUMsS0FBSyxDQUFDO2dCQUNkLENBQUM7YUFDRDtZQUNELFFBQVEsRUFBRTtnQkFDVCxHQUFHLEVBQUUsQ0FBRSx3QkFBd0IsQ0FBRTthQUNqQztZQUNELE9BQU8sRUFBRTtnQkFDUixHQUFHLEVBQUUsQ0FBRSx3QkFBd0IsRUFBRSx3QkFBd0IsQ0FBRTthQUMzRDtZQUNELE9BQU8sRUFBRTtnQkFDUixHQUFHLEVBQUUsQ0FBRSx3QkFBd0IsQ0FBRTthQUNqQztTQUNELENBQUM7SUFDSCxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgPSBmdW5jdGlvbiAoZ3J1bnQ6IElHcnVudCkge1xuXHRncnVudC5sb2FkTnBtVGFza3MoJ2dydW50LWNvbnRyaWItY2xlYW4nKTtcblxuXHRyZXR1cm4ge1xuXHRcdHR5cGluZ3M6IHtcblx0XHRcdHNyYzogWyAndHlwaW5ncy8nIF1cblx0XHR9LFxuXHRcdGRpc3Q6IHtcblx0XHRcdHNyYzogWyAnZGlzdC91bWQvKicgXSxcblx0XHRcdGZpbHRlcjogZnVuY3Rpb24gKHBhdGg6IHN0cmluZykge1xuXHRcdFx0XHRyZXR1cm4gZ3J1bnQub3B0aW9uKCdyZW1vdmUtbGlua3MnKSA/IHRydWUgOiAhZ3J1bnQuZmlsZS5pc0xpbmsocGF0aCk7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRkZXY6IHtcblx0XHRcdHNyYzogWyAnPCU9IGRldkRpcmVjdG9yeSAlPicgXVxuXHRcdH0sXG5cdFx0c3JjOiB7XG5cdFx0XHRzcmM6IFsgJ3tzcmMsdGVzdHN9LyoqLyouanMnIF0sXG5cdFx0XHRmaWx0ZXI6IGZ1bmN0aW9uIChwYXRoOiBzdHJpbmcpIHtcblx0XHRcdFx0Ly8gT25seSBjbGVhbiB0aGUgLmpzIGZpbGUgaWYgYSAuanMubWFwIGZpbGUgYWxzbyBleGlzdHNcblx0XHRcdFx0Y29uc3QgbWFwUGF0aCA9IHBhdGggKyAnLm1hcCc7XG5cdFx0XHRcdGlmIChncnVudC5maWxlLmV4aXN0cyhtYXBQYXRoKSkge1xuXHRcdFx0XHRcdGdydW50LmZpbGUuZGVsZXRlKG1hcFBhdGgpO1xuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblx0XHR9LFxuXHRcdGNvdmVyYWdlOiB7XG5cdFx0XHRzcmM6IFsgJ2NvdmVyYWdlLXVubWFwcGVkLmpzb24nIF1cblx0XHR9LFxuXHRcdHR5cGVkb2M6IHtcblx0XHRcdHNyYzogWyAnPCU9IGFwaURvY0RpcmVjdG9yeSAlPicsICc8JT0gYXBpUHViRGlyZWN0b3J5ICU+JyBdXG5cdFx0fSxcblx0XHRnaHBhZ2VzOiB7XG5cdFx0XHRzcmM6IFsgJzwlPSBhcGlQdWJEaXJlY3RvcnkgJT4nIF1cblx0XHR9XG5cdH07XG59O1xuIl19