$=jQuery = require('jquery');

var React = require('react');
var RouteHandler  = require('react-router').RouteHandler;

var App = React.createClass({
			render:function(){
				 var props = this.props;
				return (
					<div>
						<RouteHandler {...props}/>
					</div>
					);
			}

});

module.exports =App;