const handleList=(e)=>{
    
};

const handleCreateMenu=(e)=>{
    
};

const handleUpdate=(title, id, e)=>{
    let data=`title=${title}&id=${id}&completed=${e.target.checked}`;
};

const handleEdit=(e)=>{
    
};

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
};

const handleAdd=(e)=>{
    
};

const ListView=(props)=>{
    
    if(props.lists.length===0){
        return( 
        <div id="displayList">
           <div className="noLists">
               <h3 className="noChecklists">You haven't made any checklists. Make one now?</h3>
            
        </div>
        <div id="make">
                <h3 className="makePrompt">Create List</h3>
                <button type="button">+</button>
        </div>
        </div>
       
        );
    }
    
    const listNodes=props.lists.map(function(list){        
        return(
            <div key={list._id} className="checklist">
                <div className="header">
                    <h3 className="listTitle">{list.title}</h3>
                    <button type="button" value={list.title} onClick={handleExpand}>
                        +
                    </button>
                </div>
                <div className="listContent" id={list.title} style="display:none">
                    <h3 className="listDesc">{list.desc}</h3>
                    <ul>
                        {list.tasks.map(task=>(
                            <li key={task._id}>
                                <label htmlFor="task">{task.content}</label>
                                <input 
                                    type="checkbox" 
                                    name="task" 
                                    onChange={handleUpdate}
                                    taskId={task._id}
                                    title={list.title}
                                />
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        );
    });
    
    return(
        <div id="displayList">
        {listNodes}
        
        <div id="make">
            <div className="header">
                <h3 className="makePrompt">Create List</h3>
                <button type="button" onClick={handleCreateMenu}>+</button>
            </div>
            <div className="createMenu" id="createMenu" style="display:none">
                {MakeForm}
            </div>
        </div>
        </div>
    );
};


const EditForm=(props)=>{
    return(
        
    );
};

const MakeForm=()=>{
    return(
        <form
            id="createForm"
            name="createForm"
            numberTasks=3
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
            
            <input className="submitList" type="submit" value="Create Checklist"/>
        </form>
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
    
};

const getToken=()=>{
  sendAjax('GET', '/getToken', null, (result)=>{
      setup(result.csrfToken);
  }); 
};

$(document).ready(function(){
    getToken();
});