import {
  Card,
  CardContent,
  FormControl,
  MenuItem,
  Select,
} from "@material-ui/core";
import {useState, useEffect} from "react";
import "./App.css";
import InfoBox from "./InfoBox";
import LineGraph from "./LineGraph";
import Map from "./Map";
import Table from "./Table";
import {prettyPrintStat, showDataOnMap, sortData} from "./utils";
import numeral from "numeral";
import {MapContainer} from "react-leaflet";
import "leaflet/dist/leaflet.css";

function App() {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCountries, setMapCountries] = useState([]);
  const [mapProps, setMapProps] = useState({
    position: {lat: 48.80746, lng: 18.4796},
    zoom: 3,
  });
  const [casesType, setCasesType] = useState("cases");

  useEffect(() => {
    const fetchData = async () => {
      await fetch("https://disease.sh/v3/covid-19/all")
        .then((response) => response.json())
        .then((data) => setCountryInfo(data));
    };

    fetchData();
  }, []);

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));

          const sortedData = sortData(data);
          setTableData(sortedData);
          setMapCountries(data);
          setCountries(countries);
        });
    };
    getCountriesData();
  }, []);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;

    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setSelectedCountry(countryCode);
        setCountryInfo(data);

        setMapProps({
          position: [data.countryInfo.lat, data.countryInfo.long],
          zoom: 4,
        });
      });
  };

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>COVID-19 TRACKER</h1>
          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              onChange={onCountryChange}
              value={selectedCountry}
            >
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map((country, key) => (
                <MenuItem key={key} value={country.value}>
                  {country.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div className="app__stats">
          <InfoBox
            textColor="red"
            active={casesType === "cases" ? casesType : false}
            onClick={(e) => setCasesType("cases")}
            title="Coronavirus cases"
            cases={prettyPrintStat(countryInfo.todayCases)}
            total={numeral(countryInfo.cases).format("0,0")}
          ></InfoBox>
          <InfoBox
            textColor="green"
            active={casesType === "recovered" ? casesType : false}
            onClick={(e) => setCasesType("recovered")}
            title="Recoveries"
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            total={numeral(countryInfo.recovered).format("0,0")}
          ></InfoBox>
          <InfoBox
            textColor="black"
            active={casesType === "deaths" ? casesType : false}
            onClick={(e) => setCasesType("deaths")}
            title="Deaths"
            cases={prettyPrintStat(countryInfo.todayDeaths)}
            total={numeral(countryInfo.deaths).format("0,0")}
          ></InfoBox>
        </div>

        <Card className="map">
          <MapContainer center={mapProps.position} zoom={3}>
            <Map
              countries={mapCountries}
              location={mapProps}
              casesType={casesType}
            />
            {showDataOnMap(mapCountries, casesType)}
          </MapContainer>
        </Card>
      </div>
      <Card className="app__right">
        <CardContent>
          <h3>Live Cases by Country</h3>
          <Table countries={tableData} />

          <h3>Worldwide new {casesType}</h3>
          <LineGraph casesType={casesType} />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
