(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "path", "glob"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var path = require("path");
    var glob = require("glob");
    function formatGlob(tsconfigGlob) {
        return tsconfigGlob.map(function (glob) {
            if (/^\.\//.test(glob)) {
                // Remove the leading './' from the glob because grunt-ts
                // sees it and thinks it needs to create a .baseDir.ts which
                // messes up the "dist" compilation
                return glob.slice(2);
            }
            return glob;
        });
    }
    exports.initConfig = function (grunt, otherOptions) {
        var tsconfigContent = grunt.file.read('tsconfig.json');
        var tsconfig = JSON.parse(tsconfigContent);
        if (tsconfig.filesGlob) {
            tsconfig.filesGlob = formatGlob(tsconfig.filesGlob);
        }
        else {
            tsconfig.include = formatGlob(tsconfig.include);
        }
        var packageJson = grunt.file.readJSON('package.json');
        var devTasks = [
            'clean:typings',
            'typings:dev',
            'tslint',
            'clean:dev',
            'copy:staticDefinitionFiles-dev',
            'dojo-ts:dev',
            'copy:staticTestFiles'
        ];
        var distTasks = [
            'clean:typings',
            'typings:dist',
            'tslint',
            'clean:dist',
            'copy:staticDefinitionFiles-dist',
            'dojo-ts:dist',
            'fixSourceMaps'
        ];
        var distESMTasks = [
            'dojo-ts:esm'
        ];
        var docTasks = [
            'clean:typings',
            'typings:dev',
            'typedoc',
            'clean:typedoc',
            'clean:ghpages'
        ];
        grunt.initConfig({
            name: packageJson.name,
            version: packageJson.version,
            tsconfig: tsconfig,
            tsconfigContent: tsconfigContent,
            filesGlob: tsconfig.filesGlob || tsconfig.include,
            all: ['<%= filesGlob %>'],
            skipTests: ['<%= all %>', '!tests/**/*.ts'],
            testsGlob: ['./tests/**/*.ts', 'tests/**/*.ts'],
            staticTestFiles: 'tests/**/*.{html,css,json,xml,js,txt}',
            staticDefinitionFiles: '**/*.d.ts',
            devDirectory: '<%= tsconfig.compilerOptions.outDir %>',
            apiDocDirectory: '_apidoc',
            apiPubDirectory: '_apipub',
            distDirectory: 'dist/umd/',
            otherOptions: otherOptions,
            devTasks: devTasks,
            distTasks: distTasks,
            distESMTasks: distESMTasks,
            docTasks: docTasks
        });
        var options = {};
        glob.sync('*.js', {
            cwd: path.join(__dirname, 'options')
        }).forEach(function (filename) {
            var optName = path.basename(filename, '.js');
            options[optName] = require('./options/' + optName)(grunt);
        });
        grunt.config.merge(options);
        require('./tasks/uploadCoverage')(grunt);
        require('./tasks/installPeerDependencies')(grunt, packageJson);
        require('./tasks/repl')(grunt, packageJson);
        require('./tasks/run')(grunt, packageJson);
        require('./tasks/release')(grunt, packageJson);
        require('./tasks/link')(grunt, packageJson);
        require('./tasks/fixSourceMaps')(grunt, packageJson);
        require('./tasks/postcss')(grunt);
        if (otherOptions) {
            grunt.config.merge(otherOptions);
        }
        require('./tasks/ts')(grunt);
        require('./tasks/typedoc')(grunt);
        // Set some Intern-specific options if specified on the command line.
        ['suites', 'functionalSuites', 'grep'].forEach(function (option) {
            var value = grunt.option(option);
            var splitValue;
            if (value) {
                if (option !== 'grep') {
                    splitValue = value.split(',').map(function (string) { return string.trim(); });
                }
                grunt.config('intern.options.' + option, splitValue || value);
            }
        });
        function setCombined(combined) {
            if (combined) {
                grunt.config('intern.options.reporters', [
                    { id: 'grunt-dojo2/lib/intern/Reporter', file: 'coverage-unmapped.json' }
                ]);
            }
        }
        setCombined(grunt.option('combined'));
        grunt.registerTask('test', (function () {
            var flags = Object.keys(this.flags);
            if (!flags.length) {
                flags.push('node');
            }
            grunt.option('force', true);
            grunt.task.run('clean:coverage');
            grunt.task.run('dev');
            setCombined(true);
            flags.forEach(function (flag) {
                grunt.task.run('intern:' + flag);
            });
            grunt.task.run('remapIstanbul:coverage');
            grunt.task.run('clean:coverage');
        }));
        grunt.registerTask('dev', grunt.config.get('devTasks'));
        grunt.registerTask('dist', grunt.config.get('distTasks'));
        grunt.registerTask('dist_esm', grunt.config.get('distESMTasks'));
        grunt.registerTask('doc', grunt.config.get('docTasks'));
        grunt.registerTask('default', ['clean', 'dev']);
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztJQUFBLDJCQUE2QjtJQUM3QiwyQkFBNkI7SUFHN0Isb0JBQW9CLFlBQXNCO1FBQ3pDLE1BQU0sQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLFVBQVUsSUFBWTtZQUM3QyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDeEIseURBQXlEO2dCQUN6RCw0REFBNEQ7Z0JBQzVELG1DQUFtQztnQkFDbkMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDdEIsQ0FBQztZQUNELE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDYixDQUFDLENBQUMsQ0FBQztJQUNKLENBQUM7SUFFRCxPQUFPLENBQUMsVUFBVSxHQUFHLFVBQVUsS0FBYSxFQUFFLFlBQWlCO1FBQzlELElBQU0sZUFBZSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBQ3pELElBQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLENBQUM7UUFDN0MsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7WUFDeEIsUUFBUSxDQUFDLFNBQVMsR0FBRyxVQUFVLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ3JELENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNQLFFBQVEsQ0FBQyxPQUFPLEdBQUcsVUFBVSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNqRCxDQUFDO1FBQ0QsSUFBTSxXQUFXLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLENBQUM7UUFFeEQsSUFBTSxRQUFRLEdBQUc7WUFDaEIsZUFBZTtZ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QUFDLFNBQVMsRUFBRSxDQUFFLE9BQU8sRUFBRSxLQUFLLENBQUUsQ0FBQyxDQUFDO0lBQ25ELENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgKiBhcyBnbG9iIGZyb20gJ2dsb2InO1xuaW1wb3J0IElUYXNrID0gZ3J1bnQudGFzay5JVGFzaztcblxuZnVuY3Rpb24gZm9ybWF0R2xvYih0c2NvbmZpZ0dsb2I6IHN0cmluZ1tdKTogc3RyaW5nW10ge1xuXHRyZXR1cm4gdHNjb25maWdHbG9iLm1hcChmdW5jdGlvbiAoZ2xvYjogc3RyaW5nKSB7XG5cdFx0aWYgKC9eXFwuXFwvLy50ZXN0KGdsb2IpKSB7XG5cdFx0XHQvLyBSZW1vdmUgdGhlIGxlYWRpbmcgJy4vJyBmcm9tIHRoZSBnbG9iIGJlY2F1c2UgZ3J1bnQtdHNcblx0XHRcdC8vIHNlZXMgaXQgYW5kIHRoaW5rcyBpdCBuZWVkcyB0byBjcmVhdGUgYSAuYmFzZURpci50cyB3aGljaFxuXHRcdFx0Ly8gbWVzc2VzIHVwIHRoZSBcImRpc3RcIiBjb21waWxhdGlvblxuXHRcdFx0cmV0dXJuIGdsb2Iuc2xpY2UoMik7XG5cdFx0fVxuXHRcdHJldHVybiBnbG9iO1xuXHR9KTtcbn1cblxuZXhwb3J0cy5pbml0Q29uZmlnID0gZnVuY3Rpb24gKGdydW50OiBJR3J1bnQsIG90aGVyT3B0aW9uczogYW55KSB7XG5cdGNvbnN0IHRzY29uZmlnQ29udGVudCA9IGdydW50LmZpbGUucmVhZCgndHNjb25maWcuanNvbicpO1xuXHRjb25zdCB0c2NvbmZpZyA9IEpTT04ucGFyc2UodHNjb25maWdDb250ZW50KTtcblx0aWYgKHRzY29uZmlnLmZpbGVzR2xvYikge1xuXHRcdHRzY29uZmlnLmZpbGVzR2xvYiA9IGZvcm1hdEdsb2IodHNjb25maWcuZmlsZXNHbG9iKTtcblx0fSBlbHNlIHtcblx0XHR0c2NvbmZpZy5pbmNsdWRlID0gZm9ybWF0R2xvYih0c2NvbmZpZy5pbmNsdWRlKTtcblx0fVxuXHRjb25zdCBwYWNrYWdlSnNvbiA9IGdydW50LmZpbGUucmVhZEpTT04oJ3BhY2thZ2UuanNvbicpO1xuXG5cdGNvbnN0IGRldlRhc2tzID0gW1xuXHRcdCdjbGVhbjp0eXBpbmdzJyxcblx0XHQndHlwaW5nczpkZXYnLFxuXHRcdCd0c2xpbnQnLFxuXHRcdCdjbGVhbjpkZXYnLFxuXHRcdCdjb3B5OnN0YXRpY0RlZmluaXRpb25GaWxlcy1kZXYnLFxuXHRcdCdkb2pvLXRzOmRldicsXG5cdFx0J2NvcHk6c3RhdGljVGVzdEZpbGVzJ1xuXHRdO1xuXG5cdGNvbnN0IGRpc3RUYXNrcyA9IFtcblx0XHQnY2xlYW46dHlwaW5ncycsXG5cdFx0J3R5cGluZ3M6ZGlzdCcsXG5cdFx0J3RzbGludCcsXG5cdFx0J2NsZWFuOmRpc3QnLFxuXHRcdCdjb3B5OnN0YXRpY0RlZmluaXRpb25GaWxlcy1kaXN0Jyxcblx0XHQnZG9qby10czpkaXN0Jyxcblx0XHQnZml4U291cmNlTWFwcydcblx0XTtcblxuXHRjb25zdCBkaXN0RVNNVGFza3MgPSBbXG5cdFx0J2Rvam8tdHM6ZXNtJ1xuXHRdO1xuXG5cdGNvbnN0IGRvY1Rhc2tzID0gW1xuXHRcdCdjbGVhbjp0eXBpbmdzJyxcblx0XHQndHlwaW5nczpkZXYnLFxuXHRcdCd0eXBlZG9jJyxcblx0XHQnY2xlYW46dHlwZWRvYycsXG5cdFx0J2NsZWFuOmdocGFnZXMnXG5cdF07XG5cblx0Z3J1bnQuaW5pdENvbmZpZyh7XG5cdFx0bmFtZTogcGFja2FnZUpzb24ubmFtZSxcblx0XHR2ZXJzaW9uOiBwYWNrYWdlSnNvbi52ZXJzaW9uLFxuXHRcdHRzY29uZmlnOiB0c2NvbmZpZyxcblx0XHR0c2NvbmZpZ0NvbnRlbnQ6IHRzY29uZmlnQ29udGVudCxcblx0XHRmaWxlc0dsb2I6IHRzY29uZmlnLmZpbGVzR2xvYiB8fCB0c2NvbmZpZy5pbmNsdWRlLFxuXHRcdGFsbDogWyAnPCU9IGZpbGVzR2xvYiAlPicgXSxcblx0XHRza2lwVGVzdHM6IFsgJzwlPSBhbGwgJT4nICwgJyF0ZXN0cy8qKi8qLnRzJyBdLFxuXHRcdHRlc3RzR2xvYjogWycuL3Rlc3RzLyoqLyoudHMnLCAndGVzdHMvKiovKi50cyddLFxuXHRcdHN0YXRpY1Rlc3RGaWxlczogJ3Rlc3RzLyoqLyoue2h0bWwsY3NzLGpzb24seG1sLGpzLHR4dH0nLFxuXHRcdHN0YXRpY0RlZmluaXRpb25GaWxlczogJyoqLyouZC50cycsXG5cdFx0ZGV2RGlyZWN0b3J5OiAnPCU9IHRzY29uZmlnLmNvbXBpbGVyT3B0aW9ucy5vdXREaXIgJT4nLFxuXHRcdGFwaURvY0RpcmVjdG9yeTogJ19hcGlkb2MnLFxuXHRcdGFwaVB1YkRpcmVjdG9yeTogJ19hcGlwdWInLFxuXHRcdGRpc3REaXJlY3Rvcnk6ICdkaXN0L3VtZC8nLFxuXHRcdG90aGVyT3B0aW9uczogb3RoZXJPcHRpb25zLFxuXHRcdGRldlRhc2tzLFxuXHRcdGRpc3RUYXNrcyxcblx0XHRkaXN0RVNNVGFza3MsXG5cdFx0ZG9jVGFza3Ncblx0fSk7XG5cblx0Y29uc3Qgb3B0aW9uczogeyBbb3B0aW9uOiBzdHJpbmddOiBhbnkgfSA9IHt9O1xuXHRnbG9iLnN5bmMoJyouanMnLCB7XG5cdFx0Y3dkOiBwYXRoLmpvaW4oX19kaXJuYW1lLCAnb3B0aW9ucycpXG5cdH0pLmZvckVhY2goZnVuY3Rpb24gKGZpbGVuYW1lKSB7XG5cdFx0Y29uc3Qgb3B0TmFtZSA9IHBhdGguYmFzZW5hbWUoZmlsZW5hbWUsICcuanMnKTtcblx0XHRvcHRpb25zW29wdE5hbWVdID0gcmVxdWlyZSgnLi9vcHRpb25zLycgKyBvcHROYW1lKShncnVudCk7XG5cdH0pO1xuXHRncnVudC5jb25maWcubWVyZ2Uob3B0aW9ucyk7XG5cblx0cmVxdWlyZSgnLi90YXNrcy91cGxvYWRDb3ZlcmFnZScpKGdydW50KTtcblx0cmVxdWlyZSgnLi90YXNrcy9pbnN0YWxsUGVlckRlcGVuZGVuY2llcycpKGdydW50LCBwYWNrYWdlSnNvbik7XG5cdHJlcXVpcmUoJy4vdGFza3MvcmVwbCcpKGdydW50LCBwYWNrYWdlSnNvbik7XG5cdHJlcXVpcmUoJy4vdGFza3MvcnVuJykoZ3J1bnQsIHBhY2thZ2VKc29uKTtcblx0cmVxdWlyZSgnLi90YXNrcy9yZWxlYXNlJykoZ3J1bnQsIHBhY2thZ2VKc29uKTtcblx0cmVxdWlyZSgnLi90YXNrcy9saW5rJykoZ3J1bnQsIHBhY2thZ2VKc29uKTtcblx0cmVxdWlyZSgnLi90YXNrcy9maXhTb3VyY2VNYXBzJykoZ3J1bnQsIHBhY2thZ2VKc29uKTtcblx0cmVxdWlyZSgnLi90YXNrcy9wb3N0Y3NzJykoZ3J1bnQpO1xuXG5cdGlmIChvdGhlck9wdGlvbnMpIHtcblx0XHRncnVudC5jb25maWcubWVyZ2Uob3RoZXJPcHRpb25zKTtcblx0fVxuXG5cdHJlcXVpcmUoJy4vdGFza3MvdHMnKShncnVudCk7XG5cdHJlcXVpcmUoJy4vdGFza3MvdHlwZWRvYycpKGdydW50KTtcblxuXHQvLyBTZXQgc29tZSBJbnRlcm4tc3BlY2lmaWMgb3B0aW9ucyBpZiBzcGVjaWZpZWQgb24gdGhlIGNvbW1hbmQgbGluZS5cblx0WyAnc3VpdGVzJywgJ2Z1bmN0aW9uYWxTdWl0ZXMnLCAnZ3JlcCcgXS5mb3JFYWNoKGZ1bmN0aW9uIChvcHRpb24pIHtcblx0XHRjb25zdCB2YWx1ZSA9IGdydW50Lm9wdGlvbjxzdHJpbmc+KG9wdGlvbik7XG5cdFx0bGV0IHNwbGl0VmFsdWU6IHN0cmluZ1tdIHwgdW5kZWZpbmVkO1xuXHRcdGlmICh2YWx1ZSkge1xuXHRcdFx0aWYgKG9wdGlvbiAhPT0gJ2dyZXAnKSB7XG5cdFx0XHRcdHNwbGl0VmFsdWUgPSB2YWx1ZS5zcGxpdCgnLCcpLm1hcChmdW5jdGlvbiAoc3RyaW5nKSB7IHJldHVybiBzdHJpbmcudHJpbSgpOyB9KTtcblx0XHRcdH1cblx0XHRcdGdydW50LmNvbmZpZygnaW50ZXJuLm9wdGlvbnMuJyArIG9wdGlvbiwgc3BsaXRWYWx1ZSB8fCB2YWx1ZSk7XG5cdFx0fVxuXHR9KTtcblxuXHRmdW5jdGlvbiBzZXRDb21iaW5lZChjb21iaW5lZDogYm9vbGVhbikge1xuXHRcdGlmIChjb21iaW5lZCkge1xuXHRcdFx0Z3J1bnQuY29uZmlnKCdpbnRlcm4ub3B0aW9ucy5yZXBvcnRlcnMnLCBbXG5cdFx0XHRcdHsgaWQ6ICdncnVudC1kb2pvMi9saWIvaW50ZXJuL1JlcG9ydGVyJywgZmlsZTogJ2NvdmVyYWdlLXVubWFwcGVkLmpzb24nIH1cblx0XHRcdF0pO1xuXHRcdH1cblx0fVxuXHRzZXRDb21iaW5lZChncnVudC5vcHRpb248Ym9vbGVhbj4oJ2NvbWJpbmVkJykpO1xuXG5cdGdydW50LnJlZ2lzdGVyVGFzaygndGVzdCcsIDxhbnk+IChmdW5jdGlvbiAodGhpczogSVRhc2spIHtcblx0XHRjb25zdCBmbGFncyA9IE9iamVjdC5rZXlzKHRoaXMuZmxhZ3MpO1xuXG5cdFx0aWYgKCFmbGFncy5sZW5ndGgpIHtcblx0XHRcdGZsYWdzLnB1c2goJ25vZGUnKTtcblx0XHR9XG5cblx0XHRncnVudC5vcHRpb24oJ2ZvcmNlJywgdHJ1ZSk7XG5cdFx0Z3J1bnQudGFzay5ydW4oJ2NsZWFuOmNvdmVyYWdlJyk7XG5cdFx0Z3J1bnQudGFzay5ydW4oJ2RldicpO1xuXHRcdHNldENvbWJpbmVkKHRydWUpO1xuXHRcdGZsYWdzLmZvckVhY2goKGZsYWcpID0+IHtcblx0XHRcdGdydW50LnRhc2sucnVuKCdpbnRlcm46JyArIGZsYWcpO1xuXHRcdH0pO1xuXHRcdGdydW50LnRhc2sucnVuKCdyZW1hcElzdGFuYnVsOmNvdmVyYWdlJyk7XG5cdFx0Z3J1bnQudGFzay5ydW4oJ2NsZWFuOmNvdmVyYWdlJyk7XG5cdH0pKTtcblxuXHRncnVudC5yZWdpc3RlclRhc2soJ2RldicsIGdydW50LmNvbmZpZy5nZXQ8c3RyaW5nW10+KCdkZXZUYXNrcycpKTtcblx0Z3J1bnQucmVnaXN0ZXJUYXNrKCdkaXN0JywgZ3J1bnQuY29uZmlnLmdldDxzdHJpbmdbXT4oJ2Rpc3RUYXNrcycpKTtcblx0Z3J1bnQucmVnaXN0ZXJUYXNrKCdkaXN0X2VzbScsIGdydW50LmNvbmZpZy5nZXQ8c3RyaW5nW10+KCdkaXN0RVNNVGFza3MnKSk7XG5cdGdydW50LnJlZ2lzdGVyVGFzaygnZG9jJywgZ3J1bnQuY29uZmlnLmdldDxzdHJpbmdbXT4oJ2RvY1Rhc2tzJykpO1xuXG5cdGdydW50LnJlZ2lzdGVyVGFzaygnZGVmYXVsdCcsIFsgJ2NsZWFuJywgJ2RldicgXSk7XG59O1xuIl19