import React, {useEffect} from "react";
import {TileLayer, useMap} from "react-leaflet";
import "./Map.css";
import {showDataOnMap} from "./utils";

function Map({location, countries, casesType}) {
  const map = useMap();

  useEffect(() => {
    map.setView(location.position);
  }, [location]);

  return (
    <>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      {showDataOnMap(countries, casesType)}
    </>
  );
}

export default Map;
