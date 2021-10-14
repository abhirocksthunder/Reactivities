import { useEffect} from 'react';
import NavBar from './NavBar';
import { Container } from "semantic-ui-react";
import ActivityDashboard from '../features/activities/dashboard/ActivityDashboard';
import LoadingComponent from './LoadingComponent';
import { useStore } from '../stores/store';
import { observer } from 'mobx-react-lite';

function App() {
  
  const { activityStore } = useStore();

  const { loadActivities} = activityStore;

  useEffect(() => {
    loadActivities();
  }, [loadActivities])
  

  if (activityStore.loadingInitial) return <LoadingComponent content='Loading Activities...' />

  return (
    <div>
      <NavBar />
      <Container style={{ marginTop: '7em' }}>
        <ActivityDashboard />
      </Container>
    </div>
  );
}

export default observer(App);
