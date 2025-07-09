import { Box, Button, TextareaAutosize, TextField } from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

export default function NewPost() {
    return (
        // Form to create a new post
        // We need the encType to be multipart/form-data to allow file uploads
        <Box component="form" action='http://localhost:8080/posts' method='POST' encType="multipart/form-data"
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
                sx={{ width: '30%', marginBottom: '1rem' }} required />
            {/* MUI's Text Area */}
            <TextareaAutosize
                name='content'
                minRows={10}
                placeholder="Content"
                style={{ width: '30%', marginBottom: '1rem', padding: '10px', fontSize: '16px', backgroundColor: '#f5f3f4' }}
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
                <input hidden type="file" name="picture" onChange={() => { console.log('File input triggered.') }} />
            </Button>
            <Button type="submit" variant="contained" sx={{ marginTop: '1rem' }}>
                Create Post
            </Button>
        </Box>
    );
}