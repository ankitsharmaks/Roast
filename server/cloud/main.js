Parse.initialize("XUAXkfMROXgOJaAtB6KnV5lkYa138T0Ym59j3m9E", "lgmrdmFypwHHLGe7SfdW0ZW11Zf4qkTQhqH0AEHV");
var Roast = Parse.Object.extend("Roast");
var Comment = Parse.Object.extend("Comment");
var Friend = Parse.Object.extend("Friend");
var Notification= Parse.Object.extend("Notification");

Parse.Cloud.define("hello", function(request, response) {
  response.success("Hello world!");
});

Parse.Cloud.define("setAllFriends", function(request,response){
  for(id in request) {
    console.log(id);
    //console.log("movie:"+request.params.movie);
  }
  if(request.length>0)
    response.success();
  else
    response.error("Length 0");
});

/*Parse.Cloud.afterSave("Roast", function(request) {
    var victimID = request.object.get("victim").get("username");
    var query = new Parse.Query(Friend);
    query.equalTo("user",victimID);
    query.find({
        success: function(results){
            for(var i in results){
                var friendId = results[i].get("friend");
                var notification=new Notification();
                notification.set("userID",friendId);
                notification.set("roast",request.object);
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
});*/
/*Parse.Cloud.afterSave("Comment",function(request))
{
  query = new Parse.Query("Friend");
  query.include("friend");
  var roast=request.object.get("roast");
  query.equalTo("user",roast.object.get("victim"));
  query.find({
    success: function(users) {
     for(int i=0;i<users.length;i++)
	 {
		var user=users[i];
		var friend=user["friend"];
		sendNotification(friend,request.object);
	 }
    },
    error: function(error) {
      console.error("Got an error " + error.code + " : " + error.message);
    }
  });
}*/