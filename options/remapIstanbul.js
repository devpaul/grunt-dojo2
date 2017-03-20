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
        grunt.loadNpmTasks('remap-istanbul');
        return {
            coverage: {
                options: {
                    reports: {
                        'html': 'html-report',
                        'text': null
                    }
                },
                src: ['coverage-unmapped.json']
            },
            ci: {
                options: {
                    reports: {
                        'lcovonly': 'coverage-final.lcov',
                        'json': 'coverage-final.json',
                        'text': null
                    }
                },
                src: ['coverage-unmapped.json']
            }
        };
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVtYXBJc3RhbmJ1bC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInJlbWFwSXN0YW5idWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztJQUFBLE9BQVMsVUFBVSxLQUFhO1FBQy9CLEtBQUssQ0FBQyxZQUFZLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztRQUVyQyxNQUFNLENBQUM7WUFDTixRQUFRLEVBQUU7Z0JBQ1QsT0FBTyxFQUFFO29CQUNSLE9BQU8sRUFBRTt3QkFDUixNQUFNLEVBQUUsYUFBYTt3QkFDckIsTUFBTSxFQUFRLElBQUk7cUJBQ2xCO2lCQUNEO2dCQUNELEdBQUcsRUFBRSxDQUFFLHdCQUF3QixDQUFFO2FBQ2pDO1lBQ0QsRUFBRSxFQUFFO2dCQUNILE9BQU8sRUFBRTtvQkFDUixPQUFPLEVBQUU7d0JBQ1IsVUFBVSxFQUFFLHFCQUFxQjt3QkFDakMsTUFBTSxFQUFFLHFCQUFxQjt3QkFDN0IsTUFBTSxFQUFRLElBQUk7cUJBQ2xCO2lCQUNEO2dCQUNELEdBQUcsRUFBRSxDQUFFLHdCQUF3QixDQUFFO2FBQ2pDO1NBQ0QsQ0FBQztJQUNILENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCA9IGZ1bmN0aW9uIChncnVudDogSUdydW50KSB7XG5cdGdydW50LmxvYWROcG1UYXNrcygncmVtYXAtaXN0YW5idWwnKTtcblxuXHRyZXR1cm4ge1xuXHRcdGNvdmVyYWdlOiB7XG5cdFx0XHRvcHRpb25zOiB7XG5cdFx0XHRcdHJlcG9ydHM6IHtcblx0XHRcdFx0XHQnaHRtbCc6ICdodG1sLXJlcG9ydCcsXG5cdFx0XHRcdFx0J3RleHQnOiA8YW55PiBudWxsXG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHRzcmM6IFsgJ2NvdmVyYWdlLXVubWFwcGVkLmpzb24nIF1cblx0XHR9LFxuXHRcdGNpOiB7XG5cdFx0XHRvcHRpb25zOiB7XG5cdFx0XHRcdHJlcG9ydHM6IHtcblx0XHRcdFx0XHQnbGNvdm9ubHknOiAnY292ZXJhZ2UtZmluYWwubGNvdicsXG5cdFx0XHRcdFx0J2pzb24nOiAnY292ZXJhZ2UtZmluYWwuanNvbicsXG5cdFx0XHRcdFx0J3RleHQnOiA8YW55PiBudWxsXG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHRzcmM6IFsgJ2NvdmVyYWdlLXVubWFwcGVkLmpzb24nIF1cblx0XHR9XG5cdH07XG59O1xuIl19