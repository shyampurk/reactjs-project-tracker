"use strict";
var gulp = require('gulp');
var connect = require('gulp-connect');
var open = require('gulp-open');
var browserify = require('browserify');
var reactify = require('reactify');
var source = require('vinyl-source-stream');
var concat = require('gulp-concat');


var config={
	port:9007,
	devBaseUrl:'http://localhost',
	paths:{
	html:'./timetrack/src/*.html',
	js:'./timetrack/src/**/*.js',
	 css :[
	 	'node_modules/bootstrap/dist/css/bootstrap.min.css',
			'node_modules/bootstrap/dist/css/bootstrap-theme.min.css'
	 ],
	dist:'./timetrack/dist',
	mainJs:'./timetrack/src/main.js'
		}
}

gulp.task('html',function(){
	gulp.src(config.paths.html)
	.pipe(gulp.dest(config.paths.dist))
	.pipe(connect.reload());
});

gulp.task('js', function(){
	browserify(config.paths.mainJs)
	.transform(reactify)
	.bundle()
	.on('error',console.error.bind(console))
	.pipe(source('bundle.js'))
	.pipe(gulp.dest(config.paths.dist + '/scripts'))
	.pipe(connect.reload());
});

gulp.task('css', function(){
	 gulp.src(config.paths.css)
	.pipe(concat('bundle.css'))
	.pipe(gulp.dest(config.paths.dist + '/css'));
});

gulp.task('watch',function(){
	gulp.watch(config.paths.html,['html']);
	gulp.watch(config.paths.js,['js']);
});

gulp.task('default',['html','js','css','watch']);
