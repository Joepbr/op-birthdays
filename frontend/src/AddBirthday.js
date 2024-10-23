import React, { useState } from 'react';
import moment from 'moment';
import { TextField, Button, MenuItem, Box } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import axios from 'axios';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';

const AddBirthday = ({ onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [date, setDate] = useState(null);
  const [arc, setArc] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  // Sample arcs for the dropdown menu
  const arcs = [
    { label: 'Romance Dawn', value: 'Romance Dawn' },
    { label: 'Orange Town', value: 'Orange Town' },
    { label: 'Syrup Village', value: 'Syrup Village' },
    { label: 'Baratie', value: 'Baratie' },
    { label: 'Arlong Park', value: 'Arlong Park' },
    { label: 'Loguetown', value: 'Loguetown' },
    { label: 'Reverse Mountain', value: 'Reverse Mountain' },
    { label: 'Whiskey Peak', value: 'Whiskey Peak' },
    { label: 'Little Garden', value: 'Little Garden' },
    { label: 'Drum Island', value: 'Drum Island' },
    { label: 'Alabasta', value: 'Alabasta' },
    { label: 'Jaya', value: 'Jaya' },
    { label: 'Skypiea', value: 'Skypiea' },
    { label: 'Long Ring Long Land', value: 'Long Ring Long Land' },
    { label: 'Water 7', value: 'Water 7' },
    { label: 'Enies Lobby', value: 'Enies Lobby' },
    { label: 'Post Enies Loby', value: 'Post Enies Loby' },
    { label: 'Thriller Bark', value: 'Thriller Bark' },
    { label: 'Sabaody', value: 'Sabaody' },
    { label: 'Amazon Lily', value: 'Amazon Lily' },
    { label: 'Impel Down', value: 'Impel Down' },
    { label: 'Marineford', value: 'Marineford' },
    { label: 'Post War', value: 'Post War' },
    { label: 'Return to Sabaody', value: 'Return to Sabaody' },
    { label: 'Fishmen Island', value: 'Fishmen Island' },
    { label: 'Punk Hazard', value: 'Punk Hazard' },
    { label: 'Dresrosa', value: 'Dresrosa' },
    { label: 'Zou', value: 'Zou' },
    { label: 'Whole Cake Island', value: 'Whole Cake Island' },
    { label: 'Reverie', value: 'Reverie' },
    { label: 'Wano', value: 'Wano' },
    { label: 'Egghead', value: 'Egghead' },
  ];

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    const adjustedDate = moment(date).toDate();
    adjustedDate.setHours(adjustedDate.getHours() + adjustedDate.getTimezoneOffset() / 60);
    const formattedDate = moment(adjustedDate).format('YYYY-MM-DD')

    try {
      // Make POST request to backend
      const response = await axios.post('http://localhost:5000/api/birthdays', {
        name,
        date: formattedDate,
        arc,
        description,
        image_url: imageUrl
      })

      console.log('Response:', response.data);

      onAdd();
      onClose();
    } catch (error) {
      console.error('Error adding birthday:', error);
    }
  };

  return (
    <Box
      component="form"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        width: '300px',
        margin: '0 auto',
        marginTop: '20px'
      }}
      onSubmit={handleSubmit}
    >
      <TextField
        label="Character Name"
        variant="outlined"
        value={name}
        onChange={(e) => setName(e.target.value)}
        autoFocus
        required
      />
      
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <DatePicker
          views={['month', 'day']}
          label="Birthday"
          value={date}
          onChange={(newDate) => setDate(newDate)}
          renderInput={(params) => <TextField {...params} required />}
        />
      </LocalizationProvider>
      
      <TextField
        select
        label="Introduction Arc"
        value={arc}
        onChange={(e) => setArc(e.target.value)}
        required
      >
        {arcs.map((arcOption) => (
          <MenuItem key={arcOption.value} value={arcOption.value}>
            {arcOption.label}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        label="Character Description"
        variant="outlined"
        value={description}
        multiline
        onChange={(e) => setDescription(e.target.value)}
      />

      <TextField
        label="Image URL"
        variant="outlined"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
      />

      <Button variant="contained" type="submit">
        Add Birthday
      </Button>
    </Box>
  );
};

export default AddBirthday;
