#include <controller.h>
#include <lora.h>
#include <mqtt.h>
#include <main.h>
#include <automatic.h>
#include <Arduino.h>
#include <ArduinoJson.h>
#include <realtime.h>

String string = "";

String uuid = "thaihai";

String topics[] = {
  "changeTopic",
  "actuator",
  "regime",
  "threshold",
};

String trueTopics[] = {
  "changeTopic",
  "actuator",
  "regime",
  "threshold",
};

int topicCount = 4;

String ip[] = {

};

bool controlMode = false;

bool isLoraBusy = false;

float timeTick = 0;

void generateTopics() {
  for(int i = 0; i < topicCount; i++) {
    if (i == 0 || i == 5) {
      trueTopics[i] = "datn/" + topics[i];
    } else {
      trueTopics[i] = "datn/" + uuid + "/" + topics[i];
    }
  }
}

void setup() {
  Serial.begin(115200);
  
  initRealTime();
  initMQTT();
  initLora();
}

void loop() {
  loraRead();

  while (isLoraBusy) {
    loraRead();
  }

  generateTopics();
  reconnectMQTTHandle(trueTopics);
  if (!controlMode) {
    deviceAutomatic();
  } else {
    if (isTimeUp()) {
      controlMode = false;
      String json = "{ \"isAuto\": " + (controlMode ? String("false") : String("true")) + ", \"gardenId\": 1" + "}";
      mqttSend(trueTopics[2], json);
      Serial.println(json); 
      Serial.println(trueTopics[2]); 
      Serial.println("Is time up");
    }
  }
}

void handleLoraString() {
  DynamicJsonDocument doc(1024);
  deserializeJson(doc, string);

  if (doc["receiver"] != "gate_control") {
    return;
  }

  if (doc["sender"] == "sensor") {
    float _temp = doc["temp"].as<float>();
    float _air = doc["air"].as<float>();
    float _humi = doc["humi"].as<float>();
    float _light = doc["light"].as<float>();

    temp = _temp;
    air = _air;
    humi = _humi;
    light = _light;

    String json = "{ \"ip\": \"" + String(sen_temp_air_IP) + "\", \"temp\": " + (temp) + ", \"airHumidity\": " + (air) + ", \"gardenId\": 1" + "}";
    mqttSend("datn/" + uuid + "/sensor", json);
    Serial.println(json); 
    Serial.println("datn/" + uuid + "/sensor"); 

    String json1 = "{ \"ip\": \"" + String(sen_light_IP) + "\", \"value\": " + (light) + ", \"gardenId\": 1" + "}";
    mqttSend("datn/" + uuid + "/sensor", json1);
    Serial.println(json1); 
    Serial.println("datn/" + uuid + "/sensor"); 

    String json2 = "{ \"ip\": \"" + String(sen_humi_IP) + "\", \"value\": " + (humi) + ", \"gardenId\": 1" + "}";
    mqttSend("datn/" + uuid + "/sensor", json2);
    Serial.println(json2); 
    Serial.println("datn/" + uuid + "/sensor"); 

    Serial.println("Sender");
    Serial.println(temp);
    Serial.println(air);
    Serial.println(humi);
    Serial.println(light);
    Serial.println("end");
  }
}

void loraCallback(char c) {
  if (c == '$') {
    string = "";
    isLoraBusy = true;
    Serial.println("Start");
    return;
  }

  if (c == '#') { 
    Serial.println(string);
    handleLoraString();
    isLoraBusy = false;
    return;
  }

  string = string + c;
}

void mqttAction() {
  if (timeTick > 20000) {
    Serial.print(temp);
  }
  if (timeTick > 20000) {
    Serial.print(air);
  }
  if (timeTick > 20000) {
    Serial.print(humi);
  }
  if (timeTick > 20000) {
    Serial.print(light);
  }
}

void __changeTopic(String topic, DynamicJsonDocument doc, DynamicJsonDocument docJWT) {
  // changeTopic
  generateTopics();
  unSubscribe(trueTopics);
  uuid = docJWT["newTopic"].as<String>();
  generateTopics();
  subscribe(trueTopics);
  isValidUUID = true;

  Serial.println(docJWT.as<String>());

  myRTC.setMonth(docJWT["month"].as<byte>());
  myRTC.setDate(docJWT["day"].as<byte>());
  myRTC.setHour(docJWT["hour"].as<byte>());
  myRTC.setMinute(docJWT["minute"].as<byte>());

  Serial.println(getTime());

  delay(2000);

  publish("datn/" + uuid + "/initStatusDevice", "{ \"gardenId\": 1 }");
  Serial.println("This: " + String("datn/" + uuid + "/initStatusDevice") + String("{ \"gardenId\": 1 }"));

  Serial.println(uuid);
}

void __actuator(String topic, DynamicJsonDocument doc, DynamicJsonDocument docJWT) {
  // actuator
  String from = doc["from"].as<String>();

  if (from != "web" || !controlMode) {
    return;
  }

  bool status = doc["status"].as<bool>();
  String device = doc["ip"].as<String>();

  if (device == FAN_IP) {
    bool status = doc["status"].as<bool>();
    fanSpeed(FAN_PIN, status ? 1 : 0);

    String json = "{ \"ip\": \"" + device + "\", \"status\": " + (status ? String("true") : String("false")) + ", \"gardenId\": 1" + "}";
    mqttSend(topic, json);
    Serial.println(json); 
    Serial.println(topic); 

    Serial.print("fan: ");
    Serial.println(status);
  }
  if (device == PUMP_IP) {
    bool status = doc["status"].as<bool>();
    pumpStrength(PUMP_PIN, status ? 1 : 0);

    String json = "{ \"ip\": \"" + device + "\", \"status\": " + (status ? String("true") : String("false")) + ", \"gardenId\": 1" + "}";
    mqttSend(topic, json);
    Serial.println(json); 
    Serial.println(topic); 

    Serial.print("pump: ");
    Serial.println(status);
  }
  if (device == CURTAIN_IP) {
    bool status = doc["status"].as<bool>();
    curtainOpen(CURTAIN_PIN, status ? 1 : 0);

    String json = "{ \"ip\": \"" + device + "\", \"status\": " + (status ? String("true") : String("false")) + ", \"gardenId\": 1" + "}";
    mqttSend(topic, json);
    Serial.println(json); 
    Serial.println(topic); 

    Serial.print("curtain: ");
    Serial.println(status);
  }
  if (device == LAMP_IP) {
    bool status = doc["status"].as<bool>();
    lampOn(LAMP_PIN, status ? 1 : 0);

    String json = "{ \"ip\": \"" + device + "\", \"status\": " + (status ? String("true") : String("false")) + ", \"gardenId\": 1" + "}";
    mqttSend(topic, json);
    Serial.println(json); 
    Serial.println(topic); 

    Serial.print("lamp: ");
    Serial.println(status);
  }
}

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

void mqttCallback(String topic, DynamicJsonDocument doc, DynamicJsonDocument docJWT) {
  Serial.println(topic);
  Serial.println(doc.as<String>());

  // changeTopic
  if (topic == trueTopics[0]) {
    __changeTopic(topic, doc, docJWT);

    return;
  }
  
  // actuator
  if (topic == trueTopics[1]) {
    __actuator(topic, doc, docJWT);

    return;
  }

  // regime
  if (topic == trueTopics[2]) {
    __regime(topic, doc, docJWT);

    return;
  }

  // threshold
  if (topic == trueTopics[3]) {
    __threshold(topic, doc, docJWT);

    return;
  }
}