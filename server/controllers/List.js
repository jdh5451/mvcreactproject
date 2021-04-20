const models=require('../models');

const { List }=models;

//make the page
const listPage=(req,res)=>{
    res.render('app');
};

//create a new list
const makeList=(req,res)=>{
    if(!req.body.title||!req.body.numberTasks){
        return res.status(400).json({error:'Both title and number of tasks are required!'});
    }
    
    if(req.body.numberTasks<1){
        return res.status(400).json({error:'Cannot make an empty checklist!'});
    }
    
    
};

//get the set of lists for this account
const getTitles=(req,res)=>{
    
};

//get the specified list
const getList=(req,res)=>{
    
};

//update a list when tasks are checked off
const updateList=(req,res)=>{
    
};

//edit a list
const editList=(req,res)=>{
    
};


module.exports.listPage = listPage;
module.exports.getTitles = getTitles;
module.exports.getList = getList;
module.exports.makeList = makeList;
module.exports.updateList = updateList;
module.exports.editList=editList;
