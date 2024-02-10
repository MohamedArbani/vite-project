import axios from 'axios';

// Function to obtain bins data
export const getBinsData = async () => {
    try {
        const response = await axios.get("http://localhost:8080/FROST-Server/v1.1/FeaturesOfInterest");
        return response.data.value;
    } catch (error) {
        console.error("Failed to fetch bins data.", error);
        throw error;
    }
};

// Function to obtain the latest observation for a specific bin
export const getLatestObservation = async (featureOfInterestId) => {
    try {
        const url = `http://localhost:8080/FROST-Server/v1.1/FeaturesOfInterest(${featureOfInterestId})/Observations?$top=1&$orderby=phenomenonTime%20desc`;
        const response = await axios.get(url);
        return response.data.value[0] || null;
    } catch (error) {
        console.error("Failed to fetch latest observation.", error);
        throw error;
    }
};
