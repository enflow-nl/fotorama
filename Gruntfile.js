module.exports = function (grunt) {
    'use strict';
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        meta: {
            banner: '/*!\n * <%= pkg.name %> <%= pkg.version %> | http://fotorama.io/license/\n */\n',
            bannerJs: '<%= meta.banner %>fotoramaVersion = \'<%= pkg.version %>\';\n',
            sass: ['src/scss/*'],
            js: [
                'src/js/intro.js',
                'src/js/css-classes.js',
                'src/js/skip.js',
                'src/js/_.js',
                'src/js/modernizr.js',
                'src/js/fullscreen.js',
                'src/js/spin.js',
                'src/js/bez.js',
                'src/js/basevars.js',
                'src/js/utils.js',
                'src/js/animate.js',
                'src/js/touch.js',
                'src/js/moveontouch.js',
                'src/js/wheel.js',
                'src/js/fotorama.js',
                'src/js/fn-fotorama.js',
                'src/js/instances.js',
                'src/js/cache.js',
                'src/js/measures.js',
                'src/templates/compiled.js',
                'src/js/auto-initialization.js',
                'src/js/outro.js'
            ]
        },
        jst: {
            compile: {
                options: {
                    namespace: '$.Fotorama.jst',
                    processName: function (filename) {
                        return filename.replace('src/templates/', '').replace(/\.jst$/, '').replace(/\//g, '_');
                    },
                    templateSettings: {
                        variable: 'v'
                    }
                },
                files: {
                    'src/templates/compiled.js': ['src/templates/*.jst']
                }
            }
        },
        watch: {
            options: {
                atBegin: true
            },
            jst: {
                files: 'src/templates/*.jst',
                tasks: ['jst', 'replace:jst']
            },
            sass: {
                files: '<%= meta.sass %>',
                tasks: ['sass', 'autoprefixer']
            },
            js: {
                files: '<%= meta.js %>',
                tasks: 'concat:js'
            },
            i: {
                files: 'src/i/*',
                tasks: 'copy:i'
            },
            test: {
                files: ['test/**/*', '!test/index.html', '!test/*/index.html', '!test/*/*/index.html', '!test/*/*/*/index.html'],
                tasks: 'shell:indexes'
            }
        },
        sass: {
            mixdown: {
                options: {},
                files: {
                    'dist/fotorama.css': 'src/scss/fotorama.scss'
                }
            }
        },
        autoprefixer: {
            mixdown: {
                options: {
                    browsers: ['last 2 version', 'ie 8', 'ie 7']
                },
                files: {
                    'dist/fotorama.css': 'dist/fotorama.css'
                }
            }
        },
        copy: {
            i: {
                files: [
                    {
                        expand: true,
                        flatten: true,
                        src: ['src/i/*.png'],
                        dest: 'dist/'
                    }
                ]
            },
            example: {
                files: [
                    {
                        src: 'src/example/example.html',
                        dest: 'dist/example.html'
                    }
                ]
            },
            bower: {
                files: [
                    {
                        src: 'dist/fotorama.css',
                        dest: '.fotorama-bower/fotorama.css'
                    },
                    {
                        src: 'dist/fotorama.png',
                        dest: '.fotorama-bower/fotorama.png'
                    },
                    {
                        src: 'dist/fotorama@2x.png',
                        dest: '.fotorama-bower/fotorama@2x.png'
                    },
                    {
                        src: 'dist/fotorama.js',
                        dest: '.fotorama-bower/fotorama.js'
                    },
                    {
                        src: 'dist/example.html',
                        dest: '.fotorama-bower/example.html'
                    }
                ]
            },
            npm: {
                files: [
                    {
                        src: 'dist/fotorama.css',
                        dest: '.fotorama-npm/fotorama.css'
                    },
                    {
                        src: 'dist/fotorama.png',
                        dest: '.fotorama-npm/fotorama.png'
                    },
                    {
                        src: 'dist/fotorama@2x.png',
                        dest: '.fotorama-npm/fotorama@2x.png'
                    },
                    {
                        src: 'dist/fotorama.js',
                        dest: '.fotorama-npm/fotorama.js'
                    }
                ]
            }
        },
        concat: {
            js: {
                files: {
                    'dist/fotorama.js': '<%= meta.js %>'
                },
                options: {
                    banner: '<%= meta.bannerJs %>'
                }
            },
            css: {
                files: {
                    'dist/fotorama.dev.css': 'dist/fotorama.css'
                },
                options: {
                    banner: '<%= meta.banner %>'
                }
            }
        },
        cssmin: {
            min: {
                files: {
                    'dist/fotorama.css': 'dist/fotorama.css'
                },
                options: {
                    banner: '<%= meta.banner.replace(/\\n$/, "") %>',
                    report: 'gzip',
                    compatibility: 'ie7'
                }
            }
        },
        replace: {
            jst: {
                files: {
                    'src/templates/compiled.js': 'src/templates/compiled.js'
                },
                options: {
                    patterns: [
                        {
                            match: /this\[\"(\$)\"\]/g,
                            replacement: "$"
                        },
                        {
                            match: /\[\"([a-z]+)\"\]/gi,
                            replacement: ".$1"
                        }
                    ]
                }
            },
            console: {
                files: {
                    'dist/fotorama.dev.js': 'dist/fotorama.js'
                },
                options: {
                    patterns: [
                        {
                            match: /(console\.)/g,
                            replacement: "//$1"
                        }
                    ]
                }
            },
            version: {
                files: {
                    'fotorama.jquery.json': 'fotorama.jquery.json',
                    '.fotorama-npm/package.json': '.fotorama-npm/package.json'
                },
                options: {
                    patterns: [
                        {
                            match: /(\.?\d+){3,4}/g,
                            replacement: '<%= pkg.version %>'
                        }
                    ]
                }
            }
        },
        uglify: {
            min: {
                options: {
                    banner: '<%= meta.banner %>',
                    report: 'gzip'
                },
                files: {
                    'dist/fotorama.js': 'dist/fotorama.dev.js'
                }
            }
        },

        shell: {
            options: {
                stdout: true,
                stderr: true,
                failOnError: true
            },
            indexes: {
                command: './test/index.sh'
            },
            commit: {
                command: 'git commit fotorama.jquery.json -m \'Tagging the <%= pkg.version %> release\''
            },
            push: {
                command: 'git push --tags --progress origin master:master'
            },
            npm: {
                command: 'cd .fotorama-npm ' +
                    '&& npm publish'
            }
        },

        jasmine: grunt.file.readJSON('test/specs/_specs.json')
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-jst');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-replace');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-compress');

    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-shell');

    var defaultTask = 'copy:i sass autoprefixer jst replace:jst concat:js replace:console concat:css uglify cssmin jasmine clean copy:example compress';

// Compile
    grunt.registerTask('default', defaultTask.split(' '));

// Publish, will fail without secret details ;-)
    grunt.registerTask('publish', (defaultTask + ' replace:version copy:npm shell:commit shell:push shell:npm').split(' '));
};
