'use client';
import { App, Badge, Button, Card, Divider, notification } from 'antd';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { ModalCreate } from './ModalCreate';
import { CalendarOutlined } from '@ant-design/icons';

export const LeftContent = () => {
  const router = useRouter();
  const [openCreate, setOpenCreate] = useState<boolean>(false);

  return (
    <div className="grid grid-cols-1 gap-8">
      {openCreate && (
        <ModalCreate
          open={openCreate}
          setOpen={setOpenCreate}
        />
      )}
      <Button
        type="primary"
        onClick={() => {
          setOpenCreate(true);
        }}>
        Create new +
      </Button>

      <Card
        title={
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
            <CalendarOutlined />
            Upcoming events
          </div>
        }>
        <Badge
          status="success"
          text="Today, 23:00 - 23:15"
        />
        <p className="ml-[24px] font-bold">Rose watering</p>
        <Divider className="my-[10px]" />
        <Badge
          status="success"
          text="Today, 23:15 - 23:30"
        />
        <p className="ml-[24px] font-bold">Sunflower watering</p>
        <Divider className="my-[10px]" />

        {/* <span
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '220px',
          }}>
         
        </span> */}
      </Card>
    </div>
  );
};
