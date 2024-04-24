
const express = require('express');
const bodyParser = require('body-parser');
const { PubSub } = require('@google-cloud/pubsub');
const path = require('path');
const dotenv = require('dotenv');
const { queryNearbyCrimes } = require('../gcf2-query/index.js')
const axios = require('axios')


dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const port = process.env.PORT || 8080;
const pubsub = new PubSub();
const topicName = 'user_search_topic';

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/api/maps-api-key', (req, res) => {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
      console.error('API Key not found or not set in .env');
      return res.status(500).send('API Key not found');
  }
  res.send(apiKey);
});

app.post('/submitSearch', async (req, res) => {
    const messageData = JSON.stringify(req.body);
    const dataBuffer = Buffer.from(messageData);

    try {
        const messageId = await pubsub.topic(topicName).publishMessage({ data: dataBuffer });
        console.log(`Message ${messageId} published.`);

        //call gcf using Axios

        const response = await axios.post('https://us-central1-chicago-crimes-420200.cloudfunctions.net/crimeQuery',req.body)
        const results = response.data;
        console.log(results);
        res.json(results); // Send JSON response
    } catch (error) {
        console.error(`Failed to publish message: ${error}`);
        res.status(500).send('Failed to submit search data.');
    }
});




app.listen(port, () => {
    console.log(`Chicago Crimes Web App listening on port ${port}`);
});



