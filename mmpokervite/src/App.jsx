import { Box, Button, Container, Typography, Card, CardContent } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        bgcolor: "#f9f9f9",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Hero Section */}
      <Box
        sx={{
          textAlign: "center",
          py: 10,
          px: 2,
          bgcolor: "#fff",
          flex: 1,
        }}
      >
        <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
          Welcome to{" "}
          <Box component="span" sx={{ color: "#1976d2" }}>
            MMPoker League Manager
          </Box>
        </Typography>

        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ mb: 4, maxWidth: 700, mx: "auto" }}
        >
          Manage your poker league or games with ease. Track stats, rankings, and
          player performance all in one place.
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "center", gap: 2, flexWrap: "wrap" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => { navigate('/leaderboard') }}
            sx={{ px: 4, py: 1.5, borderRadius: 3 }}
          >
            View Leaderboard
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => { navigate('/stats') }}
            sx={{ px: 4, py: 1.5, borderRadius: 3 }}
          >
            View Stats
          </Button>
        </Box>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: 10, bgcolor: "#f4f6f8" }}>
        <Container>
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Card elevation={2} sx={{ borderRadius: 3, height: "100%" }}>
                <CardContent sx={{ textAlign: "center", py: 4 }}>
                  <Typography variant="h5" fontWeight="bold" gutterBottom>
                    🏆 Leaderboards
                  </Typography>
                  <Typography color="text.secondary">
                    See who&apos;s leading the season with detailed breakdowns of
                    wins, bounties, and earnings.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Card elevation={2} sx={{ borderRadius: 3, height: "100%" }}>
                <CardContent sx={{ textAlign: "center", py: 4 }}>
                  <Typography variant="h5" fontWeight="bold" gutterBottom>
                    📊 Player Stats
                  </Typography>
                  <Typography color="text.secondary">
                    Track every player&apos;s games, finishes, rebuys, and total
                    profits automatically.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Card elevation={2} sx={{ borderRadius: 3, height: "100%" }}>
                <CardContent sx={{ textAlign: "center", py: 4 }}>
                  <Typography variant="h5" fontWeight="bold" gutterBottom>
                    ♠ Easy Management
                  </Typography>
                  <Typography color="text.secondary">
                    Add players, record games, and update results easily — no
                    spreadsheets needed.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{ py: 10, textAlign: "center", bgcolor: "#1976d2", color: "#fff" }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Ready to manage your poker league?
        </Typography>
        <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
          Log in to start tracking your games and see who comes out on top.
        </Typography>
        <Button
          variant="contained"
          onClick={() => { navigate('/login') }}
          sx={{
            bgcolor: "#fff",
            color: "#1976d2",
            fontWeight: "bold",
            px: 5,
            py: 1.5,
            borderRadius: 3,
            "&:hover": { bgcolor: "#f5f5f5" },
          }}
        >
          Get Started
        </Button>
      </Box>
    </Box>
  );
}
