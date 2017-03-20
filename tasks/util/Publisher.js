(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "path", "fs", "./exec", "shelljs", "path"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var path_1 = require("path");
    var fs_1 = require("fs");
    var exec_1 = require("./exec");
    var shelljs_1 = require("shelljs");
    var path_2 = require("path");
    var consoleLogger = {
        writeln: function (info) {
            console.log(info);
            return this;
        }
    };
    function setConfig(key, value, global) {
        if (global === void 0) { global = false; }
        return exec_1.default("git config " + (global ? '--global ' : '') + key + " " + value, { silent: true });
    }
    exports.setConfig = setConfig;
    var Publisher = (function () {
        function Publisher(cloneDir, generatedDocsDir, options) {
            if (options === void 0) { options = {}; }
            /**
             * The branch to publish API documents
             */
            this.branch = 'gh-pages';
            /**
             * The deployment key to use
             */
            this.deployKey = false;
            /**
             * Logging utility
             */
            this.log = consoleLogger;
            /**
             * If publishing should be skipped
             */
            this.skipPublish = false;
            /**
             * The directory to place API docs
             */
            this.subDirectory = 'api';
            this.cloneDir = cloneDir;
            this.generatedDocsDirectory = generatedDocsDir;
            // optional configuration values
            options.branch && (this.branch = options.branch);
            options.deployKey && (this.deployKey = options.deployKey);
            options.log && (this.log = options.log);
            typeof options.skipPublish === 'boolean' && (this.skipPublish = options.skipPublish);
            options.subDirectory && (this.subDirectory = options.subDirectory);
            if (options.url) {
                this.url = options.url;
            }
            else {
                var repo = process.env.TRAVIS_REPO_SLUG || ''; // TODO look up the repo information?
                this.url = "git@github.com:" + repo + ".git";
            }
            // optional method overrides
            options.shouldPush && (this.shouldPush = options.shouldPush);
        }
        /**
         * @return {boolean} if a deploy key exists in the file system
         */
        Publisher.prototype.hasDeployCredentials = function () {
            if (typeof this.deployKey === 'boolean') {
                return false;
            }
            return fs_1.existsSync(this.deployKey);
        };
        /**
         * Publish the contents of { generatedDocsDirectory } in the clone at { cloneDir } in the directory
         * { subDirectory } and push to the { branch } branch.
         */
        Publisher.prototype.publish = function () {
            if (!fs_1.existsSync(this.cloneDir)) {
                this.setup();
            }
            this.refreshTypeDoc();
            this.commit();
            if (!this.skipPublish && this.shouldPush()) {
                if (this.canPublish()) {
                    this.push();
                }
                else {
                    this.log.writeln('Push check failed -- not publishing API docs');
                }
            }
            else {
                this.log.writeln('Only committing -- skipping push to repo');
            }
        };
        /**
         * Clone the target repository and switch to the deployment branch
         */
        Publisher.prototype.setup = function () {
            var publishBranch = this.branch;
            // Prerequisites for using git
            setConfig('user.name', 'Travis CI', true);
            setConfig('user.email', 'support@sitepen.com', true);
            this.log.writeln("Cloning " + this.url);
            this.execSSHAgent("git clone " + this.url + " " + this.cloneDir, { silent: true });
            try {
                exec_1.default("git checkout " + publishBranch, { silent: true, cwd: this.cloneDir });
            }
            catch (error) {
                // publish branch didn't exist, so create it
                exec_1.default("git checkout --orphan " + publishBranch, { silent: true, cwd: this.cloneDir });
                exec_1.default('git rm -rf .', { silent: true, cwd: this.cloneDir });
                this.log.writeln("Created " + publishBranch + " branch");
            }
        };
        /**
         * @return {boolean} indicates whether doc updates should be pushed to the origin
         */
        Publisher.prototype.shouldPush = function () {
            var branch = process.env.TRAVIS_BRANCH || exec_1.default('git rev-parse --abbrev-ref HEAD', { silent: true }).trim();
            return branch === 'master';
        };
        /**
         * If configuration information exists for obtaining a deployment key and prerequisites have been met to publish
         */
        Publisher.prototype.canPublish = function () {
            var skipDeploymentCredentials = typeof this.deployKey === 'boolean' && !this.deployKey;
            return (skipDeploymentCredentials || this.hasDeployCredentials()) && this.shouldPush();
        };
        /**
         * Remove everything in preparation for the typedoc
         */
        Publisher.prototype.refreshTypeDoc = function () {
            var publishDir = this.subDirectory;
            shelljs_1.rm('-rf', path_1.join(this.cloneDir, publishDir));
            shelljs_1.cp('-r', this.generatedDocsDirectory, path_1.join(this.cloneDir, publishDir));
        };
        /**
         * Commit (but do not push) everything the new documentation
         */
        Publisher.prototype.commit = function () {
            var publishDir = this.subDirectory;
            if (exec_1.default('git status --porcelain', { silent: true, cwd: this.cloneDir }) === '') {
                this.log.writeln('Nothing changed');
                return;
            }
            exec_1.default("git add " + publishDir, { silent: true, cwd: this.cloneDir });
            exec_1.default('git commit -m "Update API docs"', { silent: true, cwd: this.cloneDir });
        };
        /**
         * Execute a credentialed git command
         * @param command the command to execute
         * @param options execute options
         */
        Publisher.prototype.execSSHAgent = function (command, options) {
            if (options === void 0) { options = {}; }
            if (this.hasDeployCredentials()) {
                var deployKey = this.deployKey;
                var relativeDeployKey = options.cwd ? path_2.relative(options.cwd, deployKey) : deployKey;
                fs_1.chmodSync(deployKey, '600');
                return exec_1.default("ssh-agent bash -c 'ssh-add " + relativeDeployKey + "; " + command + "'", options);
            }
            else {
                return exec_1.default(command, options);
            }
        };
        /**
         * Publish the document created by typedoc
         */
        Publisher.prototype.push = function () {
            this.log.writeln('Publishing API docs');
            this.execSSHAgent("git push origin " + this.branch, { silent: true, cwd: this.cloneDir });
            this.log.writeln("Pushed " + this.branch + " to origin");
        };
        return Publisher;
    }());
    exports.default = Publisher;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUHVibGlzaGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiUHVibGlzaGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0lBQUEsNkJBQTRCO0lBQzVCLHlCQUEyQztJQUMzQywrQkFBMEI7SUFDMUIsbUNBQWlDO0lBRWpDLDZCQUFnQztJQWdCaEMsSUFBTSxhQUFhLEdBQUc7UUFDckIsT0FBTyxZQUFZLElBQVk7WUFDOUIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNsQixNQUFNLENBQUMsSUFBSSxDQUFDO1FBQ2IsQ0FBQztLQUNELENBQUM7SUFFRixtQkFBMEIsR0FBVyxFQUFFLEtBQWEsRUFBRSxNQUF1QjtRQUF2Qix1QkFBQSxFQUFBLGNBQXVCO1FBQzVFLE1BQU0sQ0FBQyxjQUFJLENBQUMsaUJBQWUsTUFBTSxHQUFHLFdBQVcsR0FBRyxFQUFFLElBQUssR0FBRyxTQUFNLEtBQVEsRUFBRSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO0lBQy9GLENBQUM7SUFGRCw4QkFFQztJQUVEO1FBeUNDLG1CQUFZLFFBQWdCLEVBQUUsZ0JBQXdCLEVBQUUsT0FBcUI7WUFBckIsd0JBQUEsRUFBQSxZQUFxQjtZQXhDN0U7O2VBRUc7WUFDSCxXQUFNLEdBQVcsVUFBVSxDQUFDO1lBTzVCOztlQUVHO1lBQ0gsY0FBUyxHQUFxQixLQUFLLENBQUM7WUFPcEM7O2VBRUc7WUFDSCxRQUFHLEdBQVEsYUFBYSxDQUFDO1lBRXpCOztlQUVHO1lBQ0gsZ0JBQVcsR0FBWSxLQUFLLENBQUM7WUFFN0I7O2VBRUc7WUFDSCxpQkFBWSxHQUFXLEtBQUssQ0FBQztZQVE1QixJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztZQUN6QixJQUFJLENBQUMsc0JBQXNCLEdBQUcsZ0JBQWdCLENBQUM7WUFFL0MsZ0NBQWdDO1lBQ2hDLE9BQU8sQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxH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RCxJQUFNLGlCQUFpQixHQUFHLE9BQU8sQ0FBQyxHQUFHLEdBQUcsZUFBUSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsU0FBUyxDQUFDLEdBQUcsU0FBUyxDQUFDO2dCQUNyRixjQUFTLENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQyxDQUFDO2dCQUM1QixNQUFNLENBQUMsY0FBSSxDQUFDLGdDQUErQixpQkFBaUIsVUFBTyxPQUFPLE1BQUksRUFBRSxPQUFPLENBQUMsQ0FBQztZQUMxRixDQUFDO1lBQ0QsSUFBSSxDQUFDLENBQUM7Z0JBQ0wsTUFBTSxDQUFDLGNBQUksQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDL0IsQ0FBQztRQUNGLENBQUM7UUFFRDs7V0FFRztRQUNLLHdCQUFJLEdBQVo7WUFDQyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO1lBQ3hDLElBQUksQ0FBQyxZQUFZLENBQUMscUJBQW1CLElBQUksQ0FBQyxNQUFRLEVBQUUsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztZQUMxRixJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxZQUFVLElBQUksQ0FBQyxNQUFNLGVBQVksQ0FBQyxDQUFDO1FBQ3JELENBQUM7UUFDRixnQkFBQztJQUFELENBQUMsQUEzTEQsSUEyTEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBqb2luIH0gZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBleGlzdHNTeW5jLCBjaG1vZFN5bmMgfSBmcm9tICdmcyc7XG5pbXBvcnQgZXhlYyBmcm9tICcuL2V4ZWMnO1xuaW1wb3J0IHsgY3AsIHJtIH0gZnJvbSAnc2hlbGxqcyc7XG5pbXBvcnQgTG9nTW9kdWxlID0gZ3J1bnQubG9nLkxvZ01vZHVsZTtcbmltcG9ydCB7IHJlbGF0aXZlIH0gZnJvbSAncGF0aCc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgT3B0aW9ucyB7XG5cdGJyYW5jaD86IFB1Ymxpc2hlclsnYnJhbmNoJ107XG5cdGRlcGxveUtleT86IFB1Ymxpc2hlclsnZGVwbG95S2V5J107XG5cdGxvZz86IFB1Ymxpc2hlclsnbG9nJ107XG5cdHNob3VsZFB1c2g/OiBQdWJsaXNoZXJbJ3Nob3VsZFB1c2gnXTtcblx0c2tpcFB1Ymxpc2g/OiBQdWJsaXNoZXJbJ3NraXBQdWJsaXNoJ107XG5cdHN1YkRpcmVjdG9yeT86IFB1Ymxpc2hlclsnc3ViRGlyZWN0b3J5J107XG5cdHVybD86IFB1Ymxpc2hlclsndXJsJ107XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgTG9nIHtcblx0d3JpdGVsbjogTG9nTW9kdWxlWyd3cml0ZWxuJ107XG59XG5cbmNvbnN0IGNvbnNvbGVMb2dnZXIgPSB7XG5cdHdyaXRlbG4odGhpczogYW55LCBpbmZvOiBzdHJpbmcpIHtcblx0XHRjb25zb2xlLmxvZyhpbmZvKTtcblx0XHRyZXR1cm4gdGhpcztcblx0fVxufTtcblxuZXhwb3J0IGZ1bmN0aW9uIHNldENvbmZpZyhrZXk6IHN0cmluZywgdmFsdWU6IHN0cmluZywgZ2xvYmFsOiBib29sZWFuID0gZmFsc2UpIHtcblx0cmV0dXJuIGV4ZWMoYGdpdCBjb25maWcgJHsgZ2xvYmFsID8gJy0tZ2xvYmFsICcgOiAnJyB9JHsga2V5IH0gJHsgdmFsdWUgfWAsIHsgc2lsZW50OiB0cnVlIH0pO1xufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQdWJsaXNoZXIge1xuXHQvKipcblx0ICogVGhlIGJyYW5jaCB0byBwdWJsaXNoIEFQSSBkb2N1bWVudHNcblx0ICovXG5cdGJyYW5jaDogc3RyaW5nID0gJ2doLXBhZ2VzJztcblxuXHQvKipcblx0ICogVGhlIHRlbXBvcmFyeSBkaXJlY3RvcnkgZm9yIHRoZSBsb2NhbCBnaXQgY2xvbmVcblx0ICovXG5cdGNsb25lRGlyOiBzdHJpbmc7XG5cblx0LyoqXG5cdCAqIFRoZSBkZXBsb3ltZW50IGtleSB0byB1c2Vcblx0ICovXG5cdGRlcGxveUtleTogc3RyaW5nIHwgYm9vbGVhbiA9IGZhbHNlO1xuXG5cdC8qKlxuXHQgKiBUaGUgZGlyZWN0b3J5IHdoZXJlIHR5cGVkb2MgZ2VuZXJhdGVzIGl0cyBkb2NzXG5cdCAqL1xuXHRnZW5lcmF0ZWREb2NzRGlyZWN0b3J5OiBzdHJpbmc7XG5cblx0LyoqXG5cdCAqIExvZ2dpbmcgdXRpbGl0eVxuXHQgKi9cblx0bG9nOiBMb2cgPSBjb25zb2xlTG9nZ2VyO1xuXG5cdC8qKlxuXHQgKiBJZiBwdWJsaXNoaW5nIHNob3VsZCBiZSBza2lwcGVkXG5cdCAqL1xuXHRza2lwUHVibGlzaDogYm9vbGVhbiA9IGZhbHNlO1xuXG5cdC8qKlxuXHQgKiBUaGUgZGlyZWN0b3J5IHRvIHBsYWNlIEFQSSBkb2NzXG5cdCAqL1xuXHRzdWJEaXJlY3Rvcnk6IHN0cmluZyA9ICdhcGknO1xuXG5cdC8qKlxuXHQgKiBUaGUgcmVwbyBsb2NhdGlvblxuXHQgKi9cblx0dXJsOiBzdHJpbmc7XG5cblx0Y29uc3RydWN0b3IoY2xvbmVEaXI6IHN0cmluZywgZ2VuZXJhdGVkRG9jc0Rpcjogc3RyaW5nLCBvcHRpb25zOiBPcHRpb25zID0ge30pIHtcblx0XHR0aGlzLmNsb25lRGlyID0gY2xvbmVEaXI7XG5cdFx0dGhpcy5nZW5lcmF0ZWREb2NzRGlyZWN0b3J5ID0gZ2VuZXJhdGVkRG9jc0RpcjtcblxuXHRcdC8vIG9wdGlvbmFsIGNvbmZpZ3VyYXRpb24gdmFsdWVzXG5cdFx0b3B0aW9ucy5icmFuY2ggJiYgKHRoaXMuYnJhbmNoID0gb3B0aW9ucy5icmFuY2gpO1xuXHRcdG9wdGlvbnMuZGVwbG95S2V5ICYmICh0aGlzLmRlcGxveUtleSA9IG9wdGlvbnMuZGVwbG95S2V5KTtcblx0XHRvcHRpb25zLmxvZyAmJiAodGhpcy5sb2cgPSBvcHRpb25zLmxvZyk7XG5cdFx0dHlwZW9mIG9wdGlvbnMuc2tpcFB1Ymxpc2ggPT09ICdib29sZWFuJyAmJiAodGhpcy5za2lwUHVibGlzaCA9IG9wdGlvbnMuc2tpcFB1Ymxpc2gpO1xuXHRcdG9wdGlvbnMuc3ViRGlyZWN0b3J5ICYmICh0aGlzLnN1YkRpcmVjdG9yeSA9IG9wdGlvbnMuc3ViRGlyZWN0b3J5KTtcblx0XHRpZiAob3B0aW9ucy51cmwpIHtcblx0XHRcdHRoaXMudXJsID0gb3B0aW9ucy51cmw7XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0Y29uc3QgcmVwbyA9IHByb2Nlc3MuZW52LlRSQVZJU19SRVBPX1NMVUcgfHwgJyc7IC8vIFRPRE8gbG9vayB1cCB0aGUgcmVwbyBpbmZvcm1hdGlvbj9cblx0XHRcdHRoaXMudXJsID0gYGdpdEBnaXRodWIuY29tOiR7IHJlcG8gfS5naXRgO1xuXHRcdH1cblxuXHRcdC8vIG9wdGlvbmFsIG1ldGhvZCBvdmVycmlkZXNcblx0XHRvcHRpb25zLnNob3VsZFB1c2ggJiYgKHRoaXMuc2hvdWxkUHVzaCA9IG9wdGlvbnMuc2hvdWxkUHVzaCk7XG5cdH1cblxuXHQvKipcblx0ICogQHJldHVybiB7Ym9vbGVhbn0gaWYgYSBkZXBsb3kga2V5IGV4aXN0cyBpbiB0aGUgZmlsZSBzeXN0ZW1cblx0ICovXG5cdGhhc0RlcGxveUNyZWRlbnRpYWxzKCk6IGJvb2xlYW4ge1xuXHRcdGlmICh0eXBlb2YgdGhpcy5kZXBsb3lLZXkgPT09ICdib29sZWFuJykge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblx0XHRyZXR1cm4gZXhpc3RzU3luYyh0aGlzLmRlcGxveUtleSk7XG5cdH1cblxuXHQvKipcblx0ICogUHVibGlzaCB0aGUgY29udGVudHMgb2YgeyBnZW5lcmF0ZWREb2NzRGlyZWN0b3J5IH0gaW4gdGhlIGNsb25lIGF0IHsgY2xvbmVEaXIgfSBpbiB0aGUgZGlyZWN0b3J5XG5cdCAqIHsgc3ViRGlyZWN0b3J5IH0gYW5kIHB1c2ggdG8gdGhlIHsgYnJhbmNoIH0gYnJhbmNoLlxuXHQgKi9cblx0cHVibGlzaCgpIHtcblx0XHRpZiAoIWV4aXN0c1N5bmModGhpcy5jbG9uZURpcikpIHtcblx0XHRcdHRoaXMuc2V0dXAoKTtcblx0XHR9XG5cdFx0dGhpcy5yZWZyZXNoVHlwZURvYygpO1xuXHRcdHRoaXMuY29tbWl0KCk7XG5cblx0XHRpZiAoIXRoaXMuc2tpcFB1Ymxpc2ggJiYgdGhpcy5zaG91bGRQdXNoKCkpIHtcblx0XHRcdGlmICh0aGlzLmNhblB1Ymxpc2goKSkge1xuXHRcdFx0XHR0aGlzLnB1c2goKTtcblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHR0aGlzLmxvZy53cml0ZWxuKCdQdXNoIGNoZWNrIGZhaWxlZCAtLSBub3QgcHVibGlzaGluZyBBUEkgZG9jcycpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdHRoaXMubG9nLndyaXRlbG4oJ09ubHkgY29tbWl0dGluZyAtLSBza2lwcGluZyBwdXNoIHRvIHJlcG8nKTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogQ2xvbmUgdGhlIHRhcmdldCByZXBvc2l0b3J5IGFuZCBzd2l0Y2ggdG8gdGhlIGRlcGxveW1lbnQgYnJhbmNoXG5cdCAqL1xuXHRzZXR1cCgpIHtcblx0XHRjb25zdCBwdWJsaXNoQnJhbmNoID0gdGhpcy5icmFuY2g7XG5cblx0XHQvLyBQcmVyZXF1aXNpdGVzIGZvciB1c2luZyBnaXRcblx0XHRzZXRDb25maWcoJ3VzZXIubmFtZScsICdUcmF2aXMgQ0knLCB0cnVlKTtcblx0XHRzZXRDb25maWcoJ3VzZXIuZW1haWwnLCAnc3VwcG9ydEBzaXRlcGVuLmNvbScsIHRydWUpO1xuXG5cdFx0dGhpcy5sb2cud3JpdGVsbihgQ2xvbmluZyAkeyB0aGlzLnVybCB9YCk7XG5cdFx0dGhpcy5leGVjU1NIQWdlbnQoYGdpdCBjbG9uZSAkeyB0aGlzLnVybCB9ICR7IHRoaXMuY2xvbmVEaXIgfWAsIHsgc2lsZW50OiB0cnVlIH0pO1xuXG5cdFx0dHJ5IHtcblx0XHRcdGV4ZWMoYGdpdCBjaGVja291dCAkeyBwdWJsaXNoQnJhbmNoIH1gLCB7IHNpbGVudDogdHJ1ZSwgY3dkOiB0aGlzLmNsb25lRGlyIH0pO1xuXHRcdH1cblx0XHRjYXRjaCAoZXJyb3IpIHtcblx0XHRcdC8vIHB1Ymxpc2ggYnJhbmNoIGRpZG4ndCBleGlzdCwgc28gY3JlYXRlIGl0XG5cdFx0XHRleGVjKGBnaXQgY2hlY2tvdXQgLS1vcnBoYW4gJHsgcHVibGlzaEJyYW5jaCB9YCwgeyBzaWxlbnQ6IHRydWUsIGN3ZDogdGhpcy5jbG9uZURpciB9KTtcblx0XHRcdGV4ZWMoJ2dpdCBybSAtcmYgLicsIHsgc2lsZW50OiB0cnVlLCBjd2Q6IHRoaXMuY2xvbmVEaXIgfSk7XG5cdFx0XHR0aGlzLmxvZy53cml0ZWxuKGBDcmVhdGVkICR7cHVibGlzaEJyYW5jaH0gYnJhbmNoYCk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIEByZXR1cm4ge2Jvb2xlYW59IGluZGljYXRlcyB3aGV0aGVyIGRvYyB1cGRhdGVzIHNob3VsZCBiZSBwdXNoZWQgdG8gdGhlIG9yaWdpblxuXHQgKi9cblx0c2hvdWxkUHVzaCgpIHtcblx0XHRjb25zdCBicmFuY2ggPSBwcm9jZXNzLmVudi5UUkFWSVNfQlJBTkNIIHx8IGV4ZWMoJ2dpdCByZXYtcGFyc2UgLS1hYmJyZXYtcmVmIEhFQUQnLCB7IHNpbGVudDogdHJ1ZSB9KS50cmltKCk7XG5cdFx0cmV0dXJuIGJyYW5jaCA9PT0gJ21hc3Rlcic7XG5cdH1cblxuXHQvKipcblx0ICogSWYgY29uZmlndXJhdGlvbiBpbmZvcm1hdGlvbiBleGlzdHMgZm9yIG9idGFpbmluZyBhIGRlcGxveW1lbnQga2V5IGFuZCBwcmVyZXF1aXNpdGVzIGhhdmUgYmVlbiBtZXQgdG8gcHVibGlzaFxuXHQgKi9cblx0cHJpdmF0ZSBjYW5QdWJsaXNoKCk6IGJvb2xlYW4ge1xuXHRcdGNvbnN0IHNraXBEZXBsb3ltZW50Q3JlZGVudGlhbHMgPSB0eXBlb2YgdGhpcy5kZXBsb3lLZXkgPT09ICdib29sZWFuJyAmJiAhdGhpcy5kZXBsb3lLZXk7XG5cdFx0cmV0dXJuIChza2lwRGVwbG95bWVudENyZWRlbnRpYWxzIHx8IHRoaXMuaGFzRGVwbG95Q3JlZGVudGlhbHMoKSkgJiYgdGhpcy5zaG91bGRQdXNoKCk7XG5cdH1cblxuXHQvKipcblx0ICogUmVtb3ZlIGV2ZXJ5dGhpbmcgaW4gcHJlcGFyYXRpb24gZm9yIHRoZSB0eXBlZG9jXG5cdCAqL1xuXHRwcml2YXRlIHJlZnJlc2hUeXBlRG9jKCkge1xuXHRcdGNvbnN0IHB1Ymxpc2hEaXIgPSB0aGlzLnN1YkRpcmVjdG9yeTtcblxuXHRcdHJtKCctcmYnLCBqb2luKHRoaXMuY2xvbmVEaXIsIHB1Ymxpc2hEaXIpKTtcblx0XHRjcCgnLXInLCB0aGlzLmdlbmVyYXRlZERvY3NEaXJlY3RvcnksIGpvaW4odGhpcy5jbG9uZURpciwgcHVibGlzaERpcikpO1xuXHR9XG5cblx0LyoqXG5cdCAqIENvbW1pdCAoYnV0IGRvIG5vdCBwdXNoKSBldmVyeXRoaW5nIHRoZSBuZXcgZG9jdW1lbnRhdGlvblxuXHQgKi9cblx0cHJpdmF0ZSBjb21taXQoKSB7XG5cdFx0Y29uc3QgcHVibGlzaERpciA9IHRoaXMuc3ViRGlyZWN0b3J5O1xuXG5cdFx0aWYgKGV4ZWMoJ2dpdCBzdGF0dXMgLS1wb3JjZWxhaW4nLCB7IHNpbGVudDogdHJ1ZSwgY3dkOiB0aGlzLmNsb25lRGlyIH0pID09PSAnJykge1xuXHRcdFx0dGhpcy5sb2cud3JpdGVsbignTm90aGluZyBjaGFuZ2VkJyk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0ZXhlYyhgZ2l0IGFkZCAke3B1Ymxpc2hEaXJ9YCwgeyBzaWxlbnQ6IHRydWUsIGN3ZDogdGhpcy5jbG9uZURpciB9KTtcblx0XHRleGVjKCdnaXQgY29tbWl0IC1tIFwiVXBkYXRlIEFQSSBkb2NzXCInLCB7IHNpbGVudDogdHJ1ZSwgY3dkOiB0aGlzLmNsb25lRGlyIH0pO1xuXHR9XG5cblx0LyoqXG5cdCAqIEV4ZWN1dGUgYSBjcmVkZW50aWFsZWQgZ2l0IGNvbW1hbmRcblx0ICogQHBhcmFtIGNvbW1hbmQgdGhlIGNvbW1hbmQgdG8gZXhlY3V0ZVxuXHQgKiBAcGFyYW0gb3B0aW9ucyBleGVjdXRlIG9wdGlvbnNcblx0ICovXG5cdHByaXZhdGUgZXhlY1NTSEFnZW50KGNvbW1hbmQ6IHN0cmluZywgb3B0aW9uczogYW55ID0ge30pOiBzdHJpbmcge1xuXHRcdGlmICh0aGlzLmhhc0RlcGxveUNyZWRlbnRpYWxzKCkpIHtcblx0XHRcdGNvbnN0IGRlcGxveUtleTogc3RyaW5nID0gPHN0cmluZz4gdGhpcy5kZXBsb3lLZXk7XG5cdFx0XHRjb25zdCByZWxhdGl2ZURlcGxveUtleSA9IG9wdGlvbnMuY3dkID8gcmVsYXRpdmUob3B0aW9ucy5jd2QsIGRlcGxveUtleSkgOiBkZXBsb3lLZXk7XG5cdFx0XHRjaG1vZFN5bmMoZGVwbG95S2V5LCAnNjAwJyk7XG5cdFx0XHRyZXR1cm4gZXhlYyhgc3NoLWFnZW50IGJhc2ggLWMgJ3NzaC1hZGQgJHsgcmVsYXRpdmVEZXBsb3lLZXkgfTsgJHsgY29tbWFuZCB9J2AsIG9wdGlvbnMpO1xuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdHJldHVybiBleGVjKGNvbW1hbmQsIG9wdGlvbnMpO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBQdWJsaXNoIHRoZSBkb2N1bWVudCBjcmVhdGVkIGJ5IHR5cGVkb2Ncblx0ICovXG5cdHByaXZhdGUgcHVzaCgpIHtcblx0XHR0aGlzLmxvZy53cml0ZWxuKCdQdWJsaXNoaW5nIEFQSSBkb2NzJyk7XG5cdFx0dGhpcy5leGVjU1NIQWdlbnQoYGdpdCBwdXNoIG9yaWdpbiAke3RoaXMuYnJhbmNofWAsIHsgc2lsZW50OiB0cnVlLCBjd2Q6IHRoaXMuY2xvbmVEaXIgfSk7XG5cdFx0dGhpcy5sb2cud3JpdGVsbihgUHVzaGVkICR7dGhpcy5icmFuY2h9IHRvIG9yaWdpbmApO1xuXHR9XG59XG4iXX0=