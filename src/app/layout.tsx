'use client';
import 'jsvectormap/dist/css/jsvectormap.css';
import 'flatpickr/dist/flatpickr.min.css';
import '@/css/satoshi.css';
import '@/css/style.css';
import React, { useEffect, useState } from 'react';
import Loader from '@/components/common/Loader';
import mqtt from 'mqtt';
import { App, Modal, notification } from 'antd';

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
    const url = 'wss://io.adafruit.com:443';
    const options = {
      clean: true,
      connectTimeout: 4000,
      clientId: 'unique_client_id_' + Math.random().toString(16).substr(2, 8),
      username: process.env.NEXT_PUBLIC_MQTT_USERNAME,
      password: process.env.NEXT_PUBLIC_MQTT_PASSWORD,
    };

    const client = mqtt.connect(url, options);

    client.on('connect', () => {
      console.log('Connected');
      client.subscribe('kd77/feeds/notification', (err) => {
        if (err) {
          console.error('Subscription error:', err);
        } else {
          console.log('Subscribed successfully');
        }
      });
    });

    client.on('message', (topic, message) => {
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

    client.on('error', (err) => {
      console.error('Connection error:', err);
    });

    client.on('close', () => {
      console.log('Connection closed');
    });

    return () => {
      if (client.connected) {
        client.end();
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
