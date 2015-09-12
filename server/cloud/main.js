
// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.define("hello", function(request, response) {
  response.success("Hello world!");
});

Parse.Cloud.afterSave("Roast", function(request) {
  query = new Parse.Query("Friend");
  query.include("friend");
  query.equalTo("user",request.object.get("victim"));
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
}

function sendNotification(user, roast)
{
	var Notification=Parse.Object.extend("Notification");
	var notification=new Notification();
	notification.set("user",user);
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

Parse.Cloud.afterSave("Comment",function(request))
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
}