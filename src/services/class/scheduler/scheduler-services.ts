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
}
export default SchedulerServices;
