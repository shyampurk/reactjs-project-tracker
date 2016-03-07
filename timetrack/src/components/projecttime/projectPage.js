"use strict";

var React = require('react');
var Modal = require('react-bootstrap').Modal;
var Button = require('react-bootstrap').Button;
var Router = require('react-router');
var ReactDOM = require('react-dom');
var Link = Router.Link;

var Upper = React.createClass({
		render:function(){
			return (
				<div className="container">
					<div className="row">
					    <div className="col-lg-6 "><h4><Link to='app'>React.js Project Tracker</Link></h4></div>
					    <div className="col-lg-6 ">
					      <div className="pull-right">
					        <h5>Logged In as {this.props.name}</h5>
					        <a href="/logout">logout</a>
					      </div>
					    </div>
					</div>
				</div>

				);
		}
});



var ProjectSummary = React.createClass({
	 contextTypes: {
		    router: React.PropTypes.func
		  },
	closeSubmit:function(){
		var pId = this.props.params.pid;
		$.ajax({
			url:"http://localhost:8080/api/delete-project?id="+pId,
			type: 'DELETE',
			cache:false,
			 success: function(dat)
		      {
		      	  if(dat === 1)
		      		this.context.router.transitionTo('/');
		      }.bind(this),
			      error: function(xhr, status, err) {
			        console.error(this.props.url, status, err.toString());
			      }.bind(this)
		});
	},
	handleCollabSubmit:function(e){
		this.setState({ popup: false});
		e.preventDefault(e)
		var selectBoxObj = ReactDOM.findDOMNode(this.refs.addselectbox);
		var values = $(selectBoxObj).val();
	    if(!values){
			return;
		}
		this.handleCollabAddSubmit({projectcollaborators:values});
          return;
    },
    handleCollabAddSubmit : function(data){
		    var pId= this.props.params.pid;
		$.ajax({
			url:"http://localhost:8080/api/collab-update1?id="+pId,
			type: 'PUT',
			data:data,
			cache:false,
			 success: function(data)
		      {
		      		alert("collaborators added");
		      }.bind(this),
			      error: function(xhr, status, err) {
			        console.error(this.props.url, status, err.toString());
			      }.bind(this)
		});
	},
	handleCollabDelete:function(e){
		alert('collbDelete');
		this.setState({ popup: false});
		e.preventDefault(e)
		var delSelectBoxObj = ReactDOM.findDOMNode(this.refs.delselectbox);
		var delValues = $(delSelectBoxObj).val();
	    if(!delValues){
			return;
		}
		this.handleCollabDelSubmit({projectcollaborators:delValues});
          return;
	},
	handleCollabDelSubmit : function(data){
		    var pId= this.props.params.pid;
		$.ajax({
			url:"http://localhost:8080/api/collab-delete?id="+pId,
			type: 'PUT',
			data:data,
			cache:false,
			 success: function(data)
		      {
		      		alert("collaborators deleted");
		      		 this.forceUpdate();

		      }.bind(this),
			      error: function(xhr, status, err) {
			        console.error(this.props.url, status, err.toString());
			      }.bind(this)
		});
	},

	handleSubmit:function(){
		this.setState({ showModal: false });
		var uId = this.props.ownerid;
		var pId= this.props.params.pid;
		var owner = this.props.owner;
		var TaskName = this.refs.taskName.value.trim(),
		Description = this.refs.taskDesc.value.trim(),
		FromTime = this.refs.fromtime.value.trim(),
		ToTime = this.refs.totime.value.trim();
		if(!FromTime || !TaskName || !ToTime){
			return;
		}
				this.props.onTaskSubmit({uId:uId,pId:pId,taskOwner:owner,taskName:TaskName,description: Description, fromTime:FromTime,toTime:ToTime});
          this.refs.taskName.value='';
          this.refs.taskDesc.value='';
          return;
	},

	getInitialState() {
    return { showModal: false };
  },

  close() {
    this.setState({ showModal: false });
  },

  open() {
    this.setState({ showModal: true });
  },
  openPopUp(){
  	this.setState({ popup :true});
  },
  closePopUp(){
  	this.setState({ popup: false});
  },
		render:function(){
			var collaborators = this.props.collaborators;
			var collabarray =[];
			 collabarray = this.props.collab.projectcollaborators;
			 var rows = [];
			 var delcollab =[];
			 var collablist=[];

    			for (var key in collaborators) {
    				if(key!==this.props.owner && (collabarray.indexOf(collaborators[key])) === -1)
        			rows.push(<option key= {collaborators[key]} value={collaborators[key]}>{key}</option>);
        			else if(key!== this.props.owner && (collabarray.indexOf(collaborators[key])) > -1){
        				delcollab.push(<option key= {collaborators[key]} value={collaborators[key]}>{key}</option>);
								collablist.push(key);
							}
    				} ;
 					var collabop = collablist.join(",");
							if(this.props.collab.owner === this.props.owner)
							 		var disabled = false;
							 	else
							 		var disabled = true;
		 	if(this.props.data1 !=''){
		 	var updatedtime = this.props.data1;
		 	var lastele = updatedtime[updatedtime.length-1];
		 	var utime = lastele.updatedTime;
			var arr = this.props.data1;
			var daysarr=[],
			hours=[],
			mins =[];
			 arr.forEach(function(result,index){
				 var date1 = new Date(result.fromTime);
				 var date2 = new Date(result.toTime);
				 var diff = (date2 - date1)/1000;
    			var diff = Math.abs(Math.floor(diff));
    			var days = Math.floor(diff/(24*60*60));
    			var leftSec = diff - days * 24*60*60;
    			var hrs = Math.floor(leftSec/(60*60));
    			var leftSec = leftSec - hrs * 60*60;
					var min = Math.floor(leftSec/(60));
    			var leftSec = leftSec - min * 60;
					daysarr.push(days);
					hours.push(hrs);
					mins.push(min);
			 });
			 var Totaldays = daysarr.reduce(function(a,b){return a+b;},0);
			 var Totalhours = hours.reduce(function(a,b){return a+b;},0);
			 var Totalmins = mins.reduce(function(a,b){return a+b;},0);
		 	}
		 	if(!utime){
		 		var utime = "";
		 	}


		return (
					<div className="col-lg-12" style={{padding: 30 + 'px'}}>
					<div className="panel panel-default">
						<div className="panel-heading">
			                <h3 className="panel-title">{this.props.params.projectName}</h3>
			            </div>
							<div className="panel-body" >
								<div className="well ">
									<div className="row">
									<p className="pull-right">ProjectCreated By:{this.props.collab.owner}</p>
									</div>
									<div className="row">
									<p className="pull-right">OtherCollaborators:({collabop})</p>
									</div>
									<div className="row">
											<div className="col-lg-6">
											<h3>Total time:{Totaldays}Days.{Totalhours}hours . {Totalmins}mins</h3>
											</div>
									<div className="col-lg-6 ">
											<div className="col-lg-8">
											<h3 className="pull-right">Last Updated:</h3>
											</div>
											<div className="col-lg-4">
											<h5>{utime}</h5>
											</div>
									</div>
									</div>
										<div className="row">
											<div className="col-lg-6">
												<button type="button" className="btn btn-default"  onClick={this.open}>Add Time</button>

											</div>
											<div className="col-lg-6 pull-right">
												<div className="col-lg-8 ">
												<button type="button" className="btn btn-default pull-right" onClick={this.openPopUp}  disabled={disabled}>Add Remove Collaborators</button>
												</div>
												<div className="col-lg-4 ">
												<button type="button" className="btn btn-default pull-right"  onClick={this.closeSubmit	} disabled={disabled}>Close Project</button>
												</div>
											</div>
										</div>
									</div>
								</div>

					</div>
					<Modal show={this.state.popup} onHide={this.closePopUp}>
				          <Modal.Header closeButton>
				            <Modal.Title>Add or remove collaborators for {this.props.params.projectName}</Modal.Title>
				          </Modal.Header>
				          <Modal.Body>
				         <form role="form" className="form-horizontal">
						    <div className="form-group">
							      <label className="col-sm-2">Select Collaborators to add</label>
							      <div className="col-sm-4">
							      <select multiple={true} className="form-control" ref="addselectbox">
										{rows}
								  </select>
								  </div>
								   <label className="col-sm-2">Select Collaborators to delete</label>
							      <div className="col-sm-4">
							      <select multiple={true} className="form-control" ref="delselectbox">
										{delcollab}
								  </select>
								  </div>
							    </div>
							  </form>
					          </Modal.Body>
					          <Modal.Footer>
					          <Button type="submit" className="btn btn-success pull-left" onClick={this.handleCollabSubmit}>Add collab</Button>
					          <Button type="submit" className="btn btn-success pull-left" onClick={this.handleCollabDelete}>Delete collab</Button>
					            <Button onClick={this.closePopUp}>Cancel</Button>
					          </Modal.Footer>

					        </Modal>
					 <Modal show={this.state.showModal} onHide={this.close}>
				          <Modal.Header closeButton>
				            <Modal.Title>Add Time for {this.props.params.projectName}</Modal.Title>
				          </Modal.Header>
				          <Modal.Body>
				         <form role="form" className="form-horizontal">
						    <div className="form-group">
						      <label className="col-sm-3" >Task Name</label>
						      <div className="col-sm-9"><input type="text" className="form-control" ref="taskName" placeholder="Task Name" /></div>
						    </div>

							    <div style={{height: 70 + 'px'}} >
							    <label className="col-sm-3" >Task Description</label>
						      <div className="col-sm-9"><textarea  className="form-control" ref="taskDesc" placeholder="Description" /></div>
							    </div>

							    <div className="form-group">
							      <div className="col-sm-6">
							      <label className="col-sm-3" >From-Time</label>
							        <input type="datetime-local" className="form-control" ref="fromtime"  />
							      </div>
							      <div className="col-sm-6">
							      <label className="col-sm-3" >To-Time</label>
							       <input type="datetime-local" className="form-control" ref="totime"  />
							      </div>
							    </div>
							  </form>
					          </Modal.Body>
					          <Modal.Footer>
					          <Button type="submit" className="btn btn-success pull-left" onClick={this.handleSubmit}>Submit</Button>
					            <Button onClick={this.close}>Cancel</Button>
					          </Modal.Footer>
					        </Modal>
					</div>
		);
		 	}


});




