#include <mqtt.h>
#include <sensor.h>
#include <Arduino.h>

void setup() {
  Serial.begin(115200);

  pinMode(12, OUTPUT);

  initMQTT();
  initSensor(25);
}

void loop() {
  int speed = constrain(80, 0, 255);

  analogWrite(12, 255);

  reconnectMQTTHandle();

  // float temp = meansureTemp();
  // float air = meansureAir();
  // float humi = meansureHumi(26);
  // float light = meansureLight(27);

  // Serial.println(temp);
  // Serial.println(air);
  // Serial.println(humi);
  // Serial.println(light);
  // Serial.println();

  delay(10000);
}
