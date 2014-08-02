gulp = require 'gulp'
coffeeify = require 'coffeeify'
browserify = require 'browserify'
source = require 'vinyl-source-stream'

errHandler = (err) ->
    console.log err.stack or err
    @end()

gulp.task 'build', ->
    browserify './src/main.coffee'
        .bundle()
        .pipe source 'main.js'
        .pipe gulp.dest './build/'

gulp.task 'watch', ['default'], ->
    gulp
        .watch './src/*.coffee', ['build']
        .on 'error', errHandler

gulp.task 'default', ['build']
