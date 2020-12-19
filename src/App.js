import {Card, CardContent, makeStyles, TextField} from "@material-ui/core";
import {Autocomplete} from "@material-ui/lab";
import "leaflet/dist/leaflet.css";
import numeral from "numeral";
import {useEffect, useState} from "react";
import "./App.css";
import InfoBox from "./InfoBox";
import LineGraph from "./LineGraph";
import Map from "./Map";
import Table from "./Table";
import {prettyPrintStat, sortData} from "./utils";

const useStyles = makeStyles(() => ({
  inputRoot: {
    color: "#cc1034",
    fontWeight: "bold",
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "rgba(118, 118, 118, 0.3)",
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "rgba(118, 118, 118, 0.3);",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "rgba(118, 118, 118, 0.3)",
      borderWidth: 1,
    },
  },
}));

function App() {
  const classes = useStyles();
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

  const onCountryChange = async (event, country) => {
    const countryCode = country?.value;

    console.log(countryCode);

    const url =
      !countryCode || countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setSelectedCountry(countryCode);
        setCountryInfo(data);

        countryCode && countryCode !== "worldwide"
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

          <Autocomplete
            id="combo-box-demo"
            classes={classes}
            size="small"
            options={countries}
            getOptionLabel={(country) => country.name || ""}
            onChange={onCountryChange}
            // value={selectedCountry}
            style={{
              backgroundColor: "#fff",
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select country"
                variant="outlined"
              />
            )}
          />
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
      <Card className="card">
        <CardContent className="app__right">
          <div className="app__right__table">
            <h3>Live Cases by Country</h3>
            <Table countries={tableData} />
          </div>
          <div>
            <h3>Worldwide new {casesType}</h3>
            <div className="app_right__chart">
              <LineGraph casesType={casesType} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
