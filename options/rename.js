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
        require('../tasks/rename')(grunt);
        return {
            sourceMaps: {
                expand: true,
                cwd: 'dist/umd',
                src: ['**/*.js.map', '!_debug/**/*.js.map'],
                dest: 'dist/umd/_debug/'
            },
            sourceMaps_esm: {
                expand: true,
                cwd: 'dist/esm',
                src: ['**/*.js.map', '!_debug/**/*.js.map'],
                dest: 'dist/esm/_debug/'
            }
        };
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVuYW1lLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicmVuYW1lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7SUFBQSxPQUFTLFVBQVUsS0FBYTtRQUMvQixPQUFPLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUVsQyxNQUFNLENBQUM7WUFDTixVQUFVLEVBQUU7Z0JBQ1gsTUFBTSxFQUFFLElBQUk7Z0JBQ1osR0FBRyxFQUFFLFVBQVU7Z0JBQ2YsR0FBRyxFQUFFLENBQUUsYUFBYSxFQUFFLHFCQUFxQixDQUFFO2dCQUM3QyxJQUFJLEVBQUUsa0JBQWtCO2FBQ3hCO1lBQ0QsY0FBYyxFQUFFO2dCQUNmLE1BQU0sRUFBRSxJQUFJO2dCQUNaLEdBQUcsRUFBRSxVQUFVO2dCQUNmLEdBQUcsRUFBRSxDQUFFLGFBQWEsRUFBRSxxQkFBcUIsQ0FBRTtnQkFDN0MsSUFBSSxFQUFFLGtCQUFrQjthQUN4QjtTQUNELENBQUM7SUFDSCxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgPSBmdW5jdGlvbiAoZ3J1bnQ6IElHcnVudCkge1xuXHRyZXF1aXJlKCcuLi90YXNrcy9yZW5hbWUnKShncnVudCk7XG5cblx0cmV0dXJuIHtcblx0XHRzb3VyY2VNYXBzOiB7XG5cdFx0XHRleHBhbmQ6IHRydWUsXG5cdFx0XHRjd2Q6ICdkaXN0L3VtZCcsXG5cdFx0XHRzcmM6IFsgJyoqLyouanMubWFwJywgJyFfZGVidWcvKiovKi5qcy5tYXAnIF0sXG5cdFx0XHRkZXN0OiAnZGlzdC91bWQvX2RlYnVnLydcblx0XHR9LFxuXHRcdHNvdXJjZU1hcHNfZXNtOiB7XG5cdFx0XHRleHBhbmQ6IHRydWUsXG5cdFx0XHRjd2Q6ICdkaXN0L2VzbScsXG5cdFx0XHRzcmM6IFsgJyoqLyouanMubWFwJywgJyFfZGVidWcvKiovKi5qcy5tYXAnIF0sXG5cdFx0XHRkZXN0OiAnZGlzdC9lc20vX2RlYnVnLydcblx0XHR9XG5cdH07XG59O1xuIl19