'use client';
import Loader from '@/components/common/Loader';
import '@/css/satoshi.css';
import '@/css/style.css';
import { clientMqtt } from '@/services/mqtt-client/mqtt';
import { notification } from 'antd';
import 'flatpickr/dist/flatpickr.min.css';
import 'jsvectormap/dist/css/jsvectormap.css';
import React, { useEffect, useState } from 'react';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  useEffect(() => {
    clientMqtt.on('connect', () => {
      console.log('Connected');
      clientMqtt.subscribe('kd77/feeds/notification', (err) => {
        if (err) {
          console.error('Subscription error:', err);
        } else {
          console.log('Subscribed successfully');
        }
      });
    });

    clientMqtt.on('message', (topic, message) => {
      console.log(
        `Received message from topic ${topic}: ${message.toString()}`
      );
      if (topic == 'kd77/feeds/notification') {
        // setOpenNotification(true);
        notification.warning({
          message: <div className="text-bold">Caution message</div>,
          description: message.toString(),
        });
      } else {
        // setOpenNotification(false);
      }
    });

    clientMqtt.on('error', (err) => {
      console.error('Connection error:', err);
    });

    clientMqtt.on('close', () => {
      console.log('Connection closed');
    });

    return () => {
      if (clientMqtt.connected) {
        clientMqtt.end();
      }
    };
  }, []);
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <div className="dark:bg-boxdark-2 dark:text-bodydark">
          {loading ? <Loader /> : children}
        </div>
      </body>
    </html>
  );
}
