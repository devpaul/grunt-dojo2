(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "child_process"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var child_process_1 = require("child_process");
    function exec(command, options) {
        if (options === void 0) { options = {}; }
        // Use execSync from child_process instead of shelljs.exec for better
        // handling of pass-through stdio
        options.encoding = options.encoding || 'utf8';
        options.stdio = options.stdio || (options.silent ? 'pipe' : 'inherit');
        return child_process_1.execSync(command, options);
    }
    exports.default = exec;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImV4ZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7SUFBQSwrQ0FBeUM7SUFFekMsY0FBNkIsT0FBZSxFQUFFLE9BQWlCO1FBQWpCLHdCQUFBLEVBQUEsWUFBaUI7UUFDOUQscUVBQXFFO1FBQ3JFLGlDQUFpQztRQUNqQyxPQUFPLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQyxRQUFRLElBQUksTUFBTSxDQUFDO1FBQzlDLE9BQU8sQ0FBQyxLQUFLLEdBQUcsT0FBTyxDQUFDLEtBQUssSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsTUFBTSxHQUFHLFNBQVMsQ0FBQyxDQUFDO1FBQ3ZFLE1BQU0sQ0FBQyx3QkFBUSxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQztJQUNuQyxDQUFDO0lBTkQsdUJBTUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBleGVjU3luYyB9IGZyb20gJ2NoaWxkX3Byb2Nlc3MnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBleGVjKGNvbW1hbmQ6IHN0cmluZywgb3B0aW9uczogYW55ID0ge30pIHtcblx0Ly8gVXNlIGV4ZWNTeW5jIGZyb20gY2hpbGRfcHJvY2VzcyBpbnN0ZWFkIG9mIHNoZWxsanMuZXhlYyBmb3IgYmV0dGVyXG5cdC8vIGhhbmRsaW5nIG9mIHBhc3MtdGhyb3VnaCBzdGRpb1xuXHRvcHRpb25zLmVuY29kaW5nID0gb3B0aW9ucy5lbmNvZGluZyB8fCAndXRmOCc7XG5cdG9wdGlvbnMuc3RkaW8gPSBvcHRpb25zLnN0ZGlvIHx8IChvcHRpb25zLnNpbGVudCA/ICdwaXBlJyA6ICdpbmhlcml0Jyk7XG5cdHJldHVybiBleGVjU3luYyhjb21tYW5kLCBvcHRpb25zKTtcbn1cbiJdfQ==