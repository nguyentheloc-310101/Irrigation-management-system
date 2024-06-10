import mqtt from 'mqtt';

const url = 'wss://io.adafruit.com:443';
const options = {
  clean: true,
  connectTimeout: 4000,
  clientId: 'unique_client_id_' + Math.random().toString(16).substr(2, 8),
  username: process.env.NEXT_PUBLIC_MQTT_USERNAME,
  password: process.env.NEXT_PUBLIC_MQTT_PASSWORD,
};

export const clientMqtt = mqtt.connect(url, options);
