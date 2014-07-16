gulp = require 'gulp'
coffeeify = require 'coffeeify'
browserify = require 'browserify'
source = require 'vinyl-source-stream'

gulp.task 'build', ->
    browserify './src/main.coffee'
        .bundle()
        .pipe source 'main.js'
        .pipe gulp.dest './build/'

gulp.task 'default', ['build']
