import React, { useState, useEffect } from "react";
import {
  FormControl,
  Select,
  MenuItem,
  Card,
  CardContent,
} from "@material-ui/core";
import Infobox from "./component/Infobox";
import Map from "./component/Map";
import "./App.css";
import Table from "./component/Table";
import { prettyPrintStat, sortData } from "./component/util";
import LineGraph from "./component/LineGraph";
import "leaflet/dist/leaflet.css";

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("Worldwide");
  const [countryInfo, setcountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({
    lat: 34.80746,
    lng: -40.4796,
  });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [caseType,setCaseType] = useState("cases");

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setcountryInfo(data);
      });
  }, []);

  useEffect(() => {
    const getCountryData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));
          const sortedData = sortData(data);
          // It only shows the country with highest coronavirus cases
          setTableData(sortedData);
          // Its shows all the countries with the total cases
          // setTableData(data)
          setCountries(countries);
          setMapCountries(data);
        });
    };
    getCountryData();
  }, []);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;

    console.log(countryCode);

    const url =
      countryCode === "Worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode} `;
    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountry(countryCode);

        //  All the data from country reaponse
        setcountryInfo(data);
        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);
      });
  };
  console.log(countryInfo);

  return (
    <div className="App">
      <div className="app__left">
        {/* Header */}
        <div className="app__header">
          <h1>Covid 19 Tracker App</h1>
          <FormControl>
            <Select
              variant="outlined"
              value={country}
              onChange={onCountryChange}
            >
              <MenuItem value="Worldwide">Worldwide</MenuItem>
              {countries.map((count) => (
                <MenuItem value={count.value}>{count.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div className="app__stats">
          <Infobox
          isRed
          onClick = {e =>setCaseType('cases')}
          active={caseType === 'cases'}
            title="Corona Cases"
            cases={prettyPrintStat(countryInfo.todayCases)}
            total={prettyPrintStat(countryInfo.active)}
          />
          <Infobox
          onClick = {e =>setCaseType('recovered')}
          active={caseType ==='recovered'}
            title="Corona Recovered"
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            total={prettyPrintStat(countryInfo.recovered)}
          />
          <Infobox
          isPink
          onClick = {e =>setCaseType('deaths')}
          active={caseType === 'deaths'}
            title="Corona Deaths"
            cases={prettyPrintStat(countryInfo.todayDeaths)}
            total={prettyPrintStat(countryInfo.deaths)}
          />
        </div>

        <Map caseType = {caseType} countries={mapCountries} center={mapCenter} zoom={mapZoom} />
      </div>

      {/* Title select input dropdown */}

      {/* info box Corona Virus Cases */}
      {/* info box  Corona recoveries*/}
      {/* info box Corona Deaths */}

      {/* table */}
      {/* graph */}

      {/* Map */}

      <Card className="app__right">
        <CardContent>
          <h3>Live Casess by country</h3>
          <Table countries={tableData} />
          <h3>World Wide new {caseType}</h3>
          <LineGraph caseType={caseType} />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;

// npm i react-leaflet
// npm i leaflet
// npm i chart-js2
