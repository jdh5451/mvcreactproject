const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const _ = require('underscore');

let ListModel = {};

const convertId = mongoose.Types.ObjectId;

const ListSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    
  },

  entryNumber: {
    type: Number,
    min: 0,
    required: true,
  },

  ordered: {
    type: Boolean,
    default: false,
  },

  entries:{
      
      
  },
    
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