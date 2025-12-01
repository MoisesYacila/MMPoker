import api from "../api/axios";
import { useState } from "react";
import { Alert, Box, Button, Collapse, IconButton, TextareaAutosize, TextField, Tooltip } from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ClearIcon from '@mui/icons-material/Clear';
import InfoOutlineIcon from '@mui/icons-material/InfoOutlined';
import { useNavigate } from "react-router-dom";
import { useAlert } from "../AlertContext";
import { errorLog } from '../utils/logger.js';

export default function NewPost() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const { alert, setAlert } = useAlert();
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
            setAlert({ message: 'Title or content cannot be empty.', severity: 'warning', open: true });
            setSubmitted(false);
            return;
        }

        if (image)
            formData.append('picture', image);

        // Post request to the server to create a new post
        api.post('/posts', formData)
            .then(() => {
                setAlert({ message: 'Post created.', severity: 'success', open: true });
                navigate('/updates');
            })
            .catch((error) => {
                errorLog('Error creating post:', error);
                // If user tries to upload a file that's not an image, show an alert telling them and reset the button
                if (error.status === 415) {
                    setImage({});
                    setAlert({ message: `${error.response.data.message}. Allowed types are jpg, jpeg, png and webp.`, severity: 'error', open: true });
                    setSubmitted(false); //resets button
                }
                else {
                    // Show alert for validation errors from the server
                    if (error?.response?.data && error.response.data.startsWith('Validation error:')) {
                        setAlert({ message: error.response.data, severity: 'error', open: true });
                        setSubmitted(false);
                    }
                    else {
                        setAlert({ message: 'Error creating post.', severity: 'error', open: true });
                        navigate('/updates');
                    }
                }
            });
    }
    return (
        <div>
            <Collapse in={alert.open}>
                <Alert severity={alert.severity} action={
                    <IconButton onClick={() => {
                        setAlert({ ...alert, open: false });
                    }}>
                        <ClearIcon></ClearIcon>
                    </IconButton>
                }>
                    {alert.message}
                </Alert>
            </Collapse>
            {/* Form to create a new post
             We need the encType to be multipart/form-data to allow file uploads */}
            <Box component="form" encType="multipart/form-data"
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
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {/* Show the upload button or the name of the updated file if the user already selected one */}
                    {!image.name ? <Button
                        component="label"
                        variant="contained"
                        color="success"
                        startIcon={<CloudUploadIcon />}
                    >
                        Upload Picture
                        <input hidden type="file" name="picture" onChange={(e) => {
                            // If the image is larger than our established limit (2MB), don't allow the upload and show an alert
                            if (e.target.files[0]?.size > 2 * 1024 * 1024) {
                                // Reset e.target.value to keep showing the alert if the user tries uploading the same image multiple times
                                e.target.value = null;
                                setAlert({ message: 'Error. Maximum size allowed is 2MB.', severity: 'error', open: true });
                                return;
                            }
                            // e.target.files[0] is where the uploaded file will be if the user selects one
                            setImage(e.target.files[0]);
                        }} />
                    </Button> : <Box sx={{ display: 'flex' }}>
                        <Box sx={{ marginRight: '0.7rem' }}>{image.name}</Box>
                        {/* Reset image to re render the upload button */}
                        <IconButton onClick={() => {
                            setImage({});
                        }}>
                            <ClearIcon fontSize='small' />
                        </IconButton>
                    </Box>}

                    <Tooltip title='2MB Max Size' sx={{ marginLeft: '0.7rem' }}>
                        <InfoOutlineIcon />
                    </Tooltip>
                </Box>
                <Button loading={submitted} loadingPosition="start" type="submit" variant="contained" sx={{ marginTop: '1rem' }}>
                    Create Post
                </Button>
            </Box>
        </div>
    );
}