import { useParams } from "react-router-dom";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, CircularProgress, IconButton } from "@mui/material";
import FavoriteIcon from '@mui/icons-material/Favorite';
import AddCommentIcon from '@mui/icons-material/AddComment';
import { useUser } from "../UserContext";

export default function Post() {
    const { id } = useParams(); // Get post id from URL params
    const [postData, setPostData] = useState(null);
    const [name, setName] = useState('');
    const { id: userId } = useUser();
    const [isLiked, setIsLiked] = useState(false);

    // Load post data on the first render
    // If postData is not set, fetch it from the server
    useEffect(() => {
        if (!postData) {
            // Fetch post data from the server using the post id
            axios.get(`http://localhost:8080/posts/${id}`)
                .then((res) => {
                    setPostData(res.data);
                })
                .catch(() => {
                    console.error('Error fetching post data');
                });
        }
    }, []);

    // Check if the user has liked the post
    useEffect(() => {
        if (postData && userId) {
            // includes will return true or false, so we can use it to set state
            setIsLiked(postData.likedBy.includes(userId));
        }
    }, [postData, userId]);

    // Fetch the author's name based on the postData
    useEffect(() => {
        // If postData is not set exit early
        if (!postData) return;

        // Get the author's name from the server
        axios.get(`http://localhost:8080/account/${postData.author}/name`)
            .then((res) => {
                setName(res.data);
            })
            .catch(() => {
                console.error('Error fetching author name');
            });
    }, [postData]);

    // Render the post data
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {postData ? (
                <Box sx={{ padding: '2rem', textAlign: 'center', width: '80%' }}>
                    {/* Display post title and content */}
                    <h1>{postData.title}</h1>
                    <h4>Posted by {name} on {new Date(postData.date).toLocaleDateString()}</h4>
                    {postData.image && (
                        <img src={postData.image} alt="Post" style={{ width: '15%' }} />
                    )}
                    <p>{postData.content} Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ad pariatur, adipisci similique totam quidem maiores iusto animi? Quasi tenetur, quibusdam illo vitae dolor voluptas! Quidem asperiores nobis adipisci eius tempora.
                        Doloremque amet ullam ea molestiae, nisi id magnam inventore, eius consequuntur ipsum modi. Facere asperiores culpa ut fugit? Minima, eveniet nemo. Suscipit, nemo laborum aspernatur voluptas in voluptatum. Ducimus, dolor.
                        Aliquid molestiae officiis unde labore odio velit, corrupti nam dicta excepturi minima, consequatur laboriosam necessitatibus exercitationem tempora optio, expedita fugiat voluptate in? Quas numquam dolor enim maxime facere vero aperiam.
                        Iure, provident repudiandae ipsa delectus sunt cupiditate deserunt consequatur quibusdam harum asperiores repellat, accusantium quod fugiat totam. Porro tenetur magnam doloribus exercitationem, officiis in voluptatibus fuga? A nihil iste modi?
                        Eos dolor excepturi maiores odit ad. Nulla numquam voluptatibus omnis. Aliquam qui cupiditate magnam, dicta odio iusto voluptatibus modi, eveniet obcaecati provident sed, praesentium quos. Tempore, saepe enim! Officiis, natus.</p>
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
                    <IconButton>
                        <AddCommentIcon />
                    </IconButton>

                </Box>
            ) : (
                <CircularProgress />
            )}
        </Box>
    )
}