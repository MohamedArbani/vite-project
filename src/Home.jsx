import { useState, useEffect } from "react";
import "leaflet.locatecontrol";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import { getBinsData, getLatestObservation } from "./apiService"; // Adjust the path as needed

import {
  Table,
  Header,
  HeaderRow,
  Body,
  Row,
  Cell,
  HeaderCell,
} from "@table-library/react-table-library/table";

import { useTheme } from "@table-library/react-table-library/theme";

//import PropTypes from "prop-types";

function Home() {
  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [data, setData] = useState([]);
  const [markerPositions, setMarkerPositions] = useState([]);
  const [binsData, setBinsData] = useState([]);
  const [observations, setObservations] = useState({});

  useEffect(() => {
    // Fetch bins data when component mounts
    getBinsData()
      .then((data) => {
        setBinsData(data);
        // Fetch latest observation for each bin
        data.forEach((bin) => {
          getLatestObservation(bin["@iot.id"])
            .then((observation) => {
              setObservations((prevObservations) => ({
                ...prevObservations,
                [bin["@iot.id"]]: observation,
              }));
            })
            .catch((error) =>
              console.error("Failed to fetch latest observation.", error)
            );
        });
      })
      .catch((error) => console.error("Failed to fetch bins data.", error));
  }, []);

  const THEME = {
    Table: ``,
    Header: ``,
    Body: ``,
    BaseRow: `
      background-color: var(--theme-ui-colors-background);
      border-radius: 10px;
      border: 1px solid var(--theme-ui-colors-border);
  
      &.row-select-selected, &.row-select-single-selected {
        background-color: var(--theme-ui-colors-background-secondary);
        color: var(--theme-ui-colors-text);
      }
    `,
    HeaderRow: `
      background-color: var(--theme-ui-colors-background-header);
      color: var(--theme-ui-colors-text-light);
  
      .th {
        border-bottom: 1px solid var(--theme-ui-colors-border);
      }
    `,
    Row: `
      color: var(--theme-ui-colors-text);
  
      &:not(:last-of-type) .td {
        border-bottom: 1px solid var(--theme-ui-colors-border);
      }
  
      &:hover {
        color: var(--theme-ui-colors-text-light);
      }
    `,
    BaseCell: `
      border-bottom: 1px solid transparent;
      border-right: 1px solid transparent;
  
      padding: 8px;
      height: 52px;
  
      svg {
        fill: var(--theme-ui-colors-text);
      }
      &:not(:last-of-type) {
        border-right: 1px solid var(--theme-ui-colors-border);
      }
    `,
    HeaderCell: ``,
    Cell: ``,
  };
  const theme = useTheme(THEME);
  const handleSectionClick = (section, image) => {
    setSelectedSection(section);
    setSelectedImage(image);

    let newData = [];
    let newMarkerPositions = [];

    switch (section) {
      case 0: // ALL
        newData = [
          { name: "Page A", uv: 4000, pv: 2400, amt: 2400 },
          { name: "Page B", uv: 3000, pv: 1398, amt: 2210 },
          { name: "Page C", uv: 2000, pv: 9800, amt: 2290 },
          { name: "Page D", uv: 2780, pv: 3908, amt: 2000 },
          { name: "Page E", uv: 1890, pv: 4800, amt: 2181 },
          { name: "Page F", uv: 2390, pv: 3800, amt: 2500 },
          { name: "Page G", uv: 3490, pv: 4300, amt: 2100 },
        ];
        newMarkerPositions = [
          [51.005, -0.06],
          [51.105, -0.07],
          [51.205, -0.08],
          [51.305, -0.09],
          [51.405, -0.1],
          [51.505, -0.11],
          [51.605, -0.12],
          [51.705, -0.13],
          [51.805, -0.14],
          [51.905, -0.15],
        ];
        break;
      case 1: // LEVEL>70
        newData = [
          { name: "Page A", uv: 4500, pv: 2600, amt: 2600 },
          { name: "Page B", uv: 3200, pv: 1498, amt: 2310 },
          { name: "Page C", uv: 2200, pv: 10100, amt: 2390 },
          { name: "Page D", uv: 2980, pv: 4408, amt: 2100 },
          { name: "Page E", uv: 1990, pv: 5200, amt: 2281 },
          { name: "Page F", uv: 2490, pv: 4000, amt: 2600 },
          { name: "Page G", uv: 3590, pv: 4500, amt: 2200 },
        ];
        newMarkerPositions = [[51.51, -0.12]];
        break;
      case 2: // LEVEL<30
        newData = [
          { name: "Page A", uv: 3500, pv: 1800, amt: 1800 },
          { name: "Page B", uv: 2500, pv: 1398, amt: 2210 },
          { name: "Page C", uv: 1600, pv: 8800, amt: 2190 },
          { name: "Page D", uv: 2380, pv: 3408, amt: 1800 },
          { name: "Page E", uv: 1390, pv: 4200, amt: 1981 },
          { name: "Page F", uv: 1790, pv: 3200, amt: 2200 },
          { name: "Page G", uv: 2890, pv: 3700, amt: 1900 },
        ];
        newMarkerPositions = [[51.515, -0.1]];
        break;
      case 3: // Prediction
        newData = [
          { name: "Page A", uv: 5000, pv: 3000, amt: 3000 },
          { name: "Page B", uv: 3700, pv: 1598, amt: 2510 },
          { name: "Page C", uv: 2800, pv: 11800, amt: 2690 },
          { name: "Page D", uv: 3580, pv: 4908, amt: 2300 },
          { name: "Page E", uv: 2590, pv: 5600, amt: 2481 },
          { name: "Page F", uv: 3290, pv: 4200, amt: 2800 },
          { name: "Page G", uv: 4390, pv: 4700, amt: 2400 },
        ];
        newMarkerPositions = [[51.505, -0.1]];
        break;
      default:
        break;
    }

    setData(newData);
    setMarkerPositions(newMarkerPositions);
  };
  //Transform date to format YYYY-MM-DD
  const formatDate = (date) => {
    const d = new Date(date);
    let month = "" + (d.getMonth() + 1);
    let day = "" + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [day, month, year].join("/");
  };

  const sections = [
    { title: "ALL" },
    { title: "LEVEL>70" },
    { title: "LEVEL<30" },
    { title: "Prediction" },
  ];

  return (
    <main className="main-container">
      <section>
        <h1>Informations sur les Bins</h1>
        <Table
          data={{ nodes: binsData }}
          theme={theme}
          layout={{ fixedHeader: true }}
        >
          {(tableList) => (
            <>
              <Header>
                <HeaderRow>
                  <HeaderCell resize>Id</HeaderCell>
                  <HeaderCell resize>Name</HeaderCell>
                  <HeaderCell resize>Description</HeaderCell>
                  <HeaderCell resize>Location</HeaderCell>
                  <HeaderCell resize>Phenomenon Time</HeaderCell>
                  <HeaderCell resize>Resulut Time</HeaderCell>
                </HeaderRow>
              </Header>

              <Body>
                {tableList.map((item) => (
                  <Row key={item["@iot.id"]} item={item}>
                    <Cell>{item["@iot.id"]}</Cell>
                    <Cell>{item.name}</Cell>
                    <Cell>{item.description}</Cell>
                    <Cell>
                      {item.feature.type}({item.feature.coordinates.join(",")})
                    </Cell>
                    <Cell>
                      {observations[item["@iot.id"]]
                        ? formatDate(observations[item["@iot.id"]].phenomenonTime)
                        : "N/A"}
                    </Cell>
                    <Cell>
                      {observations[item["@iot.id"]]
                        ? formatDate(observations[item["@iot.id"]].resultTime)
                        : "N/A"}
                    </Cell>
                  </Row>
                ))}
              </Body>
            </>
          )}
        </Table>
      </section>

      <div className="main-title">
        <h3>DASHBOARD</h3>
      </div>

      <div className="main-cards">
        {sections.map((section, index) => (
          <button
            key={index}
            className={`card ${selectedSection === index ? "active" : ""}`}
            onClick={() => handleSectionClick(index)}
            style={{ textAlign: "center" }}
          >
            <div className="card-inner" style={{ fontSize: "2rem" }}>
              <h3 style={{ textAlign: "center" }}>{section.title}</h3>
              {/* Ajoutez ici l'icône correspondante si nécessaire */}
            </div>
            <h1>{section.value}</h1>
          </button>
        ))}
      </div>

      {/* Contenu supplémentaire en fonction de la section sélectionnée */}
      {selectedSection !== null && (
        <div className="section-content">
          <h2 style={{ textAlign: "center", fontSize: "2rem" }}>
            {sections[selectedSection].title} Content
          </h2>
          {selectedImage && (
            <img
              src={selectedImage}
              alt={`Image for ${sections[selectedSection].title}`}
            />
          )}

          {/* Carte Leaflet et Graphiques */}
          <div style={{ display: "flex", flexDirection: "row" }}>
            <div style={{ flex: 1, marginRight: "20px" }}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  width={500}
                  height={300}
                  data={data}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="pv" fill="#8884d8" />
                  <Bar dataKey="uv" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>

              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  width={500}
                  height={300}
                  data={data}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="pv"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                  />
                  <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div style={{ flex: 1 }}>
              <MapContainer
                center={[51.505, -0.09]}
                zoom={13}
                style={{ height: "600px", width: "800px" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="&copy; OpenStreetMap contributors"
                />
                {markerPositions.map((coord, index) => (
                  <Marker key={index} position={coord}>
                    <Popup>A Marker Here! Replace with your content.</Popup>
                  </Marker>
                ))}
                <MyComponent />
              </MapContainer>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function MyComponent() {
  const [routingControl, setRoutingControl] = useState(null);
  const map = useMapEvents({
    click: (e) => {
      const gotolat = e.latlng.lat;
      const gotolng = e.latlng.lng;

      console.log("gotolat :>> ", gotolat);
      console.log("gotolng :>> ", gotolng);
      map.locate().on("locationfound", (i) => {
        console.log(i.latlng);
        if (routingControl) {
          routingControl.getPlan().setWaypoints([]);
          map.removeControl(routingControl);
        }
        const waypoints = [
          L.latLng(i.latlng.lat, i.latlng.lng),
          L.latLng(gotolat, gotolng),
        ];
        const routing = L.Routing.control({
          waypoints,
          lineOptions: {
            styles: [{ color: "blue", opacity: 0.7, weight: 5 }],
          },
        }).addTo(map);
        setRoutingControl(routing);
      });
    },
    locationfound: (location) => {
      console.log("location found:", location);
    },
  });
  return null;
}

export default Home;
