let csrfToken;

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

/*
const handleEdit=(e)=>{
    
};*/

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
       
        {listNodes}  
        </div>
    );
};




const MakeForm=(props)=>{
    
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