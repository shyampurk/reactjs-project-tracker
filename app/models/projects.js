var mongoose = require('mongoose');

var projectSchema = mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId, ref: 'User'
	},
	owner:{
		type: String
	},
	projectName:{
		type:String
	},
	projectcollaborators:{
		type:[{type: mongoose.Schema.Types.ObjectId, ref: 'User'}]
	},
	createdTime:{
		type:String
	},
	tasks: {
		type:[{type: mongoose.Schema.Types.ObjectId, ref: 'Task'}]
	},
	updatedTime:{
		type:String
	}

});
module.exports = mongoose.model('Project',projectSchema);