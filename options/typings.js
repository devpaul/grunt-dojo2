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
        grunt.loadNpmTasks('grunt-typings');
        return {
            install: {},
            dev: {
                options: {
                    production: false
                }
            },
            dist: {
                options: {
                    production: true
                }
            }
        };
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwaW5ncy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInR5cGluZ3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztJQUFBLE9BQVMsVUFBVSxLQUFhO1FBQy9CLEtBQUssQ0FBQyxZQUFZLENBQUMsZUFBZSxDQUFDLENBQUM7UUFFcEMsTUFBTSxDQUFDO1lBQ04sT0FBTyxFQUFFLEVBQUU7WUFDWCxHQUFHLEVBQUU7Z0JBQ0osT0FBTyxFQUFFO29CQUNSLFVBQVUsRUFBRSxLQUFLO2lCQUNqQjthQUNEO1lBQ0QsSUFBSSxFQUFFO2dCQUNMLE9BQU8sRUFBRTtvQkFDUixVQUFVLEVBQUUsSUFBSTtpQkFDaEI7YUFDRDtTQUNELENBQUM7SUFDSCxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgPSBmdW5jdGlvbiAoZ3J1bnQ6IElHcnVudCkge1xuXHRncnVudC5sb2FkTnBtVGFza3MoJ2dydW50LXR5cGluZ3MnKTtcblxuXHRyZXR1cm4ge1xuXHRcdGluc3RhbGw6IHt9LFxuXHRcdGRldjoge1xuXHRcdFx0b3B0aW9uczoge1xuXHRcdFx0XHRwcm9kdWN0aW9uOiBmYWxzZVxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0ZGlzdDoge1xuXHRcdFx0b3B0aW9uczoge1xuXHRcdFx0XHRwcm9kdWN0aW9uOiB0cnVlXG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xufTtcbiJdfQ==