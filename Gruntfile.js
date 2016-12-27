'use strict';

module.exports = function (grunt) {

	// Project configuration.
	grunt.initConfig({
		ts: {
			app: {
				files: [{
					src: ['src/**/*.ts', '!src/.baseDir.ts'],
					dest: 'build'
				}],
				options: {
					module: "commonjs",
					noLib: false,
					target: "es6",
					sourceMap: true
				}
			}
		},
		tslint: {
			src: {
				options: {
					configuration: "tslint.json"
				},
				files: {
					src: [
						"src/**/*.ts"
					]
				}
			},

		},

		jshint: {
			options: {
				jshintrc: '.jshintrc'
			},
			gruntfile: {
				src: 'Gruntfile.js'
			},
			src: {
				src: ['src/**/*.*']
			},

		},
		watch: {
			gruntfile: {
				files: '<%= jshint.gruntfile.src %>',
				tasks: ['jshint:gruntfile']
			},
			src: {
				files: ['<%= jshint.src.src %>'],
				tasks: ['ts', 'copy', 'clean:ts', 'tslint:src']
			},


		},
		copy: {
			source: {
				files: [{
					expand: true,
					cwd: 'src/',
					src: ['**', '!src/**/*.ts', '!**/#*'],
					dest: 'build/'
				}]
			},


		},
		clean: {
			build: ['build/**'],
			ts: ['build/**/*.ts']
		},


	});

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-contrib-nodeunit');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks("grunt-ts");
	grunt.loadNpmTasks("grunt-tslint");
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-clean');


	// Default task.
	grunt.registerTask('default', ['clean:build', 'ts', 'copy:source', 'clean:ts', 'tslint']);
	grunt.registerTask('default-watch', ['default', 'watch:src']);
	grunt.registerTask('default-watch-no-wait', ['watch:src']);
};
