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

void activeDevice(String device, String value){
  String object = R"rawliteral(
  ${
    "sender": "gateway",
    "receiver": "controller"
  )rawliteral" + 
  String(",device: ") + device +
  String(",value: ") + 30 
  + String("}#");

  loraWrite(object);
}

void setup() {
  Serial.begin(115200);

  initLora();
  initMQTT();
}

void loop() {
  loraRead();

  while (isLoraBusy) {
    loraRead();
  }

  reconnectMQTTHandle(topics);
}

void handleLoraString() {
  DynamicJsonDocument doc(1024);
  deserializeJson(doc, string);

  if (doc["receiver"] != "gateway") {
    return;
  }

  if (doc["sender"] == "sensor") {
    String device = doc["device"];
    float value = doc["value"].as<float>();
    Serial.println("Sensor "+ device + " send:" + String(value));
    // send sensor value mqtt
    return;
  }

  if (doc["sender"] == "controller") {
    String device = doc["device"];
    float value = doc["value"].as<float>();
    Serial.println("Controller " + device + " send:" + String(value));
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
