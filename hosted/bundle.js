"use strict";

var csrfToken;
var taskLimit = 5;

var handleList = function handleList(e) {
  e.preventDefault(); //console.log(document.getElementById("taskList").childNodes);
  //console.log($("#createForm").serialize());

  var listObject = {
    title: document.getElementById("titleField").value,
    desc: document.getElementById("descField").value,
    _csrf: csrfToken,
    tasks: []
  };
  var tasks = document.getElementById("taskList").childNodes;

  if (tasks.length === 0) {
    //error out
    return false;
  }

  for (var i = 0; i < tasks.length; i++) {
    listObject.tasks[i] = {
      title: listObject.title,
      content: tasks[i].firstElementChild.value
    };
  }

  console.log(JSON.stringify(listObject));
  sendAjaxJSON('POST', '/app', csrfToken, listObject, function () {
    loadTitlesFromServer();
  });
  return false;
};

var handleToggleEdit = function handleToggleEdit(e) {
  if (e.target.innerHTML === "Edit") loadTitlesForEdit();else loadTitlesFromServer();
};

var handleClick = function handleClick(e) {
  if (e.target.innerHTML === "-") handleShrink(e);else handleExpand(e);
};

var handleExpand = function handleExpand(e) {
  e.preventDefault();
  console.log("handling expand");
  e.target.innerHTML = "-";
  document.querySelector("#".concat(e.target.title)).style.display = "initial";
  return false;
};

var handleShrink = function handleShrink(e) {
  e.preventDefault();
  console.log("handling shrink");
  e.target.innerHTML = "+";
  document.querySelector("#".concat(e.target.title)).style.display = "none";
  return false;
};
/*const handleAdd=(e)=>{
    
};*/


var ListView = function ListView(props) {
  if (props.lists.length === 0) {
    return /*#__PURE__*/React.createElement("div", {
      id: "displayList"
    }, /*#__PURE__*/React.createElement("div", {
      className: "noLists"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "noChecklists"
    }, "You haven't made any checklists. Make one now?")));
  }

  var listNodes = props.lists.map(function (list) {
    return /*#__PURE__*/React.createElement("div", {
      key: list._id,
      className: "checklist"
    }, /*#__PURE__*/React.createElement("div", {
      className: "header"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "listTitle"
    }, list.title), /*#__PURE__*/React.createElement("button", {
      title: list.title,
      onClick: handleClick
    }, "+")), /*#__PURE__*/React.createElement("div", {
      className: "listContent",
      id: list.title,
      style: {
        display: 'none'
      }
    }, /*#__PURE__*/React.createElement("h3", {
      className: "listDesc"
    }, list.desc), /*#__PURE__*/React.createElement("ul", null, list.tasks.map(function (task) {
      var handleUpdate = function handleUpdate(e) {
        var data = "_csrf=".concat(csrfToken, "&title=").concat(task.title, "&id=").concat(task._id, "&completed=").concat(e.target.checked);
        console.log(data);
        sendAjax('POST', '/update', data, function () {
          loadTitlesFromServer();
        });
        return false;
      };

      console.log(task.completed);

      if (task.completed) {
        return /*#__PURE__*/React.createElement("li", {
          key: task._id
        }, /*#__PURE__*/React.createElement("label", {
          htmlFor: "task"
        }, task.content), /*#__PURE__*/React.createElement("input", {
          type: "checkbox",
          name: "task",
          onChange: handleUpdate,
          checked: true,
          title: task.title,
          taskid: task._id
        }));
      } else {
        return /*#__PURE__*/React.createElement("li", {
          key: task._id
        }, /*#__PURE__*/React.createElement("label", {
          htmlFor: "task"
        }, task.content), /*#__PURE__*/React.createElement("input", {
          type: "checkbox",
          name: "task",
          onChange: handleUpdate,
          title: task.title,
          taskid: task._id
        }));
      }
    }))));
  });
  return /*#__PURE__*/React.createElement("div", {
    id: "displayList"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: handleToggleEdit
  }, "Edit"), listNodes);
};

