import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import axios from 'axios';
import { Button, Modal, Box } from '@mui/material';
import AddBirthday from './AddBirthday';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Tooltip from '@mui/material/Tooltip'
import { blue } from '@mui/material/colors';

const localizer = momentLocalizer(moment);

function App() {
  const [events, setEvents] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    fetchBirthdays()
  }, []);

  const fetchBirthdays = () => {
    // Fetch birthdays from the backend
    axios.get('http://localhost:5000/api/birthdays')
      .then(response => {
        const currentYear = new Date().getFullYear()

        const isLeapYear = (year) =>{
          return ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0)
        }

        const formattedEvents = response.data.map(birthday => {
          const date = moment(birthday.date, 'YYYY-MM-DD').toDate()
          const month = date.getMonth()
          const day = date.getDate()

          if (month === 1 && day === 29 && !isLeapYear(currentYear)) {
            return null
          }

          return {
            id: birthday.id,
            title: birthday.name,
            start: new Date(currentYear, date.getMonth(), date.getDate()),
            end: new Date(currentYear, date.getMonth(), date.getDate()),
            arc: birthday.arc,
            description: birthday.description,
            image_url: birthday.image_url
          }
        }).filter(event => event !== null)
        setEvents(formattedEvents);
      })
      .catch(error => console.error(error));
  }

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const EventComponent = ({ event }) => {
    const handleDelete = (id) => {
      console.log("Event ID:", id);
      axios.delete(`http://localhost:5000/api/birthdays/${id}`)
        .then(() => {
          setEvents(events.filter(e => e.id !== id));
        })
        .catch(error => console.error(error));
    };
  
    return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        
        <Tooltip
        title={
          <div>
            <img src={`http://localhost:5000/${event.image_url}`} alt={event.title} style={{ maxWidth: '100px', maxHeight: '100px' }} />
            <p>{event.description}</p>
          </div>
          
        }
        arrow
        >
          <span>{event.title}</span>
        </Tooltip>
        <IconButton
          aria-label="delete"
          size="small"
          onClick={() => handleDelete(event.id)}
          style={{ marginRight: 8 }}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </div>
    );
  }; 

  const eventPropGetter = (event) => {
    let backgroundColor
    let color

    switch (event.arc) {
      case 'Romance Dawn':
        backgroundColor = blue[100]
        color = '#000000'
        break;
      case 'Orange Town':
        backgroundColor = blue[200]
        color = '#000000'
        break;
      case 'Syrup Village':
        backgroundColor = blue[300]
        color = '#000000'
        break;
      case 'Baratie':
        backgroundColor = blue[400]
        color = '#000000'
        break;
      case 'Arlong Park':
        backgroundColor = blue[500]
        break;
      case 'Loguetown':
        backgroundColor = blue[600]
        break;
      case 'Reverse Mountain':
        backgroundColor = '#fff9c4'
        color = '#000000'
        break;
      case 'Whiskey Peak':
        backgroundColor = '#fff176'
        color = '#000000'
        break;
      case 'Little Garden':
        backgroundColor = '#ffeb3b'
        color = '#000000'
        break;
      case 'Drum Island':
        backgroundColor = '#fdd835'
        color = '#000000'
        break;
      case 'Alabasta':
        backgroundColor = '#fbc02d'
        color = '#000000'
        break;
      case 'Jaya':
        backgroundColor = '#bdbdbd'
        color = '#000000'
        break;
      case 'Skypiea':
        backgroundColor = '#e0e0e0'
        color = '#000000'
        break;
      case 'Long Ring Long Land':
        backgroundColor = '#81c784'
        color = '#000000'
        break;
      case 'Water 7':
        backgroundColor = '#66bb6a'
        color = '#000000'
        break;
      case 'Enies Lobby':
        backgroundColor = '#43a047'
        break;
      case 'Post Enies Loby':
        backgroundColor = '#43a047'
        break;
      case 'Thriller Bark':
        backgroundColor = '#e65100'
        break;
      case 'Sabaody':
        backgroundColor = '#ef5350'
        break;
      case 'Amazon Lily':
        backgroundColor = '#f44336'
        break;
      case 'Impel Down':
        backgroundColor = '#e53935'
        break;
      case 'Marineford':
        backgroundColor = '#d32f2f'
        break;
      case 'Post War':
        backgroundColor = '#c62828'
        color = '#ffffff'
        break;
      case 'Return to Sabaody':
        backgroundColor = '#00e5ff'
        color = '#000000'
        break;
      case 'Fishmen Island':
        backgroundColor = '#00b8d4'
        color = '#000000'
        break;
      case 'Punk Hazard':
        backgroundColor = '#e040fb'
        break;
      case 'Dresrosa':
        backgroundColor = '#d500f9'
        break;
      case 'Zou':
        backgroundColor = '#ff4081'
        break;
      case 'Whole Cake Island':
        backgroundColor = '#f50057'
        break;
      case 'Reverie':
        backgroundColor = '#c51162'
        break;
      case 'Wano':
        backgroundColor = '#ff5722'
        break;
      case 'Egghead':
        backgroundColor = '#607d8b'
        break;
      default:
        backgroundColor = '#ffffff'
        color = '#000000'
    }

    return { style: { backgroundColor, color } }
  }

  return (
    <div className="App">
      <h1>Birthday Calendar</h1>

      <Box margin={3}>
        <Button variant="contained" color="primary" onClick={handleOpenModal}>
          Add New Birthday
        </Button>
      </Box>
      
      {/* Modal containing AddBirthday form */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="add-birthday-modal"
        aria-describedby="add-birthday-form"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
          }}
        >
          <AddBirthday onClose={handleCloseModal} onAdd={fetchBirthdays}/>
        </Box>
      </Modal>

      <Calendar
        localizer={localizer}
        events={events}
        eventPropGetter={eventPropGetter}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        components={{
          event: EventComponent
        }}
      />
    </div>
  );
}

export default App;
