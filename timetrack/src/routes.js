"use strict";

var React = require("react");
var Router = require('react-router');
var DefaultRoute = Router.DefaultRoute;
var Route = Router.Route;
var NotFoundRoute = Router.NotFoundRoute;
var Redirect = Router.Redirect;

var routes = (
	<Route name="app" path="/" handler={require('./components/app')}>
	<Route name="projecttime" path="/project/:projectName/:pid/:uid" handler={require('./components/projecttime/projectPage')} />
	<DefaultRoute  handler={require('./components/homePage')} />
	<NotFoundRoute handler={require('./components/notFoundPage')} />
	</Route>
	);

module.exports = routes; 