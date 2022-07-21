# HTTP to MQTT bridge

A simple HTTP to MQTT bridge, for publishing messages.

## Using the image
The image contains a webserver and exposes port 5000 by default. To start the container type:
```
$ docker run -d -p 5000:5000 heleon19/http-mqtt-bridge
```

### Configure the image by environment variables
By default the `http-mqtt-bridge` will listen on port 5000 and connect to the localhost MQTT Broker. 

Well, the image does not contain a local MQTT broker. Set the following environment variables accordingly to determine your MQTT broker.
* MQTT_HOST: Set this value to the URL to your MQTT broker, eg. mqtts://example.com
* MQTT_PORT: Set this value to the port to your MQTT broker, eg. 1883 (optional).
* MQTT_USERNAME: Set to your username for authentication on your MQTT broker.
* MQTT_PASSWORD: Set to your password accordingly to your username for authentication.
* MQTT_CLIENT_ID: Set your client ID (optional).
* HTTP_PORT: Set this value to change default HTTP port of 5000 (optional).

```
docker run -d \
    -p 5000:5000 \
    -e MQTT_HOST=mqtt://<mqtt-host> \
    -e MQTT_USERNAME=<username> \
    -e MQTT_PASSWORD=<password> \
    migoller/http-mqtt-bridge
```

## Publish to a topic
Setup and run the docker image ;-) .

You can use GET or POST requests, paramters can be passed as body or query.
* topic: Topic of the message.
* message: The message you want to send.
* qos: Quality of Service, default 0 (optional).
* retain: Send message as retain, default false (optional).

Example: 
```
http://<ip-http-mqtt-bridge>:5000/publish?topic=myTopic&message=myMessage
```

## Thanks

This idea goes back to [petkov's HTTP to MQTT bridge](https://github.com/petkov/http_to_mqtt) based on Node JS. Thank you very much for this simple and reliable piece of code! I just modified it!