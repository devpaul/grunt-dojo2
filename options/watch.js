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
        grunt.loadNpmTasks('grunt-ts');
        return {
            grunt: {
                options: {
                    reload: true
                },
                files: ['Gruntfile.js', 'tsconfig.json']
            },
            src: {
                options: {
                    atBegin: true
                },
                files: ['<%= all %>', '<%= staticTestFiles %>'],
                tasks: [
                    'dev'
                ]
            }
        };
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2F0Y2guanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ3YXRjaC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0lBQUEsT0FBUyxVQUFVLEtBQWE7UUFDL0IsS0FBSyxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUUvQixNQUFNLENBQUM7WUFDTixLQUFLLEVBQUU7Z0JBQ04sT0FBTyxFQUFFO29CQUNSLE1BQU0sRUFBRSxJQUFJO2lCQUNaO2dCQUNELEtBQUssRUFBRSxDQUFFLGNBQWMsRUFBRSxlQUFlLENBQUU7YUFDMUM7WUFDRCxHQUFHLEVBQUU7Z0JBQ0osT0FBTyxFQUFFO29CQUNSLE9BQU8sRUFBRSxJQUFJO2lCQUNiO2dCQUNELEtBQUssRUFBRSxDQUFFLFlBQVksRUFBRSx3QkFBd0IsQ0FBRTtnQkFDakQsS0FBSyxFQUFFO29CQUNOLEtBQUs7aUJBQ0w7YUFDRDtTQUNELENBQUM7SUFDSCxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgPSBmdW5jdGlvbiAoZ3J1bnQ6IElHcnVudCkge1xuXHRncnVudC5sb2FkTnBtVGFza3MoJ2dydW50LXRzJyk7XG5cblx0cmV0dXJuIHtcblx0XHRncnVudDoge1xuXHRcdFx0b3B0aW9uczoge1xuXHRcdFx0XHRyZWxvYWQ6IHRydWVcblx0XHRcdH0sXG5cdFx0XHRmaWxlczogWyAnR3J1bnRmaWxlLmpzJywgJ3RzY29uZmlnLmpzb24nIF1cblx0XHR9LFxuXHRcdHNyYzoge1xuXHRcdFx0b3B0aW9uczoge1xuXHRcdFx0XHRhdEJlZ2luOiB0cnVlXG5cdFx0XHR9LFxuXHRcdFx0ZmlsZXM6IFsgJzwlPSBhbGwgJT4nLCAnPCU9IHN0YXRpY1Rlc3RGaWxlcyAlPicgXSxcblx0XHRcdHRhc2tzOiBbXG5cdFx0XHRcdCdkZXYnXG5cdFx0XHRdXG5cdFx0fVxuXHR9O1xufTtcbiJdfQ==