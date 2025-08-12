import { useEffect, useState } from 'react';
import axios from 'axios';
import { useUser } from '../UserContext';
import {
    Box, Button, Card, CardHeader, CardMedia, CardContent, Dialog, DialogActions, DialogTitle,
    DialogContent, DialogContentText, IconButton, Menu, MenuItem, Typography, CardActionArea
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

export default function Updates() {
    // Check if the user is an admin to conditionally render the "New Post" link
    const { isAdmin } = useUser();
    const [allPosts, setAllPosts] = useState([]);
    const navigate = useNavigate();
    const [menuAnchor, setMenuAnchor] = useState(null);
    const [selectedPostId, setSelectedPostId] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [disabled, setDisabled] = useState(false);

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

    // Menu open and close handlers
    // We need to set and reset the anchor element for the menu and the selected post ID to handle actions like edit and delete
    // This allows us to open the menu for the specific post that was clicked

    const handleMenuOpen = (event, postId) => {
        setMenuAnchor(event.currentTarget);
        setSelectedPostId(postId);
    }

    const handleMenuClose = () => {
        setMenuAnchor(null);
        setSelectedPostId(null);
    }

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedPostId(null);
    }

    return (
        <Box sx={{ textAlign: 'center' }}>
            <h1>Updates</h1>
            {isAdmin ? <Link to='/updates/newpost'>New Post</Link> : null}
            {/* Map through all posts and display them */}
            {allPosts.map((post) => {
                return (
                    <Card key={post._id} sx={{ width: '80%', margin: 'auto', marginTop: 2, marginBottom: 2, display: 'flex' }}>
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
                                        subheader={`Posted on ${new Date(post.date).toLocaleDateString()} by ${post.author.name}`}
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
                        <Box>
                            {/* Only admins can edit or delete, so we'll only show the button for them */}
                            {isAdmin ? <IconButton aria-label="more" onClick={(e) => {
                                handleMenuOpen(e, post._id);
                            }}>
                                <MoreHorizIcon />
                            </IconButton> : null}

                            {/* Menu for edit and delete options */}
                            {/* MUI syntax */}
                            {/* For the open prop, we need to check if the menu anchor is set (if so, it will be truthy) 
                            and if the selected post ID matches the current post's ID, otherwise, the actions we click on might affect other posts.
                            This is because of the way that React re renders and handles elements in the .map call */}
                            <Menu anchorEl={menuAnchor} onClose={handleMenuClose} open={Boolean(menuAnchor) && selectedPostId === post._id}>
                                <MenuItem onClick={() => navigate(`/updates/${post._id}/edit`)}>Edit</MenuItem>
                                <MenuItem onClick={() => {
                                    setOpenDialog(true);
                                }}>Delete</MenuItem>
                            </Menu>
                        </Box>
                    </Card>
                );
            })}
            {/* Dialog for confirming post deletion */}
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Delete Post</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this post? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button disabled={disabled} onClick={handleCloseDialog}>Cancel</Button>
                    <Button loading={disabled} loadingPosition='start' color='error' onClick={() => {
                        // Disable the button to prevent multiple clicks
                        setDisabled(true);

                        // Handle delete post logic here
                        axios.delete(`http://localhost:8080/posts/${selectedPostId}`, { withCredentials: true })
                            .then(() => {
                                // Re-enable the button after deletion
                                setDisabled(false);

                                // Remove the post from the state after deletion
                                setAllPosts(allPosts.filter(post => post._id !== selectedPostId));
                                handleCloseDialog();
                            })
                            .catch((error) => {
                                console.error('Error deleting post:', error);
                            });
                    }}>Delete</Button>
                </DialogActions>
            </Dialog>
        </Box>

    )
}
