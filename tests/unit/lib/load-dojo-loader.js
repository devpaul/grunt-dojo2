(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "intern!object", "intern/chai!assert", "mockery"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var registerSuite = require("intern!object");
    var assert = require("intern/chai!assert");
    var mockery = require("mockery");
    registerSuite({
        name: 'lib/load-dojo-loader',
        setup: function () {
            mockery.enable({
                warnOnReplace: false,
                warnOnUnregistered: false,
                useCleanCache: true
            });
        },
        teardown: function () {
            mockery.disable();
        },
        run: function () {
            mockery.registerMock('resolve-from', function (baseUrl, mid) {
                return '/' + mid;
            });
            var configBaseUrl = '';
            var configPackages = [];
            var fakeRequire = {
                require: function () {
                },
                config: function (obj) {
                    configBaseUrl = obj.baseUrl;
                    configPackages = obj.packages;
                }
            };
            mockery.registerMock('/dojo-loader', fakeRequire);
            var loader = require.nodeRequire('../../lib/load-dojo-loader').default;
            var result = loader({
                peerDependencies: {
                    'test': 'test',
                    'dojo-loader': 'dojo-loader',
                    '@reactivex/rxjs': true,
                    'maquette': true,
                    'immutable': true
                }
            });
            assert.equal(configBaseUrl, process.cwd());
            assert.deepEqual(configPackages, [
                { name: 'src', location: '_build/src' },
                { name: 'test', location: 'node_modules/test' },
                { name: 'dojo-loader', location: 'node_modules/dojo-loader/dist/umd' },
                { name: 'rxjs', location: 'node_modules/@reactivex/rxjs/dist/amd' },
                { name: 'maquette', location: 'node_modules/maquette/dist' },
                { name: 'immutable', location: 'node_modules/immutable/dist' }
            ]);
            assert.equal(result.baseUrl, configBaseUrl);
            assert.deepEqual(result.packages, configPackages);
            assert.equal(result.require, fakeRequire);
        }
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9hZC1kb2pvLWxvYWRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImxvYWQtZG9qby1sb2FkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7SUFBQSw2Q0FBK0M7SUFDL0MsMkNBQTZDO0lBQzdDLGlDQUFtQztJQUVuQyxhQUFhLENBQUM7UUFDYixJQUFJLEVBQUUsc0JBQXNCO1FBQzVCLEtBQUssRUFBRTtZQUNOLE9BQU8sQ0FBQyxNQUFNLENBQUM7Z0JBQ2QsYUFBYSxFQUFFLEtBQUs7Z0JBQ3BCLGtCQUFrQixFQUFFLEtBQUs7Z0JBQ3pCLGFBQWEsRUFBRSxJQUFJO2FBQ25CLENBQUMsQ0FBQztRQUNKLENBQUM7UUFDRCxRQUFRLEVBQUU7WUFDVCxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDbkIsQ0FBQztRQUVELEdBQUcsRUFBRTtZQUNKLE9BQU8sQ0FBQyxZQUFZLENBQUMsY0FBYyxFQUFFLFVBQVUsT0FBZSxFQUFFLEdBQVc7Z0JBQzFFLE1BQU0sQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO1lBQ2xCLENBQUMsQ0FBQyxDQUFDO1lBRUgsSUFBSSxhQUFhLEdBQVcsRUFBRSxDQUFDO1lBQy9CLElBQUksY0FBYyxHQUdaLEVBQUUsQ0FBQztZQUVULElBQUksV0FBVyxHQUFHO2dCQUNqQixPQUFPLEVBQUU7Z0JBQ1QsQ0FBQztnQkFDRCxNQUFNLEVBQUUsVUFBVSxHQUFRO29CQUN6QixhQUFhLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQztvQkFDNUIsY0FBYyxHQUFHLEdBQUcsQ0FBQyxRQUFRLENBQUM7Z0JBQy9CLENBQUM7YUFDRCxDQUFDO1lBRUYsT0FBTyxDQUFDLFlBQVksQ0FBQyxjQUFjLEVBQUUsV0FBVyxDQUFDLENBQUM7WUFFbEQsSUFBSSxNQUFNLEdBQVUsT0FBUSxDQUFDLFdBQVcsQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDLE9BQU8sQ0FBQztZQUUvRSxJQUFJLE1BQU0sR0FBRyxNQUFNLENBQUM7Z0JBQ25CLGdCQUFnQixFQUFFO29CQUNqQixNQUFNLEVBQUUsTUFBTTtvQkFDZCxhQUFhLEVBQUUsYUFBYTtvQkFDNUIsaUJBQWlCLEVBQUUsSUFBSTtvQkFDdkIsVUFBVSxFQUFFLElBQUk7b0JBQ2hCLFdBQVcsRUFBRSxJQUFJO2lCQUNqQjthQUNELENBQUMsQ0FBQztZQUVILE1BQU0sQ0FBQyxLQUFLLENBQUMsYUFBYSxFQUFFLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO1lBQzNDLE1BQU0sQ0FBQyxTQUFTLENBQUMsY0FBYyxFQUFFO2dCQUNoQyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLFlBQVksRUFBRTtnQkFDdkMsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxtQkFBbUIsRUFBRTtnQkFDL0MsRUFBRSxJQUFJLEVBQUUsYUFBYSxFQUFFLFFBQVEsRUFBRSxtQ0FBbUMsRUFBRTtnQkFDdEUsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSx1Q0FBdUMsRUFBRTtnQkFDbkUsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSw0QkFBNEIsRUFBRTtnQkFDNUQsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLFFBQVEsRUFBRSw2QkFBNkIsRUFBRTthQUM5RCxDQUFDLENBQUM7WUFFSCxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsYUFBYSxDQUFDLENBQUM7WUFDNUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLGNBQWMsQ0FBQyxDQUFDO1lBQ2xELE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxXQUFXLENBQUMsQ0FBQztRQUMzQyxDQUFDO0tBQ0QsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgcmVnaXN0ZXJTdWl0ZSBmcm9tICdpbnRlcm4hb2JqZWN0JztcbmltcG9ydCAqIGFzIGFzc2VydCBmcm9tICdpbnRlcm4vY2hhaSFhc3NlcnQnO1xuaW1wb3J0ICogYXMgbW9ja2VyeSBmcm9tICdtb2NrZXJ5JztcblxucmVnaXN0ZXJTdWl0ZSh7XG5cdG5hbWU6ICdsaWIvbG9hZC1kb2pvLWxvYWRlcicsXG5cdHNldHVwOiBmdW5jdGlvbiAoKSB7XG5cdFx0bW9ja2VyeS5lbmFibGUoe1xuXHRcdFx0d2Fybk9uUmVwbGFjZTogZmFsc2UsXG5cdFx0XHR3YXJuT25VbnJlZ2lzdGVyZWQ6IGZhbHNlLFxuXHRcdFx0dXNlQ2xlYW5DYWNoZTogdHJ1ZVxuXHRcdH0pO1xuXHR9LFxuXHR0ZWFyZG93bjogZnVuY3Rpb24gKCkge1xuXHRcdG1vY2tlcnkuZGlzYWJsZSgpO1xuXHR9LFxuXG5cdHJ1bjogZnVuY3Rpb24gKCkge1xuXHRcdG1vY2tlcnkucmVnaXN0ZXJNb2NrKCdyZXNvbHZlLWZyb20nLCBmdW5jdGlvbiAoYmFzZVVybDogc3RyaW5nLCBtaWQ6IHN0cmluZykge1xuXHRcdFx0cmV0dXJuICcvJyArIG1pZDtcblx0XHR9KTtcblxuXHRcdGxldCBjb25maWdCYXNlVXJsOiBzdHJpbmcgPSAnJztcblx0XHRsZXQgY29uZmlnUGFja2FnZXM6IHtcblx0XHRcdG5hbWU6IHN0cmluZyxcblx0XHRcdGxvY2F0aW9uOiBzdHJpbmdcblx0XHR9W10gPSBbXTtcblxuXHRcdGxldCBmYWtlUmVxdWlyZSA9IHtcblx0XHRcdHJlcXVpcmU6IGZ1bmN0aW9uICgpIHtcblx0XHRcdH0sXG5cdFx0XHRjb25maWc6IGZ1bmN0aW9uIChvYmo6IGFueSkge1xuXHRcdFx0XHRjb25maWdCYXNlVXJsID0gb2JqLmJhc2VVcmw7XG5cdFx0XHRcdGNvbmZpZ1BhY2thZ2VzID0gb2JqLnBhY2thZ2VzO1xuXHRcdFx0fVxuXHRcdH07XG5cblx0XHRtb2NrZXJ5LnJlZ2lzdGVyTW9jaygnL2Rvam8tbG9hZGVyJywgZmFrZVJlcXVpcmUpO1xuXG5cdFx0bGV0IGxvYWRlciA9ICg8YW55PiByZXF1aXJlKS5ub2RlUmVxdWlyZSgnLi4vLi4vbGliL2xvYWQtZG9qby1sb2FkZXInKS5kZWZhdWx0O1xuXG5cdFx0bGV0IHJlc3VsdCA9IGxvYWRlcih7XG5cdFx0XHRwZWVyRGVwZW5kZW5jaWVzOiB7XG5cdFx0XHRcdCd0ZXN0JzogJ3Rlc3QnLFxuXHRcdFx0XHQnZG9qby1sb2FkZXInOiAnZG9qby1sb2FkZXInLFxuXHRcdFx0XHQnQHJlYWN0aXZleC9yeGpzJzogdHJ1ZSxcblx0XHRcdFx0J21hcXVldHRlJzogdHJ1ZSxcblx0XHRcdFx0J2ltbXV0YWJsZSc6IHRydWVcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdGFzc2VydC5lcXVhbChjb25maWdCYXNlVXJsLCBwcm9jZXNzLmN3ZCgpKTtcblx0XHRhc3NlcnQuZGVlcEVxdWFsKGNvbmZpZ1BhY2thZ2VzLCBbXG5cdFx0XHR7IG5hbWU6ICdzcmMnLCBsb2NhdGlvbjogJ19idWlsZC9zcmMnIH0sXG5cdFx0XHR7IG5hbWU6ICd0ZXN0JywgbG9jYXRpb246ICdub2RlX21vZHVsZXMvdGVzdCcgfSxcblx0XHRcdHsgbmFtZTogJ2Rvam8tbG9hZGVyJywgbG9jYXRpb246ICdub2RlX21vZHVsZXMvZG9qby1sb2FkZXIvZGlzdC91bWQnIH0sXG5cdFx0XHR7IG5hbWU6ICdyeGpzJywgbG9jYXRpb246ICdub2RlX21vZHVsZXMvQHJlYWN0aXZleC9yeGpzL2Rpc3QvYW1kJyB9LFxuXHRcdFx0eyBuYW1lOiAnbWFxdWV0dGUnLCBsb2NhdGlvbjogJ25vZGVfbW9kdWxlcy9tYXF1ZXR0ZS9kaXN0JyB9LFxuXHRcdFx0eyBuYW1lOiAnaW1tdXRhYmxlJywgbG9jYXRpb246ICdub2RlX21vZHVsZXMvaW1tdXRhYmxlL2Rpc3QnIH1cblx0XHRdKTtcblxuXHRcdGFzc2VydC5lcXVhbChyZXN1bHQuYmFzZVVybCwgY29uZmlnQmFzZVVybCk7XG5cdFx0YXNzZXJ0LmRlZXBFcXVhbChyZXN1bHQucGFja2FnZXMsIGNvbmZpZ1BhY2thZ2VzKTtcblx0XHRhc3NlcnQuZXF1YWwocmVzdWx0LnJlcXVpcmUsIGZha2VSZXF1aXJlKTtcblx0fVxufSk7XG4iXX0=