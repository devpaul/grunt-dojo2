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
    function loadModule(mid, mocks, returnDefault) {
        if (mocks === void 0) { mocks = {}; }
        if (returnDefault === void 0) { returnDefault = true; }
        mockery.enable({
            warnOnReplace: false,
            warnOnUnregistered: false,
            useCleanCache: true
        });
        mockery.resetCache();
        registerMockList(mocks);
        var loader = require.nodeRequire || require;
        var module = loader(require.toUrl(mid));
        return returnDefault ? module.default : module;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInV0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7SUFBQSw2QkFBK0I7SUFDL0IsMkJBQTZCO0lBQzdCLGlDQUFtQztJQUNuQywwQkFBNEI7SUFlNUIseUJBQWdDLElBQVksRUFBRSxJQUFhO1FBQzFELEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsRUFBRSxJQUFJLENBQUMsRUFBRSxJQUFJLEdBQUcsSUFBSSxHQUFHLEVBQUUsRUFBRTtZQUN4RSxRQUFRLEVBQUUsT0FBTztTQUNqQixDQUFDLENBQUM7SUFDSixDQUFDO0lBSkQsMENBSUM7SUFFRCw4QkFBcUMsSUFBWTtRQUNoRCxJQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLGlCQUFpQixFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDdEQsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDNUIsQ0FBQztJQUhELG9EQUdDO0lBRUQ7UUFDQyxNQUFNLENBQUMsd0JBQXdCLENBQUM7SUFDakMsQ0FBQztJQUZELDhDQUVDO0lBRUQ7UUFDQyxNQUFNLENBQUMseUJBQXlCLENBQUM7SUFDbEMsQ0FBQztJQUZELGdEQUVDO0lBRUQ7UUFDQyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxpQkFBaUIsRUFBRSxDQUFDLENBQUM7SUFDdkMsQ0FBQztJQUZELHNEQUVDO0lBRUQ7UUFDQyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxrQkFBa0IsRUFBRSxDQUFDLENBQUM7SUFDeEMsQ0FBQztJQUZELHdEQUVDO0lBRUQ7UUFDQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxpQkFBaUIsRUFBRSxDQUFDLENBQUM7SUFDeEMsQ0FBQztJQUZELGtEQUVDO0lBRUQ7UUFDQyxLQUFLLENBQUMs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QUMsQ0FBQyxDQUFDO1lBQ1gsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDekIsQ0FBQztRQUVELEtBQUssQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLGlCQUFpQixFQUFFO1FBQy9DLENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBTSxXQUFXLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLENBQUM7UUFFeEQsRUFBRSxDQUFDLENBQUMsT0FBTyxJQUFJLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7WUFDekMsV0FBVyxDQUFDLGdCQUFnQixHQUFHLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQztRQUN6RCxDQUFDO1FBRUQsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBRSxZQUFZLENBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFDLFFBQVE7WUFDN0MsT0FBUSxDQUFDLFdBQVcsQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxXQUFXLENBQUMsQ0FBQztRQUNyRyxDQUFDLENBQUMsQ0FBQztRQUVILHlCQUF5QjtRQUNsQixLQUFLLENBQUMsR0FBSSxDQUFDLE1BQU0sR0FBRztRQUMzQixDQUFDLENBQUM7SUFDSCxDQUFDO0lBakNELDhCQWlDQztJQUVEO1FBQ0MsT0FBTyxDQUFDLGFBQWEsRUFBRSxDQUFDO1FBQ3hCLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUNuQixDQUFDO0lBSEQsa0NBR0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBncnVudCBmcm9tICdncnVudCc7XG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0ICogYXMgbW9ja2VyeSBmcm9tICdtb2NrZXJ5JztcbmltcG9ydCAqIGFzIF8gZnJvbSAnbG9kYXNoJztcbmltcG9ydCB7IElSb290UmVxdWlyZSB9IGZyb20gJ2Rvam8vbG9hZGVyJztcblxuZGVjbGFyZSBjb25zdCByZXF1aXJlOiBJUm9vdFJlcXVpcmU7XG5cbmV4cG9ydCBpbnRlcmZhY2UgTW9ja0xpc3Qge1xuXHRba2V5OiBzdHJpbmddOiBhbnk7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgVGFza0xvYWRpbmdPcHRpb25zIHtcblx0cGVlckRlcGVuZGVuY2llcz86IHtcblx0XHRba2V5OiBzdHJpbmddOiBhbnk7XG5cdH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVEdW1teUZpbGUobmFtZTogc3RyaW5nLCBkYXRhPzogc3RyaW5nKSB7XG5cdGdydW50LmZpbGUud3JpdGUocGF0aC5qb2luKGdldElucHV0RGlyZWN0b3J5KCksIG5hbWUpLCBkYXRhID8gZGF0YSA6ICcnLCB7XG5cdFx0ZW5jb2Rpbmc6ICd1dGYtOCdcblx0fSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVEdW1teURpcmVjdG9yeShuYW1lOiBzdHJpbmcpIHtcblx0Y29uc3QgZmlsZVBhdGggPSBwYXRoLmpvaW4oZ2V0SW5wdXREaXJlY3RvcnkoKSwgbmFtZSk7XG5cdGdydW50LmZpbGUubWtkaXIoZmlsZVBhdGgpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0SW5wdXREaXJlY3RvcnkoKSB7XG5cdHJldHVybiAnLi9ncnVudC1kb2pvMl9kZWJ1Zy1pbic7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRPdXRwdXREaXJlY3RvcnkoKSB7XG5cdHJldHVybiAnLi9ncnVudC1kb2pvMl9kZWJ1Zy1vdXQnO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcHJlcGFyZUlucHV0RGlyZWN0b3J5KCkge1xuXHRncnVudC5maWxlLm1rZGlyKGdldElucHV0RGlyZWN0b3J5KCkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcHJlcGFyZU91dHB1dERpcmVjdG9yeSgpIHtcblx0Z3J1bnQuZmlsZS5ta2RpcihnZXRPdXRwdXREaXJlY3RvcnkoKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjbGVhbklucHV0RGlyZWN0b3J5KCkge1xuXHRncnVudC5maWxlLmRlbGV0ZShnZXRJbnB1dERpcmVjdG9yeSgpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNsZWFuT3V0cHV0RGlyZWN0b3J5KCkge1xuXHRncnVudC5maWxlLmRlbGV0ZShnZXRPdXRwdXREaXJlY3RvcnkoKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBydW5HcnVudFRhc2sodGFza05hbWU6IHN0cmluZywgY2FsbGJhY2s/OiAoKSA9PiB2b2lkKSB7XG5cdGNvbnN0IHRhc2sgPSAoPGFueT4gZ3J1bnQudGFzaykuX3Rhc2tQbHVzQXJncyh0YXNrTmFtZSk7XG5cblx0cmV0dXJuIHRhc2sudGFzay5mbi5hcHBseSh7XG5cdFx0bmFtZUFyZ3M6IHRhc2submFtZUFyZ3MsXG5cdFx0bmFtZTogdGFzay50YXNrLm5hbWUsXG5cdFx0YXJnczogdGFzay5hcmdzLFxuXHRcdGZsYWdzOiB0YXNrLmZsYWdzLFxuXHRcdGFzeW5jOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRyZXR1cm4gY2FsbGJhY2s7XG5cdFx0fVxuXHR9LCB0YXNrLmFyZ3MpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZmlsZUV4aXN0c0luT3V0cHV0RGlyZWN0b3J5KGZpbGVOYW1lOiBzdHJpbmcpIHtcblx0cmV0dXJuIGdydW50LmZpbGUuZXhpc3RzKHBhdGguam9pbihnZXRPdXRwdXREaXJlY3RvcnkoKSwgZmlsZU5hbWUpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZpbGVFeGlzdHNJbklucHV0RGlyZWN0b3J5KGZpbGVOYW1lOiBzdHJpbmcpIHtcblx0cmV0dXJuIGdydW50LmZpbGUuZXhpc3RzKHBhdGguam9pbihnZXRJbnB1dERpcmVjdG9yeSgpLCBmaWxlTmFtZSkpO1xufVxuXG5mdW5jdGlvbiByZWdpc3Rlck1vY2tMaXN0KG1vY2tzOiBNb2NrTGlzdCkge1xuXHRjb25zdCBrZXlzID0gT2JqZWN0LmtleXMobW9ja3MpO1xuXG5cdGZvciAobGV0IGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7IGkrKykge1xuXHRcdG1vY2tlcnkucmVnaXN0ZXJNb2NrKGtleXNbaV0sIG1vY2tzW2tleXNbaV1dKTtcblx0fVxufVxuXG5leHBvcnQgZnVuY3Rpb24gbG9hZE1vZHVsZShtaWQ6IHN0cmluZywgbW9ja3M6IE1vY2tMaXN0ID0ge30sIHJldHVybkRlZmF1bHQgPSB0cnVlKTogYW55IHtcblx0bW9ja2VyeS5lbmFibGUoe1xuXHRcdHdhcm5PblJlcGxhY2U6IGZhbHNlLFxuXHRcdHdhcm5PblVucmVnaXN0ZXJlZDogZmFsc2UsXG5cdFx0dXNlQ2xlYW5DYWNoZTogdHJ1ZVxuXHR9KTtcblx0bW9ja2VyeS5yZXNldENhY2hlKCk7XG5cblx0cmVnaXN0ZXJNb2NrTGlzdChtb2Nrcyk7XG5cblx0Y29uc3QgbG9hZGVyID0gcmVxdWlyZS5ub2RlUmVxdWlyZSB8fCByZXF1aXJlO1xuXHRjb25zdCBtb2R1bGUgPSBsb2FkZXIocmVxdWlyZS50b1VybChtaWQpKTtcblx0cmV0dXJuIHJldHVybkRlZmF1bHQgPyBtb2R1bGUuZGVmYXVsdCA6IG1vZHVsZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGxvYWRUYXNrcyhtb2Nrcz86IE1vY2tMaXN0LCBvcHRpb25zPzogVGFza0xvYWRpbmdPcHRpb25zKSB7XG5cdG1vY2tlcnkuZW5hYmxlKHtcblx0XHR3YXJuT25SZXBsYWNlOiBmYWxzZSxcblx0XHR3YXJuT25VbnJlZ2lzdGVyZWQ6IGZhbHNlLFxuXHRcdHVzZUNsZWFuQ2FjaGU6IHRydWVcblx0fSk7XG5cdG1vY2tlcnkucmVzZXRDYWNoZSgpO1xuXG5cdG1vY2tlcnkucmVnaXN0ZXJNb2NrKCdsb2Rhc2gnLCBfKTtcblxuXHQvLyBSZWdpc3RlcmluZyB0aGlzIG1vY2sgYXMgaXQgaGFzIHByb2JsZW1zIHdpdGggYHJlZ2VuZXJhdGVgIGZyb20gcmVnZXhwdS1jb3JlLlxuXHRtb2NrZXJ5LnJlZ2lzdGVyTW9jaygncG9zdGNzcy1tb2R1bGVzJywgZnVuY3Rpb24gbm9vcCgpIHt9KTtcblxuXHRpZiAobW9ja3MpIHtcblx0XHRyZWdpc3Rlck1vY2tMaXN0KG1vY2tzKTtcblx0fVxuXG5cdGdydW50LnJlZ2lzdGVyVGFzaygnY2xlYW4nLCAnQ2xlYW4gbW9jayB0YXNrJywgKCkgPT4ge1xuXHR9KTtcblxuXHRjb25zdCBwYWNrYWdlSnNvbiA9IGdydW50LmZpbGUucmVhZEpTT04oJ3BhY2thZ2UuanNvbicpO1xuXG5cdGlmIChvcHRpb25zICYmIG9wdGlvbnMucGVlckRlcGVuZGVuY2llcykge1xuXHRcdHBhY2thZ2VKc29uLnBlZXJEZXBlbmRlbmNpZXMgPSBvcHRpb25zLnBlZXJEZXBlbmRlbmNpZXM7XG5cdH1cblxuXHRncnVudC5maWxlLmV4cGFuZChbICd0YXNrcy8qLmpzJyBdKS5mb3JFYWNoKChmaWxlTmFtZSkgPT4ge1xuXHRcdCg8YW55PiByZXF1aXJlKS5ub2RlUmVxdWlyZSgnLi4vLi4vJyArIGZpbGVOYW1lLnN1YnN0cigwLCBmaWxlTmFtZS5sZW5ndGggLSAzKSkoZ3J1bnQsIHBhY2thZ2VKc29uKTtcblx0fSk7XG5cblx0Ly8gc3VwcHJlc3MgZ3J1bnQgbG9nZ2luZ1xuXHQoPGFueT4gZ3J1bnQubG9nKS5fd3JpdGUgPSAoKSA9PiB7XG5cdH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB1bmxvYWRUYXNrcygpIHtcblx0bW9ja2VyeS5kZXJlZ2lzdGVyQWxsKCk7XG5cdG1vY2tlcnkuZGlzYWJsZSgpO1xufVxuIl19