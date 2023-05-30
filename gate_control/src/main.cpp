#include <controller.h>
#include <lora.h>
#include <mqtt.h>
#include <main.h>
#include <sensorReceiver.h>
#include <Arduino.h>
#include <ArduinoJson.h>
#include <realtime.h>

String string = "";

String uuid = "thaihai";

String topics[] = {
  "changeTopic",
  "sensor",
  "actuator",
  "regime",
};

String trueTopics[] = {
  "changeTopic",
  "sensor",
  "actuator",
  "regime",
};

int topicCount = 4;

String ip[] = {

};

bool controlMode = false;

bool isLoraBusy = false;

float timeTick = 0;

void generateTopics() {
  for(int i = 0; i < topicCount; i++) {
    if (i == 0) {
      trueTopics[i] = "datn/" + topics[i];
    } else {
      trueTopics[i] = "datn/" + uuid + "/" + topics[i];
    }
    Serial.println("This: " + trueTopics[i]);
  }
}

void setup() {
  Serial.begin(115200);
  
  initMQTT();
  initLora();
}

void loop() {
  loraRead();

  while (isLoraBusy) {
    loraRead();
  }

  String topic[10] = {
    "datn/" + topics[0],
  };

  reconnectMQTTHandle(topic);
  if (!controlMode) {
    deviceAutomatic();
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

void mqttCallback(String topic, DynamicJsonDocument doc, DynamicJsonDocument docJWT) {
  Serial.print(topic);
  Serial.println(doc.as<String>());

  if (topic == (String("datn/") + topics[0])) {
    generateTopics();
    unSubscribe(trueTopics);
    uuid = docJWT["newTopic"].as<String>();
    generateTopics();
    subscribe(trueTopics);
    isValidUUID = true;

    Serial.println(uuid);

    return;
  }

  if (topic == (String("datn/") + uuid + "/" + topics[2])) {
    String from = doc["from"].as<String>();

    if (from != "web") {
      return;
    }

    bool status = doc["status"].as<bool>();
    String device = doc["ip"].as<String>();
    String deviceId = doc["deviceId"].as<String>();
    
    if (device == FAN_IP) {
      Serial.println(status);
      fanOnOff(status);
      String json = "{ \"ip\": \"" + device + "\", \"status\": " + (status ? String("true") : String("false")) + ", \"deviceId\": " + deviceId + String(", \"temp\": ") + temp + String(",\"air\": ") + air + String(",\"humi\": ") + humi + String(",\"light\": ") + light + "}";
      mqttSend(String("datn/") + uuid + "/" + topics[2], json);
      Serial.println(json);
    }
    if (device == PUMP_IP) {
      pumpOnOff(status);
      String json = "{ \"ip\": \"" + device + "\", \"status\": " + (status ? String("true") : String("false")) + ", \"deviceId\": " + deviceId + "}";
      mqttSend(String("datn/") + uuid + "/" + topics[2], json);
      Serial.println(json);
    }
    if (device == LAMP_IP) {
      lampOnOff(status);
      String json = "{ \"ip\": \"" + device + "\", \"status\": " + (status ? String("true") : String("false")) + ", \"deviceId\": " + deviceId + "}";
      mqttSend(String("datn/") + uuid + "/" + topics[2], json);
      Serial.println(json);
    }

    return;
  }
  if (topic == (String("datn/") + uuid + "/" + topics[1])) {
    String from = doc["from"].as<String>();

    if (from != "web") {
      return;
    }

    String device = doc["ip"].as<String>();
    
    // if (device != sen_temp_air_IP) {
    //   String json = "{ \"device\": \"" + device + "\", "
    // }
    // if (device != sen_humi_IP) {
      
    // }
    // if (device != sen_light_IP) {
    //   lampOnOff(status);
    // }

    return;
  }

  if (topic == (String("datn/") + uuid + "/" + topics[3])) {
    String from = doc["from"].as<String>();

    if (from != "web") {
      return;
    }

    bool isAuto = doc["isAuto"].as<bool>();

    controlMode = !isAuto;

    if (controlMode) { 
      timeStr = doc["time"].as<String>();
    }

    return;
  }

}