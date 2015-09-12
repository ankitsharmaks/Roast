var Roast = Parse.Object.extend("Roast");
var Comment = Parse.Object.extend("Comment");

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
	}
}

function postRoast(){
	var roast = new Roast();
	roast.set("roaster",getLoggedInUser());
	roast.set("victim",getVictim());
	roast.save({
	success :function(obj){
	  console.log("roast Saved!");
	}, error : function(error){
	  console.log("roast Save Error:"+error.message);
	}
	});
}

function postComment(){
	var comment = new Comment();
	comment.set("content",getComment());
	comment.set("user",getLoggedInUser());
	comment.set("post",getPost());
	comment.save({
	success :function(obj){
	  console.log("Comment Saved!");
	}, error : function(error){
	  console.log("Comment Save Error:"+error.message);
	}
	});
}