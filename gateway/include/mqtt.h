#ifndef MQTT_h
#define MQTT_h

#include <Arduino.h>

void initMQTT();
void reconnectMQTTHandle(String topic[]);
String encodeJWT(String object);

#endif