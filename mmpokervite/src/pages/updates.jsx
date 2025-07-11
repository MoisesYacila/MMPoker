import { useEffect, useState } from 'react';
import axios from 'axios';
import { useUser } from '../UserContext';
import { Box, Card, CardHeader, CardMedia, CardContent, Typography, CardActionArea } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

export default function Updates() {
    // Check if the user is an admin to conditionally render the "New Post" link
    const { isAdmin } = useUser();
    const [allPosts, setAllPosts] = useState([]);
    const [name, setName] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch all posts from the server
        axios.get('http://localhost:8080/posts', { withCredentials: true })
            .then((res) => {
                setAllPosts(res.data);
            })
            .catch((error) => {
                console.error('Error fetching posts:', error);
            });
    }, []);

    return (
        <Box sx={{ textAlign: 'center' }}>
            <h1>Updates</h1>
            {isAdmin ? <Link to='/updates/newpost'>New Post</Link> : null}
            {/* Map through all posts and display them */}
            {allPosts.map((post) => {
                axios.get(`http://localhost:8080/account/${post.author}/name`)
                    .then((res) => {
                        setName(res.data);
                    })
                    .catch(() => {
                        console.error('Error fetching author name');
                    });
                return (
                    <Card key={post._id} sx={{ width: '80%', margin: 'auto', marginTop: 2 }}>
                        <CardActionArea onClick={() => {
                            // Navigate to the post page with the post ID
                            navigate(`/updates/${post._id}`);
                        }}>
                            <Box sx={{ display: 'flex' }}>
                                {/* Will only render if post.image is not an empty string */}
                                {/* Similar as post.image ? <CardMedia> : null */}
                                {post.image && (
                                    <CardMedia
                                        component="img"
                                        image={post.image}
                                        alt="Post image"
                                        sx={{ width: '20%', height: 'auto' }}
                                    />
                                )}
                                <Box sx={{ display: 'flex', width: post.image ? '80%' : '100%', flexDirection: 'column' }}>
                                    <CardHeader
                                        title={post.title}
                                        subheader={`Posted on ${new Date(post.date).toLocaleDateString()} by ${name}`}
                                    />
                                    <CardContent>
                                        <Typography variant="body2" color="text.secondary">
                                            {/* Display a preview of the post content, truncating if it's too long */}
                                            {post.content.length > 100 ? post.content.substring(0, 100) + '...' : post.content}
                                        </Typography>
                                    </CardContent>
                                </Box>
                            </Box>
                        </CardActionArea>
                    </Card>
                );
            })}
        </Box>

    )
}
