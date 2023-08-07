#include <operator.h>
#include <main.h>
#include <map>

void __operator(String topic, DynamicJsonDocument doc, DynamicJsonDocument docJWT) {
    // operator
    String from = doc["from"].as<String>();
    bool first = doc["first"].as<bool>();

    if (from != "web") {
        return;
    }

    String startTime = doc["startAt"].as<String>();
    String endTime = doc["endAt"].as<String>();
    String device = doc["ip"].as<String>();
    int create = doc["createdBy"].as<int>();

    if (device == FAN_IP) {
        fanOpera[0] = startTime;
        fanOpera[1] = endTime;

        Serial.println(fanOpera[0]);
        Serial.println(fanOpera[1]);
    }
    if (device == PUMP_IP) {
        pumpOpera[0] = startTime;
        pumpOpera[1] = endTime;

        Serial.println(pumpOpera[0]);
        Serial.println(pumpOpera[1]);
    }
    if (device == CURTAIN_IP) {
        curtainOpera[0] = startTime;
        curtainOpera[1] = endTime;

        Serial.println(curtainOpera[0]);
        Serial.println(curtainOpera[1]);
    }
    if (device == LAMP_IP) {
        lampOpera[0] = startTime;
        lampOpera[1] = endTime;

        Serial.println(lampOpera[0]);
        Serial.println(lampOpera[1]);
    }

    String json = "{ \"ip\": \"" + device + "\"" + ", \"gardenId\": 1" + ", \"createdBy\": " + create  + ", \"startAt\": \"" + startTime  + "\", \"endAt\": \"" + endTime + "\"}";
    if (!first) {
        mqttSend(topic, json);
        Serial.println(json);
        Serial.println(topic);
    }
}