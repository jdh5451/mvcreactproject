let csrfToken;
let taskLimit=5;

const handleList=(e)=>{
    e.preventDefault();
    //console.log(document.getElementById("taskList").childNodes);
    //console.log($("#createForm").serialize());
    const listObject={
        title:document.getElementById("titleField").value,
        desc:document.getElementById("descField").value,
        _csrf:csrfToken,
        tasks:[],
    };
    
    let tasks=document.getElementById("taskList").childNodes;
    
    if(tasks.length===0){
        //error out
        return false;
    }
    
    for(let i=0;i<tasks.length;i++){
        
        listObject.tasks[i]={
          title:listObject.title,
          content: tasks[i].firstElementChild.value,
        };
    }
    
    console.log(JSON.stringify(listObject));
    
    sendAjaxJSON('POST', '/app',csrfToken,listObject, function(){
        loadTitlesFromServer();
    });
    return false;
};

const handleToggleEdit=(e)=>{
    if(e.target.innerHTML==="Edit") loadTitlesForEdit();
    else loadTitlesFromServer();
}


const handleClick=(e)=>{
    if(e.target.innerHTML==="-") handleShrink(e);
    else handleExpand(e);
}

const handleExpand=(e)=>{
    e.preventDefault();
    console.log("handling expand");
    e.target.innerHTML="-";
    document.querySelector(`#${e.target.title}`).style.display="initial";
    
    return false;
};

const handleShrink=(e)=>{
    e.preventDefault();
    console.log("handling shrink");
    e.target.innerHTML="+";
    document.querySelector(`#${e.target.title}`).style.display="none";
    return false;
};

/*const handleAdd=(e)=>{
    
};*/

const ListView=(props)=>{
    if(props.lists.length===0){
        return( 
        <div id="displayList">
           <div className="noLists">
               <h3 className="noChecklists">You haven't made any checklists. Make one now?</h3>
        </div>
        </div>
        );
    }
    
    const listNodes=props.lists.map(function(list){        
        return(
            <div key={list._id} className="checklist">
                <div className="header">
                    <h3 className="listTitle">{list.title}</h3>
                    <button title={list.title} onClick={handleClick}>+</button>
                </div>
                <div className="listContent" id={list.title} style={{display:'none'}}>
                    <h3 className="listDesc">{list.desc}</h3>
                    <ul>
                        {list.tasks.map((task)=>{
                            const handleUpdate=(e)=>{
                                
                                let data=`_csrf=${csrfToken}&title=${task.title}&id=${task._id}&completed=${e.target.checked}`;
                                
                                console.log(data);
                                sendAjax('POST', '/update',data, function(){
                                    loadTitlesFromServer();
                                });
                                return false
                            };
                           
                            console.log(task.completed);
                            
                            if(task.completed){
                                return(
                            <li key={task._id}>
                                <label htmlFor="task">{task.content}</label>
                                <input 
                                    type="checkbox" 
                                    name="task" 
                                    onChange={handleUpdate}
                                    checked
                                    title={task.title}
                                    taskid={task._id}
                                    
                                />
                            </li>);
                            } else {
                                return(
                            <li key={task._id}>
                                <label htmlFor="task">{task.content}</label>
                                <input 
                                    type="checkbox" 
                                    name="task" 
                                    onChange={handleUpdate}
                                    title={task.title}
                                    taskid={task._id}
                                    
                                /> 
                            </li>);
                            }
                        })}
                    </ul>
                </div>
            </div>
        );
    });
    return(
        <div id="displayList">
        <button type="button" onClick={handleToggleEdit}>Edit</button>
        {listNodes}  
        </div>
    );
};

