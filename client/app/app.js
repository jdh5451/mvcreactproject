const handleList=(e)=>{
    e.preventDefault();
    console.log($("#taskList").serializeArray());
    console.log($("#createForm").serialize());
    sendAjax('POST', '/app',$("#createForm").serialize(), function(){
        loadTitlesFromServer();
    });
    return false;
};

/*const handleCreateMenu=(e)=>{
    
};

const handleEdit=(e)=>{
    
};*/

const handleExpand=(e)=>{
    e.preventDefault();
    
    e.target.innerHTML="-";
    e.onClick=handleShrink(e);
    document.querySelector(`#${e.target.id}`).style.display="initial";
    
    return false;
};

const handleShrink=(e)=>{
    e.preventDefault();
    
    e.target.innerHTML="+";
    e.onClick=handleExpand(e);
    document.querySelector(`#${e.target.id}`).style.display="none";
    return false;
};

/*const handleAdd=(e)=>{
    
};*/

///find some way to pass a csrf token in through this
///otherwise nothing updates properly
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
                </div>
                <div className="listContent" id={list.title}>
                    <h3 className="listDesc">{list.desc}</h3>
                    <ul>
                        {list.tasks.map((task)=>{
                            const handleUpdate=(e)=>{
                                let data=`title=${task.title}&id=${task._id}&completed=${e.target.checked}`;
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
    
    return(
        <div className="makeForm">
                <h3 className="makePrompt">Create List</h3>
                
            
        
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
                    <input type="text" name="content1" placeholder="Write your task here..."/>
                </li>
                <li>
                    <input type="text" name="content2" placeholder="Write your task here..."/>
                </li>
                <li>
                    <input type="text" name="content3" placeholder="Write your task here..."/>
                </li>
            </ul>
            <input type="hidden" name="_csrf" value={props.csrf} />
            <input className="submitList" type="submit" value="Create Checklist"/>
        </form>
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


const setup=function(csrf){
    ReactDOM.render(
        <ListView lists={[]} />,document.querySelector("#lists")
    );
    ReactDOM.render(
        <MakeForm csrf={csrf} />, document.querySelector("#make")
    );
    loadTitlesFromServer();
};

const getToken=()=>{
  sendAjax('GET', '/getToken', null, (result)=>{
      setup(result.csrfToken);
  }); 

    
};

$(document).ready(function(){
    getToken();
});