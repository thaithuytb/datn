#include <regime.h>

void __regime(String topic, DynamicJsonDocument doc, DynamicJsonDocument docJWT) {
  String from = doc["from"].as<String>();

  if (from != "web") {
    return;
  }

  bool isAuto = doc["isAuto"].as<bool>();
  int create = doc["createdBy"].as<int>();
  bool first = doc["first"].as<bool>();

  controlMode = !isAuto;

  if (controlMode) { 
    timeStr = doc["time"].as<String>();

    fanLimit = fan == 1 ? "00:0" : "99:9";
    pumpLimit = pump == 1 ? "00:0" : "99:9";
    lampLimit = lamp == 1 ? "00:0" : "99:9";
    curtainLimit = curtain == 1 ? "00:0" : "99:9";
  //   fanSpeed(FAN_PIN, 0);
  //   pumpStrength(PUMP_PIN, 0);
  //   curtainOpen(CURTAIN_PIN, 0);
  //   lampOn(LAMP_PIN, false);

  //   String devices[4] = { FAN_IP, PUMP_IP, CURTAIN_IP, LAMP_IP };

  //   if(first) {
  //     return;
  //   }

  //   for(int i = 0; i < 4; i++) {
  //     String json = "{ \"ip\": \"" + devices[i] + "\", \"status\": false, \"gardenId\": 1" + ", \"createdBy\": " + create + "}";
  //     mqttSend(trueTopics[1], json);
  //     Serial.println(json); 
  //     Serial.println(topic); 
  //   }
  }

  if(first) {
    return;
  }

  String json = "{ \"isAuto\": " + (controlMode ? String("false") : String("true")) + ", \"gardenId\": 1" + ", \"createdBy\": " + create + "}";
  mqttSend(topic, json);
  Serial.println(json); 
  Serial.println(topic); 
}