"use strict";
var React = require('react');
var Router = require('react-router');
var ReactDOM = require('react-dom');
	
var Link = Router.Link;

var Upper = React.createClass({
	
		render:function(){
			return (
				<div className="container">
					<div className="row">
					    <div className="col-lg-6 "><h4><Link to='app'>React.js Project Tracker</Link>
					    </h4></div>
					    <div className="col-lg-6 ">
					      <div className="pull-right">
					        <h5>Logged In as {this.props.name} </h5>
					        <a href="/">logout</a>
					      </div>
					    </div>
					</div>
				</div>
				
				);
		}
});



var ProjectForm = React.createClass({
	
	handleSubmit:function(e){
		var Owner=this.props.name;
		var userid = this.props.id;
		e.preventDefault(e)
		var selectBoxObj = ReactDOM.findDOMNode(this.refs.selectbox);
		var values = $(selectBoxObj).val();
		var ProjectName = this.refs.projectName.value.trim();
		var time = new Date().getTime();
		var date = new Date(time);
		var datestring = date.toString();
		if(!values || !ProjectName){
			return;
		}
		this.props.onProjectSubmit({userId:userid, owner:Owner,projectName:ProjectName, projectcollaborators:values,createdTime:datestring,updatedTime:datestring});
          this.refs.projectName.value='';
          this.refs.selectbox.value='';
          return;		
	},
		render:function(){
			var panelHeight={
				minHeight:300
			};
			var collaborators = this.props.collaborators;
			 var rows = [];
    			for (var key in collaborators) {
    				if(key!==this.props.name)
        			rows.push(<option key= {collaborators[key]} value={collaborators[key]}>{key}</option>);
    				} ;
    		
		return (
				<div className="col-lg-6 " style={{padding: 30 + 'px'}}>
				<div className="panel panel-default"  >
						<div className="panel-heading"><h4>Add New Projects</h4>
						</div>
						<div className="panel-body" style={panelHeight}>
						<form role="form" className="form-horizontal" onSubmit={this.handleSubmit}>
						    <div className="form-group">
						      <label className="col-sm-3" >Project Name</label>
						      <div className="col-sm-9"><input type="text" className="form-control" ref="projectName" placeholder="Project Name" /></div>
						    </div>					   
							    <div className="form-group">
							      <label className="col-sm-4">Project Collaborators</label>
							      <div className="col-sm-8">
							      <select multiple={true} className="form-control" ref="selectbox">
										{rows}
								  </select>
								  </div>
							    </div>
							    <div style={{height: 70 + 'px'}} ></div>

							    <div className="form-group">
							      <div className="col-sm-6">
							        <button type="submit" className="btn btn-info btn-block pull-right" value="post" >Add</button>
							      </div>
							      <div className="col-sm-6">
							        <button type="reset" className="btn btn-warning btn-block pull-left">Reset</button>
							      </div>
							    </div>
							  </form>
						</div>
					
				</div>
				</div>	
			);
	}
});

var Listproject = React.createClass({

		render:function(){			
				var panelHeig={
   				 'minHeight': 300,
    			'overflowY': scroll
			};
			var data = this.props.data.reverse();
			var projectNodes = data.map(function(project,index){
				return (
						<div key ={index}>
						<li className="list-group-item" >
		        			<p className="pull-right">owner:{project.owner}</p>
		        			<Link to='projecttime' params={{projectName:project.projectName,pid:project._id,uid:project.userId}}>{project.projectName}</Link><br />
		        		<small>last updated<cite>{project.updatedTime}</cite></small>
						</li>
						</div>
					);
			});
			
		return (
					<div className="col-lg-6" style={{padding: 30 + 'px'}}>
					<div className="panel panel-default">
						<div className="panel-heading"><h4>Active Projects</h4>
						</div>
							<div className="panel-body" style={panelHeig}>
								<ul className="list-group" >  
							    		{projectNodes}		        
							     </ul>
							</div>
					</div>
					</div>
		);
	}

});


var Main = React.createClass({
	loadusersFromServer: function() {
    $.ajax({
      url: 'http://localhost:8080/api/usersList',
      dataType: 'json',
      cache: false,
      success: function(collaborators) 
      {
        this.setState({collaborators: collaborators});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.url, status, err.toString());
      }.bind(this)
    });
  },

	loadCommentsFromServer: function() {
    $.ajax({
      url: "http://localhost:8080/api/get-my-project1?id="+this.props.id,
      dataType: 'json',
      cache: false,
      success: function(data) 
      {
          this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  handleProjectSubmit: function(comment) {
    var comments = this.state.data;
      var newComments = comments.concat([comment]);
    $.ajax({
      url: "http://localhost:8080/api/create-project",
      dataType: 'json',
      type: 'POST',
      data: comment,
      success: function(data) 
      {
      	  var newproj = comments.concat([data]);
          this.setState({data: newproj});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  getInitialState: function() {
    return {data: [],collaborators:[]};
  },
  componentDidMount: function() {
  	this.loadusersFromServer();
    setInterval(this.loadusersServer);
    this.loadCommentsFromServer();
    setInterval(this.loadCommentsFromServer,this.props.pollInterval);
  },

	render:function(){
		var jumboHeight={
						height: 555
			};
		return ( <div className="clearfix">
				<Upper name ={this.props.name}/>
					<div className="jumbotron" >
						<div className="row">
								<ProjectForm onProjectSubmit = {this.handleProjectSubmit} name ={this.props.name} id={this.props.id} collaborators={this.state.collaborators}/>
								<Listproject data={this.state.data} />
						</div>
					</div>
				</div>
			);
	}
});

module.exports =Main;
