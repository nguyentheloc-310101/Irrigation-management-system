import { Form, Input, Modal, TimePicker } from 'antd';

interface ModalCreateCalendar {
    open:boolean ;
    setOpen:any;
}
export const ModalCreate = ({open, setOpen}:ModalCreateCalendar) => {
  return (
      <Modal
      title="Create Event Irrigation"
      open={open}
      okText="Save"
      onCancel={()=>{setOpen(false)}}
      width={560}
    >
      <Form layout="vertical" >
      <Form.Item
        label="Name"
        name="name"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input />
      </Form.Item>
   <Form.Item
        label="Machine 1"
        name="machine 1"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input />
      </Form.Item>
       <Form.Item
        label="Machine 2"
        name="machine 2"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input />
      </Form.Item>
       <Form.Item
        label="Machine 3"
        name="machine 3"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Date & Time"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "start",
            alignItems: "center",
          }}
        >         
              <Form.Item
              name="time"
                rules={[
                  {
                    required: true,
                  },
                ]}
                noStyle
              >
                <TimePicker.RangePicker
                  style={{
                    width:'100%',
                  }}
                  format={"HH:mm"}
                  minuteStep={15}
                />
              </Form.Item>
          
        </div>
      </Form.Item>
    </Form>

    </Modal>
  )
}