const EditView=(props)=>{
    if(props.lists.length===0){
        return( 
        <div id="displayEdit">
           <div className="noLists">
               <h3 className="noChecklists">There's nothing to edit! Make a new list now!</h3>
        </div>
        </div>
        );
    }
    
    const editNodes=props.lists.map(function(list){
        
        const handleEdit=(e)=>{
            e.preventDefault();
            //console.log(document.getElementById("taskList").childNodes);
            //console.log($("#createForm").serialize());
            const listObject={
                id:list._id,
                title:document.getElementById(`${list.title}TitleField`).value,
                desc:document.getElementById(`${list.title}DescField`).value,
                _csrf:csrfToken,
                tasks:[],
            };
    
            let tasks=document.getElementById(`edit${list.title}List`).childNodes;
    
            if(tasks.length===0){
                //error out
                return false;
            }
    
            for(let i=0;i<tasks.length;i++){
                console.log(tasks[i].lastElementChild.value);
                listObject.tasks[i]={
                title:listObject.title,
                content: tasks[i].lastElementChild.value,
                
                };
            }
    
            console.log(JSON.stringify(listObject));
    
            sendAjaxJSON('POST', '/edit',csrfToken,listObject, function(){
                loadTitlesFromServer();
            });
            return false;
        };
        
        
        
        return(
            <div key={list._id} className="editForm">
                <h3>Edit List</h3>
                <button title={`edit${list.title}`} onClick={handleClick}>+</button>
                
                <div id={`edit${list.title}`} style={{display:'none'}}>
                    <form
                    id={`edit${list.title}Form`}
                    name={`edit${list.title}Form`}
                    onSubmit={handleEdit}
                    method="POST"
                    className="editForm" >
                        <label htmlFor="title">Edit Title:</label>
                        <input id={`${list.title}TitleField`} 
                            type="text" 
                            name="title" 
                            defaultValue={list.title}/>
                        <label htmlFor="desc">Edit Description:</label>
                        <input id={`${list.title}DescField`} 
                            type="text" 
                            name="desc" 
                            defaultValue={list.desc}/>
                        <ul id={`edit${list.title}List`}>
                        {list.tasks.map((task)=>{
                            let input=React.createRef();
                            const handleUpdateText=(e)=>{
                                
                            };
                                return(
                            <li key={task._id}>
                                <label htmlFor="task">Edit Task:</label>
                                <input 
                                    ref={input}
                                    type="text" 
                                    name="task"
                                    
                                    value={task.content}
                                    onChange={handleUpdateText}

                                    
                                />
                                
                                
                            </li>);
                        })}
                    </ul>
                    <button type="button" onClick={handleToggleEdit}>Cancel</button>
                    <input className="submitEdit" type="submit" value="Edit Checklist" />
                    </form>
                </div>
            </div>
        );
    });
    return(
        <div id="displayEdit">
       
        {editNodes}  
        </div>
    );
};

const MakeForm=(props)=>{
    
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
    
    const handleAdd=(e)=>{
        console.log("handling add");
        let tasks=Array.from(document.getElementById("taskList").childNodes);
        console.log(tasks);
        if(tasks.length>2) {
            console.log('cannot add more tasks');
        } else {
            if(tasks.length+1>2){
                document.querySelector("#addButton").style.display='none';
            }
            let taskInputs = tasks.map((task) => {
                return (
                    <li>
                        <input type="text" placeholder="Write your task here..." 
                            defaultValue={task.value !== 0 ? task.value : ""} />
                        
                    </li>
                );
            });
            taskInputs.push( 
            <li>
                <input type="text" placeholder="Write your task here..." />
                    
            </li>);
            
            ReactDOM.render(taskInputs, document.getElementById("taskList"));
        }
    };
    
    return(
        <div className="makeForm">
                <h3 className="makePrompt">Create List</h3>
               <button title={"create"} onClick={handleClick}>+</button>
            
        
            <div id={"create"} style={{display:'none'}}>
                <form
            id="createForm"
            name="createForm"
            onSubmit={handleList}
            method="POST"
            className="createForm"
            
            >
            
            <label htmlFor="title">Title: </label>
            <input id="titleField" type="text" name="title" placeholder="New Checklist"/>
            <label htmlFor="desc">Description: </label>
            <input id="descField" type="text" name="desc" placeholder="No description."/>
            <button id="addButton" type="button" onClick={handleAdd}>Add Task</button>
            <ul id="taskList">
                <li>
                    <input type="text" placeholder="Write your task here..."/>
                    
                </li>
                
            </ul>
            
            <input type="hidden" name="_csrf" value={props.csrf} />
            <input className="submitList" type="submit" value="Create Checklist"/>
        </form>
            </div>
        </div>
        
    );
};

const loadTitlesFromServer=()=>{
    sendAjax('GET', '/getTitles', null, (data)=>{
        ReactDOM.render(
            <ListView lists={data.lists} />, document.querySelector("#lists")
        );
    });
};

const loadTitlesForEdit=()=>{
    sendAjax('GET', '/getTitles', null, (data)=>{
        ReactDOM.render(
            <EditView lists={data.lists} />, document.querySelector("#lists")
        );
    });
}

const setup=function(){
    ReactDOM.render(
        <ListView lists={[]} csrf={csrfToken}/>,document.querySelector("#lists")
    );
    ReactDOM.render(
        <MakeForm csrf={csrfToken} />, document.querySelector("#make")
    );
    loadTitlesFromServer();
};

const getToken=()=>{
  sendAjax('GET', '/getToken', null, (result)=>{
      csrfToken=result.csrfToken;
      setup();
  }); 

    
};

$(document).ready(function(){
    getToken();
});