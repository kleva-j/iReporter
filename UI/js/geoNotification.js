function initMap() {
  const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      const config = { zoom: 17, center: pos };
      const infoWindow = new google.maps.InfoWindow();
      const map = new google.maps.Map(document.querySelector('#map'), config);
      infoWindow.setPosition(pos);
      infoWindow.setContent('Location found.');
      infoWindow.open(map);
      map.setCenter(pos);

      const checkAddress = document.querySelector('.address')
        .addEventListener('click', getLocation);

      async function getLocation(event) {
        event.preventDefault();
        const address = document.querySelector('#address').value;
        if (address === '') {
          console.log('Address field is empty');
          return;
        }

        try {
          const data = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
            params: {
              address,
              key: 'AIzaSyB0rESKxxyOCdD5o7BEiUKwHW-hErMDMPI',
            },
          });
          const { location } = data.data.results[0].geometry;
          const newPos = location ? { lat: location.lat, lng: location.lng } : undefined;
          if (newPos) {
            infoWindow.setPosition(newPos);
            map.setCenter(newPos);
          } else {
            infoWindow.setContent('Error: The Geolocation service failed.');
          }
          infoWindow.open(map);
        } catch (err) {
          console.error(err);
        }
      }
    }, () => {
      handleLocationError(true, infoWindow, map.getCenter());
    }, options);
  } else {
    handleLocationError(false, infoWindow, map.getCenter());
  }
  function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation
      ? 'Error: The Geolocation service failed.'
      : 'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
  }
}
