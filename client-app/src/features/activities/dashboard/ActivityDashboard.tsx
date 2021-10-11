
import { Grid } from "semantic-ui-react";
import { Activity } from "../../../models/activity";
import ActivityForm from "../form/ActivityForm";
import ActivityDetails from "./ActivityDetails";
import ActivityList from "./ActivityList";

interface Props {
    activities: Activity[];
    selectedActivity: Activity | undefined;
    selectActivity: ((id: string) => void);
    cancelActivity: (() => void);
    editMode: boolean;
    openForm: ((id: string) => void);
    closeForm: (() => void);
    createOrEdit: ((activity: Activity) => void);
    deleteActivity: ((id: string) => void);
    submitting: boolean;
}

export default function ActivityDashboard({ activities, selectedActivity, selectActivity, cancelActivity,
    editMode, openForm, closeForm, createOrEdit, deleteActivity, submitting }: Props) {
    return (
        <Grid>
            <Grid.Column width='10'>
                <ActivityList
                    activities={activities}
                    selectActivity={selectActivity}
                    deleteActivity={deleteActivity}
                    submitting={submitting}
                />
            </Grid.Column>
            <Grid.Column width='6'>
                {
                    selectedActivity && !editMode &&
                    <ActivityDetails
                        activity={selectedActivity}
                        cancelActivity={cancelActivity}
                        openForm={openForm}
                    />
                }
                {editMode &&
                    <ActivityForm
                        activity={selectedActivity}
                        closeForm={closeForm}
                        createOrEdit={createOrEdit}
                        submitting={submitting}
                    />}
            </Grid.Column>
        </Grid>
    )
}