"use strict";

var handleList = function handleList(e) {
  e.preventDefault();
  console.log($("#taskList").serializeArray());
  console.log($("#createForm").serialize());
  sendAjax('POST', '/app', $("#createForm").serialize(), function () {
    loadTitlesFromServer();
  });
  return false;
};
/*const handleCreateMenu=(e)=>{
    
};

const handleEdit=(e)=>{
    
};*/


var handleExpand = function handleExpand(e) {
  e.preventDefault();
  e.target.innerHTML = "-";
  e.onClick = handleShrink(e);
  document.querySelector("#".concat(e.target.id)).style.display = "initial";
  return false;
};

var handleShrink = function handleShrink(e) {
  e.preventDefault();
  e.target.innerHTML = "+";
  e.onClick = handleExpand(e);
  document.querySelector("#".concat(e.target.id)).style.display = "none";
  return false;
};
/*const handleAdd=(e)=>{
    
};*/
///find some way to pass a csrf token in through this


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
    }, list.title)), /*#__PURE__*/React.createElement("div", {
      className: "listContent",
      id: list.title
    }, /*#__PURE__*/React.createElement("h3", {
      className: "listDesc"
    }, list.desc), /*#__PURE__*/React.createElement("ul", null, list.tasks.map(function (task) {
      var handleUpdate = function handleUpdate(e) {
        var data = "title=".concat(task.title, "&id=").concat(task._id, "&completed=").concat(e.target.checked);
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
  return /*#__PURE__*/React.createElement("div", {
    className: "makeForm"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "makePrompt"
  }, "Create List"), /*#__PURE__*/React.createElement("form", {
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
    name: "content1",
    placeholder: "Write your task here..."
  })), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("input", {
    type: "text",
    name: "content2",
    placeholder: "Write your task here..."
  })), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("input", {
    type: "text",
    name: "content3",
    placeholder: "Write your task here..."
  }))), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    className: "submitList",
    type: "submit",
    value: "Create Checklist"
  })));
};

var loadTitlesFromServer = function loadTitlesFromServer() {
  sendAjax('GET', '/getTitles', null, function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(ListView, {
      lists: data.lists
    }), document.querySelector("#lists"));
  });
};

var setup = function setup(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(ListView, {
    lists: []
  }), document.querySelector("#lists"));
  ReactDOM.render( /*#__PURE__*/React.createElement(MakeForm, {
    csrf: csrf
  }), document.querySelector("#make"));
  loadTitlesFromServer();
};

var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    setup(result.csrfToken);
  });
};

$(document).ready(function () {
  getToken();
});
"use strict";

var handleError = function handleError(message) {
  $("#errorMessage").text(message);
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
