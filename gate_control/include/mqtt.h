#ifndef MQTT_h
#define MQTT_h

#include <Arduino.h>
#include <ArduinoJson.h>

extern bool isValidUUID;
extern String topics[];
extern int topicCount;

void initMQTT();
void reconnectMQTTHandle(String topic[]);
void mqttAction();
void mqttSend(String topic, String json);
void mqttCallback(String topic, DynamicJsonDocument doc, DynamicJsonDocument docJWT);
void resetTopic(String topic[]);
void unSubscribe(String topic[]);
void subscribe(String topic[]);

String encodeJWT(String object);

#endif