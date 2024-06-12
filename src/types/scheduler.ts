export type SchedulerIrrigation = {
  id?: string;
  frequency: string;
  action: string;
  cycle: number;
  name: string;
  isActive: any;
  mixer1: number;
  mixer2: number;
  date: string;
  mixer3: number;
  area: number;
  startTime: string;
  endTime: string;
};
