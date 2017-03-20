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
    return function (grunt, packageJson) {
        var execa = require('execa');
        var path = require('path');
        var pkgDir = require('pkg-dir');
        var parse = require('parse-git-config');
        var packagePath = pkgDir.sync(process.cwd());
        var npmBin = 'npm';
        var gitBin = 'git';
        var temp = 'temp/';
        var defaultBranch = 'master';
        var preReleaseTags = ['alpha', 'beta', 'beta1', 'beta2', 'beta3', 'rc'];
        var gitBaseRemote = 'git@github.com:dojo/';
        var defaultMaintainers = ['sitepen', 'dojotoolkit', 'dojo'];
        var extraToCopy = ['README.md'];
        var releaseVersion = grunt.option('release-version');
        var nextVersion = grunt.option('next-version');
        var preReleaseTag = grunt.option('pre-release-tag');
        var dryRun = grunt.option('dry-run');
        var tag = grunt.option('tag');
        var pushBack = grunt.option('push-back');
        var initial = grunt.option('initial');
        var skipChecks = grunt.option('skip-checks');
        var initialPackageJson = grunt.file.readJSON(path.join(packagePath, 'package.json'));
        var commitMsg = '"Update package metadata"';
        function matchesPreReleaseTag(preReleaseTag, version) {
            var regexp = new RegExp("(.*)-(" + preReleaseTag + ")\\.(\\d+)");
            return regexp.exec(version) || [];
        }
        function matchesVersion(version1, version2) {
            return version2.indexOf(version1) === 0;
        }
        function getNextPreReleaseTagVersion(versionInPackage, existingVersions) {
            var filteredVersions = existingVersions
                .filter(function (v) { return matchesVersion(versionInPackage, v); })
                .filter(function (v) { return matchesPreReleaseTag(preReleaseTag, v); })
                .map(function (v) { return parseInt(matchesPreReleaseTag(preReleaseTag, v)[3], 10) || 0; });
            var nextVersion = filteredVersions.length ? Math.max.apply(Math, filteredVersions) + 1 : 1;
            return versionInPackage + "-" + preReleaseTag + "." + nextVersion;
        }
        function preparePackageJson(packageJson) {
            packageJson.private = undefined;
            packageJson.scripts = undefined;
            packageJson.files = undefined;
            packageJson.typings = undefined;
            packageJson.main = 'main.js';
            return packageJson;
        }
        function getGitRemote() {
            var gitConfig = parse.sync();
            var remotes = Object.keys(gitConfig)
                .filter(function (key) { return key.indexOf('remote') === 0; })
                .filter(function (key) { return gitConfig[key].url.indexOf(gitBaseRemote) === 0; })
                .map(function (key) { return gitConfig[key].url; });
            return remotes.length ? remotes[0] : false;
        }
        function npmPreReleaseVersion(versionInPackage, versions) {
            var versionToRelease = getNextPreReleaseTagVersion(versionInPackage, versions);
            var args = ['version', versionToRelease];
            if (dryRun) {
                args.unshift('--no-git-tag-version');
            }
            grunt.log.subhead("version to release: " + versionToRelease);
            return command(npmBin, args, {}, true);
        }
        function command(bin, args, options, executeOnDryRun) {
            if (dryRun && !executeOnDryRun) {
                grunt.log.subhead('dry-run (not running)');
            }
            bin = bin + " " + args.join(' ');
            grunt.log.ok(bin + " - " + JSON.stringify(options));
            if (!dryRun || executeOnDryRun) {
                return execa.shell(bin, options);
            }
            return Promise.resolve({});
        }
        grunt.registerTask('can-publish-check', 'check whether author can publish', function () {
            var done = this.async();
            var whoamiPromise = command(npmBin, ['whoami'], {}, true).then(function (result) { return result.stdout; }, function (err) { return grunt.fail.fatal('not logged into npm'); });
            var maintainersPromise;
            if (initial) {
                maintainersPromise = Promise.resolve(defaultMaintainers);
            }
            else {
                maintainersPromise = command(npmBin, ['view', '.', '--json'], {}, true)
                    .then(function (result) { return JSON.parse(result.stdout).maintainers; })
                    .then(function (maintainers) { return maintainers.map(function (maintainer) { return maintainer.replace(/\s<.*/, ''); }); });
            }
            return Promise.all([whoamiPromise, maintainersPromise]).then(function (results) {
                var user = results[0];
                var maintainers = results[1];
                var isMaintainer = maintainers.indexOf(user) > -1;
                if (!isMaintainer) {
                    grunt.fail.fatal("cannot publish this package with user " + user);
                }
            }).then(done);
        });
        grunt.registerTask('repo-is-clean-check', 'check whether the repo is clean', function () {
            var done = this.async();
            return command(gitBin, ['status', '--porcelain'], {}, true)
                .then(function (result) {
                if (result.stdout) {
                    grunt.fail.fatal('there are changes in the working tree');
                }
            })
                .then(function () { return command(gitBin, ['rev-parse', '--abbrev-ref', 'HEAD'], {}, true); })
                .then(function (result) {
                if (result.stdout !== defaultBranch) {
                    grunt.fail.fatal("not on " + defaultBranch + " branch");
                }
            })
                .then(done);
        });
        grunt.registerTask('release-publish', 'publish the package to npm', function () {
            var done = this.async();
            var args = ['publish', '.'];
            var promises = [command(npmBin, args, { cwd: temp }, false)];
            if (tag) {
                args.push('--tag', tag);
            }
            grunt.log.subhead('publishing to npm...');
            if (dryRun) {
                promises.push(command(npmBin, ['pack', '../' + temp], { cwd: 'dist' }, true));
            }
            return Promise.all(promises).then(done);
        });
        grunt.registerTask('release-version-pre-release-tag', 'auto version based on pre release tag', function () {
            var done = this.async();
            var versionInPackage = initialPackageJson.version.replace(/-.*/g, '');
            if (initial) {
                return npmPreReleaseVersion(versionInPackage, []).then(done);
            }
            else {
                return command(npmBin, ['view', '.', '--json'], {}, true).then(function (result) {
                    if (result.stdout) {
                        var time = JSON.parse(result.stdout).time;
                        var versions = Object.keys(time).filter(function (key) {
                            return ['created', 'modified'].indexOf(key) < 0;
                        });
                        npmPreReleaseVersion(versionInPackage, versions).then(done);
                    }
                    else {
                        grunt.fail.fatal('failed to fetch versions from npm');
                    }
                });
            }
        });
        grunt.registerTask('release-version-specific', 'set the version manually', function () {
            var done = this.async();
            var args = ['version', releaseVersion];
            if (dryRun) {
                args.unshift('--no-git-tag-version');
            }
            grunt.log.subhead("version to release: " + releaseVersion);
            return command(npmBin, args, {}, true).then(done);
        });
        grunt.registerTask('post-release-version', 'update the version post release', function () {
            var done = this.async();
            var packageJson = Object.assign({}, initialPackageJson);
            if (nextVersion) {
                packageJson.version = nextVersion;
            }
            grunt.file.write('package.json', JSON.stringify(packageJson, null, '  ') + '\n');
            grunt.log.subhead("version of package.json to commit: " + packageJson.version);
            return command(gitBin, ['commit', '-am', commitMsg], {}, false)
                .then(function () {
                if (!pushBack) {
                    return;
                }
                var remote = getGitRemote();
                if (remote) {
                    return command(gitBin, ['push', remote, defaultBranch], {}, false)
                        .then(function () { return command(gitBin, ['push', remote, '--tags'], {}, false); });
                }
                else {
                    grunt.log.subhead('could not find remote to push back to. please push with tags back to remote');
                }
            })
                .then(function () { return grunt.log.subhead('release completed. please push with tags back to remote'); })
                .then(done);
        });
        grunt.registerTask('release-publish-flat', 'publish the flat package', function () {
            grunt.log.subhead('making flat package...');
            var pkg = grunt.file.readJSON(path.join(packagePath, 'package.json'));
            var dist = grunt.config('copy.staticDefinitionFiles-dist.dest');
            var tasks = ['copy:temp', 'release-publish', 'clean:temp'];
            grunt.config.merge({
                copy: { temp: { expand: true, cwd: dist, src: '**', dest: temp } },
                clean: { temp: [temp] }
            });
            grunt.file.write(path.join(temp, 'package.json'), JSON.stringify(preparePackageJson(pkg), null, '  ') + '\n');
            extraToCopy.forEach(function (fileName) {
                if (grunt.file.exists(fileName)) {
                    grunt.file.copy(fileName, temp + '/' + fileName);
                }
            });
            grunt.task.run(tasks);
        });
        grunt.registerTask('release', 'release', function () {
            grunt.option('remove-links', true);
            var tasks = ['dist'];
            if (skipChecks && !dryRun) {
                grunt.fail.fatal('you can only skip-checks on a dry-run!');
            }
            if (!skipChecks) {
                tasks.unshift('can-publish-check', 'repo-is-clean-check');
            }
            if (preReleaseTag && preReleaseTags.indexOf(preReleaseTag) > -1) {
                tasks.push('release-version-pre-release-tag');
            }
            else if (releaseVersion && nextVersion) {
                tasks.push('release-version-specific');
            }
            else {
                grunt.fail.fatal('please specify --pre-release-tag or --release-version and --next-version');
            }
            tasks.push('release-publish-flat');
            tasks.push('post-release-version');
            grunt.task.run(tasks);
        });
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVsZWFzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInJlbGVhc2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztJQUVBLE9BQVMsVUFBUyxLQUFhLEVBQUUsV0FBZ0I7UUFDaEQsSUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQy9CLElBQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUM3QixJQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDbEMsSUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDLGtCQUFrQixDQUFDLENBQUM7UUFFMUMsSUFBTSxXQUFXLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQztRQUMvQyxJQUFNLE1BQU0sR0FBRyxLQUFLLENBQUM7UUFDckIsSUFBTSxNQUFNLEdBQUcsS0FBSyxDQUFDO1FBQ3JCLElBQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQztRQUNyQixJQUFNLGFBQWEsR0FBRyxRQUFRLENBQUM7UUFDL0IsSUFBTSxjQUFjLEdBQUcsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQzFFLElBQU0sYUFBYSxHQUFHLHNCQUFzQixDQUFDO1FBQzdDLElBQU0sa0JBQWtCLEdBQUcsQ0FBQyxTQUFTLEVBQUUsYUFBYSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQzlELElBQU0sV0FBVyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUM7UUFFbEMsSUFBTSxjQUFjLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBUyxpQkFBaUIsQ0FBQyxDQUFDO1FBQy9ELElBQU0sV0FBVyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQVMsY0FBYyxDQUFDLENBQUM7UUFDekQsSUFBTSxhQUFhLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FB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LEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3ZCLENBQUMsQ0FBQyxDQUFDO0lBQ0osQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IElUYXNrID0gZ3J1bnQudGFzay5JVGFzaztcblxuZXhwb3J0ID0gZnVuY3Rpb24oZ3J1bnQ6IElHcnVudCwgcGFja2FnZUpzb246IGFueSkge1xuXHRjb25zdCBleGVjYSA9IHJlcXVpcmUoJ2V4ZWNhJyk7XG5cdGNvbnN0IHBhdGggPSByZXF1aXJlKCdwYXRoJyk7XG5cdGNvbnN0IHBrZ0RpciA9IHJlcXVpcmUoJ3BrZy1kaXInKTtcblx0Y29uc3QgcGFyc2UgPSByZXF1aXJlKCdwYXJzZS1naXQtY29uZmlnJyk7XG5cblx0Y29uc3QgcGFja2FnZVBhdGggPSBwa2dEaXIuc3luYyhwcm9jZXNzLmN3ZCgpKTtcblx0Y29uc3QgbnBtQmluID0gJ25wbSc7XG5cdGNvbnN0IGdpdEJpbiA9ICdnaXQnO1xuXHRjb25zdCB0ZW1wID0gJ3RlbXAvJztcblx0Y29uc3QgZGVmYXVsdEJyYW5jaCA9ICdtYXN0ZXInO1xuXHRjb25zdCBwcmVSZWxlYXNlVGFncyA9IFsnYWxwaGEnLCAnYmV0YScsICdiZXRhMScsICdiZXRhMicsICdiZXRhMycsICdyYyddO1xuXHRjb25zdCBnaXRCYXNlUmVtb3RlID0gJ2dpdEBnaXRodWIuY29tOmRvam8vJztcblx0Y29uc3QgZGVmYXVsdE1haW50YWluZXJzID0gWydzaXRlcGVuJywgJ2Rvam90b29sa2l0JywgJ2Rvam8nXTtcblx0Y29uc3QgZXh0cmFUb0NvcHkgPSBbJ1JFQURNRS5tZCddO1xuXG5cdGNvbnN0IHJlbGVhc2VWZXJzaW9uID0gZ3J1bnQub3B0aW9uPHN0cmluZz4oJ3JlbGVhc2UtdmVyc2lvbicpO1xuXHRjb25zdCBuZXh0VmVyc2lvbiA9IGdydW50Lm9wdGlvbjxzdHJpbmc+KCduZXh0LXZlcnNpb24nKTtcblx0Y29uc3QgcHJlUmVsZWFzZVRhZyA9IGdydW50Lm9wdGlvbjxzdHJpbmc+KCdwcmUtcmVsZWFzZS10YWcnKTtcblx0Y29uc3QgZHJ5UnVuID0gZ3J1bnQub3B0aW9uPGJvb2xlYW4+KCdkcnktcnVuJyk7XG5cdGNvbnN0IHRhZyA9IGdydW50Lm9wdGlvbjxzdHJpbmc+KCd0YWcnKTtcblx0Y29uc3QgcHVzaEJhY2sgPSBncnVudC5vcHRpb248Ym9vbGVhbj4oJ3B1c2gtYmFjaycpO1xuXHRjb25zdCBpbml0aWFsID0gZ3J1bnQub3B0aW9uPGJvb2xlYW4+KCdpbml0aWFsJyk7XG5cdGNvbnN0IHNraXBDaGVja3MgPSBncnVudC5vcHRpb248Ym9vbGVhbj4oJ3NraXAtY2hlY2tzJyk7XG5cblx0Y29uc3QgaW5pdGlhbFBhY2thZ2VKc29uID0gZ3J1bnQuZmlsZS5yZWFkSlNPTihwYXRoLmpvaW4ocGFja2FnZVBhdGgsICdwYWNrYWdlLmpzb24nKSk7XG5cdGNvbnN0IGNvbW1pdE1zZyA9ICdcIlVwZGF0ZSBwYWNrYWdlIG1ldGFkYXRhXCInO1xuXG5cdGZ1bmN0aW9uIG1hdGNoZXNQcmVSZWxlYXNlVGFnKHByZVJlbGVhc2VUYWc6IHN0cmluZywgdmVyc2lvbjogc3RyaW5nKTogc3RyaW5nW10ge1xuXHRcdGNvbnN0IHJlZ2V4cCA9IG5ldyBSZWdFeHAoYCguKiktKCR7cHJlUmVsZWFzZVRhZ30pXFxcXC4oXFxcXGQrKWApO1xuXHRcdHJldHVybiByZWdleHAuZXhlYyh2ZXJzaW9uKSB8fCBbXTtcblx0fVxuXG5cdGZ1bmN0aW9uIG1hdGNoZXNWZXJzaW9uKHZlcnNpb24xOiBzdHJpbmcsIHZlcnNpb24yOiBzdHJpbmcpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gdmVyc2lvbjIuaW5kZXhPZih2ZXJzaW9uMSkgPT09IDA7XG5cdH1cblxuXHRmdW5jdGlvbiBnZXROZXh0UHJlUmVsZWFzZVRhZ1ZlcnNpb24odmVyc2lvbkluUGFja2FnZTogc3RyaW5nLCBleGlzdGluZ1ZlcnNpb25zOiBzdHJpbmdbXSk6IHN0cmluZyB7XG5cdFx0Y29uc3QgZmlsdGVyZWRWZXJzaW9ucyA9IGV4aXN0aW5nVmVyc2lvbnNcblx0XHRcdC5maWx0ZXIoKHYpID0+IG1hdGNoZXNWZXJzaW9uKHZlcnNpb25JblBhY2thZ2UsIHYpKVxuXHRcdFx0LmZpbHRlcigodikgPT4gbWF0Y2hlc1ByZVJlbGVhc2VUYWcocHJlUmVsZWFzZVRhZywgdikpXG5cdFx0XHQubWFwKCh2KSA9PiBwYXJzZUludChtYXRjaGVzUHJlUmVsZWFzZVRhZyhwcmVSZWxlYXNlVGFnLCB2KVszXSwgMTApIHx8IDApO1xuXG5cdFx0Y29uc3QgbmV4dFZlcnNpb24gPSBmaWx0ZXJlZFZlcnNpb25zLmxlbmd0aCA/IE1hdGgubWF4KC4uLmZpbHRlcmVkVmVyc2lvbnMpICsgMSA6IDE7XG5cdFx0cmV0dXJuIGAke3ZlcnNpb25JblBhY2thZ2V9LSR7cHJlUmVsZWFzZVRhZ30uJHtuZXh0VmVyc2lvbn1gO1xuXHR9XG5cblx0ZnVuY3Rpb24gcHJlcGFyZVBhY2thZ2VKc29uKHBhY2thZ2VKc29uOiBhbnkpOiBhbnkge1xuXHRcdHBhY2thZ2VKc29uLnByaXZhdGUgPSB1bmRlZmluZWQ7XG5cdFx0cGFja2FnZUpzb24uc2NyaXB0cyA9IHVuZGVmaW5lZDtcblx0XHRwYWNrYWdlSnNvbi5maWxlcyA9IHVuZGVmaW5lZDtcblx0XHRwYWNrYWdlSnNvbi50eXBpbmdzID0gdW5kZWZpbmVkO1xuXHRcdHBhY2thZ2VKc29uLm1haW4gPSAnbWFpbi5qcyc7XG5cdFx0cmV0dXJuIHBhY2thZ2VKc29uO1xuXHR9XG5cblx0ZnVuY3Rpb24gZ2V0R2l0UmVtb3RlKCk6IHN0cmluZ3xib29sZWFuIHtcblx0XHRjb25zdCBnaXRDb25maWcgPSBwYXJzZS5zeW5jKCk7XG5cdFx0Y29uc3QgcmVtb3RlcyA9IE9iamVjdC5rZXlzKGdpdENvbmZpZylcblx0XHRcdC5maWx0ZXIoKGtleSkgPT4ga2V5LmluZGV4T2YoJ3JlbW90ZScpID09PSAwKVxuXHRcdFx0LmZpbHRlcigoa2V5KSA9PiBnaXRDb25maWdba2V5XS51cmwuaW5kZXhPZihnaXRCYXNlUmVtb3RlKSA9PT0gMClcblx0XHRcdC5tYXAoKGtleSkgPT4gZ2l0Q29uZmlnW2tleV0udXJsKTtcblxuXHRcdHJldHVybiByZW1vdGVzLmxlbmd0aCA/IHJlbW90ZXNbMF0gOiBmYWxzZTtcblx0fVxuXG5cdGZ1bmN0aW9uIG5wbVByZVJlbGVhc2VWZXJzaW9uKHZlcnNpb25JblBhY2thZ2U6IHN0cmluZywgdmVyc2lvbnM6IHN0cmluZ1tdKTogUHJvbWlzZTxhbnk+IHtcblx0XHRjb25zdCB2ZXJzaW9uVG9SZWxlYXNlID0gZ2V0TmV4dFByZVJlbGVhc2VUYWdWZXJzaW9uKHZlcnNpb25JblBhY2thZ2UsIHZlcnNpb25zKTtcblx0XHRjb25zdCBhcmdzID0gWyd2ZXJzaW9uJywgdmVyc2lvblRvUmVsZWFzZV07XG5cblx0XHRpZiAoZHJ5UnVuKSB7XG5cdFx0XHRhcmdzLnVuc2hpZnQoJy0tbm8tZ2l0LXRhZy12ZXJzaW9uJyk7XG5cdFx0fVxuXG5cdFx0Z3J1bnQubG9nLnN1YmhlYWQoYHZlcnNpb24gdG8gcmVsZWFzZTogJHt2ZXJzaW9uVG9SZWxlYXNlfWApO1xuXHRcdHJldHVybiBjb21tYW5kKG5wbUJpbiwgYXJncywge30sIHRydWUpO1xuXHR9XG5cblx0ZnVuY3Rpb24gY29tbWFuZChiaW46IHN0cmluZywgYXJnczogc3RyaW5nW10sIG9wdGlvbnM6IGFueSwgZXhlY3V0ZU9uRHJ5UnVuPzogYm9vbGVhbik6IFByb21pc2U8YW55PiB7XG5cdFx0aWYgKGRyeVJ1biAmJiAhZXhlY3V0ZU9uRHJ5UnVuKSB7XG5cdFx0XHRncnVudC5sb2cuc3ViaGVhZCgnZHJ5LXJ1biAobm90IHJ1bm5pbmcpJyk7XG5cdFx0fVxuXG5cdFx0YmluID0gYCR7YmlufSAke2FyZ3Muam9pbignICcpfWA7XG5cdFx0Z3J1bnQubG9nLm9rKGAke2Jpbn0gLSAke0pTT04uc3RyaW5naWZ5KG9wdGlvbnMpfWApO1xuXG5cdFx0aWYgKCFkcnlSdW4gfHwgZXhlY3V0ZU9uRHJ5UnVuKSB7XG5cdFx0XHRyZXR1cm4gZXhlY2Euc2hlbGwoYmluLCBvcHRpb25zKTtcblx0XHR9XG5cdFx0cmV0dXJuIFByb21pc2UucmVzb2x2ZSh7fSk7XG5cdH1cblxuXHRncnVudC5yZWdpc3RlclRhc2soJ2Nhbi1wdWJsaXNoLWNoZWNrJywgJ2NoZWNrIHdoZXRoZXIgYXV0aG9yIGNhbiBwdWJsaXNoJywgZnVuY3Rpb24gKHRoaXM6IElUYXNrKSB7XG5cdFx0Y29uc3QgZG9uZSA9IHRoaXMuYXN5bmMoKTtcblx0XHRjb25zdCB3aG9hbWlQcm9taXNlID0gY29tbWFuZChucG1CaW4sIFsnd2hvYW1pJ10sIHt9LCB0cnVlKS50aGVuKFxuXHRcdFx0KHJlc3VsdDogYW55KSA9PiByZXN1bHQuc3Rkb3V0LFxuXHRcdFx0KGVycjogYW55KSA9PiBncnVudC5mYWlsLmZhdGFsKCdub3QgbG9nZ2VkIGludG8gbnBtJylcblx0XHQpO1xuXHRcdGxldCBtYWludGFpbmVyc1Byb21pc2U6IFByb21pc2U8c3RyaW5nW10+O1xuXHRcdGlmIChpbml0aWFsKSB7XG5cdFx0XHRtYWludGFpbmVyc1Byb21pc2UgPSBQcm9taXNlLnJlc29sdmUoZGVmYXVsdE1haW50YWluZXJzKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0bWFpbnRhaW5lcnNQcm9taXNlID0gY29tbWFuZChucG1CaW4sIFsndmlldycsICcuJywgJy0tanNvbiddLCB7fSwgdHJ1ZSlcblx0XHRcdFx0LnRoZW4oKHJlc3VsdDogYW55KSA9PiA8c3RyaW5nW10+IEpTT04ucGFyc2UocmVzdWx0LnN0ZG91dCkubWFpbnRhaW5lcnMpXG5cdFx0XHRcdC50aGVuKChtYWludGFpbmVyczogc3RyaW5nW10pID0+IG1haW50YWluZXJzLm1hcCgobWFpbnRhaW5lcikgPT4gbWFpbnRhaW5lci5yZXBsYWNlKC9cXHM8LiovLCAnJykpKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gUHJvbWlzZS5hbGwoW3dob2FtaVByb21pc2UsIG1haW50YWluZXJzUHJvbWlzZV0pLnRoZW4oKHJlc3VsdHMpID0+IHtcblx0XHRcdGNvbnN0IHVzZXIgPSByZXN1bHRzWzBdO1xuXHRcdFx0Y29uc3QgbWFpbnRhaW5lcnMgPSByZXN1bHRzWzFdO1xuXHRcdFx0Y29uc3QgaXNNYWludGFpbmVyID0gbWFpbnRhaW5lcnMuaW5kZXhPZih1c2VyKSA+IC0xO1xuXHRcdFx0aWYgKCFpc01haW50YWluZXIpIHtcblx0XHRcdFx0Z3J1bnQuZmFpbC5mYXRhbChgY2Fubm90IHB1Ymxpc2ggdGhpcyBwYWNrYWdlIHdpdGggdXNlciAke3VzZXJ9YCk7XG5cdFx0XHR9XG5cdFx0fSkudGhlbihkb25lKTtcblx0fSk7XG5cblx0Z3J1bnQucmVnaXN0ZXJUYXNrKCdyZXBvLWlzLWNsZWFuLWNoZWNrJywgJ2NoZWNrIHdoZXRoZXIgdGhlIHJlcG8gaXMgY2xlYW4nLCBmdW5jdGlvbiAodGhpczogSVRhc2spIHtcblx0XHRjb25zdCBkb25lID0gdGhpcy5hc3luYygpO1xuXHRcdHJldHVybiBjb21tYW5kKGdpdEJpbiwgWydzdGF0dXMnLCAnLS1wb3JjZWxhaW4nXSwge30sIHRydWUpXG5cdFx0XHQudGhlbigocmVzdWx0OiBhbnkpID0+IHtcblx0XHRcdFx0aWYgKHJlc3VsdC5zdGRvdXQpIHtcblx0XHRcdFx0XHRncnVudC5mYWlsLmZhdGFsKCd0aGVyZSBhcmUgY2hhbmdlcyBpbiB0aGUgd29ya2luZyB0cmVlJyk7XG5cdFx0XHRcdH1cblx0XHRcdH0pXG5cdFx0XHQudGhlbigoKSA9PiBjb21tYW5kKGdpdEJpbiwgWydyZXYtcGFyc2UnLCAnLS1hYmJyZXYtcmVmJywgJ0hFQUQnXSwge30sIHRydWUpKVxuXHRcdFx0LnRoZW4oKHJlc3VsdDogYW55KSA9PiB7XG5cdFx0XHRcdGlmIChyZXN1bHQuc3Rkb3V0ICE9PSBkZWZhdWx0QnJhbmNoKSB7XG5cdFx0XHRcdFx0Z3J1bnQuZmFpbC5mYXRhbChgbm90IG9uICR7ZGVmYXVsdEJyYW5jaH0gYnJhbmNoYCk7XG5cdFx0XHRcdH1cblx0XHRcdH0pXG5cdFx0XHQudGhlbihkb25lKTtcblx0fSk7XG5cblx0Z3J1bnQucmVnaXN0ZXJUYXNrKCdyZWxlYXNlLXB1Ymxpc2gnLCAncHVibGlzaCB0aGUgcGFja2FnZSB0byBucG0nLCBmdW5jdGlvbiAodGhpczogSVRhc2spIHtcblx0XHRjb25zdCBkb25lID0gdGhpcy5hc3luYygpO1xuXHRcdGNvbnN0IGFyZ3MgPSBbJ3B1Ymxpc2gnLCAnLiddO1xuXHRcdGNvbnN0IHByb21pc2VzID0gW2NvbW1hbmQobnBtQmluLCBhcmdzLCB7IGN3ZDogdGVtcCB9LCBmYWxzZSldO1xuXHRcdGlmICh0YWcpIHtcblx0XHRcdGFyZ3MucHVzaCgnLS10YWcnLCB0YWcpO1xuXHRcdH1cblx0XHRncnVudC5sb2cuc3ViaGVhZCgncHVibGlzaGluZyB0byBucG0uLi4nKTtcblx0XHRpZiAoZHJ5UnVuKSB7XG5cdFx0XHRwcm9taXNlcy5wdXNoKGNvbW1hbmQobnBtQmluLCBbJ3BhY2snLCAnLi4vJyArIHRlbXBdLCB7IGN3ZDogJ2Rpc3QnIH0sIHRydWUpKTtcblx0XHR9XG5cdFx0cmV0dXJuIFByb21pc2UuYWxsKHByb21pc2VzKS50aGVuKGRvbmUpO1xuXHR9KTtcblxuXHRncnVudC5yZWdpc3RlclRhc2soJ3JlbGVhc2UtdmVyc2lvbi1wcmUtcmVsZWFzZS10YWcnLCAnYXV0byB2ZXJzaW9uIGJhc2VkIG9uIHByZSByZWxlYXNlIHRhZycsIGZ1bmN0aW9uICh0aGlzOiBJVGFzaykge1xuXHRcdGNvbnN0IGRvbmUgPSB0aGlzLmFzeW5jKCk7XG5cdFx0Y29uc3QgdmVyc2lvbkluUGFja2FnZSA9IGluaXRpYWxQYWNrYWdlSnNvbi52ZXJzaW9uLnJlcGxhY2UoLy0uKi9nLCAnJyk7XG5cdFx0aWYgKGluaXRpYWwpIHtcblx0XHRcdHJldHVybiBucG1QcmVSZWxlYXNlVmVyc2lvbih2ZXJzaW9uSW5QYWNrYWdlLCBbXSkudGhlbihkb25lKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmV0dXJuIGNvbW1hbmQobnBtQmluLCBbJ3ZpZXcnLCAnLicsICctLWpzb24nXSwge30sIHRydWUpLnRoZW4oKHJlc3VsdDogYW55KSA9PiB7XG5cdFx0XHRcdGlmIChyZXN1bHQuc3Rkb3V0KSB7XG5cdFx0XHRcdFx0Y29uc3QgdGltZSA9IEpTT04ucGFyc2UocmVzdWx0LnN0ZG91dCkudGltZTtcblx0XHRcdFx0XHRjb25zdCB2ZXJzaW9ucyA9IE9iamVjdC5rZXlzKHRpbWUpLmZpbHRlcigoa2V5KSA9PiB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gWydjcmVhdGVkJywgJ21vZGlmaWVkJ10uaW5kZXhPZihrZXkpIDwgMDtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRucG1QcmVSZWxlYXNlVmVyc2lvbih2ZXJzaW9uSW5QYWNrYWdlLCB2ZXJzaW9ucykudGhlbihkb25lKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRncnVudC5mYWlsLmZhdGFsKCdmYWlsZWQgdG8gZmV0Y2ggdmVyc2lvbnMgZnJvbSBucG0nKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fVxuXHR9KTtcblxuXHRncnVudC5yZWdpc3RlclRhc2soJ3JlbGVhc2UtdmVyc2lvbi1zcGVjaWZpYycsICdzZXQgdGhlIHZlcnNpb24gbWFudWFsbHknLCBmdW5jdGlvbiAodGhpczogSVRhc2spIHtcblx0XHRjb25zdCBkb25lID0gdGhpcy5hc3luYygpO1xuXHRcdGNvbnN0IGFyZ3MgPSBbJ3ZlcnNpb24nLCByZWxlYXNlVmVyc2lvbl07XG5cdFx0aWYgKGRyeVJ1bikge1xuXHRcdFx0YXJncy51bnNoaWZ0KCctLW5vLWdpdC10YWctdmVyc2lvbicpO1xuXHRcdH1cblx0XHRncnVudC5sb2cuc3ViaGVhZChgdmVyc2lvbiB0byByZWxlYXNlOiAke3JlbGVhc2VWZXJzaW9ufWApO1xuXHRcdHJldHVybiBjb21tYW5kKG5wbUJpbiwgYXJncywge30sIHRydWUpLnRoZW4oZG9uZSk7XG5cdH0pO1xuXG5cdGdydW50LnJlZ2lzdGVyVGFzaygncG9zdC1yZWxlYXNlLXZlcnNpb24nLCAndXBkYXRlIHRoZSB2ZXJzaW9uIHBvc3QgcmVsZWFzZScsIGZ1bmN0aW9uICh0aGlzOiBJVGFzaykge1xuXHRcdGNvbnN0IGRvbmUgPSB0aGlzLmFzeW5jKCk7XG5cdFx0Y29uc3QgcGFja2FnZUpzb24gPSBPYmplY3QuYXNzaWduKHt9LCBpbml0aWFsUGFja2FnZUpzb24pO1xuXHRcdGlmIChuZXh0VmVyc2lvbikge1xuXHRcdFx0cGFja2FnZUpzb24udmVyc2lvbiA9IG5leHRWZXJzaW9uO1xuXHRcdH1cblx0XHRncnVudC5maWxlLndyaXRlKCdwYWNrYWdlLmpzb24nLCBKU09OLnN0cmluZ2lmeShwYWNrYWdlSnNvbiwgbnVsbCwgJyAgJykgKyAnXFxuJyk7XG5cdFx0Z3J1bnQubG9nLnN1YmhlYWQoYHZlcnNpb24gb2YgcGFja2FnZS5qc29uIHRvIGNvbW1pdDogJHtwYWNrYWdlSnNvbi52ZXJzaW9ufWApO1xuXHRcdHJldHVybiBjb21tYW5kKGdpdEJpbiwgWydjb21taXQnLCAnLWFtJywgY29tbWl0TXNnXSwge30sIGZhbHNlKVxuXHRcdFx0LnRoZW4oKCkgPT4ge1xuXHRcdFx0XHRpZiAoIXB1c2hCYWNrKSB7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGNvbnN0IHJlbW90ZSA9IGdldEdpdFJlbW90ZSgpO1xuXHRcdFx0XHRpZiAocmVtb3RlKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGNvbW1hbmQoZ2l0QmluLCBbJ3B1c2gnLCA8c3RyaW5nPiByZW1vdGUsIGRlZmF1bHRCcmFuY2hdLCB7fSwgZmFsc2UpXG5cdFx0XHRcdFx0XHQudGhlbigoKSA9PiBjb21tYW5kKGdpdEJpbiwgWydwdXNoJywgPHN0cmluZz4gcmVtb3RlLCAnLS10YWdzJ10sIHt9LCBmYWxzZSkpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGdydW50LmxvZy5zdWJoZWFkKCdjb3VsZCBub3QgZmluZCByZW1vdGUgdG8gcHVzaCBiYWNrIHRvLiBwbGVhc2UgcHVzaCB3aXRoIHRhZ3MgYmFjayB0byByZW1vdGUnKTtcblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHRcdC50aGVuKCgpID0+IGdydW50LmxvZy5zdWJoZWFkKCdyZWxlYXNlIGNvbXBsZXRlZC4gcGxlYXNlIHB1c2ggd2l0aCB0YWdzIGJhY2sgdG8gcmVtb3RlJykpXG5cdFx0XHQudGhlbihkb25lKTtcblx0fSk7XG5cblx0Z3J1bnQucmVnaXN0ZXJUYXNrKCdyZWxlYXNlLXB1Ymxpc2gtZmxhdCcsICdwdWJsaXNoIHRoZSBmbGF0IHBhY2thZ2UnLCBmdW5jdGlvbiAoKSB7XG5cdFx0Z3J1bnQubG9nLnN1YmhlYWQoJ21ha2luZyBmbGF0IHBhY2thZ2UuLi4nKTtcblx0XHRjb25zdCBwa2cgPSBncnVudC5maWxlLnJlYWRKU09OKHBhdGguam9pbihwYWNrYWdlUGF0aCwgJ3BhY2thZ2UuanNvbicpKTtcblx0XHRjb25zdCBkaXN0ID0gZ3J1bnQuY29uZmlnKCdjb3B5LnN0YXRpY0RlZmluaXRpb25GaWxlcy1kaXN0LmRlc3QnKTtcblx0XHRjb25zdCB0YXNrcyA9IFsnY29weTp0ZW1wJywgJ3JlbGVhc2UtcHVibGlzaCcsICdjbGVhbjp0ZW1wJ107XG5cblx0XHRncnVudC5jb25maWcubWVyZ2Uoe1xuXHRcdFx0Y29weTogeyB0ZW1wOiB7IGV4cGFuZDogdHJ1ZSwgY3dkOiBkaXN0LCBzcmM6ICcqKicsIGRlc3Q6IHRlbXAgfSB9LFxuXHRcdFx0Y2xlYW46IHsgdGVtcDogWyB0ZW1wIF0gfVxuXHRcdH0pO1xuXG5cdFx0Z3J1bnQuZmlsZS53cml0ZShwYXRoLmpvaW4odGVtcCwgJ3BhY2thZ2UuanNvbicpLCBKU09OLnN0cmluZ2lmeShwcmVwYXJlUGFja2FnZUpzb24ocGtnKSwgbnVsbCwgJyAgJykgKyAnXFxuJyk7XG5cblx0XHRleHRyYVRvQ29weS5mb3JFYWNoKChmaWxlTmFtZSkgPT4ge1xuXHRcdFx0aWYgKGdydW50LmZpbGUuZXhpc3RzKGZpbGVOYW1lKSkge1xuXHRcdFx0XHRncnVudC5maWxlLmNvcHkoZmlsZU5hbWUsIHRlbXAgKyAnLycgKyBmaWxlTmFtZSk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0Z3J1bnQudGFzay5ydW4odGFza3MpO1xuXHR9KTtcblxuXHRncnVudC5yZWdpc3RlclRhc2soJ3JlbGVhc2UnLCAncmVsZWFzZScsIGZ1bmN0aW9uICgpIHtcblx0XHRncnVudC5vcHRpb24oJ3JlbW92ZS1saW5rcycsIHRydWUpO1xuXHRcdGNvbnN0IHRhc2tzID0gWydkaXN0J107XG5cblx0XHRpZiAoc2tpcENoZWNrcyAmJiAhZHJ5UnVuKSB7XG5cdFx0XHRncnVudC5mYWlsLmZhdGFsKCd5b3UgY2FuIG9ubHkgc2tpcC1jaGVja3Mgb24gYSBkcnktcnVuIScpO1xuXHRcdH1cblxuXHRcdGlmICghc2tpcENoZWNrcykge1xuXHRcdFx0dGFza3MudW5zaGlmdCgnY2FuLXB1Ymxpc2gtY2hlY2snLCAncmVwby1pcy1jbGVhbi1jaGVjaycpO1xuXHRcdH1cblxuXHRcdGlmIChwcmVSZWxlYXNlVGFnICYmIHByZVJlbGVhc2VUYWdzLmluZGV4T2YocHJlUmVsZWFzZVRhZykgPiAtMSkge1xuXHRcdFx0dGFza3MucHVzaCgncmVsZWFzZS12ZXJzaW9uLXByZS1yZWxlYXNlLXRhZycpO1xuXHRcdH0gZWxzZSBpZiAocmVsZWFzZVZlcnNpb24gJiYgbmV4dFZlcnNpb24pIHtcblx0XHRcdHRhc2tzLnB1c2goJ3JlbGVhc2UtdmVyc2lvbi1zcGVjaWZpYycpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRncnVudC5mYWlsLmZhdGFsKCdwbGVhc2Ugc3BlY2lmeSAtLXByZS1yZWxlYXNlLXRhZyBvciAtLXJlbGVhc2UtdmVyc2lvbiBhbmQgLS1uZXh0LXZlcnNpb24nKTtcblx0XHR9XG5cdFx0dGFza3MucHVzaCgncmVsZWFzZS1wdWJsaXNoLWZsYXQnKTtcblx0XHR0YXNrcy5wdXNoKCdwb3N0LXJlbGVhc2UtdmVyc2lvbicpO1xuXHRcdGdydW50LnRhc2sucnVuKHRhc2tzKTtcblx0fSk7XG59O1xuIl19