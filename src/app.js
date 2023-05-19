// Import required modules
const dotenv = require('dotenv');
const axios = require('axios');

// Load environment variables from .env file
dotenv.config();

// Retrieve API key from environment variables
const API_KEY = process.env.API_KEY;

/**
 * Fetches airport data for a given city using the API Ninjas Airports API.
 *
 * @param {string} city - The city for which to fetch airport data.
 * @returns {Promise<Object>} The airport data for the specified city.
 * @throws {Error} If an error occurs during the API request.
 */
async function getAirportData(city) {
    const options = {
        method: 'GET',
        url: `https://api.api-ninjas.com/v1/airports?name=${city}`,
        headers: {
            'X-Api-Key': API_KEY
        }
    };

    try {
        const response = await axios.request(options);
        return response.data;
    } catch (error) {

        console.error(`An error occurred while fetching airport data: ${error.response.data}`);
        throw error;
    }
}

module.exports = {
    getAirportData
};
