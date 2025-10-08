import api from "../api/axios";
import { useState } from "react";
import { Alert, Box, Button, Collapse, IconButton, TextareaAutosize, TextField } from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ClearIcon from '@mui/icons-material/Clear';
import { useNavigate } from "react-router-dom";

export default function NewPost() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [openAlert, setOpenAlert] = useState(false);
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

        // Validate that title and content are not empty
        if (formData.get('title').trim() === '' || formData.get('content').trim() === '') {
            setOpenAlert(true);
            setSubmitted(false);
            return;
        }

        if (image)
            formData.append('picture', image);

        // Post request to the server to create a new post
        api.post('/posts', formData)
            .then(() => {
                navigate('/updates');
            })
            .catch((error) => {
                console.error('Error creating post:', error);
            });
    }


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
                    Title or content cannot be empty.
                </Alert>
            </Collapse>
            {/* Form to create a new post
             We need the encType to be multipart/form-data to allow file uploads */}
            <Box component="form" action='http://localhost:8080/posts' method='POST' encType="multipart/form-data"
                onSubmit={handleSubmit}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: '2rem'
                }}>
                <h1>New Post</h1>
                <TextField
                    label="Title"
                    variant="outlined" name='title'
                    sx={{ width: '30%', marginBottom: '1rem' }}
                    onChange={(e) => setTitle(e.target.value)}
                    required />
                {/* MUI's Text Area */}
                <TextareaAutosize
                    name='content'
                    minRows={10}
                    placeholder="Content"
                    style={{ width: '30%', marginBottom: '1rem', padding: '10px', fontSize: '16px', backgroundColor: '#f5f3f4' }}
                    onChange={(e) => setContent(e.target.value)}
                    required
                />
                {/* Button with a hidden file input to allow image upload */}
                <Button
                    component="label"
                    variant="contained"
                    color="success"
                    startIcon={<CloudUploadIcon />}
                >
                    Upload Picture
                    <input hidden type="file" name="picture" onChange={(e) => {
                        // e.target.files[0] is where the uploaded file will be if the user selects one
                        setImage(e.target.files[0]);
                    }} />
                </Button>
                <Button loading={submitted} loadingPosition="start" type="submit" variant="contained" sx={{ marginTop: '1rem' }}>
                    Create Post
                </Button>
            </Box>
        </div>
    );
}