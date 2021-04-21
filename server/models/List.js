const mongoose = require('mongoose');


mongoose.Promise = global.Promise;
const _ = require('underscore');
const tasks=require('./Task.js');

let ListModel = {};

const convertId = mongoose.Types.ObjectId;
const setTitle = (title) => _.escape(title).trim();

const ListSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    set: setTitle,
  },

  desc:{
      type:String,
      default:"no description",
      trim: true,
      set:setTitle,
  },  
  
  numberTasks: {
    type: Number,
    min: 1,
    required: true,
  },

  ordered: {
    type: Boolean,
    default: false,
  },

  tasks:[tasks.TaskSchema],
    
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },

  createdData: {
    type: Date,
    default: Date.now,
  },

});

ListSchema.statics.toAPI=(doc)=>({
    title:doc.title,
});

ListSchema.statics.findByOwner=(ownerId,callback)=>{
  const search = {
    owner: convertId(ownerId),
  };

  return ListModel.find(search,callback);
};

ListSchema.statics.findByTitle = (ownerId, title, callback) => {
  const search = {
    owner: convertId(ownerId),
    title,
  };

  return ListModel.findOne(search, callback);
};

ListModel=mongoose.model('List',ListSchema);

module.exports.ListModel=ListModel;
module.exports.ListSchema=ListSchema;