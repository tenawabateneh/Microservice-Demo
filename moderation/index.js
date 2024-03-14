const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

// post request handler to watch any request comes in '/events' endpoint from event-bus
app.post('/events', async (request, response) => {
    const { type, data } = request.body;

    // handling NewCommentCreated conditition for moderation OR just Filtering comment content
    if (type === 'NewCommentCreated') {
        const status = data.content.includes('orange') ? 'rejected' : 'approved';
        // after process the moderation emit moderation to the event-bus
        await axios.post('http://event-bus-srv:4005/events', {
            type: 'CommentModerated',
            data: {
                id: data.id,
                postId: data.postId,
                moderationStatus: status,
                content: data.content
            }
        });
    }
    response.send({});
});

app.listen(4003, () => {
    console.log(" MODERATION-SERVICE is Listening on 4003 ");
});