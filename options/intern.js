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
        grunt.loadNpmTasks('intern');
        return {
            options: {
                runType: 'runner',
                config: '<%= devDirectory %>/tests/intern',
                reporters: ['Runner']
            },
            browserstack: {},
            saucelabs: {
                options: {
                    config: '<%= devDirectory %>/tests/intern-saucelabs'
                }
            },
            remote: {},
            local: {
                options: {
                    config: '<%= devDirectory %>/tests/intern-local',
                }
            },
            node: {
                options: {
                    runType: 'client'
                }
            },
            proxy: {
                options: {
                    proxyOnly: true
                }
            }
        };
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZXJuLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW50ZXJuLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7SUFBQSxPQUFTLFVBQVUsS0FBYTtRQUMvQixLQUFLLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBRTdCLE1BQU0sQ0FBQztZQUNOLE9BQU8sRUFBRTtnQkFDUixPQUFPLEVBQUUsUUFBUTtnQkFDakIsTUFBTSxFQUFFLGtDQUFrQztnQkFDMUMsU0FBUyxFQUFFLENBQUUsUUFBUSxDQUFFO2FBQ3ZCO1lBQ0QsWUFBWSxFQUFFLEVBQUU7WUFDaEIsU0FBUyxFQUFFO2dCQUNWLE9BQU8sRUFBRTtvQkFDUixNQUFNLEVBQUUsNENBQTRDO2lCQUNwRDthQUNEO1lBQ0QsTUFBTSxFQUFFLEVBQUU7WUFDVixLQUFLLEVBQUU7Z0JBQ04sT0FBTyxFQUFFO29CQUNSLE1BQU0sRUFBRSx3Q0FBd0M7aUJBQ2hEO2FBQ0Q7WUFDRCxJQUFJLEVBQUU7Z0JBQ0wsT0FBTyxFQUFFO29CQUNSLE9BQU8sRUFBRSxRQUFRO2lCQUNqQjthQUNEO1lBQ0QsS0FBSyxFQUFFO2dCQUNOLE9BQU8sRUFBRTtvQkFDUixTQUFTLEVBQUUsSUFBSTtpQkFDZjthQUNEO1NBQ0QsQ0FBQztJQUNILENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCA9IGZ1bmN0aW9uIChncnVudDogSUdydW50KSB7XG5cdGdydW50LmxvYWROcG1UYXNrcygnaW50ZXJuJyk7XG5cblx0cmV0dXJuIHtcblx0XHRvcHRpb25zOiB7XG5cdFx0XHRydW5UeXBlOiAncnVubmVyJyxcblx0XHRcdGNvbmZpZzogJzwlPSBkZXZEaXJlY3RvcnkgJT4vdGVzdHMvaW50ZXJuJyxcblx0XHRcdHJlcG9ydGVyczogWyAnUnVubmVyJyBdXG5cdFx0fSxcblx0XHRicm93c2Vyc3RhY2s6IHt9LFxuXHRcdHNhdWNlbGFiczoge1xuXHRcdFx0b3B0aW9uczoge1xuXHRcdFx0XHRjb25maWc6ICc8JT0gZGV2RGlyZWN0b3J5ICU+L3Rlc3RzL2ludGVybi1zYXVjZWxhYnMnXG5cdFx0XHR9XG5cdFx0fSxcblx0XHRyZW1vdGU6IHt9LFxuXHRcdGxvY2FsOiB7XG5cdFx0XHRvcHRpb25zOiB7XG5cdFx0XHRcdGNvbmZpZzogJzwlPSBkZXZEaXJlY3RvcnkgJT4vdGVzdHMvaW50ZXJuLWxvY2FsJyxcblx0XHRcdH1cblx0XHR9LFxuXHRcdG5vZGU6IHtcblx0XHRcdG9wdGlvbnM6IHtcblx0XHRcdFx0cnVuVHlwZTogJ2NsaWVudCdcblx0XHRcdH1cblx0XHR9LFxuXHRcdHByb3h5OiB7XG5cdFx0XHRvcHRpb25zOiB7XG5cdFx0XHRcdHByb3h5T25seTogdHJ1ZVxuXHRcdFx0fVxuXHRcdH1cblx0fTtcbn07XG4iXX0=