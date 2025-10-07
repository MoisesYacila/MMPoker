import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Alert, Box, Button, CircularProgress, Collapse, Dialog, DialogActions,
    DialogContent, DialogContentText, DialogTitle, IconButton, Menu, MenuItem, TextareaAutosize
} from "@mui/material";
import FavoriteIcon from '@mui/icons-material/Favorite';
import AddCommentIcon from '@mui/icons-material/AddComment';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import ClearIcon from '@mui/icons-material/Clear';
import { useUser } from "../UserContext";

export default function Post() {
    const { id } = useParams(); // Get post id from URL params
    const [postData, setPostData] = useState(null);
    const { id: userId, isAdmin } = useUser();
    const [isLiked, setIsLiked] = useState(false);
    const [textFieldActive, setTextFieldActive] = useState(false);
    const [comment, setComment] = useState('');
    const [currentComment, setCurrentComment] = useState({});
    const [openAlert, setOpenAlert] = useState(false);
    const [openCommentDialog, setOpenCommentDialog] = useState(false);
    const [openMenuDialog, setOpenMenuDialog] = useState(false);
    const [menuAnchor, setMenuAnchor] = useState(null);
    const navigate = useNavigate();
    const [disabled, setDisabled] = useState(false);

    // Load post data on the first render
    // If postData is not set, fetch it from the server
    useEffect(() => {
        if (!postData) {
            // Fetch post data from the server using the post id
            axios.get(`http://localhost:8080/posts/${id}`)
                .then((res) => {
                    setPostData(res.data);
                    console.log('Post data:', res.data);
                })
                .catch(() => {
                    console.error('Error fetching post data');
                });


            // We are not populating comments in the post fetch, so we need to fetch them separately
            axios.get(`http://localhost:8080/posts/${id}/comments`)
                .then((res) => {
                    // Functional update, safer than spreading postData directly because it ensures we have the latest state
                    setPostData(prevData => ({
                        ...prevData,
                        comments: res.data
                    }));
                    console.log('Comments data:', res.data);
                })
                .catch(() => {
                    console.error('Error fetching comments data');
                });

        }
    }, []);

    // Check if the user has liked the post
    useEffect(() => {
        if (postData && userId) {
            // includes will return true or false, so we can use it to set state
            setIsLiked(postData?.likedBy?.includes(userId));
        }
    }, [postData, userId]);

    // Dialog and menu handlers
    const handleCloseCommentDialog = () => {
        setOpenCommentDialog(false);
    };

    const handleCloseMenuDialog = () => {
        setOpenMenuDialog(false);
    }

    const handleMenuOpen = (event) => {
        setMenuAnchor(event.currentTarget);
    };

    const handleMenuClose = () => {
        setMenuAnchor(null);
    };

    // Render the post data
    return (
        <div>
            <Collapse in={openAlert}>
                <Alert severity='warning' action={
                    <IconButton onClick={() => {
                        setOpenAlert(false)
                    }}>
                        <ClearIcon></ClearIcon>
                    </IconButton>
                }>
                    A comment cannot be empty.
                </Alert>
            </Collapse>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {postData ? (
                    <>
                        <Box sx={{ padding: '2rem', textAlign: 'center', width: '80%' }}>
                            {/* Display post title and content */}
                            <h1>{postData.title}</h1>
                            <h4>Posted by {postData?.author?.username ? postData?.author?.username : <CircularProgress />} on {new Date(postData.date).toLocaleDateString()}</h4>
                            {postData.image && (
                                <img src={postData.image} alt="Post" style={{ width: '15%' }} />
                            )}
                            <p>{postData.content}</p>
                            {/* Show the button red if the user has already liked it and gray otherwise. Disable the button if the user is not logged in */}
                            <IconButton color={isLiked ? 'error' : 'default'} disabled={userId ? false : true} onClick={() => {
                                // Handle like action
                                // The empty object is the data we are sending, which is empty in this case
                                // The withCredentials option is set to true to include cookies in the request
                                // If we send credentials without the empty object, the server will not recognize the request
                                axios.patch(`http://localhost:8080/posts/${id}/like`, {}, { withCredentials: true })
                                    .then((res) => {
                                        setPostData(res.data);
                                    })
                                    .catch(() => {
                                        console.error('Error liking post');
                                    });
                            }}>
                                <FavoriteIcon />
                            </IconButton>
                            {postData.likes || 0}
                            {/* Show the Add Comment button only if the user is logged in */}
                            <IconButton sx={{ display: userId ? 'inline' : 'none' }} onClick={() => {
                                // Display the text area for adding a comment
                                setTextFieldActive(true);
                            }
                            }>
                                <AddCommentIcon />
                            </IconButton>
                            {/* Only admins can edit or delete, so we'll only show the button for them */}
                            {isAdmin ? <IconButton aria-label="more" onClick={(e) => {
                                handleMenuOpen(e);
                            }}>
                                <MoreHorizIcon />
                            </IconButton> : null}
                            {/* Menu for edit and delete options */}
                            {/* MUI syntax */}
                            {/* For the open prop, we need to check if the menu anchor is set (if so, it will be truthy)  */}
                            <Menu anchorEl={menuAnchor} onClose={handleMenuClose} open={Boolean(menuAnchor)}>
                                <MenuItem onClick={() => navigate(`/updates/${id}/edit`)}>Edit</MenuItem>
                                <MenuItem onClick={() => {
                                    setOpenMenuDialog(true);
                                }}>Delete</MenuItem>
                            </Menu>
                        </Box>
                        {/* Text area component from MUI for adding a comment */}
                        <TextareaAutosize name='comment' minRows={3} placeholder='Add your comment here...' value={comment}
                            style={{
                                width: '30%', marginBottom: '1rem', padding: '10px', fontSize: '16px', backgroundColor: '#f5f3f4',
                                display: textFieldActive ? 'block' : 'none'
                            }}
                            onChange={(e) => setComment(e.target.value)}>
                        </TextareaAutosize>
                        <Box>
                            {/* Button group, should only be displayed when the text area is active */}
                            <Button loading={disabled} loadingPosition="start" sx={{ display: textFieldActive ? 'inline' : 'none' }}
                                onClick={() => {
                                    // Disable the button to prevent multiple clicks
                                    setDisabled(true);

                                    if (comment.trim() === '') {
                                        setOpenAlert(true);
                                        setDisabled(false);
                                        return;
                                    }

                                    // Post request to add the comment
                                    axios.post(`http://localhost:8080/posts/${postData._id}/comments`, { content: comment }, { withCredentials: true })
                                        .then((res) => {
                                            // Update the post data with the new comment
                                            // Reset the comment input field and hide the text area and the alert
                                            // Re-enable the button after the request
                                            console.log(res.data);
                                            setPostData(res.data);
                                            setComment('');
                                            setTextFieldActive(false);
                                            setOpenAlert(false);
                                        })
                                        .catch((err) => {
                                            console.error('Error adding comment');
                                            console.error(err);
                                        });

                                    setDisabled(false);
                                }}
                            >Comment</Button>
                            <Button disabled={disabled} color='error' sx={{ display: textFieldActive ? 'inline' : 'none' }} onClick={() => {
                                setTextFieldActive(false);
                            }}>Cancel</Button>
                        </Box>
                        {/* Display comments. If we don't have any comments, using display flex to show the <p> in the center is a good option, otherwise, no need for flexbox here */}
                        <Box sx={{ width: '80%', marginTop: '2rem', display: postData.comments?.length > 0 ? '' : 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <h2>Comments</h2>
                            {/* If there are comments, map through them and display each one */}
                            {postData.comments && postData.comments.length > 0 ? (
                                postData.comments.map((comment, index) => (
                                    <Box key={index} sx={{ marginBottom: '1rem', padding: '1rem', border: '1px solid #ccc', display: 'flex', justifyContent: 'space-between' }}>
                                        {/* div to separate the content from the delete button */}
                                        <div>
                                            <p><strong>{comment.author?.username ? comment.author.username : <CircularProgress />}</strong> on {new Date(comment.date).toLocaleDateString()}</p>
                                            <p>{comment.content}</p>
                                        </div>
                                        <IconButton sx={{
                                            // Prevents the button shade from being an oval shape and only shows the delete button if the user is the author of the comment
                                            width: 40,
                                            height: 40,
                                            borderRadius: '50%',
                                            alignSelf: 'center',
                                            display: userId === comment.author?._id ? 'inline' : 'none'
                                        }} onClick={() => {
                                            setCurrentComment({
                                                id: comment._id,
                                                author: comment.author
                                            });
                                            setOpenCommentDialog(true);
                                        }}>
                                            <DeleteOutlineOutlinedIcon></DeleteOutlineOutlinedIcon>
                                        </IconButton>
                                    </Box>
                                ))
                            ) : (
                                <p>No comments yet. Be the first to add a comment.</p>
                            )}
                        </Box>
                        {/* Dialog for deleting comments */}
                        <Dialog open={openCommentDialog} onClose={handleCloseCommentDialog}>
                            <DialogTitle>Delete Comment</DialogTitle>
                            <DialogContent>
                                <DialogContentText>
                                    Are you sure you want to delete this comment? This action cannot be undone.
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button disabled={disabled} onClick={handleCloseCommentDialog}>Cancel</Button>
                                <Button disabled={disabled} color='error' onClick={() => {
                                    // Disable the button to prevent multiple clicks
                                    setDisabled(true);

                                    // Delete request to delete the comment
                                    console.log('Deleting comment', currentComment.id);
                                    // On a delete request, we have to send the withCredentials in the same object as the data
                                    axios.delete(`http://localhost:8080/posts/${id}/comments/${currentComment.id}`, {
                                        data: { author: currentComment.author }, // body for DELETE
                                        withCredentials: true
                                    })
                                        .then((res) => {
                                            // Update the post data to show the post without the deleted comment and re-enable the button
                                            setPostData(res.data);
                                            setDisabled(false);
                                        })
                                        .catch(() => {
                                            console.error('Error deleting comment');
                                        });
                                    handleCloseCommentDialog();
                                }}>Delete</Button>
                            </DialogActions>
                        </Dialog>

                        {/* Dialog for confirming post deletion */}
                        <Dialog open={openMenuDialog} onClose={handleCloseMenuDialog}>
                            <DialogTitle>Delete Post</DialogTitle>
                            <DialogContent>
                                <DialogContentText>
                                    Are you sure you want to delete this post? This action cannot be undone.
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button disabled={disabled} onClick={handleCloseMenuDialog}>Cancel</Button>
                                <Button loading={disabled} loadingPosition="start" color='error' onClick={() => {
                                    // Disable the button to prevent multiple clicks
                                    setDisabled(true);

                                    // Handle delete post logic here
                                    axios.delete(`http://localhost:8080/posts/${id}`, { withCredentials: true })
                                        .then(() => {
                                            // Navigate back to the updates page after deletion
                                            handleCloseMenuDialog();
                                            navigate('/updates');
                                        })
                                        .catch((error) => {
                                            console.error('Error deleting post:', error);
                                        });
                                }}>Delete</Button>
                            </DialogActions>
                        </Dialog>
                    </>
                ) : (
                    <CircularProgress />
                )}
            </Box>
        </div>
    )
}