import { useState, useEffect } from "react";
import { getBinsData, getLatestObservation } from "./apiService"; // Adjust the path as needed

function DashboardComponent() {
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
  }, []); // Empty dependency array to run only once on component mount

  useEffect(() => {
    console.log("Observations:", observations);
  }, [observations]);

  return (
    <div>
      <h1>Tableau de Bord</h1>
      {binsData.map((bin) => (
        <div key={bin["@iot.id"]}>
          <h2>Poubelle {bin.name}</h2>
          <div>
            <p>ID: {bin["@iot.id"]}</p>
            <p>Description: {bin.description}</p>
            <p>Emplacement géographique: {bin.feature.type}({bin.feature.coordinates.join(",")})</p>
          </div>
          <hr />
          {observations[bin["@iot.id"]] ? (
            <div>
              <h3>Dernière observation</h3>
              <p>Date: {observations[bin["@iot.id"]].phenomenonTime}</p>
              <p>Temps de Résultat: {observations[bin["@iot.id"]].resultTime}</p>
            </div>
          ) : (
            <p>Pas d&apos;observation disponible</p>
          )}
        </div>
      ))}
    </div>
  );
}

export default DashboardComponent;
