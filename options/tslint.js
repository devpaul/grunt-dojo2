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
        grunt.loadNpmTasks('grunt-tslint');
        return {
            options: {
                configuration: grunt.file.readJSON('tslint.json')
            },
            src: {
                src: [
                    '<%= all %>',
                    '!typings/**/*.ts',
                    '!tests/typings/**/*.ts',
                    '!node_modules/**/*.ts'
                ]
            }
        };
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHNsaW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidHNsaW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7SUFBQSxPQUFTLFVBQVUsS0FBYTtRQUMvQixLQUFLLENBQUMsWUFBWSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBRW5DLE1BQU0sQ0FBQztZQUNOLE9BQU8sRUFBRTtnQkFDUixhQUFhLEVBQUUsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDO2FBQ2pEO1lBQ0QsR0FBRyxFQUFFO2dCQUNKLEdBQUcsRUFBRTtvQkFDSixZQUFZO29CQUNaLGtCQUFrQjtvQkFDbEIsd0JBQXdCO29CQUN4Qix1QkFBdUI7aUJBQ3ZCO2FBQ0Q7U0FDRCxDQUFDO0lBQ0gsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0ID0gZnVuY3Rpb24gKGdydW50OiBJR3J1bnQpIHtcblx0Z3J1bnQubG9hZE5wbVRhc2tzKCdncnVudC10c2xpbnQnKTtcblxuXHRyZXR1cm4ge1xuXHRcdG9wdGlvbnM6IHtcblx0XHRcdGNvbmZpZ3VyYXRpb246IGdydW50LmZpbGUucmVhZEpTT04oJ3RzbGludC5qc29uJylcblx0XHR9LFxuXHRcdHNyYzoge1xuXHRcdFx0c3JjOiBbXG5cdFx0XHRcdCc8JT0gYWxsICU+Jyxcblx0XHRcdFx0JyF0eXBpbmdzLyoqLyoudHMnLFxuXHRcdFx0XHQnIXRlc3RzL3R5cGluZ3MvKiovKi50cycsXG5cdFx0XHRcdCchbm9kZV9tb2R1bGVzLyoqLyoudHMnXG5cdFx0XHRdXG5cdFx0fVxuXHR9O1xufTsiXX0=