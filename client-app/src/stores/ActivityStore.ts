import { makeAutoObservable, runInAction } from "mobx";
import agent from "../features/api/agent";
import { Activity } from "../models/activity";
import { v4 as uuid } from "uuid";
import { Map } from "typescript";

export default class ActivityStore {
  activityRegistry = new Map<string, Activity>();
  selectedActivity: Activity | undefined = undefined;
  loading = false;
  editMode = false;
  loadingInitial = false;
  submitting = false;

  constructor() {
    makeAutoObservable(this);
  }

  get activitiesByDate(){
        return Array.from(this.activityRegistry.values()).sort((a,b)=> Date.parse(b.date) - Date.parse(a.date));
  }

  loadActivities = async () => {
    this.loadingInitial = true;
    try {
      const activities = await agent.Activities.list();
      runInAction(() => {
        activities.forEach((activity) => {
          activity.date = activity.date.split("T")[0];
          this.activityRegistry.set(activity.id, activity);
        });
        this.loadingInitial = false;
      });
    } catch (error) {
      console.log(error);
      runInAction(() => {
        this.loadingInitial = false;
      });
    }
  };

  selectActivity = (id: string) => {
    this.selectedActivity = this.activityRegistry.get(id);
  };

  cancelActivity = () => {
    this.selectedActivity = undefined;
  };

  openForm = (id?: string) => {
    id ? this.selectActivity(id) : this.cancelActivity();
    this.editMode = true;
  };

  closeForm = () => {
    this.editMode = false;
  };

  createOrEditActivity = async (activity: Activity) => {
    this.submitting = true;
    try {
      if (activity.id) {
        await agent.Activities.update(activity);
        runInAction(() => {
          this.activityRegistry.set(activity.id, activity);
          this.editMode = false;
          this.selectedActivity = activity;
          this.submitting = false;
        });
      } else {
        activity.id = uuid();
        await agent.Activities.create(activity);
        runInAction(() => {
          this.activityRegistry.set(activity.id, activity);
          this.editMode = false;
          this.selectedActivity = activity;
          this.submitting = false;
        });
      }
    } catch (error) {
      console.log(error);
      this.submitting = false;
    }
  };

  deleteActivity = async (id: string) => {
    this.submitting = true;
    try {
      await agent.Activities.delete(id);
      runInAction(() => {
        this.activityRegistry.delete(id);
        this.submitting = false;
      });
    } catch (error) {
      console.log(error);
      this.submitting = false;
    }
  };
}
