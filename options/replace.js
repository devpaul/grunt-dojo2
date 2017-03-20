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
        grunt.loadNpmTasks('grunt-text-replace');
        return {
            addIstanbulIgnore: {
                src: ['<%= devDirectory %>/**/*.js'],
                overwrite: true,
                replacements: [
                    {
                        from: /^(var __(?:extends|decorate|param) = )/gm,
                        to: '$1/* istanbul ignore next */ '
                    },
                    {
                        from: /^(\()(function \(deps, )/m,
                        to: '$1/* istanbul ignore next */ $2'
                    }
                ]
            }
        };
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVwbGFjZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInJlcGxhY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztJQUFBLE9BQVMsVUFBVSxLQUFhO1FBQy9CLEtBQUssQ0FBQyxZQUFZLENBQUMsb0JBQW9CLENBQUMsQ0FBQztRQUV6QyxNQUFNLENBQUM7WUFDTixpQkFBaUIsRUFBRTtnQkFDbEIsR0FBRyxFQUFFLENBQUUsNkJBQTZCLENBQUU7Z0JBQ3RDLFNBQVMsRUFBRSxJQUFJO2dCQUNmLFlBQVksRUFBRTtvQkFDYjt3QkFDQyxJQUFJLEVBQUUsMENBQTBDO3dCQUNoRCxFQUFFLEVBQUUsK0JBQStCO3FCQUNuQztvQkFDRDt3QkFDQyxJQUFJLEVBQUUsMkJBQTJCO3dCQUNqQyxFQUFFLEVBQUUsaUNBQWlDO3FCQUNyQztpQkFDRDthQUNEO1NBQ0QsQ0FBQztJQUNILENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCA9IGZ1bmN0aW9uIChncnVudDogSUdydW50KSB7XG5cdGdydW50LmxvYWROcG1UYXNrcygnZ3J1bnQtdGV4dC1yZXBsYWNlJyk7XG5cblx0cmV0dXJuIHtcblx0XHRhZGRJc3RhbmJ1bElnbm9yZToge1xuXHRcdFx0c3JjOiBbICc8JT0gZGV2RGlyZWN0b3J5ICU+LyoqLyouanMnIF0sXG5cdFx0XHRvdmVyd3JpdGU6IHRydWUsXG5cdFx0XHRyZXBsYWNlbWVudHM6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGZyb206IC9eKHZhciBfXyg/OmV4dGVuZHN8ZGVjb3JhdGV8cGFyYW0pID0gKS9nbSxcblx0XHRcdFx0XHR0bzogJyQxLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi8gJ1xuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0ZnJvbTogL14oXFwoKShmdW5jdGlvbiBcXChkZXBzLCApL20sXG5cdFx0XHRcdFx0dG86ICckMS8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovICQyJ1xuXHRcdFx0XHR9XG5cdFx0XHRdXG5cdFx0fVxuXHR9O1xufTtcbiJdfQ==