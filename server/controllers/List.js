const models = require('../models');

const { List } = models;
const { Task } = models;

// make the page
const listPage = (req, res) => {
  List.ListModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured.' });
    }
    return res.render('app', { csrfToken: req.csrfToken(), lists: docs });
  });
};

// create a new list
const makeList = (req, res) => {
  if (!req.body.title) {
    return res.status(400).json({ error: 'Both title and number of tasks are required!' });
  }

  /* if(req.body.numberTasks<1){
        return res.status(400).json({error:'Cannot make an empty checklist!'});
    } */

  const listData = {
    title: req.body.title,
    numberTasks: 3,
    tasks: [],
    owner: req.session.account._id,
  };

  if (req.body.desc) {
    listData.desc = req.body.desc;
  }

  listData.tasks.push(new Task.TaskModel({ title: listData.title, content: req.body.content1 }));
  listData.tasks.push(new Task.TaskModel({ title: listData.title, content: req.body.content2 }));
  listData.tasks.push(new Task.TaskModel({ title: listData.title, content: req.body.content3 }));

  const newList = new List.ListModel(listData);

  const listPromise = newList.save();

  listPromise.then(() => res.json({ redirect: '/app' }));

  listPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'List already exists.' });
    }

    return res.status(400).json({ error: 'An error occured.' });
  });

  return listPromise;
};

// get the set of lists for this account
const getTitles = (req, res) => List.ListModel.findByOwner(req.session.account._id, (err, docs) => {
  if (err) {
    console.log(err);
    return res.status(400).json({ error: 'An error occured.' });
  }

  return res.json({ lists: docs });
});

// update a list when tasks are checked off
const updateList = (req, res) => {
  if (!req.body.title || !req.body.id) {
    return res.status(400).json({ error: 'An error occured.' });
  }

  List.ListModel.findByTitle(req.session.account._id, req.body.title, (err, doc) => {
    if (err) { return res.status(500).json({ err }); }
    if (!doc) { return res.json({ warning: 'List not found.' }); }

    const tempList = doc;

    if (!tempList.tasks.id(req.body.id)) { return res.json({ warning: 'Task not found.' }); }
    tempList.tasks.id(req.body.id).completed = req.body.completed;
    console.log(tempList.tasks.id(req.body.id).completed);
    const listPromise = tempList.save();

    listPromise.then(() => res.json({ redirect: '/app' }));

    listPromise.catch((e) => {
      console.log(e);
      return res.status(400).json({ error: 'An error occured.' });
    });

    return listPromise;
  });

  return false;
};

// edit a list
const editList = (req, res) => {
  if (!req.body.title) {
    return res.status(400).json({ error: 'An error occured.' });
  }

  /* List.ListModel.findByTitle(req.session.account._id,req.body.title, (err,doc)=>{
        const listData={
            title: req.body.title,
            numberTasks:3,
            tasks:[],
            owner:req.session.account._id,
        };

    if(req.body.desc){
        listData.desc=req.body.desc;
    }

    listData.tasks.push(new Task.TaskModel({title:listData.title,content:req.body.content1}));
    listData.tasks.push(new Task.TaskModel({title:listData.title,content:req.body.content2}));
    listData.tasks.push(new Task.TaskModel({title:listData.title,content:req.body.content3}));

    const tempList=new List.ListModel(listData);

    const listPromise=newList.save();

    listPromise.then(()=>res.json({redirect:'/app'}));

    listPromise.catch((err)=>{
        console.log(err);
        if(err.code==11000){
            return res.status(400).json({error:'List already exists.'});
        }

        return res.status(400).json({error:'An error occured.'});
    });

    return listPromise;
    }); */
  return false;
};

module.exports.listPage = listPage;
module.exports.getTitles = getTitles;
module.exports.makeList = makeList;
module.exports.updateList = updateList;
module.exports.editList = editList;
