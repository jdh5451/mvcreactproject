"use strict";

var csrfToken;

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

  for (var i = 0; i < tasks.length; i++) {
    listObject.tasks[i] = {
      title: listObject.title,
      content: tasks[i].firstElementChild.value
    };
  }

  console.log(JSON.stringify(listObject));
  sendAjaxJSON('POST', '/app', csrfToken, JSON.stringify(listObject), function () {
    loadTitlesFromServer();
  });
  return false;
};
/*
const handleEdit=(e)=>{
    
};*/


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
  }, listNodes);
};

var MakeForm = function MakeForm(props) {
  /*const handleAdd=(e)=>{
      let tasks=document.getElementById("taskList").childNodes;
      if(tasks.length>3) {
          console.log('cannot add more tasks');
      } else {
          ReactDOM.render(
              <li>
                   <input type="text" placeholder="Write your task here..."/>
              </li>,
              document.querySelector("#taskList")
          );
      }
  };*/
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
  }), /*#__PURE__*/React.createElement("ul", {
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
    header: "CSRF-TOKEN=".concat(csrf),
    data: data,
    dataType: "json",
    success: success,
    error: function error(xhr, status, _error2) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};
