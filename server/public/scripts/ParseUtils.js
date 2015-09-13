
Parse.initialize("XUAXkfMROXgOJaAtB6KnV5lkYa138T0Ym59j3m9E", "lgmrdmFypwHHLGe7SfdW0ZW11Zf4qkTQhqH0AEHV");
var Roast = Parse.Object.extend("Roast");
var Comment = Parse.Object.extend("Comment");
var Friend = Parse.Object.extend("Friend");
var Notification= Parse.Object.extend("Notification");

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
        console.log("Logged in user:"+Parse.User.current().get("username"));
		return Parse.User.current().get("username");
	} else {
		console.log("Not Logged in");
	}
}

function getLoggedInUserName(){
   if(isLoggedIn()){
       console.log("Logged in userFullName:"+Parse.User.current().get("userFullName"));
       return Parse.User.current().get("userFullName");
   } else {
       console.log("Not Logged in");
   }
}

function postRoast(victim,content){    
    var query = new Parse.Query(Parse.User);
    query.equalTo("username",victim);
    var user = query.find({
        success: function(results){
            if(results.length>0){
                var roast = new Roast();
                roast.set("roaster",Parse.User.current());
                roast.set("victim",results[0]);
                roast.set("content",content);
                roast.set("file",null);
                roast.save({
                success :function(obj){
                    console.log("roast Saved!");
                    sendNotificationsAfterRoast(victim,obj);
                }, error : function(error){
                    console.log("roast Save Error:"+error.message);
                }
                });
            }
            console.log("getUserByUserID result:"+results[0].get("userFullName"));
            
        }, error: function(error){
            console.log("getUserByUserID Error:"+results[0]);
        }
    });
}

function sendNotificationsAfterRoast(victimID,roast){
    var query = new Parse.Query(Friend);
    query.equalTo("user",victimID);
    query.find({
        success: function(results){
            for(var i in results){
                var friendId = results[i].get("friend");
                var notification=new Notification();
                notification.set("userID",friendId);
                notification.set("roast",roast);
                notification.save({
                    success:function(obj){
                        console.log("Notification entry added");
                    },error: function(obj)
                    {
                        console.log("Notification entry failed");
                    }
                });
            }
        }, error: function(error){
            console.log("friend query error:"+error.message);
        }
    });
}

function getUserByUserID(username){
    var query = new Parse.Query(Parse.User);
    query.equalTo("username",username);
    var user = query.find({
        success: function(results){
            console.log("getUserByUserID result:"+results[0].get("userFullName"));
            return results[0];
        }, error: function(error){
            console.log("getUserByUserID Error:"+results[0]);
            return null;
        }
    });
    //console.log("userdata: "+user.get("username"));
}

function getRoast(roastID){
    console.log("getRoast called:"+roastID);
    var query = new Parse.Query(Roast);
    query.include("victim");
    query.equalTo("objectId",roastID);
    var content = "";
    var victim = "";
    var xx = query.find().then(
        function(results){
            if(results.length>0){
                content = results[0].get("content");
                victim = results[0].get("victim").get("userFullName");
                console.log("content:"+content);
                $("#victimName").html(victim);
                $("#roastContent").html(content);
                return "xxxxx";
            }
            else{
                console.log("Roast Not Found");
                content = null;
            }
        }, function(error){
            console.log("getRoast Error:"+error.message);
                content = null;
        }
    );
    return content;
}

function postComment(content,roastID){
    var query = new Parse.Query(Roast);
    query.equalTo("objectId",roastID);
    query.find({
        success: function(results){
            if(results.length>0){
                var comment = new Comment();
                comment.set("content",content);
                comment.set("user",Parse.User.current());
                comment.set("roast",results[0]);
                comment.save({
                success :function(obj){
                  console.log("Comment Saved!");
                }, error : function(error){
                  console.log("Comment Save Error:"+error.message);
                }
                });     
            } else {
                console.log("Empty output from Roast Query");
            }
        }, error: function(error){
            console.log("getUserByUserID Error:"+error.message);
        }
    });
}

