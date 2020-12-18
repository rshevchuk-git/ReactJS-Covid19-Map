import {
  Card,
  CardContent,
  FormControl,
  MenuItem,
  Select,
} from "@material-ui/core";
import "leaflet/dist/leaflet.css";
import numeral from "numeral";
import {useEffect, useState} from "react";
import "./App.css";
import InfoBox from "./InfoBox";
import LineGraph from "./LineGraph";
import Map from "./Map";
import Table from "./Table";
import {prettyPrintStat, sortData} from "./utils";

function App() {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");
  const [mapProps, setMapProps] = useState({
    position: {lat: 28.80746, lng: 18.4796},
    zoom: 2,
  });

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

        countryCode !== "worldwide"
          ? setMapProps({
              position: [data.countryInfo.lat, data.countryInfo.long],
              zoom: 5,
            })
          : setMapProps({position: {lat: 28.80746, lng: 18.4796}, zoom: 2});
      });
  };

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>
            C<img src="logo.png" className="app__logo" alt="logo" />
            VID-19 TRACKER
          </h1>
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

        <div className="app__map">
          <Map
            location={mapProps}
            countries={mapCountries}
            casesType={casesType}
            setCountryInfo={setCountryInfo}
          />
        </div>
      </div>
      <Card>
        <CardContent className="app__right">
          <div className="app__right__table">
            <h3>Live Cases by Country</h3>
            <Table countries={tableData} />
          </div>
          <div className="app_right__chart">
            <h3>Worldwide new {casesType}</h3>
            <LineGraph casesType={casesType} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
