import React from "react";
import {Map as LeafletMap, TileLayer} from "react-leaflet";
import "./Map.css";
import {showDataOnMap} from "./utils";

function Map({location, countries, casesType, setCountryInfo}) {
  const parentHeight = window.innerHeight - 290;

  const showGlobalInfo = async () => {
    await fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => setCountryInfo(data));
  };

  return (
    <div className="map">
      <LeafletMap
        style={{height: parentHeight}}
        center={location.position}
        zoom={location.zoom}
        onclick={showGlobalInfo}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        {showDataOnMap(countries, casesType, setCountryInfo)}
      </LeafletMap>
    </div>
  );
}

export default Map;
