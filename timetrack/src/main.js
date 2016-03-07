// $=jQuery = require('jquery');

var React = require('react');
var Router = require('react-router');
var ReactDOM = require('react-dom');

var routes = require('./routes');

 var user_id = $("#user_id").val();
 var username = $('#username').val();
Router.run(routes,function(Handler,state){
ReactDOM.render(<Handler {...state} name ={username} id={user_id} pollInterval={20000}/> , document.getElementById('app'));
});


