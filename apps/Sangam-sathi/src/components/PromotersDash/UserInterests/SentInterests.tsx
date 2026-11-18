import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Chip
} from '@mui/material';
import { useGetPromoterSentInterests } from '../../api/Promoter';
import TokenService from '../../token/tokenService';

const SentInterests = () => {
  const decodedToken = TokenService.decodeToken();
  const promoterId = decodedToken?.promoter_id || decodedToken?.username;

  const { data, isLoading, error } = useGetPromoterSentInterests(promoterId);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">Error loading sent interests</Typography>
      </Box>
    );
  }

  const interests = data?.content || [];

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 3, color: '#4a148c', fontWeight: 'bold' }}>
        Interests Sent by Your Referrals ({interests.length})
      </Typography>
      
      {interests.length === 0 ? (
        <Typography variant="body1">No sent interests found.</Typography>
      ) : (
        <Grid container spacing={3}>
          {interests.map((interest) => (
            <Grid item xs={12} sm={6} md={4} key={interest._id}>
              <Card elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={interest.senderProfile?.Images?.[0] || 'https://via.placeholder.com/200'}
                    alt={interest.senderProfile?.name || interest.senderProfile?.first_name || 'Sender'}
                    sx={{ objectFit: 'cover' }}
                  />
                  <Chip 
                    label={interest.status}
                    color={
                      interest.status === 'accepted' ? 'success' : 
                      interest.status === 'rejected' ? 'error' : 
                      'warning'
                    }
                    size="small"
                    sx={{ position: 'absolute', top: 10, right: 10 }}
                  />
                </Box>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h6" component="div">
                    {interest.senderProfile?.first_name || interest.senderProfile?.name || interest.sender} 
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Sent interest to:</strong> {interest.recipientProfile?.first_name || interest.recipientProfile?.name || interest.recipient}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    <strong>Date:</strong> {interest.date || new Date(interest.createdAt).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {interest.message}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default SentInterests;
