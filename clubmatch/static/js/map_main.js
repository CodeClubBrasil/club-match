var map;
var markers = [];
var markers_options = {
    imagePath: 'images/m',
    styles: clusterStyles,
    gridSize: 50
};
var clusterStyles = [
  {
    textColor: 'white',
    url: 'images/smallclusterimage.png',
    height: 50,
    width: 50
  },
 {
    textColor: 'white',
    url: 'images/smallclusterimage.png',
    height: 50,
    width: 50
  },
 {
    textColor: 'white',
    url: 'images/smallclusterimage.png',
    height: 50,
    width: 50
  }
];

function FormatInfoWindowContent(club) {

  let canBeContacted = `${club.happy_to_be_contacted}`;
  let lookingForVolunteers = `${club.looking_for_volunteer}`;

  let infoWindowContent = `<h5>${club.name}</h5><hr>`

  // open address
  if(canBeContacted === 'true')
    infoWindowContent = infoWindowContent + `<strong>Endereço: </strong>${club.venue.address.address_1} ${club.venue.address.address_2}<br>`;

  if (club.venue.address.city !== null && club.venue.address.city !== '')
    infoWindowContent = infoWindowContent + `<strong>Cidade:</strong> ${club.venue.address.city}</br>`;

  if (club.venue.address.region !== null && club.venue.address.region !== '')
    infoWindowContent = infoWindowContent + `<strong>Estado:</strong> ${club.venue.address.region}</br>`;

  // club website
  if (club.venue.url !== null && club.venue.url !== '')
    infoWindowContent = infoWindowContent + `<strong>Site:</strong> ${club.venue.url}<br><br>`;

  // open address
  if(canBeContacted === 'true')
    infoWindowContent = infoWindowContent + `<strong>Líder do Clube:</strong> ${club.contact.name}<br>`;

  // to be volunteer cta
  if(lookingForVolunteers === 'true')
    infoWindowContent = infoWindowContent + `<br><a class="c-button c-button--green" href="https://www.codeclubbrasil.org.br/voluntariado/" target="blank">Voluntariar</a>`;

  // open address
  if(canBeContacted === 'true')
    infoWindowContent = infoWindowContent + `<a class="c-button c-button--green" style="margin-left:5px;" href="mailto:contato@codeclubbrasil.org.br?subject=Contato com o Code Club ${club.name} em ${club.venue.address.city}">Contato</a>`;

  return infoWindowContent;
}

function createGoogleMapMarker(map, club, infowindow) {
  let title = club.name;
  let latitude = parseFloat(club.venue.address.latitude);
  let longitude = parseFloat(club.venue.address.longitude);

  var marker = new google.maps.Marker({
    position: {
      lat: latitude,
      lng: longitude
    },
    title: title,
    icon:'images/pin.png',
    animation: google.maps.Animation.DROP,
    map: map
  });

  var contentString = FormatInfoWindowContent(club);

  marker.addListener('click', function() {
    infowindow.setContent(contentString);
    infowindow.open(map, marker);
  });

  markers.push(marker);
}

function getClubs(query, callback_success) {
  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;
  xhr.open("GET", '/clubs?search=' + query);
  xhr.setRequestHeader("accept", "application/json");
  xhr.send();

  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === 4) {
      return callback_success(JSON.parse(this.response));
    }
  });
}

function createLocationMarker(map, location) {
  var marker = new google.maps.Marker({
    position: {
      lat: location.lat,
      lng: location.lng
    },
    title: 'Sua localização',
    map: map
  });
}

function toggleLoading() {
  let loading = document.getElementById('loading');
  if (loading.style.display === "none" || loading.style.display == "") {
    loading.style.display = "block";
  } else {
    loading.style.display = "none";
  }
}

function initMap() {
  default_location = { lat: -15.6857596, lng: -47.6843683 }; // Planaltina, Brasília/DF
  var real_location;

  toggleLoading();

  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      function(position) {
        real_location = { lat: position.coords.latitude, lng: position.coords.longitude }

        buildMap(real_location, true, '');
      }
    );
  } else {
    console.log("Geolocation is not supported from browser.");
  }
  
  document.getElementById('search_form').addEventListener('submit', function(event) {
    event.preventDefault();
    search = document.getElementById('search').value;

    toggleLoading();

    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    }
    markers = [];

    getClubs(search, function(clubs) {
      toggleLoading();
      clubs.forEach((club) => createGoogleMapMarker(map, club, new google.maps.InfoWindow));
      // var markerCluster = new MarkerClusterer(map, markers, markers_options);
    });
  });

  buildMap(default_location, false, '');
}

function buildMap(location, is_real_location, query) {
  var infowindow = new google.maps.InfoWindow;

  map = new google.maps.Map(document.getElementById('map'), {
    zoom: is_real_location ? 8 : 4,
    center: location,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  });

  if (is_real_location) {
    createLocationMarker(map, location);
  }

  getClubs(query, function(clubs) {
    toggleLoading();
    clubs.forEach((club) => createGoogleMapMarker(map, club, infowindow));
    // var markerCluster = new MarkerClusterer(map, markers, markers_options);
  });
}
