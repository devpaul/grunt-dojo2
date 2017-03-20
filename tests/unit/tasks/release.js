(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "intern!object", "intern/chai!assert", "grunt", "sinon", "path", "../util"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var registerSuite = require("intern!object");
    var assert = require("intern/chai!assert");
    var grunt = require("grunt");
    var sinon_1 = require("sinon");
    var path = require("path");
    var util_1 = require("../util");
    var shell = sinon_1.stub();
    var originalOptions = {};
    var gitUrl = 'git@github.com:dojo/test';
    function taskLoader(config, options, mocks) {
        if (mocks === void 0) { mocks = {}; }
        originalOptions = {};
        if (options) {
            Object.keys(options).forEach(function (option) {
                originalOptions[option] = grunt.option(option);
                grunt.option(option, options[option]);
            });
        }
        mocks['execa'] = {
            shell: shell
        };
        grunt.initConfig(config || {});
        util_1.loadTasks(mocks);
    }
    function taskUnloader() {
        Object.keys(originalOptions).forEach(function (option) {
            grunt.option(option, originalOptions[option]);
        });
        util_1.unloadTasks();
    }
    registerSuite({
        name: 'tasks/release',
        'can-publish-check': (function () {
            var fail;
            return {
                beforeEach: function () {
                    fail = sinon_1.stub(grunt.fail, 'fatal').throws();
                    shell = sinon_1.stub();
                },
                afterEach: function () {
                    fail.restore();
                    taskUnloader();
                },
                'logged out of npm': function () {
                    var dfd = this.async();
                    taskLoader();
                    shell.withArgs('npm whoami')
                        .returns(Promise.reject(new Error()))
                        .withArgs('npm view . --json')
                        .returns(Promise.resolve(JSON.stringify({
                        maintainers: [
                            'dojotoolkit <kitsonk@dojotoolkit.org>',
                            'sitepen <labs@sitepen.com>'
                        ]
                    })));
                    util_1.runGruntTask('can-publish-check', dfd.rejectOnError(function () {
                        assert(false, 'Should have failed');
                    })).catch(dfd.callback(function () {
                        assert.isTrue(fail.calledOnce, 'grunt.fail.fatal should have been called once');
                        assert.isTrue(fail.calledWith('not logged into npm'), 'grunt.fail.fatal should have been called with the error message');
                    }));
                },
                'not a maintainer': function () {
                    var dfd = this.async();
                    taskLoader();
                    shell.withArgs('npm whoami').returns(Promise.resolve({ stdout: 'test' })).withArgs('npm view . --json').returns(Promise.resolve({
                        stdout: JSON.stringify({
                            maintainers: [
                                "sitepen <labs@sitepen.com>"
                            ]
                        })
                    }));
                    util_1.runGruntTask('can-publish-check', dfd.rejectOnError(function () {
                        assert(false, 'Should have failed');
                    })).catch(dfd.callback(function (error) {
                        assert.isTrue(fail.calledOnce, 'grunt.fail.fatal should have been called once');
                        assert.isTrue(fail.calledWith('cannot publish this package with user test'), 'grunt.fail.fatal should have been called with the error message');
                    }));
                },
                'dry run run commands anyways': function () {
                    var dfd = this.async();
                    taskLoader(undefined, {
                        'dry-run': true
                    });
                    shell.withArgs('npm whoami')
                        .returns(Promise.reject(new Error()))
                        .withArgs('npm view . --json')
                        .returns(Promise.resolve(JSON.stringify({
                        maintainers: [
                            "dojotoolkit <kitsonk@dojotoolkit.org>",
                            "sitepen <labs@sitepen.com>"
                        ]
                    })));
                    util_1.runGruntTask('can-publish-check', dfd.rejectOnError(function () {
                        assert(false, 'Should have failed');
                    })).catch(dfd.callback(function () {
                        assert.isTrue(fail.calledOnce, 'grunt.fail.fatal should have been called once');
                        assert.isTrue(fail.calledWith('not logged into npm'), 'grunt.fail.fatal should have been called with the error message');
                    }));
                },
                'initial run uses default maintainers': function () {
                    var dfd = this.async();
                    taskLoader(undefined, {
                        'initial': true
                    });
                    shell.withArgs('npm whoami')
                        .returns(Promise.resolve({ stdout: 'dojo' }))
                        .withArgs('npm view . --json')
                        .throws();
                    util_1.runGruntTask('can-publish-check', dfd.callback(function () {
                        assert.isTrue(shell.calledOnce);
                    })).catch(dfd.rejectOnError(function () {
                        assert(false, 'Should have succeeded');
                    }));
                }
            };
        })(),
        'repo-is-clean-check': (function () {
            var failStub;
            return {
                beforeEach: function () {
                    failStub = sinon_1.stub(grunt.fail, 'fatal').throws();
                    shell = sinon_1.stub();
                },
                afterEach: function () {
                    failStub.restore();
                },
                'changes on working tree': function () {
                    var dfd = this.async();
                    taskLoader();
                    // we need to mock the whole thing because
                    shell.withArgs('git status --porcelain')
                        .returns(Promise.resolve({ stdout: 'change' }));
                    util_1.runGruntTask('repo-is-clean-check', dfd.rejectOnError(function () {
                        assert(false, 'should have failed');
                    })).catch(dfd.callback(function () {
                        assert.isTrue(failStub.calledWith('there are changes in the working tree'));
                    }));
                },
                'not on default branch': function () {
                    var dfd = this.async();
                    taskLoader();
                    // we need to mock the whole thing because
                    shell.withArgs('git status --porcelain')
                        .returns(Promise.resolve({ stdout: '' }))
                        .withArgs('git rev-parse --abbrev-ref HEAD')
                        .returns(Promise.resolve({ stdout: 'test' }));
                    util_1.runGruntTask('repo-is-clean-check', dfd.rejectOnError(function () {
                        assert(false, 'should have failed');
                    })).catch(dfd.callback(function () {
                        assert.isTrue(failStub.calledWith('not on master branch'));
                    }));
                },
                'success': function () {
                    var dfd = this.async();
                    taskLoader();
                    // we need to mock the whole thing because
                    shell.withArgs('git status --porcelain')
                        .returns(Promise.resolve({ stdout: '' }))
                        .withArgs('git rev-parse --abbrev-ref HEAD')
                        .returns(Promise.resolve({ stdout: 'master' }));
                    util_1.runGruntTask('repo-is-clean-check', dfd.callback(function () {
                    })).catch(dfd.rejectOnError(function () {
                        assert(false, 'should have succeeded');
                    }));
                }
            };
        })(),
        'release-publish': {
            beforeEach: function () {
                shell = sinon_1.stub();
            },
            afterEach: function () {
                taskUnloader();
            },
            'without a tag': function () {
                var dfd = this.async();
                taskLoader();
                shell.withArgs('npm publish .')
                    .returns(Promise.resolve({ stdout: '' }));
                util_1.runGruntTask('release-publish', dfd.callback(function () {
                    assert.isTrue(shell.calledOnce);
                })).catch(dfd.rejectOnError(function () {
                    assert(false, 'should have succeeded');
                }));
            },
            'with a tag': function () {
                var dfd = this.async();
                taskLoader(undefined, {
                    tag: 'test'
                });
                shell.withArgs('npm publish . --tag test')
                    .returns(Promise.resolve({ stdout: '' }));
                util_1.runGruntTask('release-publish', dfd.callback(function () {
                    assert.isTrue(shell.calledOnce);
                })).catch(dfd.rejectOnError(function () {
                    assert(false, 'should have succeeded');
                }));
            },
            'dry run': function () {
                var dfd = this.async();
                taskLoader(undefined, {
                    'dry-run': true
                });
                shell.withArgs('npm publish .')
                    .returns(Promise.resolve({ stdout: '' }))
                    .withArgs('npm pack ../temp/')
                    .returns(Promise.resolve());
                util_1.runGruntTask('release-publish', dfd.callback(function () {
                    assert.isTrue(shell.calledOnce);
                    assert.isTrue(shell.calledWith('npm pack ../temp/'));
                })).catch(dfd.rejectOnError(function () {
                    assert(false, 'should have succeeded');
                }));
            }
        },
        'release-version-pre-release-tag': (function () {
            var failStub;
            return {
                beforeEach: function () {
                    failStub = sinon_1.stub(grunt.fail, 'fatal').throws();
                    shell = sinon_1.stub();
                },
                afterEach: function () {
                    failStub.restore();
                    taskUnloader();
                },
                'initial, no dry run': function () {
                    var dfd = this.async();
                    taskLoader(undefined, {
                        initial: true,
                        'pre-release-tag': 'test'
                    });
                    shell.onFirstCall()
                        .returns(Promise.resolve({}));
                    util_1.runGruntTask('release-version-pre-release-tag', dfd.callback(function () {
                        assert.isTrue(shell.calledOnce);
                        var command = shell.getCalls()[0].args[0];
                        assert.isTrue(/npm version [\d.]+-test\.1/.test(command));
                    })).catch(dfd.rejectOnError(function () {
                        assert(false, 'should have succeeded');
                    }));
                },
                'initial, dry run': function () {
                    var dfd = this.async();
                    taskLoader(undefined, {
                        initial: true,
                        'dry-run': true,
                        'pre-release-tag': 'test'
                    });
                    shell.onFirstCall()
                        .returns(Promise.resolve({}));
                    util_1.runGruntTask('release-version-pre-release-tag', dfd.callback(function () {
                        assert.isTrue(shell.calledOnce);
                        var command = shell.getCalls()[0].args[0];
                        assert.isTrue(/npm --no-git-tag-version version [\d.]+-test\.1/.test(command));
                    })).catch(dfd.rejectOnError(function () {
                        assert(false, 'should have succeeded');
                    }));
                },
                'regular w/ bad output': function () {
                    var dfd = this.async();
                    taskLoader(undefined, {
                        'pre-release-tag': 'test'
                    });
                    shell.withArgs('npm view . --json')
                        .returns(Promise.resolve({ stdout: '' }));
                    util_1.runGruntTask('release-version-pre-release-tag', dfd.rejectOnError(function () {
                        assert(false, 'should have failed');
                    })).catch(dfd.callback(function () {
                        assert.isTrue(shell.calledOnce);
                    }));
                },
                'regular': function () {
                    var dfd = this.async();
                    taskLoader(undefined, {
                        'pre-release-tag': 'test'
                    });
                    var packageJson = grunt.file.readJSON(path.join(process.cwd(), 'package.json'));
                    var fullVersion = packageJson.version;
                    var justTheVersion = fullVersion.replace(/^([^\-]+).*$/g, '$1');
                    shell.onCall(0)
                        .returns(Promise.resolve({
                        stdout: JSON.stringify({
                            time: (_a = {
                                    created: '1/1/2016',
                                    modified: '1/2/2016'
                                },
                                _a[justTheVersion + "-alpha.6"] = "2016-05-13T16:24:33.949Z",
                                _a[justTheVersion + "-test.7"] = "2016-05-16T13:44:12.669Z",
                                _a)
                        })
                    }))
                        .onCall(1)
                        .returns(Promise.resolve({}));
                    util_1.runGruntTask('release-version-pre-release-tag', dfd.callback(function () {
                        assert.isTrue(shell.calledTwice);
                        assert.equal(shell.firstCall.args[0], 'npm view . --json');
                        assert.equal(shell.secondCall.args[0], "npm version " + justTheVersion + "-test.8");
                    })).catch(dfd.rejectOnError(function (error) {
                        console.log('*** ERRROR *', error);
                        assert(false, 'should have succeeded');
                    }));
                    var _a;
                }
            };
        })(),
        'release-version-specific': {
            beforeEach: function () {
                shell = sinon_1.stub();
            },
            afterEach: function () {
                taskUnloader();
            },
            'dry run': function () {
                var dfd = this.async();
                taskLoader(undefined, {
                    'dry-run': true,
                    'release-version': '2.0.0-test.1'
                });
                shell.withArgs('npm --no-git-tag-version version 2.0.0-test.1')
                    .returns(Promise.resolve());
                util_1.runGruntTask('release-version-specific', dfd.callback(function () {
                    assert.isTrue(shell.calledOnce);
                }));
            },
            'regular': function () {
                var dfd = this.async();
                taskLoader(undefined, {
                    'release-version': '2.0.0-test.1'
                });
                shell.withArgs('npm version 2.0.0-test.1')
                    .returns(Promise.resolve());
                util_1.runGruntTask('release-version-specific', dfd.callback(function () {
                    assert.isTrue(shell.calledOnce);
                }));
            }
        },
        'post-release-version': {
            beforeEach: function () {
                shell = sinon_1.stub();
                // save our actual package.json
                grunt.file.copy('package.json', 'package.json.bak');
            },
            afterEach: function () {
                taskUnloader();
                // restore our package.json
                grunt.file.copy('package.json.bak', 'package.json');
                grunt.file.delete('package.json.bak');
            },
            'without next version, without push back': function () {
                var dfd = this.async();
                var originalPackageJson = grunt.file.readJSON(path.join(process.cwd(), 'package.json'));
                taskLoader();
                shell.withArgs('git commit -am "Update package metadata"')
                    .returns(Promise.resolve({}));
                util_1.runGruntTask('post-release-version', dfd.callback(function () {
                    assert.isTrue(shell.calledOnce);
                    var newPackageJson = grunt.file.readJSON(path.join(process.cwd(), 'package.json'));
                    assert.equal(newPackageJson.version, originalPackageJson.version);
                }));
            },
            'without next version': function () {
                var dfd = this.async();
                taskLoader(undefined, {
                    'push-back': true
                }, {
                    'parse-git-config': {
                        sync: function () {
                            return {
                                'remote "origin"': {
                                    url: gitUrl
                                }
                            };
                        }
                    }
                });
                shell.withArgs('git commit -am "Update package metadata"').returns(Promise.resolve({})).withArgs("git push " + gitUrl + " master").returns(Promise.resolve()).withArgs("git push " + gitUrl + " --tags").returns(Promise.resolve());
                util_1.runGruntTask('post-release-version', dfd.callback(function () {
                    assert.isTrue(shell.calledThrice);
                }));
            },
            'no remotes': function () {
                var dfd = this.async();
                taskLoader(undefined, {
                    'push-back': true
                }, {
                    'parse-git-config': {
                        sync: function () {
                            return {
                                'remote "origin"': {
                                    url: 'test'
                                }
                            };
                        }
                    }
                });
                shell.withArgs('git commit -am "Update package metadata"').returns(Promise.resolve({}));
                util_1.runGruntTask('post-release-version', dfd.callback(function () {
                    assert.isTrue(shell.calledOnce);
                }));
            },
            'next version': function () {
                var dfd = this.async();
                var originalPackageJson = grunt.file.readJSON(path.join(process.cwd(), 'package.json'));
                taskLoader(undefined, {
                    'next-version': 'test-version'
                });
                shell.withArgs('git commit -am "Update package metadata"')
                    .returns(Promise.resolve({}));
                util_1.runGruntTask('post-release-version', dfd.callback(function () {
                    assert.isTrue(shell.calledOnce);
                    var newPackageJson = grunt.file.readJSON(path.join(process.cwd(), 'package.json'));
                    assert.equal(newPackageJson.version, 'test-version');
                }));
            }
        },
        'release-publish-flat': (function () {
            var runStub;
            return {
                beforeEach: function () {
                    runStub = sinon_1.stub(grunt.task, 'run');
                    // save our actual package.json
                    grunt.file.copy('package.json', 'package.json.bak');
                },
                afterEach: function () {
                    runStub.restore();
                    taskUnloader();
                    grunt.file.delete('temp');
                    // restore our package.json
                    grunt.file.copy('package.json.bak', 'package.json');
                    grunt.file.delete('package.json.bak');
                    if (grunt.file.exists('README.md.bak')) {
                        grunt.file.copy('README.md.bak', 'README.md');
                        grunt.file.delete('README.md.bak');
                    }
                },
                'run': function () {
                    util_1.runGruntTask('release-publish-flat');
                    assert.isTrue(runStub.calledOnce);
                    assert.deepEqual(runStub.getCalls()[0].args[0], ['copy:temp', 'release-publish', 'clean:temp']);
                    var newPackageJson = grunt.file.readJSON(path.join('temp', 'package.json'));
                    assert.isUndefined(newPackageJson.private);
                    assert.isUndefined(newPackageJson.scripts);
                    assert.isUndefined(newPackageJson.files);
                    assert.isUndefined(newPackageJson.typings);
                    assert.equal(newPackageJson.main, 'main.js');
                    assert.isTrue(grunt.file.exists('temp/README.md'));
                },
                'run w/o no extras': function () {
                    grunt.file.copy('README.md', 'README.md.bak');
                    grunt.file.delete('README.md');
                    util_1.runGruntTask('release-publish-flat');
                    assert.isFalse(grunt.file.exists('temp/README.md'));
                }
            };
        })(),
        release: (function () {
            var failStub;
            var runStub;
            return {
                beforeEach: function () {
                    failStub = sinon_1.stub(grunt.fail, 'fatal').throws();
                    runStub = sinon_1.stub(grunt.task, 'run');
                },
                afterEach: function () {
                    failStub.restore();
                    runStub.restore();
                    taskUnloader();
                },
                'skipChecks on non dry run': function () {
                    var caughtError = null;
                    taskLoader(undefined, {
                        'dry-run': false,
                        'skip-checks': true
                    });
                    try {
                        util_1.runGruntTask('release');
                    }
                    catch (e) {
                        caughtError = e;
                    }
                    finally {
                        assert.isNotNull(caughtError);
                        assert.isTrue(failStub.calledOnce);
                    }
                },
                'run with no version': function () {
                    var caughtError = null;
                    taskLoader(undefined, {});
                    try {
                        util_1.runGruntTask('release');
                    }
                    catch (e) {
                        caughtError = e;
                    }
                    finally {
                        assert.isNotNull(caughtError);
                        assert.isTrue(failStub.calledOnce);
                    }
                },
                'run w/ prerelease tags': function () {
                    taskLoader(undefined, {
                        'pre-release-tag': 'beta'
                    });
                    util_1.runGruntTask('release');
                    assert.isTrue(runStub.calledOnce);
                    assert.deepEqual(runStub.getCalls()[0].args[0], [
                        'can-publish-check',
                        'repo-is-clean-check',
                        'dist',
                        'release-version-pre-release-tag',
                        'release-publish-flat',
                        'post-release-version'
                    ]);
                },
                'run w/ prerelease tags w/ skipchecks': function () {
                    taskLoader(undefined, {
                        'pre-release-tag': 'beta',
                        'skip-checks': true,
                        'dry-run': true
                    });
                    util_1.runGruntTask('release');
                    assert.isTrue(runStub.calledOnce);
                    assert.deepEqual(runStub.getCalls()[0].args[0], [
                        'dist',
                        'release-version-pre-release-tag',
                        'release-publish-flat',
                        'post-release-version'
                    ]);
                },
                'run w/ release tag and version': function () {
                    taskLoader(undefined, {
                        'release-version': '1.2.3-alpha',
                        'next-version': '1.2.3'
                    });
                    util_1.runGruntTask('release');
                    assert.isTrue(runStub.calledOnce);
                    assert.deepEqual(runStub.getCalls()[0].args[0], [
                        'can-publish-check',
                        'repo-is-clean-check',
                        'dist',
                        'release-version-specific',
                        'release-publish-flat',
                        'post-release-version'
                    ]);
                }
            };
        })()
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVsZWFzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInJlbGVhc2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7SUFBQSw2Q0FBK0M7SUFDL0MsMkNBQTZDO0lBQzdDLDZCQUErQjtJQUMvQiwrQkFBd0M7SUFDeEMsMkJBQTZCO0lBQzdCLGdDQUErRDtJQUcvRCxJQUFJLEtBQUssR0FBYyxZQUFJLEVBQUUsQ0FBQztJQUM5QixJQUFJLGVBQWUsR0FFZixFQUFFLENBQUM7SUFFUCxJQUFNLE1BQU0sR0FBRywwQkFBMEIsQ0FBQztJQUUxQyxvQkFBb0IsTUFBK0IsRUFBRSxPQUFnQyxFQUFFLEtBQWtDO1FBQWxDLHNCQUFBLEVBQUEsVUFBa0M7UUFDeEgsZUFBZSxHQUFHLEVBQUUsQ0FBQztRQUVyQixFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1lBQ2IsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQyxNQUFNO2dCQUNuQyxlQUFlLENBQUUsTUFBTSxDQUFFLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDakQsS0FBSyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFFLE1BQU0sQ0FBRSxDQUFDLENBQUM7WUFDekMsQ0FBQyxDQUFDLENBQUM7UUFDSixDQUFDO1FBRUQsS0FBSyxDQUFFLE9BQU8sQ0FBRSxHQUFHO1lBQ2xCLEtBQUssRUFBRSxLQUFLO1NBQ1osQ0FBQztRQUVGLEtBQUssQ0FBQyxVQUFVLENBQUMsTUFBTSxJQUFJLEVBQUUsQ0FBQyxDQUFDO1FBRS9CLGdCQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDbEIsQ0FBQztJQUVEO1FBQ0MsTUFBTSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQyxNQUFjO1lBQ25ELEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLGVBQWUs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QUMzRCxtQkFBbUI7d0JBQ25CLHFCQUFxQjt3QkFDckIsTUFBTTt3QkFDTiwwQkFBMEI7d0JBQzFCLHNCQUFzQjt3QkFDdEIsc0JBQXNCO3FCQUN0QixDQUFDLENBQUM7Z0JBQ0osQ0FBQzthQUNELENBQUM7UUFDSCxDQUFDLENBQUMsRUFBRTtLQUNKLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIHJlZ2lzdGVyU3VpdGUgZnJvbSAnaW50ZXJuIW9iamVjdCc7XG5pbXBvcnQgKiBhcyBhc3NlcnQgZnJvbSAnaW50ZXJuL2NoYWkhYXNzZXJ0JztcbmltcG9ydCAqIGFzIGdydW50IGZyb20gJ2dydW50JztcbmltcG9ydCB7IHN0dWIsIFNpbm9uU3R1YiB9IGZyb20gJ3Npbm9uJztcbmltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgeyB1bmxvYWRUYXNrcywgbG9hZFRhc2tzLCBydW5HcnVudFRhc2sgfSBmcm9tICcuLi91dGlsJztcbmltcG9ydCBUZXN0ID0gcmVxdWlyZSgnaW50ZXJuL2xpYi9UZXN0Jyk7XG5cbmxldCBzaGVsbDogU2lub25TdHViID0gc3R1YigpO1xubGV0IG9yaWdpbmFsT3B0aW9uczoge1xuXHRba2V5OiBzdHJpbmddOiBhbnk7XG59ID0ge307XG5cbmNvbnN0IGdpdFVybCA9ICdnaXRAZ2l0aHViLmNvbTpkb2pvL3Rlc3QnO1xuXG5mdW5jdGlvbiB0YXNrTG9hZGVyKGNvbmZpZz86IHsgW2tleTogc3RyaW5nXTogYW55IH0sIG9wdGlvbnM/OiB7IFtrZXk6IHN0cmluZ106IGFueSB9LCBtb2NrczogeyBba2V5OiBzdHJpbmddOiBhbnkgfSA9IHt9KSB7XG5cdG9yaWdpbmFsT3B0aW9ucyA9IHt9O1xuXG5cdGlmIChvcHRpb25zKSB7XG5cdFx0T2JqZWN0LmtleXMob3B0aW9ucykuZm9yRWFjaCgob3B0aW9uKSA9PiB7XG5cdFx0XHRvcmlnaW5hbE9wdGlvbnNbIG9wdGlvbiBdID0gZ3J1bnQub3B0aW9uKG9wdGlvbik7XG5cdFx0XHRncnVudC5vcHRpb24ob3B0aW9uLCBvcHRpb25zWyBvcHRpb24gXSk7XG5cdFx0fSk7XG5cdH1cblxuXHRtb2Nrc1sgJ2V4ZWNhJyBdID0ge1xuXHRcdHNoZWxsOiBzaGVsbFxuXHR9O1xuXG5cdGdydW50LmluaXRDb25maWcoY29uZmlnIHx8IHt9KTtcblxuXHRsb2FkVGFza3MobW9ja3MpO1xufVxuXG5mdW5jdGlvbiB0YXNrVW5sb2FkZXIoKSB7XG5cdE9iamVjdC5rZXlzKG9yaWdpbmFsT3B0aW9ucykuZm9yRWFjaCgob3B0aW9uOiBzdHJpbmcpID0+IHtcblx0XHRncnVudC5vcHRpb24ob3B0aW9uLCBvcmlnaW5hbE9wdGlvbnNbIG9wdGlvbiBdKTtcblx0fSk7XG5cblx0dW5sb2FkVGFza3MoKTtcbn1cblxucmVnaXN0ZXJTdWl0ZSh7XG5cdG5hbWU6ICd0YXNrcy9yZWxlYXNlJyxcblx0J2Nhbi1wdWJsaXNoLWNoZWNrJzogKGZ1bmN0aW9uICgpIHtcblx0XHRsZXQgZmFpbDogU2lub25TdHViO1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdGJlZm9yZUVhY2goKSB7XG5cdFx0XHRcdGZhaWwgPSBzdHViKGdydW50LmZhaWwsICdmYXRhbCcpLnRocm93cygpO1xuXHRcdFx0XHRzaGVsbCA9IHN0dWIoKTtcblx0XHRcdH0sXG5cblx0XHRcdGFmdGVyRWFjaCgpIHtcblx0XHRcdFx0ZmFpbC5yZXN0b3JlKCk7XG5cdFx0XHRcdHRhc2tVbmxvYWRlcigpO1xuXHRcdFx0fSxcblxuXHRcdFx0J2xvZ2dlZCBvdXQgb2YgbnBtJyh0aGlzOiBUZXN0KSB7XG5cdFx0XHRcdGNvbnN0IGRmZCA9IHRoaXMuYXN5bmMoKTtcblxuXHRcdFx0XHR0YXNrTG9hZGVyKCk7XG5cblx0XHRcdFx0c2hlbGwud2l0aEFyZ3MoJ25wbSB3aG9hbWknKVxuXHRcdFx0XHRcdC5yZXR1cm5zKFByb21pc2UucmVqZWN0KG5ldyBFcnJvcigpKSlcblx0XHRcdFx0XHQud2l0aEFyZ3MoJ25wbSB2aWV3IC4gLS1qc29uJylcblx0XHRcdFx0XHQucmV0dXJucyhQcm9taXNlLnJlc29sdmUoSlNPTi5zdHJpbmdpZnkoe1xuXHRcdFx0XHRcdFx0bWFpbnRhaW5lcnM6IFtcblx0XHRcdFx0XHRcdFx0J2Rvam90b29sa2l0IDxraXRzb25rQGRvam90b29sa2l0Lm9yZz4nLFxuXHRcdFx0XHRcdFx0XHQnc2l0ZXBlbiA8bGFic0BzaXRlcGVuLmNvbT4nXG5cdFx0XHRcdFx0XHRdXG5cdFx0XHRcdFx0fSkpKTtcblxuXHRcdFx0XHRydW5HcnVudFRhc2soJ2Nhbi1wdWJsaXNoLWNoZWNrJywgZGZkLnJlamVjdE9uRXJyb3IoKCkgPT4ge1xuXHRcdFx0XHRcdGFzc2VydChmYWxzZSwgJ1Nob3VsZCBoYXZlIGZhaWxlZCcpO1xuXHRcdFx0XHR9KSkuY2F0Y2goZGZkLmNhbGxiYWNrKCgpID0+IHtcblx0XHRcdFx0XHRhc3NlcnQuaXNUcnVlKGZhaWwuY2FsbGVkT25jZSwgJ2dydW50LmZhaWwuZmF0YWwgc2hvdWxkIGhhdmUgYmVlbiBjYWxsZWQgb25jZScpO1xuXHRcdFx0XHRcdGFzc2VydC5pc1RydWUoZmFpbC5jYWxsZWRXaXRoKCdub3QgbG9nZ2VkIGludG8gbnBtJyksICdncnVudC5mYWlsLmZhdGFsIHNob3VsZCBoYXZlIGJlZW4gY2FsbGVkIHdpdGggdGhlIGVycm9yIG1lc3NhZ2UnKTtcblx0XHRcdFx0fSkpO1xuXHRcdFx0fSxcblxuXHRcdFx0J25vdCBhIG1haW50YWluZXInKHRoaXM6IFRlc3QpIHtcblx0XHRcdFx0Y29uc3QgZGZkID0gdGhpcy5hc3luYygpO1xuXG5cdFx0XHRcdHRhc2tMb2FkZXIoKTtcblxuXHRcdFx0XHRzaGVsbC53aXRoQXJncygnbnBtIHdob2FtaScpLnJldHVybnMoUHJvbWlzZS5yZXNvbHZlKHsgc3Rkb3V0OiAndGVzdCcgfSkpLndpdGhBcmdzKCducG0gdmlldyAuIC0tanNvbicpLnJldHVybnMoUHJvbWlzZS5yZXNvbHZlKHtcblx0XHRcdFx0XHRzdGRvdXQ6IEpTT04uc3RyaW5naWZ5KHtcblx0XHRcdFx0XHRcdG1haW50YWluZXJzOiBbXG5cdFx0XHRcdFx0XHRcdFwic2l0ZXBlbiA8bGFic0BzaXRlcGVuLmNvbT5cIlxuXHRcdFx0XHRcdFx0XVxuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdH0pKTtcblxuXHRcdFx0XHRydW5HcnVudFRhc2soJ2Nhbi1wdWJsaXNoLWNoZWNrJywgZGZkLnJlamVjdE9uRXJyb3IoKCkgPT4ge1xuXHRcdFx0XHRcdGFzc2VydChmYWxzZSwgJ1Nob3VsZCBoYXZlIGZhaWxlZCcpO1xuXHRcdFx0XHR9KSkuY2F0Y2goZGZkLmNhbGxiYWNrKChlcnJvcjogRXJyb3IpID0+IHtcblx0XHRcdFx0XHRhc3NlcnQuaXNUcnVlKGZhaWwuY2FsbGVkT25jZSwgJ2dydW50LmZhaWwuZmF0YWwgc2hvdWxkIGhhdmUgYmVlbiBjYWxsZWQgb25jZScpO1xuXHRcdFx0XHRcdGFzc2VydC5pc1RydWUoZmFpbC5jYWxsZWRXaXRoKCdjYW5ub3QgcHVibGlzaCB0aGlzIHBhY2thZ2Ugd2l0aCB1c2VyIHRlc3QnKSwgJ2dydW50LmZhaWwuZmF0YWwgc2hvdWxkIGhhdmUgYmVlbiBjYWxsZWQgd2l0aCB0aGUgZXJyb3IgbWVzc2FnZScpO1xuXHRcdFx0XHR9KSk7XG5cdFx0XHR9LFxuXG5cdFx0XHQnZHJ5IHJ1biBydW4gY29tbWFuZHMgYW55d2F5cycodGhpczogVGVzdCkge1xuXHRcdFx0XHRjb25zdCBkZmQgPSB0aGlzLmFzeW5jKCk7XG5cblx0XHRcdFx0dGFza0xvYWRlcih1bmRlZmluZWQsIHtcblx0XHRcdFx0XHQnZHJ5LXJ1bic6IHRydWVcblx0XHRcdFx0fSk7XG5cblx0XHRcdFx0c2hlbGwud2l0aEFyZ3MoJ25wbSB3aG9hbWknKVxuXHRcdFx0XHRcdC5yZXR1cm5zKFByb21pc2UucmVqZWN0KG5ldyBFcnJvcigpKSlcblx0XHRcdFx0XHQud2l0aEFyZ3MoJ25wbSB2aWV3IC4gLS1qc29uJylcblx0XHRcdFx0XHQucmV0dXJucyhQcm9taXNlLnJlc29sdmUoSlNPTi5zdHJpbmdpZnkoe1xuXHRcdFx0XHRcdFx0bWFpbnRhaW5lcnM6IFtcblx0XHRcdFx0XHRcdFx0XCJkb2pvdG9vbGtpdCA8a2l0c29ua0Bkb2pvdG9vbGtpdC5vcmc+XCIsXG5cdFx0XHRcdFx0XHRcdFwic2l0ZXBlbiA8bGFic0BzaXRlcGVuLmNvbT5cIlxuXHRcdFx0XHRcdFx0XVxuXHRcdFx0XHRcdH0pKSk7XG5cblx0XHRcdFx0cnVuR3J1bnRUYXNrKCdjYW4tcHVibGlzaC1jaGVjaycsIGRmZC5yZWplY3RPbkVycm9yKCgpID0+IHtcblx0XHRcdFx0XHRhc3NlcnQoZmFsc2UsICdTaG91bGQgaGF2ZSBmYWlsZWQnKTtcblx0XHRcdFx0fSkpLmNhdGNoKGRmZC5jYWxsYmFjaygoKSA9PiB7XG5cdFx0XHRcdFx0YXNzZXJ0LmlzVHJ1ZShmYWlsLmNhbGxlZE9uY2UsICdncnVudC5mYWlsLmZhdGFsIHNob3VsZCBoYXZlIGJlZW4gY2FsbGVkIG9uY2UnKTtcblx0XHRcdFx0XHRhc3NlcnQuaXNUcnVlKGZhaWwuY2FsbGVkV2l0aCgnbm90IGxvZ2dlZCBpbnRvIG5wbScpLCAnZ3J1bnQuZmFpbC5mYXRhbCBzaG91bGQgaGF2ZSBiZWVuIGNhbGxlZCB3aXRoIHRoZSBlcnJvciBtZXNzYWdlJyk7XG5cdFx0XHRcdH0pKTtcblx0XHRcdH0sXG5cblx0XHRcdCdpbml0aWFsIHJ1biB1c2VzIGRlZmF1bHQgbWFpbnRhaW5lcnMnKHRoaXM6IFRlc3QpIHtcblx0XHRcdFx0Y29uc3QgZGZkID0gdGhpcy5hc3luYygpO1xuXG5cdFx0XHRcdHRhc2tMb2FkZXIodW5kZWZpbmVkLCB7XG5cdFx0XHRcdFx0J2luaXRpYWwnOiB0cnVlXG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRcdHNoZWxsLndpdGhBcmdzKCducG0gd2hvYW1pJylcblx0XHRcdFx0XHQucmV0dXJucyhQcm9taXNlLnJlc29sdmUoeyBzdGRvdXQ6ICdkb2pvJyB9KSlcblx0XHRcdFx0XHQud2l0aEFyZ3MoJ25wbSB2aWV3IC4gLS1qc29uJylcblx0XHRcdFx0XHQudGhyb3dzKCk7XG5cblx0XHRcdFx0cnVuR3J1bnRUYXNrKCdjYW4tcHVibGlzaC1jaGVjaycsIGRmZC5jYWxsYmFjaygoKSA9PiB7XG5cdFx0XHRcdFx0YXNzZXJ0LmlzVHJ1ZShzaGVsbC5jYWxsZWRPbmNlKTtcblx0XHRcdFx0fSkpLmNhdGNoKGRmZC5yZWplY3RPbkVycm9yKCgpID0+IHtcblx0XHRcdFx0XHRhc3NlcnQoZmFsc2UsICdTaG91bGQgaGF2ZSBzdWNjZWVkZWQnKTtcblx0XHRcdFx0fSkpO1xuXHRcdFx0fVxuXHRcdH07XG5cdH0pKCksXG5cdCdyZXBvLWlzLWNsZWFuLWNoZWNrJzogKGZ1bmN0aW9uICgpIHtcblx0XHRsZXQgZmFpbFN0dWI6IFNpbm9uU3R1YjtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRiZWZvcmVFYWNoKCkge1xuXHRcdFx0XHRmYWlsU3R1YiA9IHN0dWIoZ3J1bnQuZmFpbCwgJ2ZhdGFsJykudGhyb3dzKCk7XG5cdFx0XHRcdHNoZWxsID0gc3R1YigpO1xuXHRcdFx0fSxcblxuXHRcdFx0YWZ0ZXJFYWNoKCkge1xuXHRcdFx0XHRmYWlsU3R1Yi5yZXN0b3JlKCk7XG5cdFx0XHR9LFxuXG5cdFx0XHQnY2hhbmdlcyBvbiB3b3JraW5nIHRyZWUnKHRoaXM6IFRlc3QpIHtcblx0XHRcdFx0Y29uc3QgZGZkID0gdGhpcy5hc3luYygpO1xuXG5cdFx0XHRcdHRhc2tMb2FkZXIoKTtcblxuXHRcdFx0XHQvLyB3ZSBuZWVkIHRvIG1vY2sgdGhlIHdob2xlIHRoaW5nIGJlY2F1c2Vcblx0XHRcdFx0c2hlbGwud2l0aEFyZ3MoJ2dpdCBzdGF0dXMgLS1wb3JjZWxhaW4nKVxuXHRcdFx0XHRcdC5yZXR1cm5zKFByb21pc2UucmVzb2x2ZSh7IHN0ZG91dDogJ2NoYW5nZScgfSkpO1xuXG5cdFx0XHRcdHJ1bkdydW50VGFzaygncmVwby1pcy1jbGVhbi1jaGVjaycsIGRmZC5yZWplY3RPbkVycm9yKCgpID0+IHtcblx0XHRcdFx0XHRhc3NlcnQoZmFsc2UsICdzaG91bGQgaGF2ZSBmYWlsZWQnKTtcblx0XHRcdFx0fSkpLmNhdGNoKGRmZC5jYWxsYmFjaygoKSA9PiB7XG5cdFx0XHRcdFx0YXNzZXJ0LmlzVHJ1ZShmYWlsU3R1Yi5jYWxsZWRXaXRoKCd0aGVyZSBhcmUgY2hhbmdlcyBpbiB0aGUgd29ya2luZyB0cmVlJykpO1xuXHRcdFx0XHR9KSk7XG5cdFx0XHR9LFxuXG5cdFx0XHQnbm90IG9uIGRlZmF1bHQgYnJhbmNoJyh0aGlzOiBUZXN0KSB7XG5cdFx0XHRcdGNvbnN0IGRmZCA9IHRoaXMuYXN5bmMoKTtcblxuXHRcdFx0XHR0YXNrTG9hZGVyKCk7XG5cblx0XHRcdFx0Ly8gd2UgbmVlZCB0byBtb2NrIHRoZSB3aG9sZSB0aGluZyBiZWNhdXNlXG5cdFx0XHRcdHNoZWxsLndpdGhBcmdzKCdnaXQgc3RhdHVzIC0tcG9yY2VsYWluJylcblx0XHRcdFx0XHQucmV0dXJucyhQcm9taXNlLnJlc29sdmUoeyBzdGRvdXQ6ICcnIH0pKVxuXHRcdFx0XHRcdC53aXRoQXJncygnZ2l0IHJldi1wYXJzZSAtLWFiYnJldi1yZWYgSEVBRCcpXG5cdFx0XHRcdFx0LnJldHVybnMoUHJvbWlzZS5yZXNvbHZlKHsgc3Rkb3V0OiAndGVzdCcgfSkpO1xuXG5cdFx0XHRcdHJ1bkdydW50VGFzaygncmVwby1pcy1jbGVhbi1jaGVjaycsIGRmZC5yZWplY3RPbkVycm9yKCgpID0+IHtcblx0XHRcdFx0XHRhc3NlcnQoZmFsc2UsICdzaG91bGQgaGF2ZSBmYWlsZWQnKTtcblx0XHRcdFx0fSkpLmNhdGNoKGRmZC5jYWxsYmFjaygoKSA9PiB7XG5cdFx0XHRcdFx0YXNzZXJ0LmlzVHJ1ZShmYWlsU3R1Yi5jYWxsZWRXaXRoKCdub3Qgb24gbWFzdGVyIGJyYW5jaCcpKTtcblx0XHRcdFx0fSkpO1xuXHRcdFx0fSxcblxuXHRcdFx0J3N1Y2Nlc3MnKHRoaXM6IFRlc3QpIHtcblx0XHRcdFx0Y29uc3QgZGZkID0gdGhpcy5hc3luYygpO1xuXG5cdFx0XHRcdHRhc2tMb2FkZXIoKTtcblxuXHRcdFx0XHQvLyB3ZSBuZWVkIHRvIG1vY2sgdGhlIHdob2xlIHRoaW5nIGJlY2F1c2Vcblx0XHRcdFx0c2hlbGwud2l0aEFyZ3MoJ2dpdCBzdGF0dXMgLS1wb3JjZWxhaW4nKVxuXHRcdFx0XHRcdC5yZXR1cm5zKFByb21pc2UucmVzb2x2ZSh7IHN0ZG91dDogJycgfSkpXG5cdFx0XHRcdFx0LndpdGhBcmdzKCdnaXQgcmV2LXBhcnNlIC0tYWJicmV2LXJlZiBIRUFEJylcblx0XHRcdFx0XHQucmV0dXJucyhQcm9taXNlLnJlc29sdmUoeyBzdGRvdXQ6ICdtYXN0ZXInIH0pKTtcblxuXHRcdFx0XHRydW5HcnVudFRhc2soJ3JlcG8taXMtY2xlYW4tY2hlY2snLCBkZmQuY2FsbGJhY2soKCkgPT4ge1xuXHRcdFx0XHR9KSkuY2F0Y2goZGZkLnJlamVjdE9uRXJyb3IoKCkgPT4ge1xuXHRcdFx0XHRcdGFzc2VydChmYWxzZSwgJ3Nob3VsZCBoYXZlIHN1Y2NlZWRlZCcpO1xuXHRcdFx0XHR9KSk7XG5cdFx0XHR9XG5cdFx0fTtcblx0fSkoKSxcblx0J3JlbGVhc2UtcHVibGlzaCc6IHtcblx0XHRiZWZvcmVFYWNoKCkge1xuXHRcdFx0c2hlbGwgPSBzdHViKCk7XG5cdFx0fSxcblxuXHRcdGFmdGVyRWFjaCgpIHtcblx0XHRcdHRhc2tVbmxvYWRlcigpO1xuXHRcdH0sXG5cblx0XHQnd2l0aG91dCBhIHRhZycodGhpczogVGVzdCkge1xuXHRcdFx0Y29uc3QgZGZkID0gdGhpcy5hc3luYygpO1xuXG5cdFx0XHR0YXNrTG9hZGVyKCk7XG5cblx0XHRcdHNoZWxsLndpdGhBcmdzKCducG0gcHVibGlzaCAuJylcblx0XHRcdFx0LnJldHVybnMoUHJvbWlzZS5yZXNvbHZlKHsgc3Rkb3V0OiAnJyB9KSk7XG5cblx0XHRcdHJ1bkdydW50VGFzaygncmVsZWFzZS1wdWJsaXNoJywgZGZkLmNhbGxiYWNrKCgpID0+IHtcblx0XHRcdFx0YXNzZXJ0LmlzVHJ1ZShzaGVsbC5jYWxsZWRPbmNlKTtcblx0XHRcdH0pKS5jYXRjaChkZmQucmVqZWN0T25FcnJvcigoKSA9PiB7XG5cdFx0XHRcdGFzc2VydChmYWxzZSwgJ3Nob3VsZCBoYXZlIHN1Y2NlZWRlZCcpO1xuXHRcdFx0fSkpO1xuXHRcdH0sXG5cblx0XHQnd2l0aCBhIHRhZycodGhpczogVGVzdCkge1xuXHRcdFx0Y29uc3QgZGZkID0gdGhpcy5hc3luYygpO1xuXG5cdFx0XHR0YXNrTG9hZGVyKHVuZGVmaW5lZCwge1xuXHRcdFx0XHR0YWc6ICd0ZXN0J1xuXHRcdFx0fSk7XG5cblx0XHRcdHNoZWxsLndpdGhBcmdzKCducG0gcHVibGlzaCAuIC0tdGFnIHRlc3QnKVxuXHRcdFx0XHQucmV0dXJucyhQcm9taXNlLnJlc29sdmUoeyBzdGRvdXQ6ICcnIH0pKTtcblxuXHRcdFx0cnVuR3J1bnRUYXNrKCdyZWxlYXNlLXB1Ymxpc2gnLCBkZmQuY2FsbGJhY2soKCkgPT4ge1xuXHRcdFx0XHRhc3NlcnQuaXNUcnVlKHNoZWxsLmNhbGxlZE9uY2UpO1xuXHRcdFx0fSkpLmNhdGNoKGRmZC5yZWplY3RPbkVycm9yKCgpID0+IHtcblx0XHRcdFx0YXNzZXJ0KGZhbHNlLCAnc2hvdWxkIGhhdmUgc3VjY2VlZGVkJyk7XG5cdFx0XHR9KSk7XG5cdFx0fSxcblxuXHRcdCdkcnkgcnVuJyh0aGlzOiBUZXN0KSB7XG5cdFx0XHRjb25zdCBkZmQgPSB0aGlzLmFzeW5jKCk7XG5cblx0XHRcdHRhc2tMb2FkZXIodW5kZWZpbmVkLCB7XG5cdFx0XHRcdCdkcnktcnVuJzogdHJ1ZVxuXHRcdFx0fSk7XG5cblx0XHRcdHNoZWxsLndpdGhBcmdzKCducG0gcHVibGlzaCAuJylcblx0XHRcdFx0LnJldHVybnMoUHJvbWlzZS5yZXNvbHZlKHsgc3Rkb3V0OiAnJyB9KSlcblx0XHRcdFx0LndpdGhBcmdzKCducG0gcGFjayAuLi90ZW1wLycpXG5cdFx0XHRcdC5yZXR1cm5zKFByb21pc2UucmVzb2x2ZSgpKTtcblxuXHRcdFx0cnVuR3J1bnRUYXNrKCdyZWxlYXNlLXB1Ymxpc2gnLCBkZmQuY2FsbGJhY2soKCkgPT4ge1xuXHRcdFx0XHRhc3NlcnQuaXNUcnVlKHNoZWxsLmNhbGxlZE9uY2UpO1xuXHRcdFx0XHRhc3NlcnQuaXNUcnVlKHNoZWxsLmNhbGxlZFdpdGgoJ25wbSBwYWNrIC4uL3RlbXAvJykpO1xuXHRcdFx0fSkpLmNhdGNoKGRmZC5yZWplY3RPbkVycm9yKCgpID0+IHtcblx0XHRcdFx0YXNzZXJ0KGZhbHNlLCAnc2hvdWxkIGhhdmUgc3VjY2VlZGVkJyk7XG5cdFx0XHR9KSk7XG5cdFx0fVxuXHR9LFxuXHQncmVsZWFzZS12ZXJzaW9uLXByZS1yZWxlYXNlLXRhZyc6IChmdW5jdGlvbiAoKSB7XG5cdFx0bGV0IGZhaWxTdHViOiBTaW5vblN0dWI7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0YmVmb3JlRWFjaCgpIHtcblx0XHRcdFx0ZmFpbFN0dWIgPSBzdHViKGdydW50LmZhaWwsICdmYXRhbCcpLnRocm93cygpO1xuXHRcdFx0XHRzaGVsbCA9IHN0dWIoKTtcblx0XHRcdH0sXG5cblx0XHRcdGFmdGVyRWFjaCgpIHtcblx0XHRcdFx0ZmFpbFN0dWIucmVzdG9yZSgpO1xuXHRcdFx0XHR0YXNrVW5sb2FkZXIoKTtcblx0XHRcdH0sXG5cblx0XHRcdCdpbml0aWFsLCBubyBkcnkgcnVuJyh0aGlzOiBUZXN0KSB7XG5cdFx0XHRcdGNvbnN0IGRmZCA9IHRoaXMuYXN5bmMoKTtcblxuXHRcdFx0XHR0YXNrTG9hZGVyKHVuZGVmaW5lZCwge1xuXHRcdFx0XHRcdGluaXRpYWw6IHRydWUsXG5cdFx0XHRcdFx0J3ByZS1yZWxlYXNlLXRhZyc6ICd0ZXN0J1xuXHRcdFx0XHR9KTtcblxuXHRcdFx0XHRzaGVsbC5vbkZpcnN0Q2FsbCgpXG5cdFx0XHRcdFx0LnJldHVybnMoUHJvbWlzZS5yZXNvbHZlKHt9KSk7XG5cblx0XHRcdFx0cnVuR3J1bnRUYXNrKCdyZWxlYXNlLXZlcnNpb24tcHJlLXJlbGVhc2UtdGFnJywgZGZkLmNhbGxiYWNrKCgpID0+IHtcblx0XHRcdFx0XHRhc3NlcnQuaXNUcnVlKHNoZWxsLmNhbGxlZE9uY2UpO1xuXG5cdFx0XHRcdFx0bGV0IGNvbW1hbmQgPSAoPGFueT4gc2hlbGwpLmdldENhbGxzKClbIDAgXS5hcmdzWyAwIF07XG5cblx0XHRcdFx0XHRhc3NlcnQuaXNUcnVlKC9ucG0gdmVyc2lvbiBbXFxkLl0rLXRlc3RcXC4xLy50ZXN0KGNvbW1hbmQpKTtcblx0XHRcdFx0fSkpLmNhdGNoKGRmZC5yZWplY3RPbkVycm9yKCgpID0+IHtcblx0XHRcdFx0XHRhc3NlcnQoZmFsc2UsICdzaG91bGQgaGF2ZSBzdWNjZWVkZWQnKTtcblx0XHRcdFx0fSkpO1xuXHRcdFx0fSxcblxuXHRcdFx0J2luaXRpYWwsIGRyeSBydW4nKHRoaXM6IFRlc3QpIHtcblx0XHRcdFx0Y29uc3QgZGZkID0gdGhpcy5hc3luYygpO1xuXG5cdFx0XHRcdHRhc2tMb2FkZXIodW5kZWZpbmVkLCB7XG5cdFx0XHRcdFx0aW5pdGlhbDogdHJ1ZSxcblx0XHRcdFx0XHQnZHJ5LXJ1bic6IHRydWUsXG5cdFx0XHRcdFx0J3ByZS1yZWxlYXNlLXRhZyc6ICd0ZXN0J1xuXHRcdFx0XHR9KTtcblxuXHRcdFx0XHRzaGVsbC5vbkZpcnN0Q2FsbCgpXG5cdFx0XHRcdFx0LnJldHVybnMoUHJvbWlzZS5yZXNvbHZlKHt9KSk7XG5cblx0XHRcdFx0cnVuR3J1bnRUYXNrKCdyZWxlYXNlLXZlcnNpb24tcHJlLXJlbGVhc2UtdGFnJywgZGZkLmNhbGxiYWNrKCgpID0+IHtcblx0XHRcdFx0XHRhc3NlcnQuaXNUcnVlKHNoZWxsLmNhbGxlZE9uY2UpO1xuXG5cdFx0XHRcdFx0bGV0IGNvbW1hbmQgPSAoPGFueT4gc2hlbGwpLmdldENhbGxzKClbIDAgXS5hcmdzWyAwIF07XG5cblx0XHRcdFx0XHRhc3NlcnQuaXNUcnVlKC9ucG0gLS1uby1naXQtdGFnLXZlcnNpb24gdmVyc2lvbiBbXFxkLl0rLXRlc3RcXC4xLy50ZXN0KGNvbW1hbmQpKTtcblx0XHRcdFx0fSkpLmNhdGNoKGRmZC5yZWplY3RPbkVycm9yKCgpID0+IHtcblx0XHRcdFx0XHRhc3NlcnQoZmFsc2UsICdzaG91bGQgaGF2ZSBzdWNjZWVkZWQnKTtcblx0XHRcdFx0fSkpO1xuXHRcdFx0fSxcblx0XHRcdCdyZWd1bGFyIHcvIGJhZCBvdXRwdXQnKHRoaXM6IFRlc3QpIHtcblx0XHRcdFx0Y29uc3QgZGZkID0gdGhpcy5hc3luYygpO1xuXG5cdFx0XHRcdHRhc2tMb2FkZXIodW5kZWZpbmVkLCB7XG5cdFx0XHRcdFx0J3ByZS1yZWxlYXNlLXRhZyc6ICd0ZXN0J1xuXHRcdFx0XHR9KTtcblxuXHRcdFx0XHRzaGVsbC53aXRoQXJncygnbnBtIHZpZXcgLiAtLWpzb24nKVxuXHRcdFx0XHRcdC5yZXR1cm5zKFByb21pc2UucmVzb2x2ZSh7IHN0ZG91dDogJycgfSkpO1xuXG5cdFx0XHRcdHJ1bkdydW50VGFzaygncmVsZWFzZS12ZXJzaW9uLXByZS1yZWxlYXNlLXRhZycsIGRmZC5yZWplY3RPbkVycm9yKCgpID0+IHtcblx0XHRcdFx0XHRhc3NlcnQoZmFsc2UsICdzaG91bGQgaGF2ZSBmYWlsZWQnKTtcblx0XHRcdFx0fSkpLmNhdGNoKGRmZC5jYWxsYmFjaygoKSA9PiB7XG5cdFx0XHRcdFx0YXNzZXJ0LmlzVHJ1ZShzaGVsbC5jYWxsZWRPbmNlKTtcblx0XHRcdFx0fSkpO1xuXHRcdFx0fSxcblx0XHRcdCdyZWd1bGFyJyh0aGlzOiBUZXN0KSB7XG5cdFx0XHRcdGNvbnN0IGRmZCA9IHRoaXMuYXN5bmMoKTtcblxuXHRcdFx0XHR0YXNrTG9hZGVyKHVuZGVmaW5lZCwge1xuXHRcdFx0XHRcdCdwcmUtcmVsZWFzZS10YWcnOiAndGVzdCdcblx0XHRcdFx0fSk7XG5cblx0XHRcdFx0Y29uc3QgcGFja2FnZUpzb24gPSBncnVudC5maWxlLnJlYWRKU09OKHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCAncGFja2FnZS5qc29uJykpO1xuXHRcdFx0XHRjb25zdCBmdWxsVmVyc2lvbiA9IHBhY2thZ2VKc29uLnZlcnNpb247XG5cdFx0XHRcdGNvbnN0IGp1c3RUaGVWZXJzaW9uID0gZnVsbFZlcnNpb24ucmVwbGFjZSgvXihbXlxcLV0rKS4qJC9nLCAnJDEnKTtcblxuXHRcdFx0XHRzaGVsbC5vbkNhbGwoMClcblx0XHRcdFx0XHQucmV0dXJucyhQcm9taXNlLnJlc29sdmUoe1xuXHRcdFx0XHRcdFx0c3Rkb3V0OiBKU09OLnN0cmluZ2lmeSh7XG5cdFx0XHRcdFx0XHRcdHRpbWU6IHtcblx0XHRcdFx0XHRcdFx0XHRjcmVhdGVkOiAnMS8xLzIwMTYnLFxuXHRcdFx0XHRcdFx0XHRcdG1vZGlmaWVkOiAnMS8yLzIwMTYnLFxuXHRcdFx0XHRcdFx0XHRcdFtgJHtqdXN0VGhlVmVyc2lvbn0tYWxwaGEuNmBdOiBcIjIwMTYtMDUtMTNUMTY6MjQ6MzMuOTQ5WlwiLFxuXHRcdFx0XHRcdFx0XHRcdFtgJHtqdXN0VGhlVmVyc2lvbn0tdGVzdC43YF06IFwiMjAxNi0wNS0xNlQxMzo0NDoxMi42NjlaXCIsXG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0fSkpXG5cdFx0XHRcdFx0Lm9uQ2FsbCgxKVxuXHRcdFx0XHRcdC5yZXR1cm5zKFByb21pc2UucmVzb2x2ZSh7fSkpO1xuXG5cdFx0XHRcdHJ1bkdydW50VGFzaygncmVsZWFzZS12ZXJzaW9uLXByZS1yZWxlYXNlLXRhZycsIGRmZC5jYWxsYmFjaygoKSA9PiB7XG5cdFx0XHRcdFx0YXNzZXJ0LmlzVHJ1ZShzaGVsbC5jYWxsZWRUd2ljZSk7XG5cdFx0XHRcdFx0YXNzZXJ0LmVxdWFsKHNoZWxsLmZpcnN0Q2FsbC5hcmdzWyAwIF0sICducG0gdmlldyAuIC0tanNvbicpO1xuXHRcdFx0XHRcdGFzc2VydC5lcXVhbChzaGVsbC5zZWNvbmRDYWxsLmFyZ3NbIDAgXSwgYG5wbSB2ZXJzaW9uICR7anVzdFRoZVZlcnNpb259LXRlc3QuOGApO1xuXHRcdFx0XHR9KSkuY2F0Y2goZGZkLnJlamVjdE9uRXJyb3IoKGVycm9yOiBhbnkpID0+IHtcblx0XHRcdFx0XHRjb25zb2xlLmxvZygnKioqIEVSUlJPUiAqJywgZXJyb3IpO1xuXHRcdFx0XHRcdGFzc2VydChmYWxzZSwgJ3Nob3VsZCBoYXZlIHN1Y2NlZWRlZCcpO1xuXHRcdFx0XHR9KSk7XG5cdFx0XHR9XG5cdFx0fTtcblx0fSkoKSxcblx0J3JlbGVhc2UtdmVyc2lvbi1zcGVjaWZpYyc6IHtcblx0XHRiZWZvcmVFYWNoKCkge1xuXHRcdFx0c2hlbGwgPSBzdHViKCk7XG5cdFx0fSxcblx0XHRhZnRlckVhY2goKSB7XG5cdFx0XHR0YXNrVW5sb2FkZXIoKTtcblx0XHR9LFxuXHRcdCdkcnkgcnVuJyh0aGlzOiBUZXN0KSB7XG5cdFx0XHRjb25zdCBkZmQgPSB0aGlzLmFzeW5jKCk7XG5cblx0XHRcdHRhc2tMb2FkZXIodW5kZWZpbmVkLCB7XG5cdFx0XHRcdCdkcnktcnVuJzogdHJ1ZSxcblx0XHRcdFx0J3JlbGVhc2UtdmVyc2lvbic6ICcyLjAuMC10ZXN0LjEnXG5cdFx0XHR9KTtcblxuXHRcdFx0c2hlbGwud2l0aEFyZ3MoJ25wbSAtLW5vLWdpdC10YWctdmVyc2lvbiB2ZXJzaW9uIDIuMC4wLXRlc3QuMScpXG5cdFx0XHRcdC5yZXR1cm5zKFByb21pc2UucmVzb2x2ZSgpKTtcblxuXHRcdFx0cnVuR3J1bnRUYXNrKCdyZWxlYXNlLXZlcnNpb24tc3BlY2lmaWMnLCBkZmQuY2FsbGJhY2soKCkgPT4ge1xuXHRcdFx0XHRhc3NlcnQuaXNUcnVlKHNoZWxsLmNhbGxlZE9uY2UpO1xuXHRcdFx0fSkpO1xuXHRcdH0sXG5cdFx0J3JlZ3VsYXInKHRoaXM6IFRlc3QpIHtcblx0XHRcdGNvbnN0IGRmZCA9IHRoaXMuYXN5bmMoKTtcblxuXHRcdFx0dGFza0xvYWRlcih1bmRlZmluZWQsIHtcblx0XHRcdFx0J3JlbGVhc2UtdmVyc2lvbic6ICcyLjAuMC10ZXN0LjEnXG5cdFx0XHR9KTtcblxuXHRcdFx0c2hlbGwud2l0aEFyZ3MoJ25wbSB2ZXJzaW9uIDIuMC4wLXRlc3QuMScpXG5cdFx0XHRcdC5yZXR1cm5zKFByb21pc2UucmVzb2x2ZSgpKTtcblxuXHRcdFx0cnVuR3J1bnRUYXNrKCdyZWxlYXNlLXZlcnNpb24tc3BlY2lmaWMnLCBkZmQuY2FsbGJhY2soKCkgPT4ge1xuXHRcdFx0XHRhc3NlcnQuaXNUcnVlKHNoZWxsLmNhbGxlZE9uY2UpO1xuXHRcdFx0fSkpO1xuXHRcdH1cblx0fSxcblx0J3Bvc3QtcmVsZWFzZS12ZXJzaW9uJzoge1xuXHRcdGJlZm9yZUVhY2goKSB7XG5cdFx0XHRzaGVsbCA9IHN0dWIoKTtcblxuXHRcdFx0Ly8gc2F2ZSBvdXIgYWN0dWFsIHBhY2thZ2UuanNvblxuXHRcdFx0Z3J1bnQuZmlsZS5jb3B5KCdwYWNrYWdlLmpzb24nLCAncGFja2FnZS5qc29uLmJhaycpO1xuXHRcdH0sXG5cblx0XHRhZnRlckVhY2goKSB7XG5cdFx0XHR0YXNrVW5sb2FkZXIoKTtcblxuXHRcdFx0Ly8gcmVzdG9yZSBvdXIgcGFja2FnZS5qc29uXG5cdFx0XHRncnVudC5maWxlLmNvcHkoJ3BhY2thZ2UuanNvbi5iYWsnLCAncGFja2FnZS5qc29uJyk7XG5cdFx0XHRncnVudC5maWxlLmRlbGV0ZSgncGFja2FnZS5qc29uLmJhaycpO1xuXHRcdH0sXG5cblx0XHQnd2l0aG91dCBuZXh0IHZlcnNpb24sIHdpdGhvdXQgcHVzaCBiYWNrJyh0aGlzOiBUZXN0KSB7XG5cdFx0XHRjb25zdCBkZmQgPSB0aGlzLmFzeW5jKCk7XG5cblx0XHRcdGNvbnN0IG9yaWdpbmFsUGFja2FnZUpzb24gPSBncnVudC5maWxlLnJlYWRKU09OKHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCAncGFja2FnZS5qc29uJykpO1xuXG5cdFx0XHR0YXNrTG9hZGVyKCk7XG5cblx0XHRcdHNoZWxsLndpdGhBcmdzKCdnaXQgY29tbWl0IC1hbSBcIlVwZGF0ZSBwYWNrYWdlIG1ldGFkYXRhXCInKVxuXHRcdFx0XHQucmV0dXJucyhQcm9taXNlLnJlc29sdmUoe30pKTtcblxuXHRcdFx0cnVuR3J1bnRUYXNrKCdwb3N0LXJlbGVhc2UtdmVyc2lvbicsIGRmZC5jYWxsYmFjaygoKSA9PiB7XG5cdFx0XHRcdGFzc2VydC5pc1RydWUoc2hlbGwuY2FsbGVkT25jZSk7XG5cblx0XHRcdFx0Y29uc3QgbmV3UGFja2FnZUpzb24gPSBncnVudC5maWxlLnJlYWRKU09OKHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCAncGFja2FnZS5qc29uJykpO1xuXG5cdFx0XHRcdGFzc2VydC5lcXVhbChuZXdQYWNrYWdlSnNvbi52ZXJzaW9uLCBvcmlnaW5hbFBhY2thZ2VKc29uLnZlcnNpb24pO1xuXHRcdFx0fSkpO1xuXHRcdH0sXG5cblx0XHQnd2l0aG91dCBuZXh0IHZlcnNpb24nKHRoaXM6IFRlc3QpIHtcblx0XHRcdGNvbnN0IGRmZCA9IHRoaXMuYXN5bmMoKTtcblxuXHRcdFx0dGFza0xvYWRlcih1bmRlZmluZWQsIHtcblx0XHRcdFx0J3B1c2gtYmFjayc6IHRydWVcblx0XHRcdH0sIHtcblx0XHRcdFx0J3BhcnNlLWdpdC1jb25maWcnOiB7XG5cdFx0XHRcdFx0c3luYzogZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XHRcdFx0J3JlbW90ZSBcIm9yaWdpblwiJzoge1xuXHRcdFx0XHRcdFx0XHRcdHVybDogZ2l0VXJsXG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdFx0c2hlbGwud2l0aEFyZ3MoXG5cdFx0XHRcdCdnaXQgY29tbWl0IC1hbSBcIlVwZGF0ZSBwYWNrYWdlIG1ldGFkYXRhXCInXG5cdFx0XHQpLnJldHVybnMoXG5cdFx0XHRcdFByb21pc2UucmVzb2x2ZSh7fSlcblx0XHRcdCkud2l0aEFyZ3MoXG5cdFx0XHRcdGBnaXQgcHVzaCAke2dpdFVybH0gbWFzdGVyYFxuXHRcdFx0KS5yZXR1cm5zKFxuXHRcdFx0XHRQcm9taXNlLnJlc29sdmUoKVxuXHRcdFx0KS53aXRoQXJncyhcblx0XHRcdFx0YGdpdCBwdXNoICR7Z2l0VXJsfSAtLXRhZ3NgXG5cdFx0XHQpLnJldHVybnMoXG5cdFx0XHRcdFByb21pc2UucmVzb2x2ZSgpXG5cdFx0XHQpO1xuXG5cdFx0XHRydW5HcnVudFRhc2soJ3Bvc3QtcmVsZWFzZS12ZXJzaW9uJywgZGZkLmNhbGxiYWNrKCgpID0+IHtcblx0XHRcdFx0YXNzZXJ0LmlzVHJ1ZShzaGVsbC5jYWxsZWRUaHJpY2UpO1xuXHRcdFx0fSkpO1xuXHRcdH0sXG5cblx0XHQnbm8gcmVtb3RlcycodGhpczogVGVzdCkge1xuXHRcdFx0Y29uc3QgZGZkID0gdGhpcy5hc3luYygpO1xuXG5cdFx0XHR0YXNrTG9hZGVyKHVuZGVmaW5lZCwge1xuXHRcdFx0XHQncHVzaC1iYWNrJzogdHJ1ZVxuXHRcdFx0fSwge1xuXHRcdFx0XHQncGFyc2UtZ2l0LWNvbmZpZyc6IHtcblx0XHRcdFx0XHRzeW5jOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdFx0XHQncmVtb3RlIFwib3JpZ2luXCInOiB7XG5cdFx0XHRcdFx0XHRcdFx0dXJsOiAndGVzdCdcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXG5cdFx0XHRzaGVsbC53aXRoQXJncyhcblx0XHRcdFx0J2dpdCBjb21taXQgLWFtIFwiVXBkYXRlIHBhY2thZ2UgbWV0YWRhdGFcIidcblx0XHRcdCkucmV0dXJucyhcblx0XHRcdFx0UHJvbWlzZS5yZXNvbHZlKHt9KVxuXHRcdFx0KTtcblxuXHRcdFx0cnVuR3J1bnRUYXNrKCdwb3N0LXJlbGVhc2UtdmVyc2lvbicsIGRmZC5jYWxsYmFjaygoKSA9PiB7XG5cdFx0XHRcdGFzc2VydC5pc1RydWUoc2hlbGwuY2FsbGVkT25jZSk7XG5cdFx0XHR9KSk7XG5cdFx0fSxcblxuXHRcdCduZXh0IHZlcnNpb24nKHRoaXM6IFRlc3QpIHtcblx0XHRcdGNvbnN0IGRmZCA9IHRoaXMuYXN5bmMoKTtcblxuXHRcdFx0Y29uc3Qgb3JpZ2luYWxQYWNrYWdlSnNvbiA9IGdydW50LmZpbGUucmVhZEpTT04ocGF0aC5qb2luKHByb2Nlc3MuY3dkKCksICdwYWNrYWdlLmpzb24nKSk7XG5cblx0XHRcdHRhc2tMb2FkZXIodW5kZWZpbmVkLCB7XG5cdFx0XHRcdCduZXh0LXZlcnNpb24nOiAndGVzdC12ZXJzaW9uJ1xuXHRcdFx0fSk7XG5cblx0XHRcdHNoZWxsLndpdGhBcmdzKCdnaXQgY29tbWl0IC1hbSBcIlVwZGF0ZSBwYWNrYWdlIG1ldGFkYXRhXCInKVxuXHRcdFx0XHQucmV0dXJucyhQcm9taXNlLnJlc29sdmUoe30pKTtcblxuXHRcdFx0cnVuR3J1bnRUYXNrKCdwb3N0LXJlbGVhc2UtdmVyc2lvbicsIGRmZC5jYWxsYmFjaygoKSA9PiB7XG5cdFx0XHRcdGFzc2VydC5pc1RydWUoc2hlbGwuY2FsbGVkT25jZSk7XG5cblx0XHRcdFx0Y29uc3QgbmV3UGFja2FnZUpzb24gPSBncnVudC5maWxlLnJlYWRKU09OKHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCAncGFja2FnZS5qc29uJykpO1xuXG5cdFx0XHRcdGFzc2VydC5lcXVhbChuZXdQYWNrYWdlSnNvbi52ZXJzaW9uLCAndGVzdC12ZXJzaW9uJyk7XG5cdFx0XHR9KSk7XG5cdFx0fVxuXHR9LFxuXHQncmVsZWFzZS1wdWJsaXNoLWZsYXQnOiAoZnVuY3Rpb24gKCkge1xuXHRcdGxldCBydW5TdHViOiBTaW5vblN0dWI7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0YmVmb3JlRWFjaCgpIHtcblx0XHRcdFx0cnVuU3R1YiA9IHN0dWIoZ3J1bnQudGFzaywgJ3J1bicpO1xuXG5cdFx0XHRcdC8vIHNhdmUgb3VyIGFjdHVhbCBwYWNrYWdlLmpzb25cblx0XHRcdFx0Z3J1bnQuZmlsZS5jb3B5KCdwYWNrYWdlLmpzb24nLCAncGFja2FnZS5qc29uLmJhaycpO1xuXHRcdFx0fSxcblxuXHRcdFx0YWZ0ZXJFYWNoKCkge1xuXHRcdFx0XHRydW5TdHViLnJlc3RvcmUoKTtcblxuXHRcdFx0XHR0YXNrVW5sb2FkZXIoKTtcblxuXHRcdFx0XHRncnVudC5maWxlLmRlbGV0ZSgndGVtcCcpO1xuXG5cdFx0XHRcdC8vIHJlc3RvcmUgb3VyIHBhY2thZ2UuanNvblxuXHRcdFx0XHRncnVudC5maWxlLmNvcHkoJ3BhY2thZ2UuanNvbi5iYWsnLCAncGFja2FnZS5qc29uJyk7XG5cdFx0XHRcdGdydW50LmZpbGUuZGVsZXRlKCdwYWNrYWdlLmpzb24uYmFrJyk7XG5cblx0XHRcdFx0aWYgKGdydW50LmZpbGUuZXhpc3RzKCdSRUFETUUubWQuYmFrJykpIHtcblx0XHRcdFx0XHRncnVudC5maWxlLmNvcHkoJ1JFQURNRS5tZC5iYWsnLCAnUkVBRE1FLm1kJyk7XG5cdFx0XHRcdFx0Z3J1bnQuZmlsZS5kZWxldGUoJ1JFQURNRS5tZC5iYWsnKTtcblx0XHRcdFx0fVxuXHRcdFx0fSxcblxuXHRcdFx0J3J1bicoKSB7XG5cdFx0XHRcdHJ1bkdydW50VGFzaygncmVsZWFzZS1wdWJsaXNoLWZsYXQnKTtcblxuXHRcdFx0XHRhc3NlcnQuaXNUcnVlKHJ1blN0dWIuY2FsbGVkT25jZSk7XG5cdFx0XHRcdGFzc2VydC5kZWVwRXF1YWwoKDxhbnk+IHJ1blN0dWIpLmdldENhbGxzKClbIDAgXS5hcmdzWyAwIF0sIFsgJ2NvcHk6dGVtcCcsICdyZWxlYXNlLXB1Ymxpc2gnLCAnY2xlYW46dGVtcCcgXSk7XG5cblx0XHRcdFx0Y29uc3QgbmV3UGFja2FnZUpzb24gPSBncnVudC5maWxlLnJlYWRKU09OKHBhdGguam9pbigndGVtcCcsICdwYWNrYWdlLmpzb24nKSk7XG5cblx0XHRcdFx0YXNzZXJ0LmlzVW5kZWZpbmVkKG5ld1BhY2thZ2VKc29uLnByaXZhdGUpO1xuXHRcdFx0XHRhc3NlcnQuaXNVbmRlZmluZWQobmV3UGFja2FnZUpzb24uc2NyaXB0cyk7XG5cdFx0XHRcdGFzc2VydC5pc1VuZGVmaW5lZChuZXdQYWNrYWdlSnNvbi5maWxlcyk7XG5cdFx0XHRcdGFzc2VydC5pc1VuZGVmaW5lZChuZXdQYWNrYWdlSnNvbi50eXBpbmdzKTtcblx0XHRcdFx0YXNzZXJ0LmVxdWFsKG5ld1BhY2thZ2VKc29uLm1haW4sICdtYWluLmpzJyk7XG5cblx0XHRcdFx0YXNzZXJ0LmlzVHJ1ZShncnVudC5maWxlLmV4aXN0cygndGVtcC9SRUFETUUubWQnKSk7XG5cdFx0XHR9LFxuXG5cdFx0XHQncnVuIHcvbyBubyBleHRyYXMnKCkge1xuXHRcdFx0XHRncnVudC5maWxlLmNvcHkoJ1JFQURNRS5tZCcsICdSRUFETUUubWQuYmFrJyk7XG5cdFx0XHRcdGdydW50LmZpbGUuZGVsZXRlKCdSRUFETUUubWQnKTtcblxuXHRcdFx0XHRydW5HcnVudFRhc2soJ3JlbGVhc2UtcHVibGlzaC1mbGF0Jyk7XG5cblx0XHRcdFx0YXNzZXJ0LmlzRmFsc2UoZ3J1bnQuZmlsZS5leGlzdHMoJ3RlbXAvUkVBRE1FLm1kJykpO1xuXHRcdFx0fVxuXHRcdH07XG5cdH0pKCksXG5cdHJlbGVhc2U6IChmdW5jdGlvbiAoKSB7XG5cdFx0bGV0IGZhaWxTdHViOiBTaW5vblN0dWI7XG5cdFx0bGV0IHJ1blN0dWI6IFNpbm9uU3R1YjtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRiZWZvcmVFYWNoKCkge1xuXHRcdFx0XHRmYWlsU3R1YiA9IHN0dWIoZ3J1bnQuZmFpbCwgJ2ZhdGFsJykudGhyb3dzKCk7XG5cdFx0XHRcdHJ1blN0dWIgPSBzdHViKGdydW50LnRhc2ssICdydW4nKTtcblx0XHRcdH0sXG5cblx0XHRcdGFmdGVyRWFjaCgpIHtcblx0XHRcdFx0ZmFpbFN0dWIucmVzdG9yZSgpO1xuXHRcdFx0XHRydW5TdHViLnJlc3RvcmUoKTtcblxuXHRcdFx0XHR0YXNrVW5sb2FkZXIoKTtcblx0XHRcdH0sXG5cblx0XHRcdCdza2lwQ2hlY2tzIG9uIG5vbiBkcnkgcnVuJygpIHtcblx0XHRcdFx0bGV0IGNhdWdodEVycm9yOiBFcnJvciB8IG51bGwgPSBudWxsO1xuXG5cdFx0XHRcdHRhc2tMb2FkZXIodW5kZWZpbmVkLCB7XG5cdFx0XHRcdFx0J2RyeS1ydW4nOiBmYWxzZSxcblx0XHRcdFx0XHQnc2tpcC1jaGVja3MnOiB0cnVlXG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0cnVuR3J1bnRUYXNrKCdyZWxlYXNlJyk7XG5cdFx0XHRcdH0gY2F0Y2ggKGUpIHtcblx0XHRcdFx0XHRjYXVnaHRFcnJvciA9IGU7XG5cdFx0XHRcdH0gZmluYWxseSB7XG5cdFx0XHRcdFx0YXNzZXJ0LmlzTm90TnVsbChjYXVnaHRFcnJvcik7XG5cdFx0XHRcdFx0YXNzZXJ0LmlzVHJ1ZShmYWlsU3R1Yi5jYWxsZWRPbmNlKTtcblx0XHRcdFx0fVxuXHRcdFx0fSxcblxuXHRcdFx0J3J1biB3aXRoIG5vIHZlcnNpb24nKCkge1xuXHRcdFx0XHRsZXQgY2F1Z2h0RXJyb3I6IEVycm9yIHwgbnVsbCA9IG51bGw7XG5cblx0XHRcdFx0dGFza0xvYWRlcih1bmRlZmluZWQsIHt9KTtcblxuXHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdHJ1bkdydW50VGFzaygncmVsZWFzZScpO1xuXHRcdFx0XHR9IGNhdGNoIChlKSB7XG5cdFx0XHRcdFx0Y2F1Z2h0RXJyb3IgPSBlO1xuXHRcdFx0XHR9IGZpbmFsbHkge1xuXHRcdFx0XHRcdGFzc2VydC5pc05vdE51bGwoY2F1Z2h0RXJyb3IpO1xuXHRcdFx0XHRcdGFzc2VydC5pc1RydWUoZmFpbFN0dWIuY2FsbGVkT25jZSk7XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cblx0XHRcdCdydW4gdy8gcHJlcmVsZWFzZSB0YWdzJygpIHtcblx0XHRcdFx0dGFza0xvYWRlcih1bmRlZmluZWQsIHtcblx0XHRcdFx0XHQncHJlLXJlbGVhc2UtdGFnJzogJ2JldGEnXG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRcdHJ1bkdydW50VGFzaygncmVsZWFzZScpO1xuXG5cdFx0XHRcdGFzc2VydC5pc1RydWUocnVuU3R1Yi5jYWxsZWRPbmNlKTtcblx0XHRcdFx0YXNzZXJ0LmRlZXBFcXVhbCgoPGFueT4gcnVuU3R1YikuZ2V0Q2FsbHMoKVsgMCBdLmFyZ3NbIDAgXSwgW1xuXHRcdFx0XHRcdCdjYW4tcHVibGlzaC1jaGVjaycsXG5cdFx0XHRcdFx0J3JlcG8taXMtY2xlYW4tY2hlY2snLFxuXHRcdFx0XHRcdCdkaXN0Jyxcblx0XHRcdFx0XHQncmVsZWFzZS12ZXJzaW9uLXByZS1yZWxlYXNlLXRhZycsXG5cdFx0XHRcdFx0J3JlbGVhc2UtcHVibGlzaC1mbGF0Jyxcblx0XHRcdFx0XHQncG9zdC1yZWxlYXNlLXZlcnNpb24nXG5cdFx0XHRcdF0pO1xuXHRcdFx0fSxcblxuXHRcdFx0J3J1biB3LyBwcmVyZWxlYXNlIHRhZ3Mgdy8gc2tpcGNoZWNrcycoKSB7XG5cdFx0XHRcdHRhc2tMb2FkZXIodW5kZWZpbmVkLCB7XG5cdFx0XHRcdFx0J3ByZS1yZWxlYXNlLXRhZyc6ICdiZXRhJyxcblx0XHRcdFx0XHQnc2tpcC1jaGVja3MnOiB0cnVlLFxuXHRcdFx0XHRcdCdkcnktcnVuJzogdHJ1ZVxuXHRcdFx0XHR9KTtcblxuXHRcdFx0XHRydW5HcnVudFRhc2soJ3JlbGVhc2UnKTtcblxuXHRcdFx0XHRhc3NlcnQuaXNUcnVlKHJ1blN0dWIuY2FsbGVkT25jZSk7XG5cdFx0XHRcdGFzc2VydC5kZWVwRXF1YWwoKDxhbnk+IHJ1blN0dWIpLmdldENhbGxzKClbIDAgXS5hcmdzWyAwIF0sIFtcblx0XHRcdFx0XHQnZGlzdCcsXG5cdFx0XHRcdFx0J3JlbGVhc2UtdmVyc2lvbi1wcmUtcmVsZWFzZS10YWcnLFxuXHRcdFx0XHRcdCdyZWxlYXNlLXB1Ymxpc2gtZmxhdCcsXG5cdFx0XHRcdFx0J3Bvc3QtcmVsZWFzZS12ZXJzaW9uJ1xuXHRcdFx0XHRdKTtcblx0XHRcdH0sXG5cblx0XHRcdCdydW4gdy8gcmVsZWFzZSB0YWcgYW5kIHZlcnNpb24nKCkge1xuXHRcdFx0XHR0YXNrTG9hZGVyKHVuZGVmaW5lZCwge1xuXHRcdFx0XHRcdCdyZWxlYXNlLXZlcnNpb24nOiAnMS4yLjMtYWxwaGEnLFxuXHRcdFx0XHRcdCduZXh0LXZlcnNpb24nOiAnMS4yLjMnXG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRcdHJ1bkdydW50VGFzaygncmVsZWFzZScpO1xuXG5cdFx0XHRcdGFzc2VydC5pc1RydWUocnVuU3R1Yi5jYWxsZWRPbmNlKTtcblx0XHRcdFx0YXNzZXJ0LmRlZXBFcXVhbCgoPGFueT4gcnVuU3R1YikuZ2V0Q2FsbHMoKVsgMCBdLmFyZ3NbIDAgXSwgW1xuXHRcdFx0XHRcdCdjYW4tcHVibGlzaC1jaGVjaycsXG5cdFx0XHRcdFx0J3JlcG8taXMtY2xlYW4tY2hlY2snLFxuXHRcdFx0XHRcdCdkaXN0Jyxcblx0XHRcdFx0XHQncmVsZWFzZS12ZXJzaW9uLXNwZWNpZmljJyxcblx0XHRcdFx0XHQncmVsZWFzZS1wdWJsaXNoLWZsYXQnLFxuXHRcdFx0XHRcdCdwb3N0LXJlbGVhc2UtdmVyc2lvbidcblx0XHRcdFx0XSk7XG5cdFx0XHR9XG5cdFx0fTtcblx0fSkoKVxufSk7XG4iXX0=