//	Defines
const link_main = "https://picsum.photos/632/408?image=";
const link_fav = "https://picsum.photos/150/100?image=";
const alt_fav = "Favorite picture id=";

//	Global array where whole list of pictures are stored.
var list = [];

//	Vue object for main random picture
var randomVM = new Vue({

	el: "#main_section",

	data: {
		id: 0,
		in_fav: false,
		src: ""
	},

	methods: {
		//	Handles the clicked buttons
		handleButton: function(e) {

			const id = e.target.id;
			console.log(e);

			if (id == 'randomize_button') {
				randomizePic();
				this.in_fav = inFavorites(this.id);
			} else if (id == 'like_button') {
				addToFavorites();
			} else if (id == 'cancel_button') {
				removeFromFavorites();
			}
		}
	}
});

//	Vue object for favorite pictures
var favVM = new Vue({

	el: "#favorite_section",

	data: {
		favorites: []
	},

	methods: {
		//	Displays the clicked picture
		handleClick: function(e) {
			//	Getting the id of the picture
			const id = e.target.alt.split('id=')[1];

			randomVM.id = id;
			randomVM.in_fav = true;
			randomVM.src = link_main + id;
		}
	}
});

//	Generates a random picture
function randomizePic() {

	//	Picks a random element from the list array
	const random = Math.ceil(list.length * Math.random());

	randomVM.id = list[random].id;
	randomVM.src = link_main + randomVM.id;
}

//	Checks if the picture is already in favorites
function inFavorites(id) {

	for (var i = 0, c = favVM.favorites.length; i < c; i++) {
		if (favVM.favorites[i].id == id)
			return true;
	}

	return false;
}

//	Adds the current picture to favorites
function addToFavorites() {

	var new_fav = {};
	const id = randomVM.id;

	//	Checking if already in favorites
	if (inFavorites(id)) return ;

	new_fav.id = id;
	new_fav.alt = alt_fav + id;
	new_fav.src = link_fav + id;
	favVM.favorites.push(new_fav);

	//	Switching buttons
	randomVM.in_fav = true;
}

//	Removes the current picture from favorites
function removeFromFavorites() {

	for (var i = 0, c = favVM.favorites.length; i < c; i++) {
		if (favVM.favorites[i].id == randomVM.id) {
			favVM.favorites.splice(i, 1);
			randomVM.in_fav = false;
			return ;
		}
	}
}

//	Creates CORS requests
function createCORSRequest(method, url) {

	var xhr = new XMLHttpRequest();
	if ("withCredentials" in xhr) {
		// Most browsers
		xhr.open(method, url, true);
	} else if (typeof XDomainRequest != "undefined") {
		// IE8 & IE9
		xhr = new XDomainRequest();
		xhr.open(method, url);
	} else {
		// CORS not supported.
		xhr = null;
	}
	return xhr;
};

//	Requests and parses the list of pictures from Lorem Picsum
function requestData() {

	// making request
	const url = 'https://picsum.photos/list';
	const method = 'GET';
	var xhr = createCORSRequest(method, url);

	xhr.onload = function() {
		if (xhr.readyState == 4 && (xhr.status == 200)) {
			list = JSON.parse(xhr.responseText);
			randomizePic();
		}
	};

	xhr.send();
}

requestData();