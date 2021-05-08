"use strict";

var csrfToken;
var isPremium;

var handleList = function handleList(e) {
  e.preventDefault(); //console.log(document.getElementById("taskList").childNodes);
  //console.log($("#createForm").serialize());

  $("#errorMessage").animate({
    width: 'hide'
  }, 350);

  if (!document.getElementById("titleField").value || document.getElementById("titleField").value === "") {
    handleError("Checklist must have a title.");
    return false;
  }

  var listObject = {
    title: document.getElementById("titleField").value,
    desc: document.getElementById("descField").value,
    _csrf: csrfToken,
    tasks: []
  };
  var tasks = document.getElementById("taskList").childNodes;

  if (tasks.length === 0) {
    handleError("Cannot send list without tasks!");
    return false;
  }

  for (var i = 0; i < tasks.length; i++) {
    if (!tasks[i].firstElementChild.value || tasks[i].firstElementChild.value === "") {
      handleError("All tasks must be given descriptions!");
      return false;
    }

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
      className: "formSubmit",
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
      return /*#__PURE__*/React.createElement("li", {
        key: task._id
      }, /*#__PURE__*/React.createElement("label", {
        htmlFor: "task"
      }, task.content), /*#__PURE__*/React.createElement("input", {
        type: "checkbox",
        name: "task",
        onChange: handleUpdate,
        defaultChecked: task.completed,
        title: task.title,
        taskid: task._id
      }));
    }))));
  });
  return /*#__PURE__*/React.createElement("div", {
    id: "displayList"
  }, /*#__PURE__*/React.createElement("button", {
    className: "formSubmit",
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

      $("#errorMessage").animate({
        width: 'hide'
      }, 350);

      if (!document.getElementById("".concat(list.title, "TitleField")).value || document.getElementById("".concat(list.title, "TitleField")).value === "") {
        handleError("Checklist must have a title.");
        return false;
      }

      var listObject = {
        id: list._id,
        title: document.getElementById("".concat(list.title, "TitleField")).value,
        desc: document.getElementById("".concat(list.title, "DescField")).value,
        _csrf: csrfToken,
        tasks: []
      };
      var tasks = document.getElementById("edit".concat(list.title, "List")).childNodes;

      if (tasks.length === 0) {
        handleError("Cannot send list without tasks!");
        return false;
      }

      for (var i = 0; i < tasks.length; i++) {
        if (!tasks[i].firstElementChild.value || tasks[i].firstElementChild.value === "") {
          handleError("All tasks must be given descriptions!");
          return false;
        }

        listObject.tasks[i] = {
          title: listObject.title,
          content: tasks[i].firstElementChild.value,
          completed: tasks[i].lastElementChild.checked
        };
      }

      console.log(JSON.stringify(listObject));
      sendAjaxJSON('POST', '/edit', csrfToken, listObject, function () {
        loadTitlesFromServer();
      });
      return false;
    };
    /*const handleDelete=(e)=>{
        e.preventDefault();
        let data=`_csrf=${csrfToken}&title=${list.title}`;
        
        
    }*/


    return /*#__PURE__*/React.createElement("div", {
      key: list._id,
      className: "editForm"
    }, /*#__PURE__*/React.createElement("h3", null, "Edit List: ", list.title), /*#__PURE__*/React.createElement("button", {
      className: "formSubmit",
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
      }, /*#__PURE__*/React.createElement("input", {
        type: "text",
        name: "task",
        defaultValue: task.content
      }), /*#__PURE__*/React.createElement("label", {
        htmlFor: "taskDone"
      }, "Completed?"), /*#__PURE__*/React.createElement("input", {
        type: "checkbox",
        name: "taskDone",
        defaultChecked: task.completed
      }));
    })), /*#__PURE__*/React.createElement("input", {
      className: "formSubmit",
      type: "submit",
      value: "Edit Checklist"
    }))));
  });
  return /*#__PURE__*/React.createElement("div", {
    id: "displayEdit"
  }, /*#__PURE__*/React.createElement("button", {
    className: "formSubmit",
    type: "button",
    onClick: handleToggleEdit
  }, "Cancel"), editNodes);
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
    $("#errorMessage").animate({
      width: 'hide'
    }, 350);
    console.log("handling add");
    var taskLimit = 4;
    if (isPremium) taskLimit = 6;
    var tasks = Array.from(document.getElementById("taskList").childNodes);
    console.log(tasks);

    if (tasks.length > taskLimit) {
      handleError("This list cannot hold any more tasks!");
      return false;
    } else {
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
    className: "formSubmit",
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
    className: "formSubmit",
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
    className: "formSubmit",
    type: "submit",
    value: "Create Checklist"
  }))));
};

var PremiumButton = function PremiumButton() {
  var handlePremium = function handlePremium(e) {
    e.preventDefault();
    $("#errorMessage").animate({
      width: 'hide'
    }, 350);

    if (isPremium) {
      handleError("You're already premium!");
      return false;
    }

    var data = "_csrf=".concat(csrfToken);
    sendAjax('POST', '/goPremium', data, function () {
      getPremium();
    });
  };

  if (isPremium) {
    return /*#__PURE__*/React.createElement("button", {
      className: "formSubmit",
      style: {
        display: 'none'
      },
      onClick: handlePremium
    }, "Premium!");
  } else {
    return /*#__PURE__*/React.createElement("button", {
      className: "formSubmit",
      onClick: handlePremium
    }, "Go Premium!");
  }
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
  getPremium();
};

var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    csrfToken = result.csrfToken;
    setup();
  });
};

var getPremium = function getPremium() {
  sendAjax('GET', '/isPremium', null, function (result) {
    isPremium = result.premium;
    console.log(isPremium);
    ReactDOM.render( /*#__PURE__*/React.createElement(PremiumButton, null), document.querySelector("#premium"));
  });
};

$(document).ready(function () {
  getToken();
});
"use strict";

var handleError = function handleError(message) {
  $("#errorMessage").text(message);
  $("#errorMessage").animate({
    width: 'toggle'
  }, 350);
};

var redirect = function redirect(response) {
  $("#errorMessage").animate({
    width: 'hide'
  }, 350);
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
