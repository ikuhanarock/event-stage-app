import React, { useEffect, useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  CssBaseline,
  Grid,
  CircularProgress,
  Box,
  Alert,
} from '@mui/material';
import StageCard from './components/StageCard';
import { fetchStages } from './services/api';
import type { Stage } from './services/api';

function App() {
  const [stages, setStages] = useState<Stage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setError(null);
      const data = await fetchStages();
      setStages(data);
    } catch (err) {
      setError('Failed to fetch stage data. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    loadData(); // 初回データ取得

    const intervalId = setInterval(() => {
      loadData();
    }, 30000); // 30秒ごとにデータを更新

    return () => clearInterval(intervalId); // クリーンアップ
  }, []);

  return (
    <>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div">
            AI Real-time Event Digest
          </Typography>
        </Toolbar>
      </AppBar>
      <main>
        <Container sx={{ py: 4 }} maxWidth="lg">
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error">{error}</Alert>
          ) : (
            <Grid container spacing={4}>
              {stages.map((stage) => (
                <Grid item key={stage.id} xs={12} sm={6} md={4}>
                  <StageCard
                    stageName={stage.stageName}
                    summary={stage.summary}
                    videoUrl={stage.videoUrl}
                    excitement={stage.excitement}
                    tags={stage.tags}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </Container>
      </main>
    </>
  );
}

export default App;