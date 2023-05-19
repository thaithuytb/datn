#include <mqtt.h>
#include <lora.h>
#include <Arduino.h>
#include <ArduinoJson.h>

String topics[] = {
    "datn/test/actuator",
    "datn/changeTopic"
};

String string = "";

bool isLoraBusy = false;

void setup() {
  Serial.begin(115200);

  initLora();
  // initMQTT();
}

void loop() {
  loraRead();

  while (isLoraBusy) {
    loraRead();
  }

  String object = R"rawliteral(
  ${
    "sender": "controller",
    "receiver": "gateway",
    "value": 30
  }#
  )rawliteral";

  loraWrite(object);

  delay(10000);

  // reconnectMQTTHandle(topics);
}

void handleLoraString() {
  DynamicJsonDocument doc(1024);
  deserializeJson(doc, string);

  if (doc["receiver"] != "gateway") {
    return;
  }

  if (doc["sender"] != "sensor") {
    float value = doc["value"].as<float>();
    Serial.println("Sensor send:" + String(value));
    // send sensor value mqtt
    return;
  }

  if (doc["sender"] != "controller") {
    float device = doc["device"];
    float value = doc["value"].as<float>();
    Serial.println("Controller " + String(device) + " send:" + String(value));
    // send controller status
    return;
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
