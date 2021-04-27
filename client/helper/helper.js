const handleError=(message)=>{
   console.log(message);
};

const redirect=(response)=>{
    window.location=response.redirect;
};

const sendAjax=(type,action,data,success)=>{
    $.ajax({
        cache:false,
        type: type,
        url:action,
        data: data,
        dataType: "json",
        success: success,
        error: function(xhr,status,error){
            var messageObj=JSON.parse(xhr.responseText);
            handleError(messageObj.error);
        }
    });
};

const sendAjaxJSON=(type,action,csrf,data,success)=>{
    $.ajax({
        cache:false,
        type: type,
        url:action,
        header: `CSRF-TOKEN=${csrf}`,
        data: data,
        dataType: "json",
        success: success,
        error: function(xhr,status,error){
            var messageObj=JSON.parse(xhr.responseText);
            handleError(messageObj.error);
        }
    });
};