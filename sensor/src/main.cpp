#include <sensor.h>
#include <lora.h>
#include <Arduino.h>
#include <ArduinoJson.h>

#define DHT_PIN 25
#define LIGHT_PIN 26
#define HUMI_PIN 27

void meansure(String device, String value){
  String object = R"rawliteral(${"sender": "sensor", "receiver": "gate_control",)rawliteral" + 
  String("\"device\": \"") + device + String("\",\"value\": ") + value + String("}#");

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
  float temp = meansureTemp();
  float air = meansureAir();
  float humi = meansureHumi(HUMI_PIN);
  float light = meansureLight(LIGHT_PIN);

  Serial.println("Temp" + String(temp));
  Serial.println("Air" + String(air));
  Serial.println("Humi" + String(humi));
  Serial.println("Light" + String(light));

  meansure("temp", String(temp));
  meansure("air", String(air));
  meansure("humi", String(humi));
  meansure("light", String(light));
}

void loraCallback(char c) {
  
}
