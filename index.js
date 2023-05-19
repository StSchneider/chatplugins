// Import required modules
const express = require('express');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const bodyParser = require('body-parser');
require('dotenv').config();

// Import custom modules
const { getAirportData } = require('./src/app');

// Initialize Express application
const app = express();

// Set the port number
const PORT = process.env.PORT || 3000;

// Configure Express to parse JSON
app.use(bodyParser.json());

// Configure CORS options
const corsOptions = {
    origin: 'https://chat.openai.com',
    optionsSuccessStatus: 200 // For compatibility with legacy browsers (IE11, various SmartTVs)
};

// Use CORS middleware with the specified options
app.use(cors(corsOptions));

// Define content types for different file extensions
const contentTypes = {
    '.json': 'application/json',
    '.yaml': 'text/yaml',
};

// Function to read a file and send its contents as a response
const readFileAndSend = (filePath, res, contentType) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(`Error reading file: ${err}`);
            return res.status(500).send('An error occurred while reading the file.');
        }
        res.setHeader('Content-Type', contentType);
        res.send(data);
    });
};

// Route to serve the plugin manifest
app.get('/.well-known/ai-plugin.json', (req, res) => {
    readFileAndSend(path.join(__dirname, '.well-known/ai-plugin.json'), res, contentTypes['.json']);
});

// Route to serve the OpenAPI schema
app.get('/openapi.yaml', (req, res) => {
    readFileAndSend(path.join(__dirname, 'openapi.yaml'), res, contentTypes['.yaml']);
});

// Route to serve the logo image
app.get('/logo.jpg', (req, res) => {
    res.sendFile(path.join(__dirname, 'logo.png'));
});

// Route to fetch airport data
app.post('/airportData', async (req, res) => {
    const city = req.body.city;
    try {
        const data = await getAirportData(city);
        res.json(data);
    } catch (error) {
        console.error(`Error fetching airport data: ${error}`);
        res.status(500).send('Error occurred while fetching airport data');
    }
});

// Default route for unimplemented methods and paths
app.all('/*', (req, res) => {
    res.status(501).send(`Method ${req.method} not implemented for path ${req.path}`);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
