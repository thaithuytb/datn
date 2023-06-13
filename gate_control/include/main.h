#ifndef MAIN_h
#define MAIN_h

#include <Arduino.h>
#include <controller.h>
#include <lora.h>
#include <mqtt.h>
#include <automatic.h>
#include <Arduino.h>
#include <ArduinoJson.h>
#include <realtime.h>

#define DHT_PIN 25
#define LIGHT_PIN 26
#define HUMI_PIN 27

#define FAN_PIN 25
#define PUMP_PIN 33
// #define MIST_PIN 33
#define CURTAIN_PIN 32
#define LAMP_PIN 27

// #define MIST_IP "mist"
#define FAN_IP "fan_1_1"
#define PUMP_IP "pump_1_1"
#define CURTAIN_IP "curtain_1_1"
#define LAMP_IP "lamp_1_1"

#define sen_temp_air_IP "temp_air_sensor_1_1"
#define sen_humi_IP "humi_sensor_1_1"
#define sen_light_IP "light_sensor_1_1"

extern bool controlMode;

extern String string;
extern String uuid;
extern String topics[];
extern String trueTopics[];

extern int topicCount;
extern bool isLoraBusy;
extern float timeTick;

void generateTopics();

#endif