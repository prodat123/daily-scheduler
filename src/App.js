import './App.css';
import React, {useState, useEffect} from 'react';


function App() {

  const [modalOpen, setModalOpen] = useState(false);
  const [activities, setActivities] = useState([]);
  const [activity, setActivity] = useState('');
  const [importance, setImportance] = useState(null);
  const [urgency, setUrgency] = useState(null);
  const [time, setTime] = useState(0);

  const addActivity = () => {
    console.log('I am adding an activity')
    setModalOpen(true)
  }
  const handleActivityChange = (event) => {
    setActivity(event.target.value);
  };

  const handleImportanceChange = (event) => {
    setImportance(event.target.value);
  };

  const handleUrgencyChange = (event) => {
    setUrgency(event.target.value);
  };

  const handleTimeChange = (event) => {
    setTime(event.target.value);
  };

  const assignTimes = (sortedActivities) => {
    let currentTime = 600; // Start at 8 AM
  
    return sortedActivities.map(activity => {
      const start = currentTime;
      const end = currentTime + activity.time;
      currentTime = end;
  
      return {
        ...activity,
        start,
        end
      };
    });
  };

  const formatClockTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const formattedHours = hours < 10 ? `0${hours}` : hours;
    const formattedMins = mins < 10 ? `0${mins}` : mins;
    return `${formattedHours}:${formattedMins}`;
  };
  

  const handleAddActivity = () => {
    const newActivity = {
      activity,
      importance: parseInt(importance, 10),
      urgency: parseInt(urgency, 10),
      time: parseInt(time, 10),
    };
  
    const updatedActivities = sortActivities([...activities, newActivity]);
    const scheduledActivities = assignTimes(updatedActivities);
    setActivities(scheduledActivities);
    setModalOpen(false);
    setActivity('');
    setImportance(null);
    setUrgency(null);
    setTime(0);
  };
  

  const formatTime = (time) => {
    const hours = Math.floor(time / 60);
    const minutes = time % 60;
    return `${hours > 0 ? `${hours} hr` : ''} ${minutes > 0 ? `${minutes} min` : ''}`.trim();
  };

  const calculateGrade = (activity) => {
    return ((activity.urgency / 5) + (activity.importance / 5)) / 2;
  };

  const sortActivities = (activities) => {
    return activities.sort((a, b) => calculateGrade(b) - calculateGrade(a));
  };



  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <h1 className='text-2xl font-semibold'>Daily Schedule</h1>
      {activities.map((act, index) => (
        <div className='w-64 h-32 shadow-md rounded-md border p-2 text-center'>
          <label className='text-sm mr-2 text-gray-500'>Start: <b>{formatClockTime(act.start)}</b></label>
          <label className='text-sm text-gray-500'>Finish: <b>{formatClockTime(act.end)}</b></label>
          
          <p className='mt-2 text-lg'>{act.activity}</p>

          <p className='text-md font-semibold text-gray-500'> Duration: <span className='underline text-error'>{formatTime(act.time)}</span></p>
          <span className='text-sm'>
            Importance: {act.importance}, Urgency: {act.urgency}
          </span>
        </div>
      ))}
      
      

      <button className='border-dotted w-64 h-16 border-2 rounded-md' onClick={addActivity}>Add +</button>
      

      {modalOpen ? (
        <div className='w-screen h-screen absolute top-0 flex flex-col items-center justify-center text-gray-900'>
          <div className='bg-gray-700 w-full h-full opacity-[0.7] absolute'></div>
          <div className='h-auto w-96 bg-white border relative rounded-md p-4 text-center z-50'>
            <button className='absolute top-0 right-0 text-error m-2' onClick={() => setModalOpen(false)}>X</button>
            <h1 className='text-lg mb-2 font-semibold'>Add a New Activity</h1>

            <span className='text-lg font-medium'>Activity: </span>
            <br></br>
            <input 
              placeholder='Input your activity...'
              type='text'
              value={activity}
              onChange={handleActivityChange}
              className='w-full border rounded-md px-2 py-2 mb-2' 
            />
            
            <span className='text-lg font-medium'>Importance: </span>
            <br></br>
            <div className="flex items-center justify-center space-x-4">
              <span>Least</span>
              {Array.from({ length: 5 }, (_, i) => i + 1).map((number) => (
                <label key={number} className="flex flex-col items-center space-y-1">
                  <span>{number}</span>
                  <input
                    type="radio"
                    name="importance"
                    value={number}
                    checked={importance === String(number)}
                    onChange={handleImportanceChange}
                    className="radio"
                  />
                </label>
              ))}
              <span>Most</span>
            </div>

            <br></br>
            <span className='text-lg font-medium'>Urgency: </span>
            <div className="flex items-center justify-center space-x-4">
              <span>Least</span>
              {Array.from({ length: 5 }, (_, i) => i + 1).map((number) => (
                <label key={number} className="flex flex-col items-center space-y-1">
                  <span>{number}</span>
                  <input
                    type="radio"
                    name="urgency"
                    value={number}
                    checked={urgency === String(number)}
                    onChange={handleUrgencyChange}
                    className="radio"
                  />
                </label>
              ))}
              <span>Most</span>
            </div>

            <br></br>
            <div className="flex flex-col items-center space-y-4 mb-2">
              <label htmlFor="time-range" className="text-lg font-medium">
                Select Duration: {formatTime(time)}
              </label>
              <input
                type="range"
                id="time-range"
                name="time-range"
                min="0"
                max="720"
                value={time}
                onChange={handleTimeChange}
                className="range w-full"
              />
              <div className="flex justify-between w-full px-2 text-sm">
                <span>0 min</span>
                <span>3 hr</span>
                <span>6 hr</span>
                <span>9 hr</span>
                <span>12 hr</span>
              </div>
            </div>

            <button 
              className='border rounded-md px-4 py-2 bg-success text-white w-full' 
              onClick={handleAddActivity}
            >
              Add
            </button>
            <button 
              className='border rounded-md px-4 py-2 bg-error text-white mt-2 w-full' 
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : null}

      
    </div>
  );
}

export default App;
