import EditIcon from '@mui/icons-material/Edit';
import EmailIcon from '@mui/icons-material/Email';
import HomeIcon from '@mui/icons-material/Home';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import { Box, Button, IconButton, TextField, Typography } from '@mui/material';
import { useState } from 'react';
// ----------------------------------------------------------------------

export default function ProfileInfoCard({ data }: { data?: Record<string, any> }) {
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [editedUserData, setEditedUserData] = useState(data);

  const handleCancelEdit = () => {
    setEditedUserData(data);
    setIsEditingInfo(false);
  };

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setEditedUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateUserData = () => {
    // setUserData(editedUserData);
    setIsEditingInfo(false);
    console.log('Updated user data:', editedUserData);
  };

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 1,
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          Intro
        </Typography>
        {!isEditingInfo ? (
          <IconButton size="small" onClick={() => setIsEditingInfo(true)}>
            <EditIcon fontSize="small" />
          </IconButton>
        ) : null}
      </Box>

      {isEditingInfo ? (
        <Box component="form" sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={editedUserData?.name}
            onChange={handleInputChange}
            variant="outlined"
            size="small"
            margin="normal"
          />
          <TextField
            fullWidth
            label="Username"
            name="username"
            value={editedUserData?.username}
            onChange={handleInputChange}
            variant="outlined"
            size="small"
            margin="normal"
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            value={editedUserData?.email}
            onChange={handleInputChange}
            variant="outlined"
            size="small"
            margin="normal"
          />
          <TextField
            fullWidth
            label="Address"
            name="address"
            value={editedUserData?.address}
            onChange={handleInputChange}
            variant="outlined"
            size="small"
            margin="normal"
          />
          <TextField
            fullWidth
            label="Phone"
            name="phone"
            value={editedUserData?.phone}
            onChange={handleInputChange}
            variant="outlined"
            size="small"
            margin="normal"
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
            <Button variant="outlined" onClick={handleCancelEdit} size="small">
              Cancel
            </Button>
            <Button variant="contained" onClick={handleUpdateUserData} size="small">
              Save
            </Button>
          </Box>
        </Box>
      ) : (
        <Box>
          <Box sx={{ mb: 2, mt: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <WorkIcon sx={{ mr: 1, color: 'text.secondary' }} />
              <Typography variant="body2">Works at Example Company</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <SchoolIcon sx={{ mr: 1, color: 'text.secondary' }} />
              <Typography variant="body2">Studied at Example University</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <HomeIcon sx={{ mr: 1, color: 'text.secondary' }} />
              <Typography variant="body2">Lives in {data?.address}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <LocationOnIcon sx={{ mr: 1, color: 'text.secondary' }} />
              <Typography variant="body2">From Example City</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />
              <Typography variant="body2">{data?.email}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />
              <Typography variant="body2">{data?.phone}</Typography>
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
}
