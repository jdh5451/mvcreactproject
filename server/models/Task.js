const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const _ = require('underscore');

let TaskModel = {};

const convertId = mongoose.Types.ObjectId;
const setContent = (content) => _.escape(content).trim();

const TaskSchema = new mongoose.Schema({
  content:{
      type:String,
      required:true,
      trim: true,
      set:setContent,
  },  
  
  completed: {
    type:Boolean,
    default:false,
  },

  createdData: {
    type: Date,
    default: Date.now,
  },

});

TaskModel=mongoose.model('Task',TaskSchema);

module.exports.TaskModel=TaskModel;
module.exports.TaskSchema=TaskSchema;
