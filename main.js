$=jQuery = require('jquery');

var React = require('react');

var Main = require('./components/homePage');
var ProjectTime = require('./components/projecttime/projectPage');


var App = React.createClass({
			render:function(){
				var Child;
				switch(this.props.route){
					case 'projecttime': Child =ProjectTime; break;
					default: Child=Main;
				}
				return (
					<div>
						<Child name ={this.props.name} id={this.props.id} pollInterval={20000}/>
					</div>
					);
			}

});
 var user_id = $("#user_id").val();
 var username = $('#username').val();
function render(){
	var route= window.location.hash.substr(1);
	React.render(<App name ={username} id={user_id} route={route}/>, document.getElementById('app'));
}

window.addEventListener('hashchange', render);
render();