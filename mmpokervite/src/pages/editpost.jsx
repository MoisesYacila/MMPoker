import api from "../api/axios";
import { useState, useEffect } from "react";
import { Alert, Box, Button, Collapse, IconButton, TextareaAutosize, TextField, Tooltip } from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ClearIcon from '@mui/icons-material/Clear';
import InfoOutlineIcon from '@mui/icons-material/InfoOutlined';
import { useNavigate, useParams } from "react-router-dom";
import { useAlert } from "../AlertContext";

export default function EditPost() {
    //Get the game id from the URL
    const { id } = useParams();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [existingImage, setExistingImage] = useState('');
    const [newImage, setNewImage] = useState({});
    const [deletedImage, setDeletedImage] = useState('');
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
        formData.append('deletedImage', deletedImage);

        // Validate that title and content are not empty
        if (formData.get('title').trim() === '' || formData.get('content').trim() === '') {
            setAlert({ message: 'Title or content cannot be empty.', severity: 'warning', open: true });
            setSubmitted(false);
            return;
        }

        // If there's a new image, add it to the form data
        if (newImage?.name) {
            formData.append('picture', newImage);
        }

        // Post request to edit the post
        api.patch(`/posts/${id}/edit`, formData)
            .then(() => {
                console.log('Submitting edit post with title:', title);
                setAlert({ message: 'Post updated.', severity: 'success', open: true });
                navigate(`/updates/${id}`);
            })
            .catch((error) => {
                console.error('Error editing post:', error);
                // If user tries to upload a file that's not an image, show an alert telling them and reset the button
                if (error.status === 415) {
                    setNewImage({});
                    setAlert({ message: `${error.response.data.message}. Allowed types are jpg, jpeg, png and webp.`, severity: 'error', open: true });
                    setSubmitted(false); //resets button
                }
                else {
                    setAlert({ message: 'Error editing post.', severity: 'error', open: true });
                    navigate('updates');
                }
            });
    }

    useEffect(() => {
        api.get(`/posts/${id}`)
            .then((res) => {
                setTitle(res.data.title);
                setContent(res.data.content);
                // If the post has an image, set it
                if (res.data.image) {
                    setExistingImage(res.data);
                }
            })
            .catch((error) => {
                console.error('Error fetching post:', error);
            });
    }, [id]);

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

                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    {/* If the post has an image already, show it with an x button to remove it */}
                    {existingImage ? <>
                        <img src={existingImage.image} alt="Post" style={{ width: '15%' }} />
                        <IconButton sx={{
                            // Prevents the button shade from being an oval shape
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            alignSelf: 'center',
                            marginLeft: '1rem'
                        }} onClick={() => {
                            // Set the deleted image for the backend to handle it and remove the existing image
                            setDeletedImage(existingImage.imagePublicId)
                            setExistingImage('');
                        }}>
                            <ClearIcon fontSize='small' />
                        </IconButton>
                    </> : <>
                        <Box sx={{ display: 'flex', alignItems: 'center', marginTop: newImage ? '1rem' : '' }}>
                            {/* If there's no new image uploaded, show the button to upload one, otherwise, show the name with the x to cancel the upload */}
                            {!newImage.name ? <Button
                                component="label"
                                variant="contained"
                                color="success"
                                startIcon={<CloudUploadIcon />}
                            >
                                Upload Photo
                                <input hidden type="file" name="picture" onChange={(e) => {
                                    // If the image is larger than our established limit (2MB), don't allow the upload and show an alert
                                    if (e.target.files[0]?.size > 2 * 1024 * 1024) {
                                        // Reset e.target.value to keep showing the alert if the user tries uploading the same image multiple times
                                        e.target.value = null;
                                        setAlert({ message: 'Error. Maximum size allowed is 2MB.', severity: 'error', open: true });
                                        return;
                                    }
                                    // e.target.files[0] is where the uploaded file will be if the user selects one
                                    setNewImage(e.target.files[0]);
                                }} />
                            </Button> : <Box sx={{ display: 'flex' }}>
                                <Box sx={{ marginRight: '0.7rem' }}>{newImage.name}</Box>
                                {/* Reset image to re render the upload button */}
                                <IconButton onClick={() => {
                                    setNewImage({});
                                }}>
                                    <ClearIcon fontSize='small' />
                                </IconButton>
                            </Box>}

                            <Tooltip title='2MB Max Size' sx={{ marginLeft: '0.7rem' }}>
                                <InfoOutlineIcon />
                            </Tooltip>
                        </Box>
                    </>}
                </Box>
                <Button loading={submitted} loadingPosition="start" type="submit" variant="contained" sx={{ marginTop: '1rem' }}>
                    Save Changes
                </Button>
            </Box>
        </div>
    )

}