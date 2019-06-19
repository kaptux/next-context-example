import GoogleMapReact from 'google-map-react';
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { mapOptions, ourBuildings, places, parks, neighborhoodOverlays } from '../data/map';

const MapContainer = styled.div`
  height: 100%;
  width: 100%;
`;

const Map = ({ activeFilter }) => {
  const [map, setMapState] = useState(null);
  const [maps, setMapsState] = useState(null);
  const [overlays, setOverlays] = useState([]);
  const [infoWindows, setInfoWindows] = useState({});

  useEffect(() => {
    // console.log('filter - updated');
    drawMapFeatures();
  }, [activeFilter]);

  useEffect(() => {
    // console.log('maps - updated');
    drawParks();
    drawMapFeatures();
  }, [maps]);

  const setUpMap = (map, maps) => {
    setMapState(map);
    setMapsState(maps);
  };

  const drawMapFeatures = () => {
    clearOverlays();
    switch (activeFilter) {
      case 'Our Buildings':
        drawNeighborhoods();
        drawBuildings();
        break;
      case 'Restaurants':
        drawMarkers(places['RESTAURANTS']);
        break;
      case 'Grab & Go Food':
        drawMarkers(places['GRAB & GO FOOD']);
        break;
      case 'Event Spaces':
        drawMarkers(places['EVENT SPACES']);
        break;
      case 'Bars':
        drawMarkers(places['BARS']);
        break;
      case 'Cafes + Bakeries':
        drawMarkers(places['CAFES + BAKERIES']);
        break;
      case 'Retail':
        drawMarkers(places['RETAIL']);
        break;
      case 'Health + Fitness':
        drawMarkers(places['HEALTH + FITNESS']);
        break;
      case 'Galleries + Museums':
        drawMarkers(places['GALLERIES + MUSEUMS']);
        break;
      case 'Film, Theater And Culture':
        drawMarkers(places['FILM, THEATER AND CULTURE']);
        break;
      case 'Bank And Convenience':
        drawMarkers(places['BANK AND CONVENIENCE']);
        break;
      default:
        break;
    }
  };

  const drawParks = () => {
    if (map && maps) {
      parks.forEach(park => {
        const tempPark = new maps.Polygon({
          paths: park,
          strokeColor: '#afc47b',
          strokeOpacity: '1',
          strokeWeight: 1,
          fillOpacity: '0.8',
          fillColor: '#afc47b'
        });
        tempPark.setMap(map);
      });
    } else {
      // console.log('maps not setup');
    }
  };

  const drawBuildings = () => {
    if (map && maps) {
      const buildingsArray = [...overlays];
      ourBuildings.forEach(building => {
        const tempBuilding = new maps.Polygon({
          paths: building.path,
          strokeColor: '#369BF7',
          strokeOpacity: '1',
          strokeWeight: 0.5,
          fillOpacity: '1',
          fillColor: '#369BF7',
          zIndex: 100
        });
        const tempMarker = new maps.Marker({
          position: building.markerPos,
          icon: { url: building.markerImg, scaledSize: new maps.Size(90, 60), anchor: new maps.Point(45, 30) }
        });
        tempBuilding.addListener('click', () => {
          window.location.href = building.url;
        });
        tempBuilding.setMap(map);
        tempMarker.setMap(map);
        buildingsArray.push(tempBuilding);
        buildingsArray.push(tempMarker);
      });
      if (overlays !== buildingsArray) {
        // console.log('buildings');
        setOverlays(buildingsArray);
      }
    }
  };

  const drawMarkers = data => {
    const markersArray = [...overlays];
    if (map && maps) {
      const service = new maps.places.PlacesService(map);
      Object.keys(data).forEach(key => {
        const tempMarker = new maps.Marker({
          icon: {
            path: 'M0,4a4,4 0 1,0 8,0a4,4 0 1,0 -8,0',
            fillColor: '#369bf7',
            fillOpacity: 0.95,
            scale: 1.5,
            strokeColor: '#000000',
            strokeWeight: 1,
            anchor: new maps.Point(-1, 4),
            labelOrigin: new maps.Point(4, 15)
          },
          position: data[key].position,
          label: { color: '#000000', fontWeight: 'bold', fontSize: '12px', text: data[key].name }
        });
        const tempInfoWindow = new maps.InfoWindow();

        tempMarker.addListener('click', () => {
          fetchInfoWindow(service, tempInfoWindow, tempMarker, key);
        });
        tempMarker.setMap(map);
        markersArray.push(tempMarker);
      });
    }
    if (overlays !== markersArray) {
      setOverlays(markersArray);
    }
  };

  const fetchInfoWindow = (service, infoWindow, marker, key) => {
    if (infoWindows[key]) {
      let windowContent = infoWindows[key];
      infoWindow.setContent(windowContent);
      infoWindow.open(map, marker);
    } else {
      service.getDetails(
        {
          placeId: key,
          fields: ['name', 'rating', 'formatted_address', 'geometry', 'photos', 'url', 'website']
        },
        (place, status) => {
          if (status === 'OK') {
            let newWindow = {};
            newWindow[key] = generateInfoWindow(place);
            setInfoWindows(Object.assign(infoWindows, newWindow));
            infoWindow.setContent(newWindow[key]);
            infoWindow.open(map, marker);
          }
        }
      );
    }
  };

  const drawNeighborhoods = () => {
    if (map && maps) {
      const neighborhoodArray = [...overlays];
      neighborhoodOverlays.forEach(neighborhood => {
        const tempNeighborhood = new maps.Polygon({
          paths: neighborhood.path,
          strokeColor: '#369BF7',
          strokeOpacity: 0,
          fillOpacity: 0,
          strokeWeight: 0,
          fillColor: '#369BF7',
          zIndex: 100
        });
        maps.event.addListener(tempNeighborhood, 'mouseover', function() {
          this.setOptions({ fillOpacity: '0.5' });
        });
        maps.event.addListener(tempNeighborhood, 'mouseout', function() {
          this.setOptions({ fillOpacity: '0' });
        });
        tempNeighborhood.setMap(map);
        neighborhoodArray.push(tempNeighborhood);
      });
      if (overlays !== neighborhoodArray) {
        // console.log('neighborhoods');
        // console.log(neighborhoodArray.length);
        setOverlays(neighborhoodArray);
      }
    }
  };

  const clearOverlays = () => {
    if (overlays.length > 0) {
      const overlaysCopy = [...overlays];
      while (overlaysCopy.length > 0) {
        const overlay = overlaysCopy.pop();
        overlay.setMap(null);
      }
      // console.log('clear');
      // console.log(overlaysCopy.length);
      setOverlays(overlaysCopy);
      // console.log('overlays', overlays.length);
    }
  };

  const generateInfoWindow = ({ photos, name, url, formatted_address, rating }) => {
    return `<div class="styled-info-window">
        <img src="${photos[0].getUrl()}" alt={${name}} />
        <h5>${name}</h5>
        <a href=${url} target="_blank" rel="noopener noreferrer">
          Website
        </a>
        <span>${formatted_address}</span>
        ${parseStars(rating)}
      </div>`;
  };

  const parseStars = numStars => {
    var stars = [];
    var intRating = parseInt(numStars);
    for (var i = 0; i < intRating; i++) {
      stars.push(
        '<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 576 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z"></path></svg>'
      );
    }
    return `<div class="star-row">
        <div class="number-rating">${numStars}</div>
        <div class="stars-rating">${stars}</div>
      </div class="star-row">`;
  };

  return (
    <MapContainer>
      <GoogleMapReact
        bootstrapURLKeys={{ key: 'AIzaSyBSsLXxJ5NSrSgFjFW7U5hxmGyHnE1po88', libraries: ['places'] }}
        defaultCenter={{
          lat: 40.726,
          lng: -74.006
        }}
        defaultZoom={16}
        options={mapOptions}
        placesLibrary={true}
        yesIWantToUseGoogleMapApiInternals
        onGoogleApiLoaded={({ map, maps }) => setUpMap(map, maps)}
      />
    </MapContainer>
  );
};

export default Map;
