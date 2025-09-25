import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  LinearProgress,
  Chip,
} from '@mui/material';

interface StageCardProps {
  stageName: string;
  summary: string;
  videoUrl: string;
  excitement: number; // 0-100
  tags: string[];
}

const StageCard: React.FC<StageCardProps> = ({
  stageName,
  summary,
  videoUrl,
  excitement,
  tags,
}) => {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia
        component="video"
        src={videoUrl}
        title={stageName}
        sx={{ height: 200 }}
        autoPlay
        loop
        muted // autoPlay requires muted
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h5" component="h2">
          {stageName}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {summary}
        </Typography>
        <Box sx={{ mt: 2 }}>
          {tags.map((tag) => (
            <Chip label={tag} key={tag} sx={{ mr: 1, mb: 1 }} />
          ))}
        </Box>
      </CardContent>
      <Box sx={{ p: 2 }}>
        <Typography variant="body2" color="text.secondary">
          盛り上がり度: {excitement}%
        </Typography>
        <LinearProgress variant="determinate" value={excitement} />
      </Box>
    </Card>
  );
};

export default StageCard;
