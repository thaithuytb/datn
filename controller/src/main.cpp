#include <controller.h>
#include <lora.h>
#include <Arduino.h>
#include <ArduinoJson.h>

#define FAN_PIN 6
#define PUMP_PIN 6
#define MIST_PIN 6
#define CURTAIN_PIN 6
#define LIGHT_PIN 6

String string = "";

bool isLoraBusy = false;

void setup() {
  Serial.begin(115200);

  initLora();
}

void loop() {
  loraRead();

  while (isLoraBusy) {
    loraRead();
  }
}

void handleLoraString() {
  DynamicJsonDocument doc(1024);
  deserializeJson(doc, string);

  if (doc["receiver"] != "controller") {
    return;
  }

  if (doc["sender"] == "gateway") {
    String device = doc["device"];
    float value = doc["value"].as<float>();

    if (device == "fan") {
      fanSpeed(FAN_PIN, value);
      String object = R"rawliteral(
      ${
        "sender": "controller",
        "receiver": "gateway",
        "device": "fan",
        "value": 
      )rawliteral" + String(value) + "}#";

      loraWrite(object);
    }

    if (device == "pump") {
      pumpStrength(PUMP_PIN, value);
      String object = R"rawliteral(
      ${
        "sender": "controller",
        "receiver": "gateway",
        "device": "pump",
        "value": 
      )rawliteral" + String(value) + "}#";
      
      loraWrite(object);
    }

    if (device == "mist") {
      mistStrength(MIST_PIN, value);
      String object = R"rawliteral(
      ${
        "sender": "controller",
        "receiver": "gateway",
        "device": "mist",
        "value": 
      )rawliteral" + String(value) + "}#";
      
      loraWrite(object);
    }

    if (device == "curtain") {
      curtainOpen(CURTAIN_PIN, value);
      String object = R"rawliteral(
      ${
        "sender": "controller",
        "receiver": "gateway",
        "device": "curtain",
        "value": 
      )rawliteral" + String(value) + "}#";
      
      loraWrite(object);
    }

    if (device == "light") {
      lightToggle(LIGHT_PIN);
      String object = R"rawliteral(
      ${
        "sender": "controller",
        "receiver": "gateway",
        "device": "curtain",
        "value": 
      )rawliteral" + String(digitalRead(LIGHT_PIN)) + "}#";
      
      loraWrite(object);
    }
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
