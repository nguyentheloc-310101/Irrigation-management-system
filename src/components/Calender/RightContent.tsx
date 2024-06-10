'use client';
import SchedulerServices from '@/services/class/scheduler/scheduler-services';
import { Badge, Card, Drawer, Table, message } from 'antd';
import { useEffect, useState } from 'react';
import TableSkeleton from '../common/skeleton/TableSkeleton';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

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
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [selectDay, setSelectDay] = useState<any>(null);

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

  return (
    <>
      <Drawer
        title="Details Irrigation schedule"
        onClose={() => {
          setOpenDrawer(false);
        }}
        open={openDrawer}>
        <div className="grid grid-cols-1 gap-[24px]">
          {selectDay?.items?.map((item: any) => {
            return (
              <Card
                title={
                  <div className="flex items-center justify-between">
                    <p>{item?.name}</p>
                    <div className="flex gap-[4px]">
                      <EditOutlined className=" cursor-pointer" />
                      <DeleteOutlined className="text-[red] cursor-pointer" />
                    </div>
                  </div>
                }
                key={item?.id}>
                <>{item?.name}</>
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
