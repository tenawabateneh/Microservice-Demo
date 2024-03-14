const express = require('express');
const bodyParser = require('body-parser');

// we need cors because there is a front application that make direct request to this comment service
const cors = require('cors');
const axios = require('axios');

// to generate a random id for each post from crypto lib
const { randomBytes } = require('crypto');

// waired up toMy app as a middleware and call them {bodyParser, cors}
const app = express();
app.use(bodyParser.json());
app.use(cors());

const allPosts = {};

// app route handlers such as get and post
app.get('/posts', (request, response) => {
    response.send(allPosts);
});

app.post('/posts/create', async (request, response) => {
    const id = randomBytes(4).toString('hex');
    const { title } = request.body;

    allPosts[id] = {
        id,
        title
    };

    // Noteifing the event to the event-bus
    await axios.post('http://event-bus-srv:4005/events', {
        type: 'NewPostCreated',
        data: {
            id,
            title
        }
    });

    response.status(201).send(allPosts[id]);
    console.log("The Created Post-ID  ==> " + allPosts[id].id + ' AND Post-TITLE ==> ' + allPosts[id].title);
});

// puting the post-event handler endpoint that comes from the event-bus
app.post('/events', (request, response) => {
    console.log('Recived an event ==> ', request.body.type);

    response.send({});
});

app.listen(4000, () => {
    console.log(" POST-SERVICE is Listening ON 4000 ");
});