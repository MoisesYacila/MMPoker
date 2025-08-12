import axios from "axios";
import { useState, useEffect } from "react";
import { Box, Button, TextareaAutosize, TextField } from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useNavigate, useParams } from "react-router-dom";

export default function EditPost() {
    //Get the game id from the URL
    const { id } = useParams();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState({});
    const [uploadedImage, setUploadedImage] = useState(false);
    const [deletedImage, setDeletedImage] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const navigate = useNavigate();

    // Function to handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        // Prevent multiple submissions
        if (submitted) return;
        setSubmitted(true);

        // We use FormData to be able to send the whole form data including the image while being able to handle the submission on the client side
        const formData = new FormData();

        // The first parameter must match what the server expects
        formData.append('title', title);
        formData.append('content', content);
        formData.append('deletedImage', deletedImage);

        if (image && uploadedImage)
            formData.append('picture', image);



        axios.patch(`http://localhost:8080/posts/${id}/edit`, formData, { withCredentials: true })
            .then(() => {
                console.log('Submitting edit post with title:', title);
                navigate(`/updates/${id}`);
            })
            .catch((error) => {
                console.error('Error editing post:', error);
                setSubmitted(false); // Reset submitted state on error
            });
    }

    useEffect(() => {
        axios.get(`http://localhost:8080/posts/${id}`, { withCredentials: true })
            .then((res) => {
                setTitle(res.data.title);
                setContent(res.data.content);
                // If the post has an image, set it
                if (res.data.image) {
                    setImage(res.data.image);
                    setDeletedImage(res.data.imagePublicId); // Set the public ID for the image to be deleted if a new one is uploaded
                }
            })
            .catch((error) => {
                console.error('Error fetching post:', error);
            });
    }, [id]);

    return (
        <Box component="form" action='http://localhost:8080/posts/:id/edit?_method=PATCH' method='POST' encType="multipart/form-data"
            onSubmit={handleSubmit}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: '2rem'
            }}>
            <h1>Edit Post</h1>
            <TextField
                label="Title"
                variant="outlined" name='title'
                sx={{ width: '30%', marginBottom: '1rem' }}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required />
            {/* MUI's Text Area */}
            <TextareaAutosize
                name='content'
                minRows={10}
                placeholder="Content"
                style={{ width: '30%', marginBottom: '1rem', padding: '10px', fontSize: '16px', backgroundColor: '#f5f3f4' }}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
            />
            <Button
                component="label"
                variant="contained"
                color="success"
                startIcon={<CloudUploadIcon />}
            >
                Swap or Upload Photo
                <input hidden type="file" name="picture" onChange={(e) => {
                    // e.target.files[0] is where the uploaded file will be if the user selects one
                    setImage(e.target.files[0]);
                    setUploadedImage(true);
                }} />
            </Button>
            <Button loading={submitted} loadingPosition="start" type="submit" variant="contained" sx={{ marginTop: '1rem' }}>
                Save Changes
            </Button>
        </Box>
    )

}