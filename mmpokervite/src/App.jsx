import { Box, Button, Container, Typography, Card, CardContent, alpha } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useNavigate } from "react-router-dom";

export default function App() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Hero Section */}
      <Box
        sx={{
          textAlign: "center",
          py: 12,
          px: 2,
          backgroundImage: 'url("/homeGameWSOP.jpg")',
          backgroundSize: "cover", // Ensure the image covers the entire area
          backgroundPosition: "top",
          backgroundAttachment: "fixed", // Creates parallax effect
          position: "relative", // For overlay, contains the overlay effect to this box

          // Overlay effect that darkens the image for better text visibility
          // before inserts a pseudo-element before the Box content
          // the & means "this component", so &::before inserts the pseudo-element before this Box
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: alpha("#0a1929", 0.7), // Dark blue overlay
            zIndex: 1 // Ensure overlay is above the image but below the text, the image has no zIndex so it is at 0 by default
          }
        }}
      >
        {/* Here we also need the position relative to enable the zIndex of 2, otherwise, the overlay will be covering it and it won't work */}
        <Container sx={{ position: "relative", zIndex: 2 }}>
          <Typography
            variant="h2"
            component="h1"
            fontWeight="bold"
            sx={{
              color: "white",
              mb: 3,
              textShadow: "2px 2px 4px rgba(0,0,0,0.5)"
            }}
          >
            Welcome to{" "}
            <Box component="span" sx={{ color: "#ffd700" }}> {/* Gold accent */}
              MMPoker League Manager
            </Box>
          </Typography>

          <Typography
            variant="h5"
            sx={{
              mb: 5,
              maxWidth: 700,
              mx: "auto", // Center horizontally by setting left and right margins to auto mx = margin x
              color: "white",
              opacity: 0.9,
              textShadow: "1px 1px 2px rgba(0,0,0,0.5)"
            }}
          >
            Manage your poker league or games with ease. Track stats, rankings, and
            player performance all in one place.
          </Typography>

          {/* Make sure that elements wrap into new lines on smaller screens with wrap */}
          <Box sx={{ display: "flex", justifyContent: "center", gap: 3, flexWrap: "wrap" }}>
            <Button
              variant="contained"
              onClick={() => navigate('/leaderboard')}
              sx={{
                px: 5,
                py: 1.5,
                borderRadius: 3,
                bgcolor: "#ffd700", // Gold
                color: "#0a1929", // Dark blue
                fontWeight: "bold",
                fontSize: "1.1rem",
                // Hover effect with slight background color change and border color change
                // & means "this component", so &:hover means "on hover of this component"
                "&:hover": {
                  bgcolor: "#ffed4e",
                  transform: "translateY(-2px)", // Slight lift effect by moving up 2px
                  boxShadow: 4 // MUI box shadow level 4 for hover effect
                },
                transition: "all 0.3s ease"
              }}
            >
              View Leaderboard
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/stats')}
              sx={{
                // Similar styling to the contained button but with outlined style
                px: 5,
                py: 1.5,
                borderRadius: 3,
                borderColor: "#ffd700",
                color: "#ffd700",
                fontWeight: "bold",
                fontSize: "1.1rem",
                "&:hover": {
                  bgcolor: "rgba(255, 215, 0, 0.1)",
                  borderColor: "#ffed4e",
                  transform: "translateY(-2px)"
                },
                transition: "all 0.3s ease"
              }}
            >
              View Stats
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: 12, bgcolor: "#f8f9fa" }}>
        {/* Container adds automatic padding-x */}
        <Container>
          <Typography
            variant="h3"
            component="h2"
            textAlign="center"
            fontWeight="bold"
            sx={{ mb: 6, color: "#0a1929" }}
          >
            Why Choose MMPoker?
          </Typography>

          {/* container here makes the grid have flexbox behavior */}
          <Grid container spacing={4}>
            {/* Take up 12/12 units of horizontal space on xs screens and 4/12 in mid sized screens */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Card
                elevation={3}
                sx={{
                  borderRadius: 3,
                  height: "100%", // Make all cards the same height
                  transition: "transform 0.3s ease",
                  // & means "this component", so &:hover means "on hover of this component"
                  "&:hover": {
                    transform: "translateY(-8px)", // Lift effect
                    boxShadow: 6
                  }
                }}
              >
                <CardContent sx={{ textAlign: "center", py: 5 }}>
                  <Typography
                    variant="h4"
                    sx={{ mb: 2, color: "#0a1929" }}
                  >
                    🏆
                  </Typography>
                  {/* gutterBottom adds a margin to the bottom */}
                  <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ color: "#0a1929" }}>
                    Live Leaderboards
                  </Typography>
                  <Typography color="text.secondary">
                    Real-time rankings with detailed breakdowns of wins, bounties, and tournament earnings.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Similar structure to the previous card */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Card
                elevation={3}
                sx={{
                  borderRadius: 3,
                  height: "100%",
                  transition: "transform 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: 6
                  }
                }}
              >
                <CardContent sx={{ textAlign: "center", py: 5 }}>
                  <Typography
                    variant="h4"
                    sx={{ mb: 2, color: "#0a1929" }}
                  >
                    📊
                  </Typography>
                  <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ color: "#0a1929" }}>
                    Advanced Analytics
                  </Typography>
                  <Typography color="text.secondary">
                    Track player performance, win rates, and historical data with comprehensive statistics.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Similar structure to the previous card */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Card
                elevation={3}
                sx={{
                  borderRadius: 3,
                  height: "100%",
                  transition: "transform 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: 6
                  }
                }}
              >
                <CardContent sx={{ textAlign: "center", py: 5 }}>
                  <Typography
                    variant="h4"
                    sx={{ mb: 2, color: "#0a1929" }}
                  >
                    ♠️
                  </Typography>
                  <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ color: "#0a1929" }}>
                    Easy Management
                  </Typography>
                  <Typography color="text.secondary">
                    Streamline game tracking, player management, and results—no spreadsheets needed.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{
        py: 12,
        textAlign: "center",
        bgcolor: "#0a1929",
        color: "white",
        // Gradient background for visual appeal
        background: "linear-gradient(135deg, #051423 0%, #2a4a7f 100%)"
      }}>
        <Container>
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            Ready to Elevate Your Poker League?
          </Typography>
          <Typography variant="h6" sx={{ mb: 5, opacity: 0.9, maxWidth: 600, mx: "auto" }}>
            Manage your poker games or league with confidence using our seamless tournament tracking and analytics.
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/login')}
            sx={{
              bgcolor: "#ffd700",
              color: "#0a1929",
              fontWeight: "bold",
              fontSize: "1.1rem",
              px: 6,
              py: 1.5,
              borderRadius: 3,
              "&:hover": {
                bgcolor: "#ffed4e",
                transform: "translateY(-2px)",
                boxShadow: 4
              },
              transition: "all 0.3s ease"
            }}
          >
            Get Started Free
          </Button>
        </Container>
      </Box>
    </Box>
  );
}