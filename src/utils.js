import {Circle, Popup} from "react-leaflet";
import numeral from "numeral";

const casesTypeColors = {
  cases: {
    hex: "#CC1034",
    multiplier: 250,
  },
  recovered: {
    hex: "#7dd71d",
    multiplier: 310,
  },
  deaths: {
    hex: "#323232",
    multiplier: 1000,
  },
};

export const sortData = (data) => {
  const sortedData = [...data];

  return sortedData.sort((a, b) => (a.cases > b.cases ? -1 : 1));
};

export const prettyPrintStat = (stat) => {
  return stat ? `+${numeral(stat).format("0.0a")}` : "+0";
};

export const showDataOnMap = (data, casesType = "cases", setCountryInfo) =>
  data.map((country) => {
    return (
      <Circle
        center={[country.countryInfo.lat, country.countryInfo.long]}
        color={casesTypeColors[casesType].hex}
        fillColor={casesTypeColors[casesType].hex}
        fillOpacity={0.4}
        radius={
          Math.sqrt(country[casesType]) * casesTypeColors[casesType].multiplier
        }
        onclick={() => setCountryInfo(country)}
      >
        <Popup className="infoContainer">
          <div>
            <div
              className="infoFlag"
              style={{backgroundImage: `url(${country.countryInfo.flag})`}}
            ></div>
            <div className="infoName">{country.country}</div>
            <div className="infoConfirmed">
              Cases: {numeral(country.cases).format("0,0")}
            </div>
            <div className="infoRecovered">
              Recovered: {numeral(country.recovered).format("0,0")}
            </div>
            <div className="infoDeaths">
              Deaths: {numeral(country.deaths).format("0,0")}
            </div>
          </div>
        </Popup>
      </Circle>
    );
  });
