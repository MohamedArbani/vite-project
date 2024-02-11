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
} from "recharts";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { getBinsData, getLatestObservation } from "./services/apiService";
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
import PropTypes from "prop-types";


function Home() {
  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [data, setData] = useState([]);
  const [markerPositions, setMarkerPositions] = useState([]);
  const [binsData, setBinsData] = useState([]);
  const [observations, setObservations] = useState({});

  useEffect(() => {
    getBinsData()
      .then((data) => {
        setBinsData(data);
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
  
      .td {
        border-bottom: 1px solid var(--theme-ui-colors-border);
      }
  
      &:hover {
        color: var(--theme-ui-colors-text-light);
      }
    `,
    BaseCell: `

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
  const calculatePercentage = (value) => {
    return value.toFixed(2);
  };
  const handleSectionClick = (section, image) => {
    setSelectedSection(section);
    setSelectedImage(image);

    let newData = [];
    let newMarkerPositions = [];

    switch (section) {
      case 0: // ALL
        newData = binsData.map((bin) => ({
          name: bin.name,
          result: observations[bin["@iot.id"]]
            ? observations[bin["@iot.id"]].result
            : 0,
        }));
        newMarkerPositions = binsData.map((bin) => [
          bin.properties.geometry.coordinates[0],
          bin.properties.geometry.coordinates[1],
        ]);
        break;
      // ... (other cases)
    }

    setData(newData);
    setMarkerPositions(newMarkerPositions);
  };

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
    // ... (other sections)
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
                  <HeaderCell resize>Result Time</HeaderCell>
                  <HeaderCell resize>Result</HeaderCell>
                </HeaderRow>
              </Header>

              <Body>
                {tableList.map((item) => (
                  <Row key={item["@iot.id"]} item={item}>
                    <Cell>{item["@iot.id"]}</Cell>
                    <Cell>{item.name}</Cell>
                    <Cell>{item.description}</Cell>
                    <Cell>
                      {item.properties.geometry?.type
                        ? ` ${
                            item.properties.geometry.type
                          }(${item.properties.geometry.coordinates.join(",")})`
                        : "N/A"}
                    </Cell>
                    <Cell>
                      {observations[item["@iot.id"]]
                        ? formatDate(
                            observations[item["@iot.id"]].phenomenonTime
                          )
                        : "N/A"}
                    </Cell>
                    <Cell>
                      {observations[item["@iot.id"]]
                        ? formatDate(observations[item["@iot.id"]].resultTime)
                        : "N/A"}
                    </Cell>
                    <Cell>
                      <Cell>
                        {observations[item["@iot.id"]]
                          ? calculatePercentage(
                              observations[item["@iot.id"]].result
                            )
                          : "N/A"}
                      </Cell>
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
            </div>
            <h1>{section.value}</h1>
          </button>
        ))}
      </div>
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

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <ResponsiveContainer width="80%" height={400}>
              <BarChart
                width={600}
                height={400}
                data={data}
                margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  interval={0}
                />
                <YAxis
                  tickFormatter={(value) => `${calculatePercentage(value)}%`}
                />
                <Tooltip
                  formatter={(value) => `${calculatePercentage(value)}%`}
                />
                <Legend />
                <Bar dataKey="result" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>

            <MapContainer
              center={markerPositions[0] || [0, 0]}
              zoom={13}
              style={{ height: "600px", width: "800px", marginTop: "20px" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
              />
              {markerPositions.map((coord, index) => (
                <MyMarker key={index} coord={coord} index={index} />
              ))}
            </MapContainer>
          </div>
        </div>
      )}
    </main>
  );
}

function MyMarker({ coord, index }) {
  const [routingControl, setRoutingControl] = useState(null);
  const map = useMap();

  const handleMarkerClick = () => {
    map.locate().on("locationfound", (i) => {
      if (routingControl) {
        routingControl.getPlan().setWaypoints([]);
        map.removeControl(routingControl);
      }
      const waypoints = [
        L.latLng(i.latlng.lat, i.latlng.lng),
        L.latLng(coord[0], coord[1]),
      ];
      const routing = L.Routing.control({
        waypoints,
        lineOptions: {
          styles: [{ color: "blue", opacity: 0.7, weight: 5 }],
        },
      }).addTo(map);
      setRoutingControl(routing);
    });
  };

  return (
    <Marker
      key={index}
      position={coord}
      riseOnHover
      eventHandlers={{ click: handleMarkerClick }}
    >
      <Popup>{`Dushbin ${index + 1} - Point(${coord[0]}, ${coord[1]})`}</Popup>
    </Marker>
  );
}

MyMarker.propTypes = {
  coord: PropTypes.arrayOf(PropTypes.number).isRequired,
  index: PropTypes.number.isRequired,
};

export default Home;
