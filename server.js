const express = require('express');
const bodyParser = require('body-parser');
const loudness = require('loudness'); // Ensure this works for Windows

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static('public')); // Serves the client HTML and assets

const MIN_VOLUME = 10;

// Endpoint to get the current volume
app.get('/volume', async (req, res) => {
    try {
        const currentVolume = await loudness.getVolume();
        res.json({ volume: currentVolume });
    } catch (error) {
        res.status(500).send('Failed to retrieve volume');
    }
});

// Endpoint to set the volume
app.post('/volume', async (req, res) => {
    const { volume } = req.body;

    if (volume < MIN_VOLUME || volume > 100) {
        return res.status(400).send(`Volume must be between ${MIN_VOLUME} and 100`);
    }

    try {
        await loudness.setVolume(volume);
        res.send(`Volume set to ${volume}`);
    } catch (error) {
        res.status(500).send('Failed to set volume');
    }
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
