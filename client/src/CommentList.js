import React from 'react';

const CommentList = ({ comments }) => {

    const renderedComments = comments.map(comment => {
        let content;

        if (comment.moderationStatus === 'approved') {
            content = comment.content + ' STATUS:APPROVED';
        }

        if (comment.moderationStatus === 'pending') {
            content = 'This Comment Awaiting For Moderation Process... SO, STATUS:PENDING';
        }

        if (comment.moderationStatus === 'rejected') {
            content = 'This Comment has been Rejected! SO, STATUS:REJECTED';
        }

        return <li key={comment.id}>{content}</li>;
    });

    return <ol> {renderedComments} </ol>;
};

export default CommentList;