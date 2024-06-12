import { handleOnKeyDown } from '@/libs/number-format-input';
import SchedulerServices from '@/services/class/scheduler/scheduler-services';
import { clientMqtt } from '@/services/mqtt-client/mqtt';
import { SchedulerIrrigation } from '@/types/scheduler';
import {
  Button,
  Form,
  Input,
  Modal,
  Select,
  Spin,
  Switch,
  TimePicker,
  message,
} from 'antd';
import dayjs from 'dayjs';
import { useRef, useState } from 'react';

interface ModalEditCalendar {
  open: boolean;
  setOpen: any;
  selectedRecord: any;
}
export const ModalEdit = ({
  open,
  setOpen,
  selectedRecord,
}: ModalEditCalendar) => {
  const [form] = Form.useForm();
  const formEditSchedule = useRef<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const handleAddSchedule = async (value: any) => {
    if (value?.name !== selectedRecord.name) {
      const { data: dataSchedule } = await SchedulerServices.getAllScheduler();
      const checkExit = dataSchedule?.filter(
        (item) => item.name === value?.name
      );
      if (checkExit?.length !== 0) {
        message.warning('This name has been already used');
        setLoading(false);
        return;
      }
    }
    try {
      setLoading(true);

      const dataPostSupabase = {
        id: selectedRecord?.id,
        action: 'Edit',
        area: value?.area,
        isActive: value?.isActive,
        frequency: value?.active,
        date: value?.dateInWeek ? value?.dateInWeek : selectedRecord?.date,
        name: value?.name,
        mixer1: value?.mixer1,
        mixer2: value?.mixer2,
        mixer3: value?.mixer3,
        cycle: value?.cycle,
        startTime: value?.time
          ? dayjs(value?.time[0]).format('HH:mm')
          : selectedRecord?.startTime,
        endTime: value?.time
          ? dayjs(value?.time[1]).format('HH:mm')
          : selectedRecord?.endTime,
      };
      const dataMqtt: SchedulerIrrigation = {
        action: 'Edit',
        area: value?.area,
        isActive: value?.isActive ? '1' : '0',
        cycle: Number(value?.cycle),
        frequency: value?.frequency,
        date: value?.dateInWeek ? value?.dateInWeek : selectedRecord?.date,
        name: value?.name,
        mixer1: Number(value?.mixer1),
        mixer2: Number(value?.mixer2),
        mixer3: Number(value?.mixer3),
        startTime: value?.time
          ? dayjs(value?.time[0]).format('HH:mm')
          : selectedRecord?.startTime,
        endTime: value?.time
          ? dayjs(value?.time[1]).format('HH:mm')
          : selectedRecord?.endTime,
      };

      const { error } = await SchedulerServices.editScheduler(dataPostSupabase);
      if (error) {
        message.warning(error.message);
        setLoading(false);
        return;
      }

      const jsonStringData = JSON.stringify(dataMqtt);
      clientMqtt.publish('kd77/feeds/scheduler', jsonStringData);
      message.success('Update scheduler successfully');
      setLoading(false);
      setOpen(false);
      form.resetFields();
    } catch (e: any) {
      console.log(e);
      message.error('error updating scheduler');
      setLoading(false);
      return;
    }
  };
  return (
    <>
      <Modal
        centered
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
                  if (formEditSchedule.current) {
                    formEditSchedule.current.submit();
                  }
                }}
                type="primary">
                Save
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
            initialValues={{
              frequency: selectedRecord?.frequency,
              action: selectedRecord?.action,
              cycle: selectedRecord?.cycle,
              name: selectedRecord?.name,
              isActive: selectedRecord?.isActive == '1' ? true : false,
              mixer1: selectedRecord?.mixer1,
              mixer2: selectedRecord?.mixer2,
              dateInWeek: selectedRecord?.date,
              mixer3: selectedRecord?.mixer3,
              area: selectedRecord?.area,
            }}
            ref={formEditSchedule}>
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
                label={
                  <div className="flex items-center gap-[4px] justify-center">
                    <p>{'Date & Time'}</p>
                    <p className="text-[red] italic text-[12px] text-center">
                      {' '}
                      {'Old: ' +
                        selectedRecord?.startTime +
                        ' - ' +
                        selectedRecord?.endTime}{' '}
                    </p>
                  </div>
                }
                name="time"
                rules={[
                  {
                    required: false,
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
                name="frequency"
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
            <Form.Item
              label="Active"
              name="isActive"
              valuePropName="checked">
              <Switch
                onChange={(e) => {
                  console.log(e);
                }}
              />
            </Form.Item>
          </Form>
        </Spin>
      </Modal>
    </>
  );
};
