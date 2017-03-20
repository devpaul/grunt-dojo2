(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "intern"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    require("intern");
    exports.loaderOptions = {
        packages: [
            { name: 'grunt-dojo2', location: '.' }
        ]
    };
    exports.suites = ['grunt-dojo2/tests/unit/all'];
    exports.excludeInstrumentation = /^(?:tests|node_modules)\//;
    exports.loaders = {
        'host-node': 'dojo-loader'
    };
    exports.filterErrorStack = true;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZXJuLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW50ZXJuLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0lBQUEsa0JBQWdCO0lBRUgsUUFBQSxhQUFhLEdBQUc7UUFDNUIsUUFBUSxFQUFFO1lBQ1QsRUFBQyxJQUFJLEVBQUUsYUFBYSxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUM7U0FDcEM7S0FDRCxDQUFDO0lBRVcsUUFBQSxNQUFNLEdBQUcsQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDO0lBRXhDLFFBQUEsc0JBQXNCLEdBQUcsMkJBQTJCLENBQUM7SUFFckQsUUFBQSxPQUFPLEdBQUc7UUFDdEIsV0FBVyxFQUFFLGFBQWE7S0FDMUIsQ0FBQztJQUVXLFFBQUEsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICdpbnRlcm4nO1xuXG5leHBvcnQgY29uc3QgbG9hZGVyT3B0aW9ucyA9IHtcblx0cGFja2FnZXM6IFtcblx0XHR7bmFtZTogJ2dydW50LWRvam8yJywgbG9jYXRpb246ICcuJ31cblx0XVxufTtcblxuZXhwb3J0IGNvbnN0IHN1aXRlcyA9IFsnZ3J1bnQtZG9qbzIvdGVzdHMvdW5pdC9hbGwnXTtcblxuZXhwb3J0IGNvbnN0IGV4Y2x1ZGVJbnN0cnVtZW50YXRpb24gPSAvXig/OnRlc3RzfG5vZGVfbW9kdWxlcylcXC8vO1xuXG5leHBvcnQgY29uc3QgbG9hZGVycyA9IHtcblx0J2hvc3Qtbm9kZSc6ICdkb2pvLWxvYWRlcidcbn07XG5cbmV4cG9ydCBjb25zdCBmaWx0ZXJFcnJvclN0YWNrID0gdHJ1ZTtcbiJdfQ==