import React, { useState } from 'react';
import axios from 'axios';

const CommentCreate = ({ postID }) => {
    const [content, setContent] = useState('');

    const submitHandler = async event => {
        event.preventDefault();

        // throw the content here
        await axios.post(`http://posts.com/posts/${postID}/comments`, {
            content
        });
        // after submitting the comment make the content value empty
        setContent('');
    };
    return (
        <div>
            <form onSubmit={submitHandler}>
                <div className="form-group">
                    <label>New Comment</label>
                    <input
                        value={content}
                        onChange={e => setContent(e.target.value)}
                        className="form-control"
                    />
                </div>
                <button className="btn btn-primary">Submit</button>
            </form>
        </div>
    );
};

export default CommentCreate;
