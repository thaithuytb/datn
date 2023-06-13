#include <regime.h>

void __regime(String topic, DynamicJsonDocument doc, DynamicJsonDocument docJWT) {
  String from = doc["from"].as<String>();

  if (from != "web") {
    return;
  }

  bool isAuto = doc["isAuto"].as<bool>();

  controlMode = !isAuto;

  if (controlMode) { 
    timeStr = doc["time"].as<String>();

    fanSpeed(FAN_PIN, 0);
    pumpStrength(PUMP_PIN, 0);
    curtainOpen(CURTAIN_PIN, 0);
    lampOn(LAMP_PIN, false);

    String devices[4] = { FAN_IP, PUMP_IP, CURTAIN_IP, LAMP_IP };

    for(int i = 0; i < 4; i++) {
      String json = "{ \"ip\": \"" + devices[i] + "\", \"status\": false, \"gardenId\": 1" + "}";
      mqttSend(trueTopics[1], json);
      Serial.println(json); 
      Serial.println(topic); 
    }
  }

  String json = "{ \"isAuto\": " + (controlMode ? String("false") : String("true")) + ", \"gardenId\": 1" + "}";
  mqttSend(topic, json);
  Serial.println(json); 
  Serial.println(topic); 
}