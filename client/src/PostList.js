import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CommentCreate from './CommentCreate';
import CommentList from './CommentList';

const PostList = () => {
    const [posts, setPosts] = useState({});

    // fetching posts from post sercice
    const fetchPosts = async () => {
        // get all information from query service
        const response = await axios.get('http://posts.com/posts');
        // console.log(response.data);

        setPosts(response.data);
    };
    // This useeffect used for to run the fetchPosts function when this component is displaed
    // The 2nd argument empty array tell to react to run the fetchPosts function only one time 
    useEffect(() => {
        fetchPosts();
    }, []);
    // console.log(posts);

    // rendering posts 
    const renderedPosts = Object.values(posts).map(post => {
        return (
            <div
                className="card"
                style={{ width: '30%', marginBottom: '20px' }}
                key={post.id}
            >
                <div className="card-body">
                    <h3>{post.title}</h3>
                    <CommentList comments={post.comments} />
                    <CommentCreate postID={post.id} />
                </div>
            </div>
        );
    });

    return (
        <div className="d-flex flex-row flex-wrap justify-content-between">
            {renderedPosts}
        </div>
    );
};

export default PostList;