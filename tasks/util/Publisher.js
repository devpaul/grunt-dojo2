(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "fs", "./process", "path"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var fs_1 = require("fs");
    var process_1 = require("./process");
    var path_1 = require("path");
    var consoleLogger = {
        writeln: function (info) {
            console.log(info);
            return this;
        }
    };
    function getConfig(key) {
        return process_1.exec("git config " + key, { silent: true });
    }
    exports.getConfig = getConfig;
    function setGlobalConfig(key, value) {
        return process_1.exec("git config --global " + key + " " + value, { silent: true });
    }
    exports.setGlobalConfig = setGlobalConfig;
    var Publisher = (function () {
        function Publisher(cloneDir, options) {
            if (options === void 0) { options = {}; }
            /**
             * The branch to publish
             */
            this.branch = 'gh-pages';
            /**
             * The deployment key to use
             */
            this.deployKey = 'deploy_key';
            /**
             * Logging utility
             */
            this.log = consoleLogger;
            this.cloneDirectory = cloneDir;
            // optional configuration values
            options.branch && (this.branch = options.branch);
            options.deployKey && (this.deployKey = options.deployKey);
            options.log && (this.log = options.log);
            if (options.url) {
                this.url = options.url;
            }
            else {
                var repo = process.env.TRAVIS_REPO_SLUG || ''; // TODO look up the repo information?
                this.url = "git@github.com:" + repo + ".git";
            }
        }
        /**
         * @return {boolean} if a deploy key exists in the file system
         */
        Publisher.prototype.hasDeployCredentials = function () {
            return fs_1.existsSync(this.deployKey);
        };
        /**
         * Commit files to a fresh clone of the repository
         */
        Publisher.prototype.commit = function () {
            if (process_1.exec('git status --porcelain', { silent: true, cwd: this.cloneDirectory }) === '') {
                this.log.writeln('Nothing changed');
                return false;
            }
            process_1.exec("git add --all .", { silent: true, cwd: this.cloneDirectory });
            process_1.exec('git commit -m "Update API docs"', { silent: true, cwd: this.cloneDirectory });
            return true;
        };
        /**
         * Initialize the repo and prepare for it to check in
         */
        Publisher.prototype.init = function () {
            var publishBranch = this.branch;
            // Prerequisites for using git
            if (!getConfig('user.name')) {
                setGlobalConfig('user.name', 'Travis CI');
            }
            if (!getConfig('user.email')) {
                setGlobalConfig('user.email', 'support@sitepen.com');
            }
            this.log.writeln("Cloning " + this.url);
            this.execSSHAgent('git', ['clone', this.url, this.cloneDirectory], { silent: true });
            try {
                process_1.exec("git checkout " + publishBranch, { silent: true, cwd: this.cloneDirectory });
            }
            catch (error) {
                // publish branch didn't exist, so create it
                process_1.exec("git checkout --orphan " + publishBranch, { silent: true, cwd: this.cloneDirectory });
                process_1.exec('git rm -rf .', { silent: true, cwd: this.cloneDirectory });
                this.log.writeln("Created " + publishBranch + " branch");
            }
        };
        /**
         * Publish the contents of { sourceDirectory } in the clone at { cloneDir } in the directory
         * { subDirectory } and push to the { branch } branch.
         */
        Publisher.prototype.publish = function () {
            this.log.writeln("Publishing " + this.branch + " to origin");
            this.execSSHAgent('git', ['push', 'origin', this.branch], { silent: true, cwd: this.cloneDirectory });
            this.log.writeln("Pushed " + this.branch + " to origin");
        };
        /**
         * Execute a credentialed git command
         * @param command the command to execute
         * @param options execute options
         */
        Publisher.prototype.execSSHAgent = function (command, args, options) {
            if (this.hasDeployCredentials()) {
                var deployKey = this.deployKey;
                var relativeDeployKey = options.cwd ? path_1.relative(options.cwd, deployKey) : deployKey;
                fs_1.chmodSync(deployKey, '600');
                return process_1.exec("ssh-agent bash -c 'ssh-add " + relativeDeployKey + "; " + command + " " + args.join(' ') + "'", options);
            }
            else {
                this.log.writeln("Deploy Key \"" + this.deployKey + "\" is not present. Using environment credentials.");
                return process_1.spawn(command, args, options).stdout;
            }
        };
        return Publisher;
    }());
    exports.default = Publisher;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUHVibGlzaGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiUHVibGlzaGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0lBQUEseUJBQTJDO0lBQzNDLHFDQUF3QztJQUV4Qyw2QkFBZ0M7SUFhaEMsSUFBTSxhQUFhLEdBQUc7UUFDckIsT0FBTyxZQUFZLElBQVk7WUFDOUIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNsQixNQUFNLENBQUMsSUFBSSxDQUFDO1FBQ2IsQ0FBQztLQUNELENBQUM7SUFFRixtQkFBMEIsR0FBVztRQUNwQyxNQUFNLENBQUMsY0FBSSxDQUFDLGdCQUFlLEdBQU0sRUFBRSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO0lBQ3RELENBQUM7SUFGRCw4QkFFQztJQUVELHlCQUFnQyxHQUFXLEVBQUUsS0FBYTtRQUN6RCxNQUFNLENBQUMsY0FBSSxDQUFDLHlCQUF3QixHQUFHLFNBQU0sS0FBUSxFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7SUFDMUUsQ0FBQztJQUZELDBDQUVDO0lBRUQ7UUEwQkMsbUJBQVksUUFBZ0IsRUFBRSxPQUFxQjtZQUFyQix3QkFBQSxFQUFBLFlBQXFCO1lBekJuRDs7ZUFFRztZQUNILFdBQU0sR0FBVyxVQUFVLENBQUM7WUFPNUI7O2VBRUc7WUFDSCxjQUFTLEdBQVcsWUFBWSxDQUFDO1lBRWpDOztlQUVHO1lBQ0gsUUFBRyxHQUFRLGFBQWEsQ0FBQztZQVF4QixJQUFJLENBQUMsY0FBYyxHQUFHLFFBQVEsQ0FBQztZQUUvQixnQ0FBZ0M7WUFDaEMsT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ2pELE9BQU8sQ0FBQyxTQUFTLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FB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UyxzREFBbUQsQ0FBQyxDQUFDO2dCQUNwRyxNQUFNLENBQUMsZUFBSyxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUMsTUFBTSxDQUFDO1lBQzdDLENBQUM7UUFDRixDQUFDO1FBQ0YsZ0JBQUM7SUFBRCxDQUFDLEFBdEhELElBc0hDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZXhpc3RzU3luYywgY2htb2RTeW5jIH0gZnJvbSAnZnMnO1xuaW1wb3J0IHsgZXhlYywgc3Bhd24gfSBmcm9tICcuL3Byb2Nlc3MnO1xuaW1wb3J0IExvZ01vZHVsZSA9IGdydW50LmxvZy5Mb2dNb2R1bGU7XG5pbXBvcnQgeyByZWxhdGl2ZSB9IGZyb20gJ3BhdGgnO1xuXG5leHBvcnQgaW50ZXJmYWNlIE9wdGlvbnMge1xuXHRicmFuY2g/OiBQdWJsaXNoZXJbJ2JyYW5jaCddO1xuXHRkZXBsb3lLZXk/OiBQdWJsaXNoZXJbJ2RlcGxveUtleSddO1xuXHRsb2c/OiBQdWJsaXNoZXJbJ2xvZyddO1xuXHR1cmw/OiBQdWJsaXNoZXJbJ3VybCddO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIExvZyB7XG5cdHdyaXRlbG46IExvZ01vZHVsZVsnd3JpdGVsbiddO1xufVxuXG5jb25zdCBjb25zb2xlTG9nZ2VyID0ge1xuXHR3cml0ZWxuKHRoaXM6IGFueSwgaW5mbzogc3RyaW5nKSB7XG5cdFx0Y29uc29sZS5sb2coaW5mbyk7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRDb25maWcoa2V5OiBzdHJpbmcpOiBzdHJpbmcge1xuXHRyZXR1cm4gZXhlYyhgZ2l0IGNvbmZpZyAkeyBrZXkgfWAsIHsgc2lsZW50OiB0cnVlIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2V0R2xvYmFsQ29uZmlnKGtleTogc3RyaW5nLCB2YWx1ZTogc3RyaW5nKSB7XG5cdHJldHVybiBleGVjKGBnaXQgY29uZmlnIC0tZ2xvYmFsICR7IGtleSB9ICR7IHZhbHVlIH1gLCB7IHNpbGVudDogdHJ1ZSB9KTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUHVibGlzaGVyIHtcblx0LyoqXG5cdCAqIFRoZSBicmFuY2ggdG8gcHVibGlzaFxuXHQgKi9cblx0YnJhbmNoOiBzdHJpbmcgPSAnZ2gtcGFnZXMnO1xuXG5cdC8qKlxuXHQgKiBUaGUgdGVtcG9yYXJ5IGRpcmVjdG9yeSBmb3IgdGhlIGxvY2FsIGdpdCBjbG9uZVxuXHQgKi9cblx0Y2xvbmVEaXJlY3Rvcnk6IHN0cmluZztcblxuXHQvKipcblx0ICogVGhlIGRlcGxveW1lbnQga2V5IHRvIHVzZVxuXHQgKi9cblx0ZGVwbG95S2V5OiBzdHJpbmcgPSAnZGVwbG95X2tleSc7XG5cblx0LyoqXG5cdCAqIExvZ2dpbmcgdXRpbGl0eVxuXHQgKi9cblx0bG9nOiBMb2cgPSBjb25zb2xlTG9nZ2VyO1xuXG5cdC8qKlxuXHQgKiBUaGUgcmVwbyBsb2NhdGlvblxuXHQgKi9cblx0dXJsOiBzdHJpbmc7XG5cblx0Y29uc3RydWN0b3IoY2xvbmVEaXI6IHN0cmluZywgb3B0aW9uczogT3B0aW9ucyA9IHt9KSB7XG5cdFx0dGhpcy5jbG9uZURpcmVjdG9yeSA9IGNsb25lRGlyO1xuXG5cdFx0Ly8gb3B0aW9uYWwgY29uZmlndXJhdGlvbiB2YWx1ZXNcblx0XHRvcHRpb25zLmJyYW5jaCAmJiAodGhpcy5icmFuY2ggPSBvcHRpb25zLmJyYW5jaCk7XG5cdFx0b3B0aW9ucy5kZXBsb3lLZXkgJiYgKHRoaXMuZGVwbG95S2V5ID0gb3B0aW9ucy5kZXBsb3lLZXkpO1xuXHRcdG9wdGlvbnMubG9nICYmICh0aGlzLmxvZyA9IG9wdGlvbnMubG9nKTtcblx0XHRpZiAob3B0aW9ucy51cmwpIHtcblx0XHRcdHRoaXMudXJsID0gb3B0aW9ucy51cmw7XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0Y29uc3QgcmVwbyA9IHByb2Nlc3MuZW52LlRSQVZJU19SRVBPX1NMVUcgfHwgJyc7IC8vIFRPRE8gbG9vayB1cCB0aGUgcmVwbyBpbmZvcm1hdGlvbj9cblx0XHRcdHRoaXMudXJsID0gYGdpdEBnaXRodWIuY29tOiR7IHJlcG8gfS5naXRgO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBAcmV0dXJuIHtib29sZWFufSBpZiBhIGRlcGxveSBrZXkgZXhpc3RzIGluIHRoZSBmaWxlIHN5c3RlbVxuXHQgKi9cblx0aGFzRGVwbG95Q3JlZGVudGlhbHMoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIGV4aXN0c1N5bmModGhpcy5kZXBsb3lLZXkpO1xuXHR9XG5cblx0LyoqXG5cdCAqIENvbW1pdCBmaWxlcyB0byBhIGZyZXNoIGNsb25lIG9mIHRoZSByZXBvc2l0b3J5XG5cdCAqL1xuXHRjb21taXQoKTogYm9vbGVhbiB7XG5cdFx0aWYgKGV4ZWMoJ2dpdCBzdGF0dXMgLS1wb3JjZWxhaW4nLCB7IHNpbGVudDogdHJ1ZSwgY3dkOiB0aGlzLmNsb25lRGlyZWN0b3J5IH0pID09PSAnJykge1xuXHRcdFx0dGhpcy5sb2cud3JpdGVsbignTm90aGluZyBjaGFuZ2VkJyk7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0ZXhlYyhgZ2l0IGFkZCAtLWFsbCAuYCwgeyBzaWxlbnQ6IHRydWUsIGN3ZDogdGhpcy5jbG9uZURpcmVjdG9yeSB9KTtcblx0XHRleGVjKCdnaXQgY29tbWl0IC1tIFwiVXBkYXRlIEFQSSBkb2NzXCInLCB7IHNpbGVudDogdHJ1ZSwgY3dkOiB0aGlzLmNsb25lRGlyZWN0b3J5IH0pO1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cblx0LyoqXG5cdCAqIEluaXRpYWxpemUgdGhlIHJlcG8gYW5kIHByZXBhcmUgZm9yIGl0IHRvIGNoZWNrIGluXG5cdCAqL1xuXHRpbml0KCkge1xuXHRcdGNvbnN0IHB1Ymxpc2hCcmFuY2ggPSB0aGlzLmJyYW5jaDtcblxuXHRcdC8vIFByZXJlcXVpc2l0ZXMgZm9yIHVzaW5nIGdpdFxuXHRcdGlmICghZ2V0Q29uZmlnKCd1c2VyLm5hbWUnKSkge1xuXHRcdFx0c2V0R2xvYmFsQ29uZmlnKCd1c2VyLm5hbWUnLCAnVHJhdmlzIENJJyk7XG5cdFx0fVxuXHRcdGlmICghZ2V0Q29uZmlnKCd1c2VyLmVtYWlsJykpIHtcblx0XHRcdHNldEdsb2JhbENvbmZpZygndXNlci5lbWFpbCcsICdzdXBwb3J0QHNpdGVwZW4uY29tJyk7XG5cdFx0fVxuXG5cdFx0dGhpcy5sb2cud3JpdGVsbihgQ2xvbmluZyAkeyB0aGlzLnVybCB9YCk7XG5cdFx0dGhpcy5leGVjU1NIQWdlbnQoJ2dpdCcsIFsgJ2Nsb25lJywgdGhpcy51cmwsIHRoaXMuY2xvbmVEaXJlY3RvcnkgXSwgeyBzaWxlbnQ6IHRydWUgfSk7XG5cblx0XHR0cnkge1xuXHRcdFx0ZXhlYyhgZ2l0IGNoZWNrb3V0ICR7IHB1Ymxpc2hCcmFuY2ggfWAsIHsgc2lsZW50OiB0cnVlLCBjd2Q6IHRoaXMuY2xvbmVEaXJlY3RvcnkgfSk7XG5cdFx0fVxuXHRcdGNhdGNoIChlcnJvcikge1xuXHRcdFx0Ly8gcHVibGlzaCBicmFuY2ggZGlkbid0IGV4aXN0LCBzbyBjcmVhdGUgaXRcblx0XHRcdGV4ZWMoYGdpdCBjaGVja291dCAtLW9ycGhhbiAkeyBwdWJsaXNoQnJhbmNoIH1gLCB7IHNpbGVudDogdHJ1ZSwgY3dkOiB0aGlzLmNsb25lRGlyZWN0b3J5IH0pO1xuXHRcdFx0ZXhlYygnZ2l0IHJtIC1yZiAuJywgeyBzaWxlbnQ6IHRydWUsIGN3ZDogdGhpcy5jbG9uZURpcmVjdG9yeSB9KTtcblx0XHRcdHRoaXMubG9nLndyaXRlbG4oYENyZWF0ZWQgJHtwdWJsaXNoQnJhbmNofSBicmFuY2hgKTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogUHVibGlzaCB0aGUgY29udGVudHMgb2YgeyBzb3VyY2VEaXJlY3RvcnkgfSBpbiB0aGUgY2xvbmUgYXQgeyBjbG9uZURpciB9IGluIHRoZSBkaXJlY3Rvcnlcblx0ICogeyBzdWJEaXJlY3RvcnkgfSBhbmQgcHVzaCB0byB0aGUgeyBicmFuY2ggfSBicmFuY2guXG5cdCAqL1xuXHRwdWJsaXNoKCkge1xuXHRcdHRoaXMubG9nLndyaXRlbG4oYFB1Ymxpc2hpbmcgJHt0aGlzLmJyYW5jaH0gdG8gb3JpZ2luYCk7XG5cdFx0dGhpcy5leGVjU1NIQWdlbnQoJ2dpdCcsIFsgJ3B1c2gnLCAnb3JpZ2luJywgdGhpcy5icmFuY2ggXSwgeyBzaWxlbnQ6IHRydWUsIGN3ZDogdGhpcy5jbG9uZURpcmVjdG9yeSB9KTtcblx0XHR0aGlzLmxvZy53cml0ZWxuKGBQdXNoZWQgJHt0aGlzLmJyYW5jaH0gdG8gb3JpZ2luYCk7XG5cdH1cblxuXHQvKipcblx0ICogRXhlY3V0ZSBhIGNyZWRlbnRpYWxlZCBnaXQgY29tbWFuZFxuXHQgKiBAcGFyYW0gY29tbWFuZCB0aGUgY29tbWFuZCB0byBleGVjdXRlXG5cdCAqIEBwYXJhbSBvcHRpb25zIGV4ZWN1dGUgb3B0aW9uc1xuXHQgKi9cblx0cHJpdmF0ZSBleGVjU1NIQWdlbnQoY29tbWFuZDogc3RyaW5nLCBhcmdzOiBzdHJpbmdbXSwgb3B0aW9uczogYW55KTogc3RyaW5nIHtcblx0XHRpZiAodGhpcy5oYXNEZXBsb3lDcmVkZW50aWFscygpKSB7XG5cdFx0XHRjb25zdCBkZXBsb3lLZXk6IHN0cmluZyA9IDxzdHJpbmc+IHRoaXMuZGVwbG95S2V5O1xuXHRcdFx0Y29uc3QgcmVsYXRpdmVEZXBsb3lLZXkgPSBvcHRpb25zLmN3ZCA/IHJlbGF0aXZlKG9wdGlvbnMuY3dkLCBkZXBsb3lLZXkpIDogZGVwbG95S2V5O1xuXHRcdFx0Y2htb2RTeW5jKGRlcGxveUtleSwgJzYwMCcpO1xuXHRcdFx0cmV0dXJuIGV4ZWMoYHNzaC1hZ2VudCBiYXNoIC1jICdzc2gtYWRkICR7IHJlbGF0aXZlRGVwbG95S2V5IH07ICR7IGNvbW1hbmQgfSAkeyBhcmdzLmpvaW4oJyAnKSB9J2AsIG9wdGlvbnMpO1xuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdHRoaXMubG9nLndyaXRlbG4oYERlcGxveSBLZXkgXCIkeyB0aGlzLmRlcGxveUtleSB9XCIgaXMgbm90IHByZXNlbnQuIFVzaW5nIGVudmlyb25tZW50IGNyZWRlbnRpYWxzLmApO1xuXHRcdFx0cmV0dXJuIHNwYXduKGNvbW1hbmQsIGFyZ3MsIG9wdGlvbnMpLnN0ZG91dDtcblx0XHR9XG5cdH1cbn1cbiJdfQ==