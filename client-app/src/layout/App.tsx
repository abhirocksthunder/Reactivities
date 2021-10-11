import { useEffect, useState } from 'react';
import NavBar from './NavBar';
import { Container } from "semantic-ui-react";
import ActivityDashboard from '../features/activities/dashboard/ActivityDashboard';
import { Activity } from '../models/activity';
import { v4 as uuid } from 'uuid';
import agent from '../features/api/agent';
import LoadingComponent from './LoadingComponent';

function App() {

  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectActivity] = useState<Activity | undefined>(undefined);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    agent.Activities.list().then(res => {
      let activities: Activity[] = [];
      res.forEach(activity => {
        activity.date = activity.date.split('T')[0]
        activities.push(activity);
      })
      setActivities(activities);
      setLoading(false);
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
    setSubmitting(true);
    if (activity.id) {
      agent.Activities.update(activity).then(() => {
        setActivities([...activities.filter(x => x.id !== activity.id), activity]);
        setEditMode(false);
        setSelectActivity(activity);
        setSubmitting(false);
      })
    }
    else {
      activity.id= uuid();
      agent.Activities.create(activity).then(() => {
        setActivities([...activities, activity]);
        setEditMode(false);
        setSelectActivity(activity);
        setSubmitting(false);
      })
    }

  }

  function handleDeleteActivity(id: string) {
    setSubmitting(true);
    agent.Activities.delete(id).then(()=>{
      setActivities([...activities.filter(x => x.id !== id)]);
      setSubmitting(false);
    })
    
  }

  if (loading) return <LoadingComponent content='Loading Activities...' />

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
          submitting={submitting}
        />
      </Container>
    </div>
  );
}

export default App;
