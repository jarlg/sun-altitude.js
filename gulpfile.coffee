gulp = require 'gulp'
coffeeify = require 'coffeeify'
browserify = require 'browserify'
source = require 'vinyl-source-stream'

gulp.task 'build', ->
    browserify './src/sun-altitude.coffee'
        .bundle()
        .pipe source 'sun-altitude.js'
        .pipe gulp.dest './build/'

gulp.task 'default', ['build']
