#include <sensor.h>
#include <lora.h>
#include <Arduino.h>
#include <ArduinoJson.h>

#define DHT_PIN 25
#define LIGHT_PIN 26
#define HUMI_PIN 27

#define INTERVAL_TIME 20000

int _time = -INTERVAL_TIME;

bool isLoraBusy = false;

String string = "";

void meansure(String device, String value){
  String object = R"rawliteral(${"sender": "sensor", "receiver": "gate_control",)rawliteral" + 
  String("\"device\": \"") + device + String("\",\"value\": ") + value + String("}#");

  Serial.print(object);
  loraWrite(object);

  delay(1500);
}

void meansureAll(String temp, String air, String humi, String light) {
  String object = R"rawliteral(${"sender": "sensor", "receiver": "gate_control",)rawliteral" + 
  String("\"temp\": ") + temp + String(",\"air\": ") + air + String(",\"humi\": ") + humi + String(",\"light\": ") + light + String("}#");

  Serial.print(object);
  loraWrite(object);

  delay(1500);
}

void setup() {
  Serial.begin(115200);

  initSensor(DHT_PIN);
  initLora();
}

void loop() {
  loraRead();

  while (isLoraBusy) {
    loraRead();
  }

  if (millis() - _time > INTERVAL_TIME) {
    float temp = meansureTemp();
    float air = meansureAir();
    float humi = meansureHumi(HUMI_PIN);
    float light = meansureLight(LIGHT_PIN);

    Serial.println("Temp" + String(temp));
    Serial.println("Air" + String(air));
    Serial.println("Humi" + String(humi));
    Serial.println("Light" + String(light));

    meansureAll(String(temp), String(air), String(humi), String(light));

    _time = millis();
  }
}

void handleLoraString() {

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