(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "grunt", "path", "mockery", "lodash"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var grunt = require("grunt");
    var path = require("path");
    var mockery = require("mockery");
    var _ = require("lodash");
    function createDummyFile(name, data) {
        grunt.file.write(path.join(getInputDirectory(), name), data ? data : '', {
            encoding: 'utf-8'
        });
    }
    exports.createDummyFile = createDummyFile;
    function createDummyDirectory(name) {
        var filePath = path.join(getInputDirectory(), name);
        grunt.file.mkdir(filePath);
    }
    exports.createDummyDirectory = createDummyDirectory;
    function getInputDirectory() {
        return './grunt-dojo2_debug-in';
    }
    exports.getInputDirectory = getInputDirectory;
    function getOutputDirectory() {
        return './grunt-dojo2_debug-out';
    }
    exports.getOutputDirectory = getOutputDirectory;
    function prepareInputDirectory() {
        grunt.file.mkdir(getInputDirectory());
    }
    exports.prepareInputDirectory = prepareInputDirectory;
    function prepareOutputDirectory() {
        grunt.file.mkdir(getOutputDirectory());
    }
    exports.prepareOutputDirectory = prepareOutputDirectory;
    function cleanInputDirectory() {
        grunt.file.delete(getInputDirectory());
    }
    exports.cleanInputDirectory = cleanInputDirectory;
    function cleanOutputDirectory() {
        grunt.file.delete(getOutputDirectory());
    }
    exports.cleanOutputDirectory = cleanOutputDirectory;
    function runGruntTask(taskName, callback) {
        var task = grunt.task._taskPlusArgs(taskName);
        return task.task.fn.apply({
            nameArgs: task.nameArgs,
            name: task.task.name,
            args: task.args,
            flags: task.flags,
            async: function () {
                return callback;
            }
        }, task.args);
    }
    exports.runGruntTask = runGruntTask;
    function fileExistsInOutputDirectory(fileName) {
        return grunt.file.exists(path.join(getOutputDirectory(), fileName));
    }
    exports.fileExistsInOutputDirectory = fileExistsInOutputDirectory;
    function fileExistsInInputDirectory(fileName) {
        return grunt.file.exists(path.join(getInputDirectory(), fileName));
    }
    exports.fileExistsInInputDirectory = fileExistsInInputDirectory;
    function registerMockList(mocks) {
        var keys = Object.keys(mocks);
        for (var i = 0; i < keys.length; i++) {
            mockery.registerMock(keys[i], mocks[keys[i]]);
        }
    }
    function loadModule(mid, mocks) {
        if (mocks === void 0) { mocks = {}; }
        mockery.enable({
            warnOnReplace: false,
            warnOnUnregistered: false,
            useCleanCache: true
        });
        mockery.resetCache();
        registerMockList(mocks);
        var loader = require.nodeRequire || require;
        return loader(require.toUrl(mid)).default;
    }
    exports.loadModule = loadModule;
    function loadTasks(mocks, options) {
        mockery.enable({
            warnOnReplace: false,
            warnOnUnregistered: false,
            useCleanCache: true
        });
        mockery.resetCache();
        mockery.registerMock('lodash', _);
        // Registering this mock as it has problems with `regenerate` from regexpu-core.
        mockery.registerMock('postcss-modules', function noop() { });
        if (mocks) {
            registerMockList(mocks);
        }
        grunt.registerTask('clean', 'Clean mock task', function () {
        });
        var packageJson = grunt.file.readJSON('package.json');
        if (options && options.peerDependencies) {
            packageJson.peerDependencies = options.peerDependencies;
        }
        grunt.file.expand(['tasks/*.js']).forEach(function (fileName) {
            require.nodeRequire('../../' + fileName.substr(0, fileName.length - 3))(grunt, packageJson);
        });
        // suppress grunt logging
        grunt.log._write = function () {
        };
    }
    exports.loadTasks = loadTasks;
    function unloadTasks() {
        mockery.deregisterAll();
        mockery.disable();
    }
    exports.unloadTasks = unloadTasks;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInV0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7SUFBQSw2QkFBK0I7SUFDL0IsMkJBQTZCO0lBQzdCLGlDQUFtQztJQUNuQywwQkFBNEI7SUFlNUIseUJBQWdDLElBQVksRUFBRSxJQUFhO1FBQzFELEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsRUFBRSxJQUFJLENBQUMsRUFBRSxJQUFJLEdBQUcsSUFBSSxHQUFHLEVBQUUsRUFBRTtZQUN4RSxRQUFRLEVBQUUsT0FBTztTQUNqQixDQUFDLENBQUM7SUFDSixDQUFDO0lBSkQsMENBSUM7SUFFRCw4QkFBcUMsSUFBWTtRQUNoRCxJQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLGlCQUFpQixFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDdEQsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDNUIsQ0FBQztJQUhELG9EQUdDO0lBRUQ7UUFDQyxNQUFNLENBQUMsd0JBQXdCLENBQUM7SUFDakMsQ0FBQztJQUZELDhDQUVDO0lBRUQ7UUFDQyxNQUFNLENBQUMseUJBQXlCLENBQUM7SUFDbEMsQ0FBQztJQUZELGdEQUVDO0lBRUQ7UUFDQyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxpQkFBaUIsRUFBRSxDQUFDLENBQUM7SUFDdkMsQ0FBQztJQUZELHNEQUVDO0lBRUQ7UUFDQyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxrQkFBa0IsRUFBRSxDQUFDLENBQUM7SUFDeEMsQ0FBQztJQUZELHdEQUVDO0lBRUQ7UUFDQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxpQkFBaUIsRUFBRSxDQUFDLENBQUM7SUFDeEMsQ0FBQztJQUZELGtEQUVDO0lBRUQ7UUFDQyxLQUFLLENBQUMs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LEVBQUUsaUJBQWlCLEVBQUU7UUFDL0MsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFNLFdBQVcsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUV4RCxFQUFFLENBQUMsQ0FBQyxPQUFPLElBQUksT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQztZQUN6QyxXQUFXLENBQUMsZ0JBQWdCLEdBQUcsT0FBTyxDQUFDLGdCQUFnQixDQUFDO1FBQ3pELENBQUM7UUFFRCxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFFLFlBQVksQ0FBRSxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUMsUUFBUTtZQUM3QyxPQUFRLENBQUMsV0FBVyxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBQ3JHLENBQUMsQ0FBQyxDQUFDO1FBRUgseUJBQXlCO1FBQ2xCLEtBQUssQ0FBQyxHQUFJLENBQUMsTUFBTSxHQUFHO1FBQzNCLENBQUMsQ0FBQztJQUNILENBQUM7SUFqQ0QsOEJBaUNDO0lBRUQ7UUFDQyxPQUFPLENBQUMsYUFBYSxFQUFFLENBQUM7UUFDeEIsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQ25CLENBQUM7SUFIRCxrQ0FHQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGdydW50IGZyb20gJ2dydW50JztcbmltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgKiBhcyBtb2NrZXJ5IGZyb20gJ21vY2tlcnknO1xuaW1wb3J0ICogYXMgXyBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IHsgSVJvb3RSZXF1aXJlIH0gZnJvbSAnZG9qby9sb2FkZXInO1xuXG5kZWNsYXJlIGNvbnN0IHJlcXVpcmU6IElSb290UmVxdWlyZTtcblxuZXhwb3J0IGludGVyZmFjZSBNb2NrTGlzdCB7XG5cdFtrZXk6IHN0cmluZ106IGFueTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBUYXNrTG9hZGluZ09wdGlvbnMge1xuXHRwZWVyRGVwZW5kZW5jaWVzPzoge1xuXHRcdFtrZXk6IHN0cmluZ106IGFueTtcblx0fTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUR1bW15RmlsZShuYW1lOiBzdHJpbmcsIGRhdGE/OiBzdHJpbmcpIHtcblx0Z3J1bnQuZmlsZS53cml0ZShwYXRoLmpvaW4oZ2V0SW5wdXREaXJlY3RvcnkoKSwgbmFtZSksIGRhdGEgPyBkYXRhIDogJycsIHtcblx0XHRlbmNvZGluZzogJ3V0Zi04J1xuXHR9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUR1bW15RGlyZWN0b3J5KG5hbWU6IHN0cmluZykge1xuXHRjb25zdCBmaWxlUGF0aCA9IHBhdGguam9pbihnZXRJbnB1dERpcmVjdG9yeSgpLCBuYW1lKTtcblx0Z3J1bnQuZmlsZS5ta2RpcihmaWxlUGF0aCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRJbnB1dERpcmVjdG9yeSgpIHtcblx0cmV0dXJuICcuL2dydW50LWRvam8yX2RlYnVnLWluJztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldE91dHB1dERpcmVjdG9yeSgpIHtcblx0cmV0dXJuICcuL2dydW50LWRvam8yX2RlYnVnLW91dCc7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwcmVwYXJlSW5wdXREaXJlY3RvcnkoKSB7XG5cdGdydW50LmZpbGUubWtkaXIoZ2V0SW5wdXREaXJlY3RvcnkoKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwcmVwYXJlT3V0cHV0RGlyZWN0b3J5KCkge1xuXHRncnVudC5maWxlLm1rZGlyKGdldE91dHB1dERpcmVjdG9yeSgpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNsZWFuSW5wdXREaXJlY3RvcnkoKSB7XG5cdGdydW50LmZpbGUuZGVsZXRlKGdldElucHV0RGlyZWN0b3J5KCkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY2xlYW5PdXRwdXREaXJlY3RvcnkoKSB7XG5cdGdydW50LmZpbGUuZGVsZXRlKGdldE91dHB1dERpcmVjdG9yeSgpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJ1bkdydW50VGFzayh0YXNrTmFtZTogc3RyaW5nLCBjYWxsYmFjaz86ICgpID0+IHZvaWQpIHtcblx0Y29uc3QgdGFzayA9ICg8YW55PiBncnVudC50YXNrKS5fdGFza1BsdXNBcmdzKHRhc2tOYW1lKTtcblxuXHRyZXR1cm4gdGFzay50YXNrLmZuLmFwcGx5KHtcblx0XHRuYW1lQXJnczogdGFzay5uYW1lQXJncyxcblx0XHRuYW1lOiB0YXNrLnRhc2submFtZSxcblx0XHRhcmdzOiB0YXNrLmFyZ3MsXG5cdFx0ZmxhZ3M6IHRhc2suZmxhZ3MsXG5cdFx0YXN5bmM6IGZ1bmN0aW9uICgpIHtcblx0XHRcdHJldHVybiBjYWxsYmFjaztcblx0XHR9XG5cdH0sIHRhc2suYXJncyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmaWxlRXhpc3RzSW5PdXRwdXREaXJlY3RvcnkoZmlsZU5hbWU6IHN0cmluZykge1xuXHRyZXR1cm4gZ3J1bnQuZmlsZS5leGlzdHMocGF0aC5qb2luKGdldE91dHB1dERpcmVjdG9yeSgpLCBmaWxlTmFtZSkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZmlsZUV4aXN0c0luSW5wdXREaXJlY3RvcnkoZmlsZU5hbWU6IHN0cmluZykge1xuXHRyZXR1cm4gZ3J1bnQuZmlsZS5leGlzdHMocGF0aC5qb2luKGdldElucHV0RGlyZWN0b3J5KCksIGZpbGVOYW1lKSk7XG59XG5cbmZ1bmN0aW9uIHJlZ2lzdGVyTW9ja0xpc3QobW9ja3M6IE1vY2tMaXN0KSB7XG5cdGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyhtb2Nrcyk7XG5cblx0Zm9yIChsZXQgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgaSsrKSB7XG5cdFx0bW9ja2VyeS5yZWdpc3Rlck1vY2soa2V5c1tpXSwgbW9ja3Nba2V5c1tpXV0pO1xuXHR9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBsb2FkTW9kdWxlKG1pZDogc3RyaW5nLCBtb2NrczogTW9ja0xpc3QgPSB7fSk6IGFueSB7XG5cdG1vY2tlcnkuZW5hYmxlKHtcblx0XHR3YXJuT25SZXBsYWNlOiBmYWxzZSxcblx0XHR3YXJuT25VbnJlZ2lzdGVyZWQ6IGZhbHNlLFxuXHRcdHVzZUNsZWFuQ2FjaGU6IHRydWVcblx0fSk7XG5cdG1vY2tlcnkucmVzZXRDYWNoZSgpO1xuXG5cdHJlZ2lzdGVyTW9ja0xpc3QobW9ja3MpO1xuXG5cdGNvbnN0IGxvYWRlciA9IHJlcXVpcmUubm9kZVJlcXVpcmUgfHwgcmVxdWlyZTtcblx0cmV0dXJuIGxvYWRlcihyZXF1aXJlLnRvVXJsKG1pZCkpLmRlZmF1bHQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBsb2FkVGFza3MobW9ja3M/OiBNb2NrTGlzdCwgb3B0aW9ucz86IFRhc2tMb2FkaW5nT3B0aW9ucykge1xuXHRtb2NrZXJ5LmVuYWJsZSh7XG5cdFx0d2Fybk9uUmVwbGFjZTogZmFsc2UsXG5cdFx0d2Fybk9uVW5yZWdpc3RlcmVkOiBmYWxzZSxcblx0XHR1c2VDbGVhbkNhY2hlOiB0cnVlXG5cdH0pO1xuXHRtb2NrZXJ5LnJlc2V0Q2FjaGUoKTtcblxuXHRtb2NrZXJ5LnJlZ2lzdGVyTW9jaygnbG9kYXNoJywgXyk7XG5cblx0Ly8gUmVnaXN0ZXJpbmcgdGhpcyBtb2NrIGFzIGl0IGhhcyBwcm9ibGVtcyB3aXRoIGByZWdlbmVyYXRlYCBmcm9tIHJlZ2V4cHUtY29yZS5cblx0bW9ja2VyeS5yZWdpc3Rlck1vY2soJ3Bvc3Rjc3MtbW9kdWxlcycsIGZ1bmN0aW9uIG5vb3AoKSB7fSk7XG5cblx0aWYgKG1vY2tzKSB7XG5cdFx0cmVnaXN0ZXJNb2NrTGlzdChtb2Nrcyk7XG5cdH1cblxuXHRncnVudC5yZWdpc3RlclRhc2soJ2NsZWFuJywgJ0NsZWFuIG1vY2sgdGFzaycsICgpID0+IHtcblx0fSk7XG5cblx0Y29uc3QgcGFja2FnZUpzb24gPSBncnVudC5maWxlLnJlYWRKU09OKCdwYWNrYWdlLmpzb24nKTtcblxuXHRpZiAob3B0aW9ucyAmJiBvcHRpb25zLnBlZXJEZXBlbmRlbmNpZXMpIHtcblx0XHRwYWNrYWdlSnNvbi5wZWVyRGVwZW5kZW5jaWVzID0gb3B0aW9ucy5wZWVyRGVwZW5kZW5jaWVzO1xuXHR9XG5cblx0Z3J1bnQuZmlsZS5leHBhbmQoWyAndGFza3MvKi5qcycgXSkuZm9yRWFjaCgoZmlsZU5hbWUpID0+IHtcblx0XHQoPGFueT4gcmVxdWlyZSkubm9kZVJlcXVpcmUoJy4uLy4uLycgKyBmaWxlTmFtZS5zdWJzdHIoMCwgZmlsZU5hbWUubGVuZ3RoIC0gMykpKGdydW50LCBwYWNrYWdlSnNvbik7XG5cdH0pO1xuXG5cdC8vIHN1cHByZXNzIGdydW50IGxvZ2dpbmdcblx0KDxhbnk+IGdydW50LmxvZykuX3dyaXRlID0gKCkgPT4ge1xuXHR9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdW5sb2FkVGFza3MoKSB7XG5cdG1vY2tlcnkuZGVyZWdpc3RlckFsbCgpO1xuXHRtb2NrZXJ5LmRpc2FibGUoKTtcbn1cbiJdfQ==