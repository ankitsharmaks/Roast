
$(document).ready(function(){
   loadProfile();
});

// loads user profile on their profile page
function loadProfile() {
	var id = getLoggedInUser();
	var uname = getLoggedInUserName();

	var div_profile_banner = document.createElement('div');
	var div_main = document.getElementById('main');

	div_profile_banner.id = 'profile_banner';
	div_profile_banner.innerHTML = '<img src="http://graph.facebook.com/' + id + '/picture?width=100" /><h2>' + uname + '</h2>'
		+ '<button type="button" onclick="location.href = \'create_roast.html\';">Start Roast</button>';
	div_main.appendChild(div_profile_banner);

	var div_history = document.createElement('div');
	var div_feed = document.createElement('div');
	div_history.id = 'history';
	div_feed.id = 'feed';
	div_history.innerHTML = '<h3>Roast History</h3>';
	div_feed.innerHTML = '<h3>Feed</h3>';

	div_main.appendChild(div_feed);
	div_main.appendChild(div_history);

}