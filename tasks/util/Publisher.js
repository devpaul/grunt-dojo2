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
            if (!this.hasConifg('user.name')) {
                setGlobalConfig('user.name', 'Travis CI');
            }
            if (!this.hasConifg('user.email')) {
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
                var response = process_1.spawn(command, args, options);
                if (response.stderr) {
                    this.log.writeln(response.stderr);
                }
                return response.stdout;
            }
        };
        Publisher.prototype.hasConifg = function (key) {
            try {
                return !!process_1.exec("git config " + key, { silent: true });
            }
            catch (e) { }
            return false;
        };
        return Publisher;
    }());
    exports.default = Publisher;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUHVibGlzaGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiUHVibGlzaGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0lBQUEseUJBQTJDO0lBQzNDLHFDQUF3QztJQUV4Qyw2QkFBZ0M7SUFhaEMsSUFBTSxhQUFhLEdBQUc7UUFDckIsT0FBTyxZQUFZLElBQVk7WUFDOUIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNsQixNQUFNLENBQUMsSUFBSSxDQUFDO1FBQ2IsQ0FBQztLQUNELENBQUM7SUFFRix5QkFBZ0MsR0FBVyxFQUFFLEtBQWE7UUFDekQsTUFBTSxDQUFDLGNBQUksQ0FBQyx5QkFBd0IsR0FBRyxTQUFNLEtBQVEsRUFBRSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO0lBQzFFLENBQUM7SUFGRCwwQ0FFQztJQUVEO1FBMEJDLG1CQUFZLFFBQWdCLEVBQUUsT0FBcUI7WUFBckIsd0JBQUEsRUFBQSxZQUFxQjtZQXpCbkQ7O2VBRUc7WUFDSCxXQUFNLEdBQVcsVUFBVSxDQUFDO1lBTzVCOztlQUVHO1lBQ0gsY0FBUyxHQUFXLFlBQVksQ0FBQztZQUVqQzs7ZUFFRztZQUNILFFBQUcsR0FBUSxhQUFhLENBQUM7WUFReEIsSUFBSSxDQUFDLGNBQWMsR0FBRyxRQUFRLENBQUM7WUFFL0IsZ0NBQWdDO1lBQ2hDLE9BQU8sQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUNqRCxPQUFPLENBQUMsU0FBUyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDMUQsT0FBTyxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3hDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENB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RSxDQUFDLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7b0JBQ3JCLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDbkMsQ0FBQztnQkFDRCxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQztZQUN4QixDQUFDO1FBQ0YsQ0FBQztRQUVPLDZCQUFTLEdBQWpCLFVBQWtCLEdBQVc7WUFDNUIsSUFBSSxDQUFDO2dCQUNKLE1BQU0sQ0FBQyxDQUFDLENBQUMsY0FBSSxDQUFDLGdCQUFlLEdBQU0sRUFBRSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO1lBQ3hELENBQUM7WUFDRCxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUViLE1BQU0sQ0FBQyxLQUFLLENBQUM7UUFDZCxDQUFDO1FBQ0YsZ0JBQUM7SUFBRCxDQUFDLEFBcElELElBb0lDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZXhpc3RzU3luYywgY2htb2RTeW5jIH0gZnJvbSAnZnMnO1xuaW1wb3J0IHsgZXhlYywgc3Bhd24gfSBmcm9tICcuL3Byb2Nlc3MnO1xuaW1wb3J0IExvZ01vZHVsZSA9IGdydW50LmxvZy5Mb2dNb2R1bGU7XG5pbXBvcnQgeyByZWxhdGl2ZSB9IGZyb20gJ3BhdGgnO1xuXG5leHBvcnQgaW50ZXJmYWNlIE9wdGlvbnMge1xuXHRicmFuY2g/OiBQdWJsaXNoZXJbJ2JyYW5jaCddO1xuXHRkZXBsb3lLZXk/OiBQdWJsaXNoZXJbJ2RlcGxveUtleSddO1xuXHRsb2c/OiBQdWJsaXNoZXJbJ2xvZyddO1xuXHR1cmw/OiBQdWJsaXNoZXJbJ3VybCddO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIExvZyB7XG5cdHdyaXRlbG46IExvZ01vZHVsZVsnd3JpdGVsbiddO1xufVxuXG5jb25zdCBjb25zb2xlTG9nZ2VyID0ge1xuXHR3cml0ZWxuKHRoaXM6IGFueSwgaW5mbzogc3RyaW5nKSB7XG5cdFx0Y29uc29sZS5sb2coaW5mbyk7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBzZXRHbG9iYWxDb25maWcoa2V5OiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcpIHtcblx0cmV0dXJuIGV4ZWMoYGdpdCBjb25maWcgLS1nbG9iYWwgJHsga2V5IH0gJHsgdmFsdWUgfWAsIHsgc2lsZW50OiB0cnVlIH0pO1xufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQdWJsaXNoZXIge1xuXHQvKipcblx0ICogVGhlIGJyYW5jaCB0byBwdWJsaXNoXG5cdCAqL1xuXHRicmFuY2g6IHN0cmluZyA9ICdnaC1wYWdlcyc7XG5cblx0LyoqXG5cdCAqIFRoZSB0ZW1wb3JhcnkgZGlyZWN0b3J5IGZvciB0aGUgbG9jYWwgZ2l0IGNsb25lXG5cdCAqL1xuXHRjbG9uZURpcmVjdG9yeTogc3RyaW5nO1xuXG5cdC8qKlxuXHQgKiBUaGUgZGVwbG95bWVudCBrZXkgdG8gdXNlXG5cdCAqL1xuXHRkZXBsb3lLZXk6IHN0cmluZyA9ICdkZXBsb3lfa2V5JztcblxuXHQvKipcblx0ICogTG9nZ2luZyB1dGlsaXR5XG5cdCAqL1xuXHRsb2c6IExvZyA9IGNvbnNvbGVMb2dnZXI7XG5cblx0LyoqXG5cdCAqIFRoZSByZXBvIGxvY2F0aW9uXG5cdCAqL1xuXHR1cmw6IHN0cmluZztcblxuXHRjb25zdHJ1Y3RvcihjbG9uZURpcjogc3RyaW5nLCBvcHRpb25zOiBPcHRpb25zID0ge30pIHtcblx0XHR0aGlzLmNsb25lRGlyZWN0b3J5ID0gY2xvbmVEaXI7XG5cblx0XHQvLyBvcHRpb25hbCBjb25maWd1cmF0aW9uIHZhbHVlc1xuXHRcdG9wdGlvbnMuYnJhbmNoICYmICh0aGlzLmJyYW5jaCA9IG9wdGlvbnMuYnJhbmNoKTtcblx0XHRvcHRpb25zLmRlcGxveUtleSAmJiAodGhpcy5kZXBsb3lLZXkgPSBvcHRpb25zLmRlcGxveUtleSk7XG5cdFx0b3B0aW9ucy5sb2cgJiYgKHRoaXMubG9nID0gb3B0aW9ucy5sb2cpO1xuXHRcdGlmIChvcHRpb25zLnVybCkge1xuXHRcdFx0dGhpcy51cmwgPSBvcHRpb25zLnVybDtcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHRjb25zdCByZXBvID0gcHJvY2Vzcy5lbnYuVFJBVklTX1JFUE9fU0xVRyB8fCAnJzsgLy8gVE9ETyBsb29rIHVwIHRoZSByZXBvIGluZm9ybWF0aW9uP1xuXHRcdFx0dGhpcy51cmwgPSBgZ2l0QGdpdGh1Yi5jb206JHsgcmVwbyB9LmdpdGA7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIEByZXR1cm4ge2Jvb2xlYW59IGlmIGEgZGVwbG95IGtleSBleGlzdHMgaW4gdGhlIGZpbGUgc3lzdGVtXG5cdCAqL1xuXHRoYXNEZXBsb3lDcmVkZW50aWFscygpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gZXhpc3RzU3luYyh0aGlzLmRlcGxveUtleSk7XG5cdH1cblxuXHQvKipcblx0ICogQ29tbWl0IGZpbGVzIHRvIGEgZnJlc2ggY2xvbmUgb2YgdGhlIHJlcG9zaXRvcnlcblx0ICovXG5cdGNvbW1pdCgpOiBib29sZWFuIHtcblx0XHRpZiAoZXhlYygnZ2l0IHN0YXR1cyAtLXBvcmNlbGFpbicsIHsgc2lsZW50OiB0cnVlLCBjd2Q6IHRoaXMuY2xvbmVEaXJlY3RvcnkgfSkgPT09ICcnKSB7XG5cdFx0XHR0aGlzLmxvZy53cml0ZWxuKCdOb3RoaW5nIGNoYW5nZWQnKTtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHRleGVjKGBnaXQgYWRkIC0tYWxsIC5gLCB7IHNpbGVudDogdHJ1ZSwgY3dkOiB0aGlzLmNsb25lRGlyZWN0b3J5IH0pO1xuXHRcdGV4ZWMoJ2dpdCBjb21taXQgLW0gXCJVcGRhdGUgQVBJIGRvY3NcIicsIHsgc2lsZW50OiB0cnVlLCBjd2Q6IHRoaXMuY2xvbmVEaXJlY3RvcnkgfSk7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblxuXHQvKipcblx0ICogSW5pdGlhbGl6ZSB0aGUgcmVwbyBhbmQgcHJlcGFyZSBmb3IgaXQgdG8gY2hlY2sgaW5cblx0ICovXG5cdGluaXQoKSB7XG5cdFx0Y29uc3QgcHVibGlzaEJyYW5jaCA9IHRoaXMuYnJhbmNoO1xuXG5cdFx0Ly8gUHJlcmVxdWlzaXRlcyBmb3IgdXNpbmcgZ2l0XG5cdFx0aWYgKCF0aGlzLmhhc0NvbmlmZygndXNlci5uYW1lJykpIHtcblx0XHRcdHNldEdsb2JhbENvbmZpZygndXNlci5uYW1lJywgJ1RyYXZpcyBDSScpO1xuXHRcdH1cblx0XHRpZiAoIXRoaXMuaGFzQ29uaWZnKCd1c2VyLmVtYWlsJykpIHtcblx0XHRcdHNldEdsb2JhbENvbmZpZygndXNlci5lbWFpbCcsICdzdXBwb3J0QHNpdGVwZW4uY29tJyk7XG5cdFx0fVxuXG5cdFx0dGhpcy5sb2cud3JpdGVsbihgQ2xvbmluZyAkeyB0aGlzLnVybCB9YCk7XG5cdFx0dGhpcy5leGVjU1NIQWdlbnQoJ2dpdCcsIFsgJ2Nsb25lJywgdGhpcy51cmwsIHRoaXMuY2xvbmVEaXJlY3RvcnkgXSwgeyBzaWxlbnQ6IHRydWUgfSk7XG5cblx0XHR0cnkge1xuXHRcdFx0ZXhlYyhgZ2l0IGNoZWNrb3V0ICR7IHB1Ymxpc2hCcmFuY2ggfWAsIHsgc2lsZW50OiB0cnVlLCBjd2Q6IHRoaXMuY2xvbmVEaXJlY3RvcnkgfSk7XG5cdFx0fVxuXHRcdGNhdGNoIChlcnJvcikge1xuXHRcdFx0Ly8gcHVibGlzaCBicmFuY2ggZGlkbid0IGV4aXN0LCBzbyBjcmVhdGUgaXRcblx0XHRcdGV4ZWMoYGdpdCBjaGVja291dCAtLW9ycGhhbiAkeyBwdWJsaXNoQnJhbmNoIH1gLCB7IHNpbGVudDogdHJ1ZSwgY3dkOiB0aGlzLmNsb25lRGlyZWN0b3J5IH0pO1xuXHRcdFx0ZXhlYygnZ2l0IHJtIC1yZiAuJywgeyBzaWxlbnQ6IHRydWUsIGN3ZDogdGhpcy5jbG9uZURpcmVjdG9yeSB9KTtcblx0XHRcdHRoaXMubG9nLndyaXRlbG4oYENyZWF0ZWQgJHtwdWJsaXNoQnJhbmNofSBicmFuY2hgKTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogUHVibGlzaCB0aGUgY29udGVudHMgb2YgeyBzb3VyY2VEaXJlY3RvcnkgfSBpbiB0aGUgY2xvbmUgYXQgeyBjbG9uZURpciB9IGluIHRoZSBkaXJlY3Rvcnlcblx0ICogeyBzdWJEaXJlY3RvcnkgfSBhbmQgcHVzaCB0byB0aGUgeyBicmFuY2ggfSBicmFuY2guXG5cdCAqL1xuXHRwdWJsaXNoKCkge1xuXHRcdHRoaXMubG9nLndyaXRlbG4oYFB1Ymxpc2hpbmcgJHt0aGlzLmJyYW5jaH0gdG8gb3JpZ2luYCk7XG5cdFx0dGhpcy5leGVjU1NIQWdlbnQoJ2dpdCcsIFsgJ3B1c2gnLCAnb3JpZ2luJywgdGhpcy5icmFuY2ggXSwgeyBzaWxlbnQ6IHRydWUsIGN3ZDogdGhpcy5jbG9uZURpcmVjdG9yeSB9KTtcblx0XHR0aGlzLmxvZy53cml0ZWxuKGBQdXNoZWQgJHt0aGlzLmJyYW5jaH0gdG8gb3JpZ2luYCk7XG5cdH1cblxuXHQvKipcblx0ICogRXhlY3V0ZSBhIGNyZWRlbnRpYWxlZCBnaXQgY29tbWFuZFxuXHQgKiBAcGFyYW0gY29tbWFuZCB0aGUgY29tbWFuZCB0byBleGVjdXRlXG5cdCAqIEBwYXJhbSBvcHRpb25zIGV4ZWN1dGUgb3B0aW9uc1xuXHQgKi9cblx0cHJpdmF0ZSBleGVjU1NIQWdlbnQoY29tbWFuZDogc3RyaW5nLCBhcmdzOiBzdHJpbmdbXSwgb3B0aW9uczogYW55KTogc3RyaW5nIHtcblx0XHRpZiAodGhpcy5oYXNEZXBsb3lDcmVkZW50aWFscygpKSB7XG5cdFx0XHRjb25zdCBkZXBsb3lLZXk6IHN0cmluZyA9IDxzdHJpbmc+IHRoaXMuZGVwbG95S2V5O1xuXHRcdFx0Y29uc3QgcmVsYXRpdmVEZXBsb3lLZXkgPSBvcHRpb25zLmN3ZCA/IHJlbGF0aXZlKG9wdGlvbnMuY3dkLCBkZXBsb3lLZXkpIDogZGVwbG95S2V5O1xuXHRcdFx0Y2htb2RTeW5jKGRlcGxveUtleSwgJzYwMCcpO1xuXHRcdFx0cmV0dXJuIGV4ZWMoYHNzaC1hZ2VudCBiYXNoIC1jICdzc2gtYWRkICR7IHJlbGF0aXZlRGVwbG95S2V5IH07ICR7IGNvbW1hbmQgfSAkeyBhcmdzLmpvaW4oJyAnKSB9J2AsIG9wdGlvbnMpO1xuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdHRoaXMubG9nLndyaXRlbG4oYERlcGxveSBLZXkgXCIkeyB0aGlzLmRlcGxveUtleSB9XCIgaXMgbm90IHByZXNlbnQuIFVzaW5nIGVudmlyb25tZW50IGNyZWRlbnRpYWxzLmApO1xuXHRcdFx0Y29uc3QgcmVzcG9uc2UgPSBzcGF3bihjb21tYW5kLCBhcmdzLCBvcHRpb25zKTtcblxuXHRcdFx0aWYgKHJlc3BvbnNlLnN0ZGVycikge1xuXHRcdFx0XHR0aGlzLmxvZy53cml0ZWxuKHJlc3BvbnNlLnN0ZGVycik7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gcmVzcG9uc2Uuc3Rkb3V0O1xuXHRcdH1cblx0fVxuXG5cdHByaXZhdGUgaGFzQ29uaWZnKGtleTogc3RyaW5nKTogYm9vbGVhbiB7XG5cdFx0dHJ5IHtcblx0XHRcdHJldHVybiAhIWV4ZWMoYGdpdCBjb25maWcgJHsga2V5IH1gLCB7IHNpbGVudDogdHJ1ZSB9KTtcblx0XHR9XG5cdFx0Y2F0Y2ggKGUpIHsgfVxuXG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG59XG4iXX0=