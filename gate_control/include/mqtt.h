#ifndef MQTT_h
#define MQTT_h

#include <Arduino.h>
#include <ArduinoJson.h>

void initMQTT();
void reconnectMQTTHandle(String topic[]);
void mqttAction();
void mqttCallback(String topic, DynamicJsonDocument doc, DynamicJsonDocument docJWT);
void resetTopic(String topic[]);
String encodeJWT(String object);

#endif