function getCommentsForRoast(roastID){
    var query = new Parse.Query(Roast);
    query.equalTo("objectId",roastID);
    query.find({
        success: function(results){
            if(results.length>0){
                var query = new Parse.Query(Comment);
                query.equalTo("roast",results[0]);
                query.include("user")
                query.find({
                success: function(results){
                    if(results.length>0){
                        for( var i in results){
                            console.log("comment:"+results[i].get("content"));
                            if(results[i].get("user")){
                                console.log("user:"+results[i].get("user").get("userFullName"));
                            } else{
                                console.log("null user");
                            }
                        }
                    } else {
                        console.log("Empty output from Comment Query");
                    }
                }, error: function(error){
                    console.log("output from Comment Query Error:"+error.message);
                }
                });
            } else {
                console.log("Empty output from Roast Query");
            }
        }, error: function(error){
            console.log("output from Roast Query Error:"+error.message);
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

function signinOrSignupUser(userId, userFullName){
    var query = new Parse.Query(Parse.User);
    query.equalTo("username",userId);
    query.find({
        success: function(results){
            if(results.length>0){
                loginUser(userId);
            } else{
                signupUser(userId, userFullName);
            }
        }, error: function(error){
            console.log("signinOrSignupUser error:"+error.message);
        }
    });
}

function loginUser(userId){
    console.log("Login for:"+userId);
    var name = userId;
    var password = userId;
    Parse.User.logIn(name,password,{
    success : function(user){
      console.log("Login Success");
    },error : function(user,error){
      console.log("Login error"+error.message);
    }
    });
}

function signUpIfNotExist(userId, userFullName){
    var query = new Parse.Query(Parse.User);
    query.equalTo("username",userId);
    query.find({
        success: function(results){
            if(results.length>0){
            } else{
                signupUser(userId, userFullName);
            }
        }, error: function(error){
            console.log("signUpIfNotExist error:"+error.message);
        }
    });
}

function signupUser(userId, userFullName){
    console.log("SignUp for:"+userId+"  "+userFullName);
    var name = userId;
    var password = userId;
    var user = new Parse.User();
    user.set("username",name);
    user.set("password",password);
    user.set("userFullName",userFullName);
    
    user.signUp(null,{
    success : function(user){
      console.log("Signup Success");
    },error : function(user,error){
      console.log("Signup error");
    }
    });
}

function saveFriend(friendId){
    if(isLoggedIn()){
        var query = new Parse.Query(Friend);
        query.equalTo("user",getLoggedInUser());
        query.equalTo("friend",friendId);
        query.find({
            success: function(results){
                console.log("friend query response:"+results);
                if(results.length>0){
                    console.log("length >0");
                } else{
                    console.log("friend not found. adding new friend");
                    var friend = new Friend();
                    friend.set("user",getLoggedInUser());
                    friend.set("friend",friendId);
                    console.log("user:"+getLoggedInUser()+"  friendid:"+friendId);
                    friend.save({
                    success :function(obj){
                      console.log("friend Saved!");
                    }, error : function(error){
                      console.log("friend Save Error:"+error.message);
                    }
                    });
                }
            }, error: function(error){
                console.log("friend query error:"+error.message);
            }
        });
    }
}

function notifyFriends(list){
 Parse.Cloud.run('setAllFriends', list,{
        success: function(){ 
            console.log("Friends list sent to cloud successfully");} 
        ,
        error :  function(error){ console.log("Some error while sending the freinds list to cloud");}
    });
}

function getNotificationsForUser(){
    var query = new Parse.Query(Notification);
    query.include("roast");
    query.equalTo("userID",Parse.User.current().get("username"));
    query.find({
        success: function(results){
            if(results.length>0){
                for(var i in results){
                    var roast = results[i].get("roast");
                    console.log("Roast for "+results[i].get("roast").get("victim").get("userFullName")+ "added");
                }
            } else{
                console.log("No notifications found");
            }
        }, error: function(error){
            console.log("getNotificationsForUser error:"+error.message);
        }
    });
}

/*function getComment(){
	//Return comment String
}


function getRoastContent(){
	//Return Roast String
}

function getVictim(){
	//Return User object
}

function getFile(){
	//Return File Object
}*/

function temp(){
    console.log("temp logs");
}

function logout(){
    // if(isLoggedIn()){
    //     console.log("currently in logout block");

    //     Parse.User.logOut({
    // success : function(){
    //   console.log("Logout Success");
    // },error : function(error){
    //   console.log("Logout error"+error.message);
    // }
    // });
    // }

    // if(isLoggedIn) console.log("sadly log out is not working");
    // else console.log("The logout is working may be!");
}