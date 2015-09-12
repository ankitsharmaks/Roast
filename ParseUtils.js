var Roast = Parse.Object.extend("Roast");
var Comment = Parse.Object.extend("Comment");
var Friend = Parse.Object.extend("Friend");

function isLoggedIn(){
  if(Parse.User.current()){
    console.log("Logged in as "+Parse.User.current().get("username"));
    return true;
  } else{
    console.log("Not Logged in");
    return false;
  }
}

function getLoggedInUser(){
	if(isLoggedIn()){
		return Parse.User.current().get("username");
	} else {
		console.log("Not Logged in");
	}
}

function postRoast(){
	var roast = new Roast();
	roast.set("roaster",getLoggedInUser());
	roast.set("victim",getVictim());
	roast.set("content",getRoastContent());
	roast.set("file",getFile());
	roast.save({
	success :function(obj){
	  console.log("roast Saved!");
	  Parse.Cloud.run('PostNotificationPost',{victim: roast.getVictim()}){
		  success: function(notify)
		  {
			  console.log("notifications sent");
		  }, error: function(notify)
		  {
			  console.log("notifications failed");
		  }
		  
	  }
	}, error : function(error){
	  console.log("roast Save Error:"+error.message);
	}
	});
}

function postComment(){
	var comment = new Comment();
	comment.set("content",getComment());
	comment.set("user",getLoggedInUser());
	comment.set("roast",getRoast());
	comment.save({
	success :function(obj){
	  console.log("Comment Saved!");
	   Parse.Cloud.run('PostNotificationComment',{roastID: comment.getRoast()}){
		  success: function(notify)
		  {
			  console.log("notifications sent");
		  }, error: function(notify)
		  {
			  console.log("notifications failed");
		  }
		  
	  }
	  
	}, error : function(error){
	  console.log("Comment Save Error:"+error.message);
	}
	
	});
}

function getFriendList(){
	var query = new Parse.Query(Friend);
    query.include("user");
    query.include("friend");
    query.equalTo("user",getUser());
    query.find({
        success: function(results){

        }, error: function(error){

        }
    });
}

function getComment(){
	//Return comment String
}

function getRoast(){
	//Return Roast Object
}

function getRoastContent(){
	//Return Roast String
}

function getVictim(){
	//Return User object
}

function getFile(){
	//Return File Object
}

function sendNotification()
{
	Parse.Cloud.run('PostNotification',{})
}