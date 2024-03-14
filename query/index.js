const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const allPosts = {};

// handle all event when call in from this(Query) service app.post route handler
const handleEvent = (type, data) => {
    // handleing each conditition
    if (type === 'NewPostCreated') {
        const { id, title } = data;
        allPosts[id] = { id, title, comments: [] };
    }
    if (type === 'NewCommentCreated') {
        const { id, content, postId, moderationStatus } = data;

        const post = allPosts[postId];
        // persisting the comments
        post.comments.push({ id, content, moderationStatus });
    }

    // Too much generic update and last action which is perform on query service
    if (type === 'CommentUpdated') {
        const { id, content, postId, moderationStatus } = data;
        // Getting a specfic post by postId from the above allPosts array 
        const post = allPosts[postId];
        // Getting a specfic comment by finding from all comments assoscated with this gotten post
        const comment = post.comments.find(comment => {
            return comment.id === id;
        });

        // Because of this is a generic update... Update Everything b/c may be if there is some change on content
        comment.moderationStatus = moderationStatus;
        comment.content = content;
    }
};

app.get('/posts', (request, response) => {
    response.send(allPosts);
});

// hundlling all incoming events here
app.post('/events', (request, response) => {
    const { type, data } = request.body;

    handleEvent(type, data);

    // console.log('The Current Data-Structure ==> ', allPosts);
    console.log(allPosts);
    // Just saying recived fine
    response.send({});
});

app.listen(4002, async () => {
    console.log("QUERY-SERVICE is Listening on 4002");

    // Asking event-bus to get all events what I missed
    const response = await axios.get('http://event-bus-srv:4005/events');
    for (let event of response.data) {
        console.log('Processing Event: ', event.type);

        handleEvent(event.type, event.data);
    }
});