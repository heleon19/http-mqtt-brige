const mqtt = require("mqtt");
const express = require("express");
const bodyParser = require("body-parser");

function HttpMqttBridge() {

    const host = process.env.MQTT_HOST || "mqtt://192.168.2.30";
    const port = process.env.MQTT_PORT || "1883";
    const username = process.env.MQTT_USERNAME || "admin";
    const password = process.env.MQTT_PASSWORD || "ottag2022";
    const clientId = process.env.MQTT_CLIENT_ID || `http-bridge_${Math.random().toString(16).substr(2, 8)}`;
    const httpPort = process.env.HTTP_PORT || "5000";

    const app = express();
    app.use(bodyParser.json());
    
    const createMqttClient = () => {   
        console.log(`mqtt connect to [${host}:${port}] as [${clientId}]`);
        return mqtt.connect(`${host}`, { port, username, password, clientId });
    };
    
    const mqttClient = createMqttClient();
    
    
    const logRequest = (req, topic, qos, retain) => {
        const pathname = req.originalUrl.split("?").shift();
        const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
        let message = `Request [${pathname}] from [${ip}] with topic [${topic}] qos [${qos}]`;
        if (typeof retain === "boolean") {
            message += ` retain [${retain}]`;
        }
        console.log(message);
    };

    const checkTopic = (topic) => {
        if (!topic) {
            throw new Error("topic not specified");
        }
    };
    
    app.all("/publish", async (req, res) => {
        try {
            const topic = req.body.topic || req.query.topic;
            const message = req.body.message || req.query.message || "";
            const qos = req.body.qos || req.query.qos || 0;
            const retain = req.body.retain || req.query.retain || false;
            
            logRequest(req, topic, qos, retain);
            checkTopic(topic);

            if (!mqttClient.connected) {
                throw new Error("disconnected");
            }

            const response = await new Promise((_res, _rej) => {
                mqttClient.publish(topic, message, { qos, retain }, (merr, mres) => {
                    if (merr) {
                        _rej(merr);
                    } else {
                        _res(mres);
                    }
                });
            })

            res.json(response);

        } catch (err) {
            console.error(err.message);
            res.status(500).send({ error: err.message });
        }
    });
    
    app.listen(httpPort,  () => {
        console.log(`http-mqtt-bridge running on port ${httpPort}`);
    });

}
new HttpMqttBridge();