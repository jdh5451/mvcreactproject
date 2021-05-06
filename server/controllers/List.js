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
    return res.status(400).json({ error: 'Title is required.' });
  }

  /* if(req.body.numberTasks<1){
        return res.status(400).json({error:'Cannot make an empty checklist!'});
    } */

  const listData = {
    title: req.body.title,
    numberTasks: req.body.tasks.length,
    tasks: [],
    owner: req.session.account._id,
  };

  if (req.body.desc) {
    listData.desc = req.body.desc;
  }

  for (let i = 0; i < listData.numberTasks; i++) {
    listData.tasks.push(new Task.TaskModel({
      title: req.body.tasks[i].title,
      content: req.body.tasks[i].content,
    }));
  }

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
  if (!req.body.id) {
    return res.status(400).json({ error: 'An error occured.' });
  }

  List.ListModel.findById(req.session.account._id, req.body.id, (err, doc) => {
    const tempList = doc;
    tempList.title = req.body.title;
    if (req.body.desc) {
      tempList.desc = req.body.desc;
    }

    const tasks = [];

    for (let i = 0; i < req.body.tasks.length; i++) {
      tasks.push(new Task.TaskModel({
        title: req.body.tasks[i].title,
        content: req.body.tasks[i].content,
        completed: req.body.tasks[i].completed,
      }));
    }

    tempList.tasks = tasks;

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

module.exports.listPage = listPage;
module.exports.getTitles = getTitles;
module.exports.makeList = makeList;
module.exports.updateList = updateList;
module.exports.editList = editList;
