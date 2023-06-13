#include <threshold.h>

void __threshold(String topic, DynamicJsonDocument doc, DynamicJsonDocument docJWT) {
  // statusDevice
  String from = doc["from"].as<String>();

  if (from != "web") {
    return;
  }

  String device = doc["ip"].as<String>();
  
  // sensor update
  if (device == sen_temp_air_IP) {
    JsonArray lowThreshold = doc["lowThreshold"].as<JsonArray>();
    JsonArray highThreshold = doc["highThreshold"].as<JsonArray>();
    
    tempThresh[0] = lowThreshold[0].as<float>();
    tempThresh[1] = highThreshold[0].as<float>();
    airThresh[0] = lowThreshold[1].as<float>();
    airThresh[1] = highThreshold[1].as<float>();

    String json = "{ \"ip\": \"" + device + 
                  "\", \"lowThreshold\": " + "[" + String(tempThresh[0]) + "," + String(airThresh[0]) + "]" + 
                  ", \"highThreshold\": " + "[" + String(tempThresh[1]) + "," + String(airThresh[1]) + "]" + 
                   + ", \"gardenId\": 1"
                    "}";
    mqttSend(topic, json);
    Serial.println(json); 
    Serial.println(topic); 

    Serial.println("tempThresh");
    Serial.print(tempThresh[0]);
    Serial.print("-");
    Serial.println(tempThresh[1]);
    
    Serial.println("airThresh");
    Serial.print(airThresh[0]);
    Serial.print("-");
    Serial.println(airThresh[1]);
  }
  if (device == sen_humi_IP) {
    JsonArray lowThreshold = doc["lowThreshold"].as<JsonArray>();
    JsonArray highThreshold = doc["highThreshold"].as<JsonArray>();

    humiThresh[0] = lowThreshold[0].as<float>();
    humiThresh[1] = highThreshold[0].as<float>();

    String json = "{ \"ip\": \"" + device + 
                  "\", \"lowThreshold\": " + "[" + String(humiThresh[0]) + "]" + 
                  ", \"highThreshold\": " + "[" + String(humiThresh[1]) + "]" + 
                   + ", \"gardenId\": 1"
                    "}";
    mqttSend(topic, json);
    Serial.println(json); 
    Serial.println(topic); 

    Serial.println("humiThresh");
    Serial.print(humiThresh[0]);
    Serial.print("-");
    Serial.println(humiThresh[1]);
  }
  if (device == sen_light_IP) {
    JsonArray lowThreshold = doc["lowThreshold"].as<JsonArray>();
    JsonArray highThreshold = doc["highThreshold"].as<JsonArray>();

    lightThresh[0] = lowThreshold[0].as<float>();
    lightThresh[1] = highThreshold[0].as<float>();
  
    String json = "{ \"ip\": \"" + device + 
                  "\", \"lowThreshold\": " + "[" + String(lightThresh[0]) + "]" + 
                  ", \"highThreshold\": " + "[" + String(lightThresh[1]) + "]" + 
                   + ", \"gardenId\": 1"
                    "}";
    mqttSend(topic, json);
    Serial.println(json); 
    Serial.println(topic); 

    Serial.println("lightThresh");
    Serial.print(lightThresh[0]);
    Serial.print("-");
    Serial.println(lightThresh[1]);
  }
}