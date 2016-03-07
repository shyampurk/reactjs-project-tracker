
var mongoose = require('mongoose');

var taskSchema = mongoose.Schema({
	taskName:{
		type:String
	},
	description:{
		type:String
	},
	taskOwner:{
		type: String
	},
	uId: {
		type: mongoose.Schema.Types.ObjectId, ref: 'User'
	},
	pId:{
		type:mongoose.Schema.Types.ObjectId, ref: 'Project'
	},
	fromTime:{
		 type: Date, default: Date.now
	},
	toTime:{
		type: Date, default: Date.now
	},
	updatedTime:{
		type:Date, default:Date.now
	}

});

module.exports = mongoose.model('Task', taskSchema);
