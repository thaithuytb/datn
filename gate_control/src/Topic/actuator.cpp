#include <actuator.h>

void __actuator(String topic, DynamicJsonDocument doc, DynamicJsonDocument docJWT) {
  // actuator
  String from = doc["from"].as<String>();
  bool first = doc["first"].as<bool>();

  if (from != "web" || !controlMode) {
    return;
  }

  bool status = doc["status"].as<bool>();
  String device = doc["ip"].as<String>();
  int create = doc["createdBy"].as<int>();

  if (device == FAN_IP) {
    bool status = doc["status"].as<bool>();
    fanSpeed(FAN_PIN, status ? 1 : 0);

    String json = "{ \"ip\": \"" + device + "\", \"status\": " + (status ? String("true") : String("false")) + ", \"gardenId\": 1" + ", \"createdBy\": " + create + "}";
    if(!first) {
      mqttSend(topic, json);
      Serial.println(json); 
      Serial.println(topic); 

      Serial.print("fan: ");
      Serial.println(status);
    }
  }
  if (device == PUMP_IP) {
    bool status = doc["status"].as<bool>();
    pumpStrength(PUMP_PIN, status ? 1 : 0);

    String json = "{ \"ip\": \"" + device + "\", \"status\": " + (status ? String("true") : String("false")) + ", \"gardenId\": 1" + ", \"createdBy\": " + create + "}";
    if(!first) {
      mqttSend(topic, json);
      Serial.println(json); 
      Serial.println(topic); 

      Serial.print("pump: ");
      Serial.println(status);
    }
  }
  if (device == CURTAIN_IP) {
    bool status = doc["status"].as<bool>();
    curtainOpen(CURTAIN_PIN, status ? 1 : 0);

    String json = "{ \"ip\": \"" + device + "\", \"status\": " + (status ? String("true") : String("false")) + ", \"gardenId\": 1" + ", \"createdBy\": " + create + "}";
    if(!first) {
      mqttSend(topic, json);
      Serial.println(json); 
      Serial.println(topic); 

      Serial.print("curtain: ");
      Serial.println(status);
    }
  }
  if (device == LAMP_IP) {
    bool status = doc["status"].as<bool>();
    lampOn(LAMP_PIN, status ? 1 : 0);

    String json = "{ \"ip\": \"" + device + "\", \"status\": " + (status ? String("true") : String("false")) + ", \"gardenId\": 1" + ", \"createdBy\": " + create + "}";
    if(!first) {
      mqttSend(topic, json);
      Serial.println(json); 
      Serial.println(topic); 

      Serial.print("lamp: ");
      Serial.println(status);
    }
  }
}