var ProjectLog = React.createClass({
	handleEditSubmit:function(){
		this.setState({ showModal: false });
		var tId = this.state.editdata._id;
		var uId = this.props.ownerid;
		var pId= this.props.params.pid;
		var TaskName = this.refs.taskName.value.trim(),
		Description = this.refs.taskDesc.value.trim(),
		FromTime = this.refs.fromtime.value.trim(),
		ToTime = this.refs.totime.value.trim();
		if(!FromTime || !TaskName || !ToTime){
			return;
		}
		this.handleTaskEditSubmit({_id:tId,taskName:TaskName,description: Description, fromTime:FromTime,toTime:ToTime});
          this.refs.taskName.value='';
          this.refs.taskDesc.value='';
          return;
	},
	handleTaskEditSubmit : function(editdata){
		var Tasks = this.props.data1;
		var taskid = editdata._id;
		$.ajax({
			url:"http://localhost:8080/api/task-update?id="+taskid,
			type: 'PUT',
			data:editdata,
			cache:false,
			 success: function(data)
		      {
		   //    		var index= this.state.index;
					// var data1 = Tasks.splice(index,1)[0];
					var newTasks = Tasks.concat([data]);
				     this.setState({data1: newTasks});

		      }.bind(this),
			      error: function(xhr, status, err) {
			        console.error(this.props.url, status, err.toString());
			      }.bind(this)

		});
	},

	onClick: function(tasks,index) {
		// console.log(this.props.data1,"from props");
		// console.log(this.props.data1.splice(index,1),"afterdeleting");
		 var tid= tasks._id;
		$.ajax({
			url:"http://localhost:8080/api/delete-task?id="+tid,
			type: 'DELETE',
			cache:false,
			 success: function(dat)
		      {
		      	 if(dat === 1)
		      	 	var data1 =this.props.data1.splice(index,1);
		     		this.setState({data1: data1 });

		      }.bind(this),
			      error: function(xhr, status, err) {
			        console.error(this.props.url, status, err.toString());
			      }.bind(this)

		});
	},
			getInitialState() {
		    return { showModal: false,editdata:[] };
		  },

		  close:function() {
		    this.setState({ showModal: false });
		  },

			  open(tasks,index) {
					var fromDate = tasks.fromTime.replace('Z','');
						var toDate = tasks.toTime.replace('Z','');
					// console.log(fromDate);
			     this.setState({ showModal: true ,editdata:tasks, index:index,from:fromDate,to:toDate});
			  },
		render:function(){
			var date = this.state.editdata.fromTime;
			// console.log(date,"wow");
			  //  var date1 = date.toISOString().replace('Z', '');
				var date1="";
			 var data1 = this.props.data1.reverse();
			var logNodes = data1.map(function(tasks, index){
												if(tasks.taskOwner === this.props.owner){
													var disabled = false;
												}
												else{
													var disabled = true;
												}
				return  (
					<div className="well" key ={index}>
						<div className="row" >
						<div className="col-lg-4">
							<h4>Task Name:{tasks.taskName}</h4>
						</div>

						</div>
					<div className="row">
						<div className="col-lg-4">
						<h5>Task:Description:{tasks.description}</h5>
						</div>
						<div className="col-lg-3 pull-right">
						<h4>Task owner:{tasks.taskOwner}</h4>
						</div>
					</div>
					<div className="row">
						<div className="col-lg-3">
						<small >From:{tasks.fromTime}</small>
						</div>
						<div className="col-lg-3 pull-left">
						<small>To:{tasks.toTime}</small>
						</div>
						<div className="col-lg-3 pull-left">
						<small >Last Updated:{tasks.updatedTime}</small>
						</div>
						<div className="col-lg-3 pull-right">
						<span className="pull-right">
						<button type="submit" className="btn btn-default" onClick={this.onClick.bind(this, tasks,index)} disabled={disabled}>Remove</button>
						</span>
						<span className="pull-right">
						<button type="button" className="btn btn-default"  onClick={this.open.bind(this, tasks,index)} disabled={disabled}>Edit</button>
						</span>
						</div>
					</div>
					<Modal show={this.state.showModal}  onHide={this.close}>
				          <Modal.Header closeButton>
				            <Modal.Title>Edit data for this task </Modal.Title>
				          </Modal.Header>
				          <Modal.Body>
				         <form role="form" className="form-horizontal">
						    <div className="form-group">
						      <label className="col-sm-3" >task name</label>
						      <div className="col-sm-9"><input type="text" className="form-control" ref="taskName" placeholder="Task Name" defaultValue={this.state.editdata.taskName}/></div>
						    </div>

							    <div style={{height: 70 + 'px'}} >
							    <label className="col-sm-3" >Task Description</label>
						      <div className="col-sm-9"><textarea  className="form-control" ref="taskDesc" placeholder="Description" defaultValue={this.state.editdata.description}/></div>
							    </div>

							    <div className="form-group">
							      <div className="col-sm-6">
							      <label className="col-sm-3" >From-Time</label>
							        <input type="datetime-local" className="form-control" ref="fromtime" defaultValue={this.state.from} />
							      </div>
							      <div className="col-sm-6">
							      <label className="col-sm-3" >To-Time</label>
							       <input type="datetime-local" className="form-control" ref="totime" defaultValue={this.state.to} />
							      </div>
							    </div>
							  </form>
					          </Modal.Body>
					          <Modal.Footer>
					          <Button type="submit" className="btn btn-success pull-left"onClick={this.handleEditSubmit} >Submit</Button>
					            <Button onClick={this.close}>Cancel</Button>
					          </Modal.Footer>
					        </Modal>
					</div>
					);
			}.bind(this));
			return (<div>
						{logNodes}

					</div>
				);
		}
});