var EditView = function EditView(props) {
  if (props.lists.length === 0) {
    return /*#__PURE__*/React.createElement("div", {
      id: "displayEdit"
    }, /*#__PURE__*/React.createElement("div", {
      className: "noLists"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "noChecklists"
    }, "There's nothing to edit! Make a new list now!")));
  }

  var editNodes = props.lists.map(function (list) {
    var handleEdit = function handleEdit(e) {
      e.preventDefault(); //console.log(document.getElementById("taskList").childNodes);
      //console.log($("#createForm").serialize());

      var listObject = {
        id: list._id,
        title: document.getElementById("".concat(list.title, "TitleField")).value,
        desc: document.getElementById("".concat(list.title, "DescField")).value,
        _csrf: csrfToken,
        tasks: []
      };
      var tasks = document.getElementById("edit".concat(list.title, "List")).childNodes;

      if (tasks.length === 0) {
        //error out
        return false;
      }

      for (var i = 0; i < tasks.length; i++) {
        console.log(tasks[i].lastElementChild.value);
        listObject.tasks[i] = {
          title: listObject.title,
          content: tasks[i].lastElementChild.value
        };
      }

      console.log(JSON.stringify(listObject));
      sendAjaxJSON('POST', '/edit', csrfToken, listObject, function () {
        loadTitlesFromServer();
      });
      return false;
    };

    return /*#__PURE__*/React.createElement("div", {
      key: list._id,
      className: "editForm"
    }, /*#__PURE__*/React.createElement("h3", null, "Edit List"), /*#__PURE__*/React.createElement("button", {
      title: "edit".concat(list.title),
      onClick: handleClick
    }, "+"), /*#__PURE__*/React.createElement("div", {
      id: "edit".concat(list.title),
      style: {
        display: 'none'
      }
    }, /*#__PURE__*/React.createElement("form", {
      id: "edit".concat(list.title, "Form"),
      name: "edit".concat(list.title, "Form"),
      onSubmit: handleEdit,
      method: "POST",
      className: "editForm"
    }, /*#__PURE__*/React.createElement("label", {
      htmlFor: "title"
    }, "Edit Title:"), /*#__PURE__*/React.createElement("input", {
      id: "".concat(list.title, "TitleField"),
      type: "text",
      name: "title",
      defaultValue: list.title
    }), /*#__PURE__*/React.createElement("label", {
      htmlFor: "desc"
    }, "Edit Description:"), /*#__PURE__*/React.createElement("input", {
      id: "".concat(list.title, "DescField"),
      type: "text",
      name: "desc",
      defaultValue: list.desc
    }), /*#__PURE__*/React.createElement("ul", {
      id: "edit".concat(list.title, "List")
    }, list.tasks.map(function (task) {
      var input = React.createRef();

      var handleUpdateText = function handleUpdateText(e) {};

      return /*#__PURE__*/React.createElement("li", {
        key: task._id
      }, /*#__PURE__*/React.createElement("label", {
        htmlFor: "task"
      }, "Edit Task:"), /*#__PURE__*/React.createElement("input", {
        ref: input,
        type: "text",
        name: "task",
        value: task.content,
        onChange: handleUpdateText
      }));
    })), /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: handleToggleEdit
    }, "Cancel"), /*#__PURE__*/React.createElement("input", {
      className: "submitEdit",
      type: "submit",
      value: "Edit Checklist"
    }))));
  });
  return /*#__PURE__*/React.createElement("div", {
    id: "displayEdit"
  }, editNodes);
};

var MakeForm = function MakeForm(props) {
  /*const handleAddSubtract=(e)=>{
      if(e.target.id!=="addButton") handleSubtract(e);
      else handleAdd(e);
  }*/

  /*const handleSubtract=(e)=>{
      console.log("handling subtract");
      if(document.querySelector("#addButton").style.display==='none'){
          document.querySelector("#addButton").style.display='initial';
      }
      e.target.parentNode.remove();
  };*/
  var handleAdd = function handleAdd(e) {
    console.log("handling add");
    var tasks = Array.from(document.getElementById("taskList").childNodes);
    console.log(tasks);

    if (tasks.length > 2) {
      console.log('cannot add more tasks');
    } else {
      if (tasks.length + 1 > 2) {
        document.querySelector("#addButton").style.display = 'none';
      }

      var taskInputs = tasks.map(function (task) {
        return /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("input", {
          type: "text",
          placeholder: "Write your task here...",
          defaultValue: task.value !== 0 ? task.value : ""
        }));
      });
      taskInputs.push( /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("input", {
        type: "text",
        placeholder: "Write your task here..."
      })));
      ReactDOM.render(taskInputs, document.getElementById("taskList"));
    }
  };

  return /*#__PURE__*/React.createElement("div", {
    className: "makeForm"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "makePrompt"
  }, "Create List"), /*#__PURE__*/React.createElement("button", {
    title: "create",
    onClick: handleClick
  }, "+"), /*#__PURE__*/React.createElement("div", {
    id: "create",
    style: {
      display: 'none'
    }
  }, /*#__PURE__*/React.createElement("form", {
    id: "createForm",
    name: "createForm",
    onSubmit: handleList,
    method: "POST",
    className: "createForm"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "title"
  }, "Title: "), /*#__PURE__*/React.createElement("input", {
    id: "titleField",
    type: "text",
    name: "title",
    placeholder: "New Checklist"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "desc"
  }, "Description: "), /*#__PURE__*/React.createElement("input", {
    id: "descField",
    type: "text",
    name: "desc",
    placeholder: "No description."
  }), /*#__PURE__*/React.createElement("button", {
    id: "addButton",
    type: "button",
    onClick: handleAdd
  }, "Add Task"), /*#__PURE__*/React.createElement("ul", {
    id: "taskList"
  }, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "Write your task here..."
  }))), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    className: "submitList",
    type: "submit",
    value: "Create Checklist"
  }))));
};

var loadTitlesFromServer = function loadTitlesFromServer() {
  sendAjax('GET', '/getTitles', null, function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(ListView, {
      lists: data.lists
    }), document.querySelector("#lists"));
  });
};

var loadTitlesForEdit = function loadTitlesForEdit() {
  sendAjax('GET', '/getTitles', null, function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(EditView, {
      lists: data.lists
    }), document.querySelector("#lists"));
  });
};

var setup = function setup() {
  ReactDOM.render( /*#__PURE__*/React.createElement(ListView, {
    lists: [],
    csrf: csrfToken
  }), document.querySelector("#lists"));
  ReactDOM.render( /*#__PURE__*/React.createElement(MakeForm, {
    csrf: csrfToken
  }), document.querySelector("#make"));
  loadTitlesFromServer();
};

var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    csrfToken = result.csrfToken;
    setup();
  });
};

$(document).ready(function () {
  getToken();
});
"use strict";

var handleError = function handleError(message) {
  console.log(message);
};

var redirect = function redirect(response) {
  window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: "json",
    success: success,
    error: function error(xhr, status, _error) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};

var sendAjaxJSON = function sendAjaxJSON(type, action, csrf, data, success) {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    headers: {
      'CSRF-TOKEN': csrf
    },
    data: data,
    dataType: "json",
    success: success,
    error: function error(xhr, status, _error2) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};
