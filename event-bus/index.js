const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
// assocatining this express app with the bodyParser as a middleware
app.use(bodyParser.json());

const allEvents = [];

// reciving a post request event from post service
app.post('/events', (request, response) => {
    // reciving what ever format of event
    const event = request.body;
    allEvents.push(event);

    // notifiy or echo to all parties about the recived event(OR make a serious post request to downward)

    axios.post('http://posts-clusterip-srv:4000/events', event);  // emiting event to post service
    axios.post('http://comments-srv:4001/events', event);  // emiting event to comment service
    axios.post('http://query-srv:4002/events', event);  // emiting event to query service
    axios.post('http://moderation-srv:4003/events', event);  // emiting event to moderation service

    // sending back status report
    response.send({ status: 'OK' });
});

// To handle missing-events during the query service goes down
app.get('/events', (request, response) => {
    // responding/sending all events
    response.send(allEvents);
});

app.listen(4005, () => {
    console.log(" EVENT-BUS-SERVICE is Listening on 4005 ");
});
