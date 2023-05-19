#include <sensor.h>
#include <lora.h>
#include <Arduino.h>
#include <ArduinoJson.h>

void setup() {
  Serial.begin(115200);

  initLora();
}

void loop() {
  loraRead();
}

void loraCallback(char c) {
  Serial.print(c);
}
