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
        var path = require('path');
        grunt.loadNpmTasks('grunt-contrib-copy');
        return {
            staticTestFiles: {
                expand: true,
                cwd: '.',
                src: ['<%= staticTestFiles %>'],
                dest: '<%= devDirectory %>'
            },
            'staticDefinitionFiles-dev': {
                expand: true,
                cwd: 'src',
                src: ['<%= staticDefinitionFiles %>'],
                dest: '<%= devDirectory %>'
            },
            'staticDefinitionFiles-dist': {
                expand: true,
                cwd: 'src',
                src: ['<%= staticDefinitionFiles %>'],
                dest: '<%= distDirectory %>'
            }
        };
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29weS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNvcHkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztJQUFBLE9BQVMsVUFBVSxLQUFhO1FBQy9CLElBQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUU3QixLQUFLLENBQUMsWUFBWSxDQUFDLG9CQUFvQixDQUFDLENBQUM7UUFFekMsTUFBTSxDQUFDO1lBQ04sZUFBZSxFQUFFO2dCQUNoQixNQUFNLEVBQUUsSUFBSTtnQkFDWixHQUFHLEVBQUUsR0FBRztnQkFDUixHQUFHLEVBQUUsQ0FBRSx3QkFBd0IsQ0FBRTtnQkFDakMsSUFBSSxFQUFFLHFCQUFxQjthQUMzQjtZQUNELDJCQUEyQixFQUFFO2dCQUM1QixNQUFNLEVBQUUsSUFBSTtnQkFDWixHQUFHLEVBQUUsS0FBSztnQkFDVixHQUFHLEVBQUUsQ0FBRSw4QkFBOEIsQ0FBRTtnQkFDdkMsSUFBSSxFQUFFLHFCQUFxQjthQUMzQjtZQUNELDRCQUE0QixFQUFFO2dCQUM3QixNQUFNLEVBQUUsSUFBSTtnQkFDWixHQUFHLEVBQUUsS0FBSztnQkFDVixHQUFHLEVBQUUsQ0FBRSw4QkFBOEIsQ0FBRTtnQkFDdkMsSUFBSSxFQUFFLHNCQUFzQjthQUM1QjtTQUNELENBQUM7SUFDSCxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgPSBmdW5jdGlvbiAoZ3J1bnQ6IElHcnVudCkge1xuXHRjb25zdCBwYXRoID0gcmVxdWlyZSgncGF0aCcpO1xuXHRcblx0Z3J1bnQubG9hZE5wbVRhc2tzKCdncnVudC1jb250cmliLWNvcHknKTtcblxuXHRyZXR1cm4ge1xuXHRcdHN0YXRpY1Rlc3RGaWxlczoge1xuXHRcdFx0ZXhwYW5kOiB0cnVlLFxuXHRcdFx0Y3dkOiAnLicsXG5cdFx0XHRzcmM6IFsgJzwlPSBzdGF0aWNUZXN0RmlsZXMgJT4nIF0sXG5cdFx0XHRkZXN0OiAnPCU9IGRldkRpcmVjdG9yeSAlPidcblx0XHR9LFxuXHRcdCdzdGF0aWNEZWZpbml0aW9uRmlsZXMtZGV2Jzoge1xuXHRcdFx0ZXhwYW5kOiB0cnVlLFxuXHRcdFx0Y3dkOiAnc3JjJyxcblx0XHRcdHNyYzogWyAnPCU9IHN0YXRpY0RlZmluaXRpb25GaWxlcyAlPicgXSxcblx0XHRcdGRlc3Q6ICc8JT0gZGV2RGlyZWN0b3J5ICU+J1xuXHRcdH0sXG5cdFx0J3N0YXRpY0RlZmluaXRpb25GaWxlcy1kaXN0Jzoge1xuXHRcdFx0ZXhwYW5kOiB0cnVlLFxuXHRcdFx0Y3dkOiAnc3JjJyxcblx0XHRcdHNyYzogWyAnPCU9IHN0YXRpY0RlZmluaXRpb25GaWxlcyAlPicgXSxcblx0XHRcdGRlc3Q6ICc8JT0gZGlzdERpcmVjdG9yeSAlPidcblx0XHR9XG5cdH07XG59O1xuIl19