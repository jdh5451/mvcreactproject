const handleList=(e)=>{
    
};

const handleUpdate=(e)=>{
    
};

const handleEdit=(e)=>{
    
};

const handleExpand=(e)=>{
    
};

const handleShrink=(e)=>{
    
};

const handleAdd=(e)=>{
    
};

const ListView=(props)=>{
    
    if(props.lists.length===0){
        return( 
        <div className="displayList">
           <div className="noLists">
               <h3 className="noChecklists">You haven't made any checklists. Make one now?</h3>
            
        </div>
        <div className="make">
                <h3 className="makePrompt">Create List</h3>
                <button type="button">+</button>
        </div>
        </div>
       
        );
    }
    
    const listNodes=props.lists.map(function(list){
        return(
            <div key={list._id} className="checklist">
                <h3 className="listTitle">{list.title}</h3>
                <button type="button">+</button>
            </div>
        );
    });
    
    return(
        <div className="displayList">
        {listNodes}
        
        <div className="make">
                <h3 className="makePrompt">Create List</h3>
                <button type="button">+</button>
        </div>
        </div>
    );
};

const ViewList=(props)=>{
    return(
        
    );
};

const EditForm=(props)=>{
    return(
        
    );
};

const MakeForm=(props)=>{
    return(
        
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