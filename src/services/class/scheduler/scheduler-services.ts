import { supabase } from '@/services/supabase-client/supabase';
import { SchedulerIrrigation } from '@/types/scheduler';

class SchedulerServices {
  static async createScheduler(dataPost: SchedulerIrrigation) {
    const { data, error } = await supabase
      .from('scheduler')
      .insert(dataPost)
      .select('*');
    return { data, error };
  }
  static async getAllScheduler() {
    let { data, error } = await supabase.from('scheduler').select('*');
    if (error) {
      console.log(error.message);
    }
    return { data, error };
  }
  static async editScheduler(value: SchedulerIrrigation) {
    const { data, error } = await supabase
      .from('scheduler')
      .update({
        frequency: value.frequency,
        action: value.action,
        cycle: value.cycle,
        name: value.name,
        isActive: value.isActive,
        mixer1: value.mixer1,
        mixer2: value.mixer2,
        date: value.date,
        mixer3: value.mixer3,
        area: value.area,
        startTime: value.startTime,
        endTime: value.endTime,
      })
      .eq('id', value?.id)
      .select();
    return { data, error };
  }
  static async deleteScheduler(id: string) {
    const { error } = await supabase.from('scheduler').delete().eq('id', id);
    return { error };
  }
}
export default SchedulerServices;
