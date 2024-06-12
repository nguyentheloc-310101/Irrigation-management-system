'use client';
import SchedulerServices from '@/services/class/scheduler/scheduler-services';
import {
  Badge,
  Card,
  Divider,
  Drawer,
  Modal,
  Popconfirm,
  Table,
  Tag,
  Tooltip,
  message,
} from 'antd';
import { useEffect, useState } from 'react';
import TableSkeleton from '../common/skeleton/TableSkeleton';
import {
  DeleteOutlined,
  EditOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import { ItemInfo } from '../common/item-information/ItemInfor';
import { ModalEdit } from './ModalEdit';
import { SchedulerIrrigation } from '@/types/scheduler';
import { clientMqtt } from '@/services/mqtt-client/mqtt';

// interface IRightContent {
//   loading: boolean;
//   dataSource: SchedulerIrrigation[];
// }
export const RightContent = () => {
  const columns = [
    {
      title: 'Monday',
      dataIndex: 'Monday',
      width: 200,
      key: 'monday',
      onCell: (record: any, rowIndex: any) => {
        return {
          onClick: (ev: any) => {
            handleClickCell(record?.Monday);
          },
        };
      },
      render: (_: any, record: any) => (
        <div className="grid grid-cols-1 gap-[24px]">
          {record?.Monday?.items?.map((item: any) => {
            return (
              <StatusScheduler
                key={item?.id}
                isActive={item?.isActive}
                name={item?.name}
              />
            );
          })}
        </div>
      ),
    },
    {
      title: 'Tuesday',
      dataIndex: 'Tuesday',
      key: 'tuesday',
      width: 200,

      onCell: (record: any, rowIndex: any) => {
        return {
          onClick: (ev: any) => {
            handleClickCell(record?.Tuesday);
          },
        };
      },
      render: (_: any, record: any) => (
        <div className="grid grid-cols-1">
          {record?.Tuesday?.items?.map((item: any) => {
            return (
              <StatusScheduler
                key={item?.id}
                isActive={item?.isActive}
                name={item?.name}
              />
            );
          })}
        </div>
      ),
    },
    {
      title: 'Wednesday',
      dataIndex: 'Wednesday',
      width: 200,

      key: 'wednesday',
      onCell: (record: any, rowIndex: any) => {
        return {
          onClick: (ev: any) => {
            handleClickCell(record?.Wednesday);
          },
        };
      },
      render: (_: any, record: any) => (
        <div className="grid grid-cols-1">
          {record?.Wednesday?.items?.map((item: any) => {
            return (
              <StatusScheduler
                key={item?.id}
                isActive={item?.isActive}
                name={item?.name}
              />
            );
          })}
        </div>
      ),
    },
    {
      title: 'Thursday',
      dataIndex: 'Thursday',
      key: 'thursday',
      width: 200,

      onCell: (record: any, rowIndex: any) => {
        return {
          onClick: (ev: any) => {
            handleClickCell(record?.Thursday);
          },
        };
      },
      render: (_: any, record: any) => (
        <div className="grid grid-cols-1">
          {record?.Thursday?.items?.map((item: any) => {
            return (
              <StatusScheduler
                key={item?.id}
                isActive={item?.isActive}
                name={item?.name}
              />
            );
          })}
        </div>
      ),
    },
    {
      title: 'Friday',
      dataIndex: 'Friday',
      width: 200,

      key: 'friday',
      onCell: (record: any, rowIndex: any) => {
        return {
          onClick: (ev: any) => {
            handleClickCell(record?.Friday);
          },
        };
      },
      render: (_: any, record: any) => (
        <div className="grid grid-cols-1">
          {record?.Friday?.items?.map((item: any) => {
            return (
              <StatusScheduler
                key={item?.id}
                isActive={item?.isActive}
                name={item?.name}
              />
            );
          })}
        </div>
      ),
    },
    {
      title: 'Saturday',
      dataIndex: 'Saturday',
      width: 200,

      key: 'saturday',
      onCell: (record: any, rowIndex: any) => {
        return {
          onClick: (ev: any) => {
            handleClickCell(record?.Saturday);
          },
        };
      },
      render: (_: any, record: any) => (
        <div className="grid grid-cols-1">
          {record?.Saturday?.items?.map((item: any) => {
            return (
              <StatusScheduler
                key={item?.id}
                isActive={item?.isActive}
                name={item?.name}
              />
            );
          })}
        </div>
      ),
    },
    {
      title: 'Sunday',
      dataIndex: 'Sunday',
      width: 200,

      onCell: (record: any, rowIndex: any) => {
        return {
          onClick: (ev: any) => {
            handleClickCell(record?.Sunday);
          },
        };
      },
      key: 'sunday',
      render: (_: any, record: any) => (
        <div className="grid grid-cols-1">
          {record?.Sunday?.items?.map((item: any) => {
            return (
              <StatusScheduler
                key={item?.id}
                isActive={item?.isActive}
                name={item?.name}
              />
            );
          })}
        </div>
      ),
    },
  ];

  const [loading, setLoading] = useState<boolean>(false);
  const [activeEdit, setActiveEdit] = useState<boolean>(false);

  const [dataSource, setDataSource] = useState<any[]>([]);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [selectDay, setSelectDay] = useState<any>(null);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  useEffect(() => {
    const formatDaySelect = () => {
      if (!selectDay) {
        return;
      }
      selectDay.items.sort((a: any, b: any) => {
        if (a.startTime < b.startTime) return -1;
        if (a.startTime > b.startTime) return 1;
        return 0;
      });
      setSelectDay(selectDay);
    };
    formatDaySelect();
  }, [selectDay]);
  useEffect(() => {
    const fetchScheduler = async () => {
      try {
        const { data, error } = await SchedulerServices.getAllScheduler();
        if (error) {
          message.error(error.message);
          setLoading(false);
        } else {
          const groupedData = groupDataByDate(data as any);
          setDataSource([groupedData]);
          console.log([groupedData]);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchScheduler();
  }, []);
  const handleClickCell = (record: any) => {
    setOpenDrawer(true);
    setSelectDay(record);
  };
  const groupDataByDate = (
    data: any[]
  ): { [key: string]: { items: any[] } } => {
    // Initialize an empty object to store grouped data
    const groupedData: { [key: string]: { items: any[] } } = {};

    // Group the data by date
    data.forEach((item) => {
      if (!groupedData[item.date]) {
        groupedData[item.date] = { items: [] };
      }
      groupedData[item.date].items.push(item);
    });

    // Ensure each day has an object even if there's no data
    const daysOfTheWeek = [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ];
    daysOfTheWeek.forEach((day) => {
      if (!groupedData[day]) {
        groupedData[day] = { items: [] };
      }
    });

    return groupedData;
  };
  const deleteScheduler = async (id: string, item: any) => {
    try {
      const { error } = await SchedulerServices.deleteScheduler(id);
      if (error) {
        message.warning(error.message);
      } else {
        const dataMqtt: SchedulerIrrigation = {
          action: 'Delete',
          area: item?.area,
          isActive: item?.isActive,
          cycle: Number(item?.cycle),
          frequency: item?.frequency,
          date: item?.date,
          name: item?.name,
          mixer1: Number(item?.mixer1),
          mixer2: Number(item?.mixer2),
          mixer3: Number(item?.mixer3),
          startTime: item?.startTime,
          endTime: item?.endTime,
        };
        const jsonStringData = JSON.stringify(dataMqtt);
        clientMqtt.publish('kd77/feeds/scheduler', jsonStringData);
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      {activeEdit && (
        <ModalEdit
          open={activeEdit}
          setOpen={setActiveEdit}
          selectedRecord={selectedRecord}
        />
      )}
      <Drawer
        title="Details Irrigation schedule"
        width={400}
        onClose={() => {
          setOpenDrawer(false);
        }}
        open={openDrawer}>
        <div className="grid grid-cols-1 gap-[24px]">
          {selectDay?.items?.map((item: any) => {
            return (
              <Card
                className="shadow-box-custom"
                bordered
                title={
                  <div className="flex items-center justify-between">
                    <div className="flex items-center justify-start gap-[12px]">
                      <p>{item?.name}</p>
                      <Tag color={item?.isActive ? 'blue' : 'red'}>
                        {item?.isActive ? 'Active' : 'Inactive'}
                      </Tag>
                    </div>
                    <div className="flex gap-[4px]">
                      <Tooltip title="Edit">
                        <EditOutlined
                          className=" cursor-pointer"
                          onClick={() => {
                            setSelectedRecord(item);
                            setActiveEdit(true);
                          }}
                        />
                      </Tooltip>

                      <Popconfirm
                        title="Delete"
                        onConfirm={() => {
                          deleteScheduler(item?.id, item);
                        }}
                        description="Are you sure to delete this scheduler?"
                        icon={
                          <QuestionCircleOutlined style={{ color: 'red' }} />
                        }>
                        <Tooltip title="Delete">
                          <DeleteOutlined className="text-[red] cursor-pointer" />
                        </Tooltip>
                      </Popconfirm>
                    </div>
                  </div>
                }
                key={item?.id}>
                <>
                  <ItemInfo
                    label={'Name'}
                    info={<div className="">{item?.name}</div>}
                  />
                  <Divider className="my-[10px]" />
                  <ItemInfo
                    label={'Date & Time'}
                    info={
                      <div className="">
                        {item?.date +
                          ', ' +
                          item?.startTime +
                          ' - ' +
                          item?.endTime}
                      </div>
                    }
                  />
                  <Divider className="my-[10px]" />
                  <ItemInfo
                    label={'Mixer [1,2,3]'}
                    info={
                      <div className="">
                        {item?.mixer1 +
                          ', ' +
                          item?.mixer2 +
                          ', ' +
                          item?.mixer3}
                      </div>
                    }
                  />
                  <Divider className="my-[10px]" />
                  <ItemInfo
                    label={'Area'}
                    info={<div className="">{item?.area}</div>}
                  />
                  <Divider className="my-[10px]" />
                  <ItemInfo
                    label={'Cycle'}
                    info={<div className="">{item?.cycle}</div>}
                  />
                  <Divider className="my-[10px]" />
                  <ItemInfo
                    label={'frequency'}
                    info={<div className="">{item?.frequency}</div>}
                  />
                  <Divider className="my-[10px]" />
                </>
              </Card>
            );
          })}
        </div>
      </Drawer>
      <TableSkeleton
        columns={columns}
        loading={loading}>
        <Table
          className="cursor-pointer "
          columns={columns}
          bordered
          dataSource={dataSource}
          scroll={{
            x: 1200,
            // y: `calc(100vh - 10rem)`,
          }}
        />
      </TableSkeleton>
    </>
  );
};

interface IStatusSchedulerProps {
  isActive: boolean;
  name: string;
}
const StatusScheduler = ({ isActive, name }: IStatusSchedulerProps) => {
  return (
    <Badge
      status={isActive ? 'success' : 'error'}
      text={name}
    />
  );
};
