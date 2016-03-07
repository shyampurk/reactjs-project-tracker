"use strict";

var React = require('react');
var Link = require('react-router').Link;
var NotFoundPage = React.createClass({
			render:function(){
				return (<div className="container-fluid">
						<p>page not found</p>
						<p><Link to="app" className="btn btnlg btn-default">back to home page</Link></p>
					</div>
				);
			}

});
module.exports = NotFoundPage;