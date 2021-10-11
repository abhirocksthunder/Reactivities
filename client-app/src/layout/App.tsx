import { useEffect, useState } from 'react';
import axios from 'axios';
import NavBar from './NavBar';
import { Container } from "semantic-ui-react";
import ActivityDashboard from '../features/activities/dashboard/ActivityDashboard';
import { Activity } from '../models/activity';
import { v4 as uuid } from 'uuid';

function App() {

  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectActivity] = useState<Activity | undefined>(undefined);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    axios.get<Activity[]>("http://localhost:5000/api/Activities").then(res => {
      setActivities(res.data);
    })
  }, [])

  function handleSelectActivity(id: string) {
    setSelectActivity(activities.find(x => x.id === id));
  }

  function handleCancelActivity() {
    setSelectActivity(undefined);
  }

  function handleFormOpen(id?: string) {
    id ? handleSelectActivity(id) : handleCancelActivity();
    setEditMode(true);
  }

  function handleFormClose() {
    setEditMode(false);
  }

  function handleCreateOrEditActivity(activity: Activity) {
    activity.id ? setActivities([...activities.filter(x => x.id !== activity.id), activity]) :
      setActivities([...activities, { ...activity, id: uuid() }]);
    setEditMode(false);
    setSelectActivity(activity);
  }

  function handleDeleteActivity(id: string) {
    setActivities([...activities.filter(x => x.id !== id)]);
  }

  return (
    <div>
      <NavBar openForm={handleFormOpen} createOrEdit={handleCreateOrEditActivity} />
      <Container style={{ marginTop: '7em' }}>
        <ActivityDashboard
          activities={activities}
          selectedActivity={selectedActivity}
          selectActivity={handleSelectActivity}
          cancelActivity={handleCancelActivity}
          editMode={editMode}
          openForm={handleFormOpen}
          closeForm={handleFormClose}
          createOrEdit={handleCreateOrEditActivity}
          deleteActivity={handleDeleteActivity}
        />
      </Container>
    </div>
  );
}

export default App;
