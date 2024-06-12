import { handleOnKeyDown } from '@/libs/number-format-input';
import SchedulerServices from '@/services/class/scheduler/scheduler-services';
import { clientMqtt } from '@/services/mqtt-client/mqtt';
import { supabase } from '@/services/supabase-client/supabase';
import { SchedulerIrrigation } from '@/types/scheduler';
import {
  Button,
  Form,
  Input,
  Modal,
  Select,
  Spin,
  TimePicker,
  message,
} from 'antd';
import dayjs from 'dayjs';
import mqtt from 'mqtt';
import { useRef, useState } from 'react';

interface ModalCreateCalendar {
  open: boolean;
  setOpen: any;
}
export const ModalCreate = ({ open, setOpen }: ModalCreateCalendar) => {
  const [form] = Form.useForm();
  const formAddSchedule = useRef<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const handleAddSchedule = async (value: any) => {
    setLoading(true);
    const { data: dataSchedule } = await SchedulerServices.getAllScheduler();
    const checkExit = dataSchedule?.filter((item) => item.name === value?.name);
    if (checkExit?.length !== 0) {
      message.warning('This name has been already used');
      setLoading(false);
      return;
    }
    const dataPostSupabase = value?.dateInWeek?.map((item: any) => {
      return {
        action: 'Create',
        area: value?.area,
        isActive: true,
        frequency: value?.active,
        date: item,
        name: value?.name,
        mixer1: value?.mixer1,
        mixer2: value?.mixer2,
        mixer3: value?.mixer3,
        cycle: value?.cycle,
        startTime: dayjs(value?.time[0]).format('HH:mm'),
        endTime: dayjs(value?.time[1]).format('HH:mm'),
      };
    });
    const dataMqtt: SchedulerIrrigation = {
      action: 'Create',
      area: value?.area,
      isActive: '1',
      cycle: Number(value?.cycle),
      frequency: value?.active,
      date: value?.dateInWeek,
      name: value?.name,
      mixer1: Number(value?.mixer1),
      mixer2: Number(value?.mixer2),
      mixer3: Number(value?.mixer3),
      startTime: dayjs(value?.time[0]).format('HH:mm'),
      endTime: dayjs(value?.time[1]).format('HH:mm'),
    };

    const { data, error } = await SchedulerServices.createScheduler(
      dataPostSupabase
    );
    if (error) {
      message.warning(error.message);
      setLoading(false);

      return;
    }
    console.log(data);

    const jsonStringData = JSON.stringify(dataMqtt);

    clientMqtt.publish('kd77/feeds/scheduler', jsonStringData);
    message.success('Create scheduler successfully');
    setLoading(false);
    setOpen(false);
    form.resetFields();
  };
  return (
    <>
      <Modal
        title="Create Event Irrigation"
        open={open}
        footer={() => (
          <div className="flex items-center justify-between">
            <div className="flex w-full justify-end items-center gap-[12px]">
              <Button
                onClick={() => {
                  setOpen(false);
                  form.resetFields();
                  // handleAddSchedule(123);
                }}
                type="default">
                Cancel
              </Button>
              <Button
                disabled={loading}
                loading={loading}
                onClick={() => {
                  if (formAddSchedule.current) {
                    formAddSchedule.current.submit();
                  }
                }}
                type="primary">
                Create
              </Button>
            </div>
          </div>
        )}
        onCancel={() => {
          setOpen(false);
        }}
        width={560}>
        <Spin
          spinning={loading}
          tip="Loading...">
          <Form
            layout="vertical"
            onFinish={handleAddSchedule}
            form={form}
            ref={formAddSchedule}>
            <div className="grid lg:grid-cols-2 grid-cols-1 gap-[24px]">
              <Form.Item
                label="Name Event"
                name="name"
                rules={[
                  {
                    required: true,
                  },
                ]}>
                <Input placeholder="Enter name of event" />
              </Form.Item>
              <Form.Item
                label="Number of cycle"
                name="cycle"
                rules={[
                  {
                    required: true,
                  },
                ]}>
                <Input
                  onKeyDown={handleOnKeyDown}
                  placeholder="Enter Number of cycle"
                />
              </Form.Item>
            </div>
            <div className="grid lg:grid-cols-2 grid-cols-1 gap-[24px]">
              <Form.Item
                label="Date & Time"
                name="time"
                rules={[
                  {
                    required: true,
                  },
                ]}>
                <TimePicker.RangePicker
                  style={{
                    width: '100%',
                  }}
                  format={'HH:mm'}
                  // onChange={(e: any) => console.log(dayjs(e[0]).format('HH:mm:ss'))}
                  minuteStep={15}
                />
              </Form.Item>
              <Form.Item
                label="Area"
                name="area"
                rules={[
                  {
                    required: true,
                  },
                ]}>
                <Select
                  placeholder="Choose area"
                  options={[
                    { value: 1, label: 'Area 1' },
                    { value: 2, label: 'Area 2' },
                    { value: 3, label: 'Area 3' },
                  ]}
                />
              </Form.Item>
            </div>
            <div className="grid lg:grid-cols-2 grid-cols-1 gap-[24px]">
              <Form.Item
                label="Date in week"
                name="dateInWeek"
                rules={[
                  {
                    required: true,
                  },
                ]}>
                <Select
                  mode="multiple"
                  placeholder="Choose dates"
                  allowClear
                  options={[
                    { value: 'Monday', label: 'Monday' },
                    { value: 'Tuesday', label: 'Tuesday' },
                    { value: 'Wednesday', label: 'Wednesday' },
                    { value: 'Thursday', label: 'Thursday' },
                    { value: 'Friday', label: 'Friday' },
                    { value: 'Saturday', label: 'Saturday' },
                    { value: 'Sunday', label: 'Sunday' },
                  ]}
                />
              </Form.Item>
              <Form.Item
                label="Frequency"
                name="active"
                rules={[
                  {
                    required: true,
                  },
                ]}>
                <Select
                  placeholder="Once or Repeat"
                  options={[
                    { value: 'Once', label: 'Once' },
                    { value: 'Repeat', label: 'Repeat' },
                  ]}
                />
              </Form.Item>
            </div>
            <Form.Item
              label="Mixer 1"
              name="mixer1"
              rules={[
                {
                  required: true,
                },
              ]}>
              <Input
                onKeyDown={handleOnKeyDown}
                placeholder="Enter number"
              />
            </Form.Item>
            <Form.Item
              label="Mixer 2"
              name="mixer2"
              rules={[
                {
                  required: true,
                },
              ]}>
              <Input
                onKeyDown={handleOnKeyDown}
                placeholder="Enter number"
              />
            </Form.Item>
            <Form.Item
              label="Mixer 3"
              name="mixer3"
              rules={[
                {
                  required: true,
                },
              ]}>
              <Input
                onKeyDown={handleOnKeyDown}
                placeholder="Enter number"
              />
            </Form.Item>
          </Form>
        </Spin>
      </Modal>
    </>
  );
};
