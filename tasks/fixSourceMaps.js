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
        /**
         * When compiling with --inlineSources, tsc generates sources which include folder
         * paths. Until this is fixed, we need to remove paths leaving just the filename.
         *
         * ie '../../src/has.ts' -> 'has.ts'
         *
         * @param sourceMap input source map
         * @return modified source map
         */
        function fixSources(sourceMap) {
            sourceMap.sources = sourceMap.sources.map(function (source) { return source.replace(/.*\//, ''); });
            return sourceMap;
        }
        grunt.registerTask('fixSourceMaps', function () {
            var dist = grunt.config('distDirectory');
            var fixers = [fixSources];
            grunt.file.expand({ filter: 'isFile' }, [dist + '/**/*.js.map']).forEach(function (path) {
                var inputSourceMap = grunt.file.readJSON(path);
                var outputSourceMap = fixers.reduce(function (sourceMap, fixer) { return fixer(sourceMap); }, inputSourceMap);
                grunt.file.write(path, JSON.stringify(outputSourceMap));
            });
        });
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZml4U291cmNlTWFwcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImZpeFNvdXJjZU1hcHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztJQUFBLE9BQVMsVUFBVSxLQUFhO1FBRS9COzs7Ozs7OztXQVFHO1FBQ0gsb0JBQW9CLFNBQWM7WUFDakMsU0FBUyxDQUFDLE9BQU8sR0FBRyxTQUFTLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFDLE1BQWMsSUFBSyxPQUFBLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUExQixDQUEwQixDQUFDLENBQUM7WUFDMUYsTUFBTSxDQUFDLFNBQVMsQ0FBQztRQUNsQixDQUFDO1FBRUQsS0FBSyxDQUFDLFlBQVksQ0FBQyxlQUFlLEVBQVE7WUFDekMsSUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUMsQ0FBQztZQUMzQyxJQUFNLE1BQU0sR0FBRyxDQUFFLFVBQVUsQ0FBRSxDQUFDO1lBQzlCLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBQyxFQUFFLENBQUMsSUFBSSxHQUFHLGNBQWMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVMsSUFBSTtnQkFDcEYsSUFBTSxjQUFjLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ2pELElBQU0sZUFBZSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsVUFBQyxTQUFTLEVBQUUsS0FBSyxJQUFLLE9BQUEsS0FBSyxDQUFDLFNBQVMsQ0FBQyxFQUFoQixDQUFnQixFQUFFLGNBQWMsQ0FBQyxDQUFDO2dCQUM5RixLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDO1lBQ3pELENBQUMsQ0FBQyxDQUFDO1FBQ0osQ0FBQyxDQUFDLENBQUM7SUFDSixDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgPSBmdW5jdGlvbiAoZ3J1bnQ6IElHcnVudCkge1xuXG5cdC8qKlxuXHQgKiBXaGVuIGNvbXBpbGluZyB3aXRoIC0taW5saW5lU291cmNlcywgdHNjIGdlbmVyYXRlcyBzb3VyY2VzIHdoaWNoIGluY2x1ZGUgZm9sZGVyXG5cdCAqIHBhdGhzLiBVbnRpbCB0aGlzIGlzIGZpeGVkLCB3ZSBuZWVkIHRvIHJlbW92ZSBwYXRocyBsZWF2aW5nIGp1c3QgdGhlIGZpbGVuYW1lLlxuXHQgKlxuXHQgKiBpZSAnLi4vLi4vc3JjL2hhcy50cycgLT4gJ2hhcy50cydcblx0ICpcblx0ICogQHBhcmFtIHNvdXJjZU1hcCBpbnB1dCBzb3VyY2UgbWFwXG5cdCAqIEByZXR1cm4gbW9kaWZpZWQgc291cmNlIG1hcFxuXHQgKi9cblx0ZnVuY3Rpb24gZml4U291cmNlcyhzb3VyY2VNYXA6IGFueSk6IGFueSB7XG5cdFx0c291cmNlTWFwLnNvdXJjZXMgPSBzb3VyY2VNYXAuc291cmNlcy5tYXAoKHNvdXJjZTogc3RyaW5nKSA9PiBzb3VyY2UucmVwbGFjZSgvLipcXC8vLCAnJykpO1xuXHRcdHJldHVybiBzb3VyY2VNYXA7XG5cdH1cblxuXHRncnVudC5yZWdpc3RlclRhc2soJ2ZpeFNvdXJjZU1hcHMnLCA8YW55PiBmdW5jdGlvbiAoKSB7XG5cdFx0Y29uc3QgZGlzdCA9IGdydW50LmNvbmZpZygnZGlzdERpcmVjdG9yeScpO1xuXHRcdGNvbnN0IGZpeGVycyA9IFsgZml4U291cmNlcyBdO1xuXHRcdGdydW50LmZpbGUuZXhwYW5kKHsgZmlsdGVyOiAnaXNGaWxlJ30sIFtkaXN0ICsgJy8qKi8qLmpzLm1hcCddKS5mb3JFYWNoKGZ1bmN0aW9uKHBhdGgpIHtcblx0XHRcdGNvbnN0IGlucHV0U291cmNlTWFwID0gZ3J1bnQuZmlsZS5yZWFkSlNPTihwYXRoKTtcblx0XHRcdGNvbnN0IG91dHB1dFNvdXJjZU1hcCA9IGZpeGVycy5yZWR1Y2UoKHNvdXJjZU1hcCwgZml4ZXIpID0+IGZpeGVyKHNvdXJjZU1hcCksIGlucHV0U291cmNlTWFwKTtcblx0XHRcdGdydW50LmZpbGUud3JpdGUocGF0aCwgSlNPTi5zdHJpbmdpZnkob3V0cHV0U291cmNlTWFwKSk7XG5cdFx0fSk7XG5cdH0pO1xufTtcbiJdfQ==