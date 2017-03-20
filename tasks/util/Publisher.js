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
                var result = process_1.spawn(command, args, options);
                if (result.stderr) {
                    this.log.writeln(result.stderr);
                }
                return result.stdout;
            }
        };
        return Publisher;
    }());
    exports.default = Publisher;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUHVibGlzaGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiUHVibGlzaGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0lBQUEseUJBQTJDO0lBQzNDLHFDQUF3QztJQUV4Qyw2QkFBZ0M7SUFhaEMsSUFBTSxhQUFhLEdBQUc7UUFDckIsT0FBTyxZQUFZLElBQVk7WUFDOUIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNsQixNQUFNLENBQUMsSUFBSSxDQUFDO1FBQ2IsQ0FBQztLQUNELENBQUM7SUFFRixtQkFBMEIsR0FBVztRQUNwQyxNQUFNLENBQUMsY0FBSSxDQUFDLGdCQUFlLEdBQU0sRUFBRSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO0lBQ3RELENBQUM7SUFGRCw4QkFFQztJQUVELHlCQUFnQyxHQUFXLEVBQUUsS0FBYTtRQUN6RCxNQUFNLENBQUMsY0FBSSxDQUFDLHlCQUF3QixHQUFHLFNBQU0sS0FBUSxFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7SUFDMUUsQ0FBQztJQUZELDBDQUVDO0lBRUQ7UUEwQkMsbUJBQVksUUFBZ0IsRUFBRSxPQUFxQjtZQUFyQix3QkFBQSxFQUFBLFlBQXFCO1lBekJuRDs7ZUFFRztZQUNILFdBQU0sR0FBVyxVQUFVLENBQUM7WUFPNUI7O2VBRUc7WUFDSCxjQUFTLEdBQVcsWUFBWSxDQUFDO1lBRWpDOztlQUVHO1lBQ0gsUUFBRyxHQUFRLGFBQWEsQ0FBQztZQVF4QixJQUFJLENBQUMsY0FBYyxHQUFHLFFBQVEsQ0FBQztZQUUvQixnQ0FBZ0M7WUFDaEMsT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ2pELE9BQU8sQ0FBQyxTQUFTLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FB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UyxzREFBbUQsQ0FBQyxDQUFDO2dCQUNwRyxJQUFNLE1BQU0sR0FBRyxlQUFLLENBQUMsT0FBTyxFQUFFLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztnQkFFN0MsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7b0JBQ25CLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDakMsQ0FBQztnQkFDRCxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQztZQUN0QixDQUFDO1FBQ0YsQ0FBQztRQUNGLGdCQUFDO0lBQUQsQ0FBQyxBQTNIRCxJQTJIQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGV4aXN0c1N5bmMsIGNobW9kU3luYyB9IGZyb20gJ2ZzJztcbmltcG9ydCB7IGV4ZWMsIHNwYXduIH0gZnJvbSAnLi9wcm9jZXNzJztcbmltcG9ydCBMb2dNb2R1bGUgPSBncnVudC5sb2cuTG9nTW9kdWxlO1xuaW1wb3J0IHsgcmVsYXRpdmUgfSBmcm9tICdwYXRoJztcblxuZXhwb3J0IGludGVyZmFjZSBPcHRpb25zIHtcblx0YnJhbmNoPzogUHVibGlzaGVyWydicmFuY2gnXTtcblx0ZGVwbG95S2V5PzogUHVibGlzaGVyWydkZXBsb3lLZXknXTtcblx0bG9nPzogUHVibGlzaGVyWydsb2cnXTtcblx0dXJsPzogUHVibGlzaGVyWyd1cmwnXTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBMb2cge1xuXHR3cml0ZWxuOiBMb2dNb2R1bGVbJ3dyaXRlbG4nXTtcbn1cblxuY29uc3QgY29uc29sZUxvZ2dlciA9IHtcblx0d3JpdGVsbih0aGlzOiBhbnksIGluZm86IHN0cmluZykge1xuXHRcdGNvbnNvbGUubG9nKGluZm8pO1xuXHRcdHJldHVybiB0aGlzO1xuXHR9XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q29uZmlnKGtleTogc3RyaW5nKTogc3RyaW5nIHtcblx0cmV0dXJuIGV4ZWMoYGdpdCBjb25maWcgJHsga2V5IH1gLCB7IHNpbGVudDogdHJ1ZSB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNldEdsb2JhbENvbmZpZyhrZXk6IHN0cmluZywgdmFsdWU6IHN0cmluZykge1xuXHRyZXR1cm4gZXhlYyhgZ2l0IGNvbmZpZyAtLWdsb2JhbCAkeyBrZXkgfSAkeyB2YWx1ZSB9YCwgeyBzaWxlbnQ6IHRydWUgfSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFB1Ymxpc2hlciB7XG5cdC8qKlxuXHQgKiBUaGUgYnJhbmNoIHRvIHB1Ymxpc2hcblx0ICovXG5cdGJyYW5jaDogc3RyaW5nID0gJ2doLXBhZ2VzJztcblxuXHQvKipcblx0ICogVGhlIHRlbXBvcmFyeSBkaXJlY3RvcnkgZm9yIHRoZSBsb2NhbCBnaXQgY2xvbmVcblx0ICovXG5cdGNsb25lRGlyZWN0b3J5OiBzdHJpbmc7XG5cblx0LyoqXG5cdCAqIFRoZSBkZXBsb3ltZW50IGtleSB0byB1c2Vcblx0ICovXG5cdGRlcGxveUtleTogc3RyaW5nID0gJ2RlcGxveV9rZXknO1xuXG5cdC8qKlxuXHQgKiBMb2dnaW5nIHV0aWxpdHlcblx0ICovXG5cdGxvZzogTG9nID0gY29uc29sZUxvZ2dlcjtcblxuXHQvKipcblx0ICogVGhlIHJlcG8gbG9jYXRpb25cblx0ICovXG5cdHVybDogc3RyaW5nO1xuXG5cdGNvbnN0cnVjdG9yKGNsb25lRGlyOiBzdHJpbmcsIG9wdGlvbnM6IE9wdGlvbnMgPSB7fSkge1xuXHRcdHRoaXMuY2xvbmVEaXJlY3RvcnkgPSBjbG9uZURpcjtcblxuXHRcdC8vIG9wdGlvbmFsIGNvbmZpZ3VyYXRpb24gdmFsdWVzXG5cdFx0b3B0aW9ucy5icmFuY2ggJiYgKHRoaXMuYnJhbmNoID0gb3B0aW9ucy5icmFuY2gpO1xuXHRcdG9wdGlvbnMuZGVwbG95S2V5ICYmICh0aGlzLmRlcGxveUtleSA9IG9wdGlvbnMuZGVwbG95S2V5KTtcblx0XHRvcHRpb25zLmxvZyAmJiAodGhpcy5sb2cgPSBvcHRpb25zLmxvZyk7XG5cdFx0aWYgKG9wdGlvbnMudXJsKSB7XG5cdFx0XHR0aGlzLnVybCA9IG9wdGlvbnMudXJsO1xuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdGNvbnN0IHJlcG8gPSBwcm9jZXNzLmVudi5UUkFWSVNfUkVQT19TTFVHIHx8ICcnOyAvLyBUT0RPIGxvb2sgdXAgdGhlIHJlcG8gaW5mb3JtYXRpb24/XG5cdFx0XHR0aGlzLnVybCA9IGBnaXRAZ2l0aHViLmNvbTokeyByZXBvIH0uZ2l0YDtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogQHJldHVybiB7Ym9vbGVhbn0gaWYgYSBkZXBsb3kga2V5IGV4aXN0cyBpbiB0aGUgZmlsZSBzeXN0ZW1cblx0ICovXG5cdGhhc0RlcGxveUNyZWRlbnRpYWxzKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiBleGlzdHNTeW5jKHRoaXMuZGVwbG95S2V5KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDb21taXQgZmlsZXMgdG8gYSBmcmVzaCBjbG9uZSBvZiB0aGUgcmVwb3NpdG9yeVxuXHQgKi9cblx0Y29tbWl0KCk6IGJvb2xlYW4ge1xuXHRcdGlmIChleGVjKCdnaXQgc3RhdHVzIC0tcG9yY2VsYWluJywgeyBzaWxlbnQ6IHRydWUsIGN3ZDogdGhpcy5jbG9uZURpcmVjdG9yeSB9KSA9PT0gJycpIHtcblx0XHRcdHRoaXMubG9nLndyaXRlbG4oJ05vdGhpbmcgY2hhbmdlZCcpO1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdGV4ZWMoYGdpdCBhZGQgLS1hbGwgLmAsIHsgc2lsZW50OiB0cnVlLCBjd2Q6IHRoaXMuY2xvbmVEaXJlY3RvcnkgfSk7XG5cdFx0ZXhlYygnZ2l0IGNvbW1pdCAtbSBcIlVwZGF0ZSBBUEkgZG9jc1wiJywgeyBzaWxlbnQ6IHRydWUsIGN3ZDogdGhpcy5jbG9uZURpcmVjdG9yeSB9KTtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBJbml0aWFsaXplIHRoZSByZXBvIGFuZCBwcmVwYXJlIGZvciBpdCB0byBjaGVjayBpblxuXHQgKi9cblx0aW5pdCgpIHtcblx0XHRjb25zdCBwdWJsaXNoQnJhbmNoID0gdGhpcy5icmFuY2g7XG5cblx0XHQvLyBQcmVyZXF1aXNpdGVzIGZvciB1c2luZyBnaXRcblx0XHRpZiAoIWdldENvbmZpZygndXNlci5uYW1lJykpIHtcblx0XHRcdHNldEdsb2JhbENvbmZpZygndXNlci5uYW1lJywgJ1RyYXZpcyBDSScpO1xuXHRcdH1cblx0XHRpZiAoIWdldENvbmZpZygndXNlci5lbWFpbCcpKSB7XG5cdFx0XHRzZXRHbG9iYWxDb25maWcoJ3VzZXIuZW1haWwnLCAnc3VwcG9ydEBzaXRlcGVuLmNvbScpO1xuXHRcdH1cblxuXHRcdHRoaXMubG9nLndyaXRlbG4oYENsb25pbmcgJHsgdGhpcy51cmwgfWApO1xuXHRcdHRoaXMuZXhlY1NTSEFnZW50KCdnaXQnLCBbICdjbG9uZScsIHRoaXMudXJsLCB0aGlzLmNsb25lRGlyZWN0b3J5IF0sIHsgc2lsZW50OiB0cnVlIH0pO1xuXG5cdFx0dHJ5IHtcblx0XHRcdGV4ZWMoYGdpdCBjaGVja291dCAkeyBwdWJsaXNoQnJhbmNoIH1gLCB7IHNpbGVudDogdHJ1ZSwgY3dkOiB0aGlzLmNsb25lRGlyZWN0b3J5IH0pO1xuXHRcdH1cblx0XHRjYXRjaCAoZXJyb3IpIHtcblx0XHRcdC8vIHB1Ymxpc2ggYnJhbmNoIGRpZG4ndCBleGlzdCwgc28gY3JlYXRlIGl0XG5cdFx0XHRleGVjKGBnaXQgY2hlY2tvdXQgLS1vcnBoYW4gJHsgcHVibGlzaEJyYW5jaCB9YCwgeyBzaWxlbnQ6IHRydWUsIGN3ZDogdGhpcy5jbG9uZURpcmVjdG9yeSB9KTtcblx0XHRcdGV4ZWMoJ2dpdCBybSAtcmYgLicsIHsgc2lsZW50OiB0cnVlLCBjd2Q6IHRoaXMuY2xvbmVEaXJlY3RvcnkgfSk7XG5cdFx0XHR0aGlzLmxvZy53cml0ZWxuKGBDcmVhdGVkICR7cHVibGlzaEJyYW5jaH0gYnJhbmNoYCk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIFB1Ymxpc2ggdGhlIGNvbnRlbnRzIG9mIHsgc291cmNlRGlyZWN0b3J5IH0gaW4gdGhlIGNsb25lIGF0IHsgY2xvbmVEaXIgfSBpbiB0aGUgZGlyZWN0b3J5XG5cdCAqIHsgc3ViRGlyZWN0b3J5IH0gYW5kIHB1c2ggdG8gdGhlIHsgYnJhbmNoIH0gYnJhbmNoLlxuXHQgKi9cblx0cHVibGlzaCgpIHtcblx0XHR0aGlzLmxvZy53cml0ZWxuKGBQdWJsaXNoaW5nICR7dGhpcy5icmFuY2h9IHRvIG9yaWdpbmApO1xuXHRcdHRoaXMuZXhlY1NTSEFnZW50KCdnaXQnLCBbICdwdXNoJywgJ29yaWdpbicsIHRoaXMuYnJhbmNoIF0sIHsgc2lsZW50OiB0cnVlLCBjd2Q6IHRoaXMuY2xvbmVEaXJlY3RvcnkgfSk7XG5cdFx0dGhpcy5sb2cud3JpdGVsbihgUHVzaGVkICR7dGhpcy5icmFuY2h9IHRvIG9yaWdpbmApO1xuXHR9XG5cblx0LyoqXG5cdCAqIEV4ZWN1dGUgYSBjcmVkZW50aWFsZWQgZ2l0IGNvbW1hbmRcblx0ICogQHBhcmFtIGNvbW1hbmQgdGhlIGNvbW1hbmQgdG8gZXhlY3V0ZVxuXHQgKiBAcGFyYW0gb3B0aW9ucyBleGVjdXRlIG9wdGlvbnNcblx0ICovXG5cdHByaXZhdGUgZXhlY1NTSEFnZW50KGNvbW1hbmQ6IHN0cmluZywgYXJnczogc3RyaW5nW10sIG9wdGlvbnM6IGFueSk6IHN0cmluZyB7XG5cdFx0aWYgKHRoaXMuaGFzRGVwbG95Q3JlZGVudGlhbHMoKSkge1xuXHRcdFx0Y29uc3QgZGVwbG95S2V5OiBzdHJpbmcgPSA8c3RyaW5nPiB0aGlzLmRlcGxveUtleTtcblx0XHRcdGNvbnN0IHJlbGF0aXZlRGVwbG95S2V5ID0gb3B0aW9ucy5jd2QgPyByZWxhdGl2ZShvcHRpb25zLmN3ZCwgZGVwbG95S2V5KSA6IGRlcGxveUtleTtcblx0XHRcdGNobW9kU3luYyhkZXBsb3lLZXksICc2MDAnKTtcblx0XHRcdHJldHVybiBleGVjKGBzc2gtYWdlbnQgYmFzaCAtYyAnc3NoLWFkZCAkeyByZWxhdGl2ZURlcGxveUtleSB9OyAkeyBjb21tYW5kIH0gJHsgYXJncy5qb2luKCcgJykgfSdgLCBvcHRpb25zKTtcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHR0aGlzLmxvZy53cml0ZWxuKGBEZXBsb3kgS2V5IFwiJHsgdGhpcy5kZXBsb3lLZXkgfVwiIGlzIG5vdCBwcmVzZW50LiBVc2luZyBlbnZpcm9ubWVudCBjcmVkZW50aWFscy5gKTtcblx0XHRcdGNvbnN0IHJlc3VsdCA9IHNwYXduKGNvbW1hbmQsIGFyZ3MsIG9wdGlvbnMpO1xuXG5cdFx0XHRpZiAocmVzdWx0LnN0ZGVycikge1xuXHRcdFx0XHR0aGlzLmxvZy53cml0ZWxuKHJlc3VsdC5zdGRlcnIpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHJlc3VsdC5zdGRvdXQ7XG5cdFx0fVxuXHR9XG59XG4iXX0=