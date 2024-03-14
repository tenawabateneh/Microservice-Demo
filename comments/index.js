const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
// we need cors for handleing front application that make direct request to this comment service
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const commentsByPostId = {};

app.get('/posts/:id/comments', (req, res) => {
    res.send(commentsByPostId[req.params.id] || []);
});

app.post('/posts/:id/comments', async (request, response) => {
    const commentID = randomBytes(4).toString('hex');
    const { content } = request.body;

    const comments = commentsByPostId[request.params.id] || [];

    comments.push({ id: commentID, content, moderationStatus: 'pending' });

    commentsByPostId[request.params.id] = comments;

    // notifing this event to the event-bus
    await axios.post('http://event-bus-srv:4005/events', {
        // space on string not allowed
        type: 'NewCommentCreated',
        data: {
            id: commentID,
            content,
            postId: request.params.id,
            moderationStatus: 'pending'
        }
    });

    response.status(201).send(comments);
});

// puting the post-event handler endpoint that comes from the event-bus
app.post('/events', async (req, res) => {
    console.log('Event Received:', req.body.type);

    // pull of type and data property
    const { type, data } = req.body;

    if (type === 'CommentModerated') {
        const { postId, id, moderationStatus, content } = data;
        // getting the comments from commentsByPostId
        const comments = commentsByPostId[postId];

        const comment = comments.find(comment => {
            return comment.id === id;
        });

        // Updating the comment-moderation status
        comment.moderationStatus = moderationStatus;

        // Emitting Comment-moderation Updated to the event-bus
        await axios.post('http://event-bus-srv:4005/events', {
            type: 'CommentUpdated',
            data: {
                id,
                moderationStatus,
                postId,
                content
            }
        });
    }


    // just responding it's fine
    res.send({});
});

app.listen(4001, () => {
    console.log(' COMMENT-SERVICE is Listening on 4001');
});
