#include <mqtt.h>
#include <sensor.h>
#include <lora.h>
#include <Arduino.h>

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
