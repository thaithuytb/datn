#include <controller.h>
#include <lora.h>
#include <mqtt.h>
#include <sensorReceiver.h>
#include <Arduino.h>
#include <ArduinoJson.h>

String string = "";

String uuid = "thaihai";

String topics[] = {
    "datn/changeTopic"
};

bool isLoraBusy = false;

float timeTick = 0;

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

  reconnectMQTTHandle(topics);
  deviceAutomatic();
}

void handleLoraString() {
  DynamicJsonDocument doc(1024);
  deserializeJson(doc, string);

  if (doc["receiver"] != "gate_control") {
    return;
  }

  if (doc["sender"] == "sensor") {
    String device = doc["device"];
    float value = doc["value"].as<float>();

    if (device == "temp") {
      temp = value;
    }
    if (device == "air") {
      air = value;
    }
    if (device == "humi") {
      humi = value;
    }
    if (device == "light") {
      light = value;
    }
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
  if (topic == topics[0]) {
    uuid = docJWT["id"].as<String>();
    return;
  }
  
}