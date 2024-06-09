'use client'
import { Button, Card } from 'antd'
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { ModalCreate } from './ModalCreate';
import { CalendarOutlined } from '@ant-design/icons';

export const LeftContent = () => {
    const [openCreate, setOpenCreate] = useState<boolean>(false)
    const router = useRouter();
  return (
    <div className="grid grid-cols-1 gap-8">
        {openCreate&&<ModalCreate open={ openCreate } setOpen={ setOpenCreate }/>}
        <Button type="primary" onClick={()=>{setOpenCreate(true)}}>Create new +</Button>
        <Card title={<div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
          <CalendarOutlined />
          
            Upcoming events
        </div>}> <span
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '220px',
    }}>
    No Upcoming Event
  </span></Card>
    </div>
  )
}
