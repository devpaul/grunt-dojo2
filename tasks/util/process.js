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
    function applyOptions(options) {
        if (options === void 0) { options = {}; }
        options.encoding = options.encoding || 'utf8';
        options.stdio = options.stdio || (options.silent ? 'pipe' : 'inherit');
        return options;
    }
    function exec(command, options) {
        // Use execSync from child_process instead of shelljs.exec for better
        // handling of pass-through stdio
        return child_process_1.execSync(command, applyOptions(options));
    }
    exports.exec = exec;
    function spawn(command, args, options) {
        return child_process_1.spawnSync(command, args, applyOptions(options));
    }
    exports.spawn = spawn;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvY2Vzcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInByb2Nlc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7SUFBQSwrQ0FBb0Q7SUFFcEQsc0JBQXNCLE9BQWlCO1FBQWpCLHdCQUFBLEVBQUEsWUFBaUI7UUFDdEMsT0FBTyxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUMsUUFBUSxJQUFJLE1BQU0sQ0FBQztRQUM5QyxPQUFPLENBQUMsS0FBSyxHQUFHLE9BQU8sQ0FBQyxLQUFLLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxHQUFHLE1BQU0sR0FBRyxTQUFTLENBQUMsQ0FBQztRQUN2RSxNQUFNLENBQUMsT0FBTyxDQUFDO0lBQ2hCLENBQUM7SUFFRCxjQUFxQixPQUFlLEVBQUUsT0FBYTtRQUNsRCxxRUFBcUU7UUFDckUsaUNBQWlDO1FBQ2pDLE1BQU0sQ0FBQyx3QkFBUSxDQUFDLE9BQU8sRUFBRSxZQUFZLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztJQUNqRCxDQUFDO0lBSkQsb0JBSUM7SUFFRCxlQUFzQixPQUFlLEVBQUUsSUFBYyxFQUFFLE9BQWE7UUFDbkUsTUFBTSxDQUFDLHlCQUFTLENBQUMsT0FBTyxFQUFFLElBQUksRUFBRSxZQUFZLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztJQUN4RCxDQUFDO0lBRkQsc0JBRUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBleGVjU3luYywgc3Bhd25TeW5jIH0gZnJvbSAnY2hpbGRfcHJvY2Vzcyc7XG5cbmZ1bmN0aW9uIGFwcGx5T3B0aW9ucyhvcHRpb25zOiBhbnkgPSB7fSkge1xuXHRvcHRpb25zLmVuY29kaW5nID0gb3B0aW9ucy5lbmNvZGluZyB8fCAndXRmOCc7XG5cdG9wdGlvbnMuc3RkaW8gPSBvcHRpb25zLnN0ZGlvIHx8IChvcHRpb25zLnNpbGVudCA/ICdwaXBlJyA6ICdpbmhlcml0Jyk7XG5cdHJldHVybiBvcHRpb25zO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZXhlYyhjb21tYW5kOiBzdHJpbmcsIG9wdGlvbnM/OiBhbnkpIHtcblx0Ly8gVXNlIGV4ZWNTeW5jIGZyb20gY2hpbGRfcHJvY2VzcyBpbnN0ZWFkIG9mIHNoZWxsanMuZXhlYyBmb3IgYmV0dGVyXG5cdC8vIGhhbmRsaW5nIG9mIHBhc3MtdGhyb3VnaCBzdGRpb1xuXHRyZXR1cm4gZXhlY1N5bmMoY29tbWFuZCwgYXBwbHlPcHRpb25zKG9wdGlvbnMpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNwYXduKGNvbW1hbmQ6IHN0cmluZywgYXJnczogc3RyaW5nW10sIG9wdGlvbnM/OiBhbnkpIHtcblx0cmV0dXJuIHNwYXduU3luYyhjb21tYW5kLCBhcmdzLCBhcHBseU9wdGlvbnMob3B0aW9ucykpO1xufVxuIl19