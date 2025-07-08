import { useUser } from '../UserContext';
import { Box, Card, CardHeader, CardMedia, CardContent, Typography, CardActionArea } from '@mui/material';
import { Link } from 'react-router-dom';

export default function Updates() {
    const { isAdmin } = useUser();
    return (
        <Box sx={{ textAlign: 'center' }}>
            <h1>Updates</h1>
            {isAdmin ? <Link to='/updates/newpost'>New Post</Link> : null}
            <Card sx={{ width: '80%', margin: 'auto', marginTop: 2 }}>
                <CardActionArea>
                    <Box sx={{ display: 'flex' }}>
                        <CardMedia
                            component="img"
                            image="https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fi.huffpost.com%2Fgen%2F4707746%2Fimages%2Fo-BREAKING-NEWS-facebook.jpg&f=1&nofb=1&ipt=66a1c4d0528fccd8778f831526cd39543dfce4c6eeb28d4420aed4ad02e77683"
                            alt="Breaking News img"
                            sx={{ width: '20%', height: 'auto' }}>

                        </CardMedia>
                        {/*  */}
                        <Box sx={{ display: 'flex', width: '80%', flexDirection: 'column' }}>
                            <CardHeader
                                title="MMPoker soon to deploy"
                                subheader="Posted on July 8 2025 by Moi"
                            />
                            <CardContent>
                                <Typography variant="body2" color="text.secondary">
                                    We are excited to announce that MMPoker&apos;s initial release is 90% completed. Stay tuned for more updates!
                                </Typography>
                            </CardContent>
                        </Box>
                    </Box>


                </CardActionArea>
            </Card>
        </Box>

    )
}
