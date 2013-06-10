module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        //uglify
        uglify: {
            options: {
                banner: '/**\n' +
                    '    Library: <%= pkg.name %>\n' +
                    '    Version: <%= pkg.version %>\n' +
                    '    GitHub: https://github.com/benqus/DOMRouter\n' +
                    '    License: MIT\n' +
                    '    Last build: <%= grunt.template.today("yyyy-mm-dd") %>\n' +
                    '*/\n'
            },
            build: {
                src: 'js/<%= pkg.name %>.js',
                dest: 'build/<%= pkg.name %>-<%= pkg.version %>.min.js'
            }
        },

        //jshint
        jshint: {
            files: ['js/DOMRouter.js'],
            options: {
                globals: {
                    console: true,
                    window: true
                }
            }
        },

        //qunit
        qunit: {
            files: ['test/unit-test.html']
        },

        //watch
        watch: {
            files: ['js/**/*.js'],
            tasks: ['qunit']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('default', ['watch']);
    grunt.registerTask('ut', ['jshint', 'qunit']);
    grunt.registerTask('release', ['qunit', 'jshint', 'uglify']);
};