var ProjectTime = React.createClass({
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

	loadCollabFromServer:function(){
		$.ajax({
			url:"http://localhost:8080/api/get-projcollab?id="+this.props.params.pid,
			dataType:'json',
			cache:false,
			success:function(data)
			{
				this.setState({ detail:data});

			}.bind(this),
			error:function(xhr, status, err){
				console.error(this.props.url, status,err.toString());
			}.bind(this)
		});
	},

loadTasksFromServer: function() {
	// var url ="http://localhost:8080/api/get-task?id="+this.props.params.pid+"&uid="+this.props.id"
    $.ajax({
      url: "http://localhost:8080/api/get-taskp?id="+this.props.params.pid,
      dataType: 'json',
      cache: false,
      success: function(data1)
      {
      	this.setState({data1: data1 });
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  handleTaskSubmit: function(data1) {
    var Tasks = this.state.data1;
      var newTasks = Tasks.concat([data1]);
     this.setState({data1: newTasks});
    $.ajax({
      url: "http://localhost:8080/api/project-task",
      dataType: 'json',
      type: 'POST',
      data: data1,
      success: function(data1)
      {
      	var newtask = Tasks.concat([data1]);
          this.setState({data1: newtask});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  getInitialState: function() {
    return {data1: [],detail:[]};
  },
  componentWillMount:function(){
this.loadCollabFromServer();
this.loadTasksFromServer();
console.log("componentWillMount called");
  },
  componentDidMount: function() {
  	this.loadusersFromServer();
    setInterval(this.loadusersServer);
  	this.loadCollabFromServer();
  	console.log("componentDidMount called");
  },

		render:function(){
			var jumboHeight={
						height: 555

			};
			return (
					<div className="clearfix">
					<Upper name = {this.props.name}/>
							<div className="row">
							<ProjectSummary collaborators={this.state.collaborators}owner= {this.props.name} ownerid={this.props.id} params={this.props.params} collab={this.state.detail} onTaskSubmit = {this.handleTaskSubmit} data1 ={this.state.data1}/>
							</div>
							<div className=" jumbotron " style={{padding: 30 + 'px'}}>
							<ProjectLog  params={this.props.params} ownerid={this.props.id} owner= {this.props.name} collab={this.state.detail} data1 ={this.state.data1}  />
							</div>
					</div>
				);
		},
		componentWillReceiveProps:function(nextProps){
          //  console.log("inside componentWillReceiveProps method",nectProps);
        },shouldComponentUpdate:function(){
            // console.log("inside shouldComponentUpdate method");
            return true;
        },componentWillUpdate:function(nextProps,nextState){
            // console.log("inside componentWillUpdate method",nextProps ,nextState);
        },componentDidUpdate:function(){
            // console.log("inside componentDidUpdate method");
        },componentWillUnmount:function(){
            // console.log("inside componentWillUnmount method");
        }
});

module.exports =ProjectTime;
