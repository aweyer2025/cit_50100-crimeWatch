// Import packages
const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require ('body-parser')
const {PubSub} = require('@google-cloud/pubsub')
const { appendFileSynce } = require('fs');
const { json } = require('body-parser')
const dotenv = require('dotenv')

// Load enviroment varibales from .env file
dotenv.config();

//Port
const port = 8080;


//Middleware
app.use(bodyParser.urlencoded(  { extended: false}));
app.use(bodyParser.json());

app.use('/js', express.static(path.join(__dirname, 'public', 'js')));
app.use('/css', express.static(path.join(__dirname, 'public', 'css')));
app.use('/images', express.static(path.join(__dirname, 'public', 'images')));

//varible pointing to pubsub topic
const pubsub_topic = "crime_watch_signup";

//routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});


app.post('/subscribe', async (req, res) =>  {
  const location = req.body.watch_location;
  const email = req.body.email_address;
  const radius = req.body.distance_radius;
  

  //create a PubSub client
  const pubSubClient = new PubSub();

  //create message payload

  const message_data = JSON.stringify({
    watch_location: location,
    email_address: email,
    distance_radius: radius
    

  });

  //create data buffer to stream message to the topic
  const dataBuffer = Buffer.from(message_data);

  //publish the message to the PubSub topic
  const messageID = await pubSubClient.topic(pubsub_topic).publishMessage({data: dataBuffer});

  console.log(`Message ID: ${messageID}`);

  res.status(200).send(`You have been subsribed to crime watch <br/> Message ID ${messageID}`);

});

app.listen(port, () => {
  console.log(`Crime watch is listening on port ${port}`)
});