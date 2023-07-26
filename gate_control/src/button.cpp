#include "button.h"

void enterButton14() {
    Serial.print(1);
    lampOn(LAMP_PIN, lamp ? 0 : 1);
    delay(200);

    String json = "{ \"ip\": \"" + String(LAMP_IP) + "\", \"status\": " + (lamp ? String("true") : String("false")) + ", \"gardenId\": 1" + ", \"createdBy\": " + 1 + "}";
    mqttSend(trueTopics[1], json);
    Serial.println(json); 
    Serial.println(trueTopics[1]); 

    Serial.print("lamp: ");
    Serial.println(lamp);
}

void enterButton12() {
    Serial.print(2);
    pumpStrength(PUMP_PIN, pump ? 0 : 1);
    delay(200);

    String json = "{ \"ip\": \"" + String(PUMP_IP) + "\", \"status\": " + (pump ? String("true") : String("false")) + ", \"gardenId\": 1" + ", \"createdBy\": " + 1 + "}";
    mqttSend(trueTopics[1], json);
    Serial.println(json); 
    Serial.println(trueTopics[1]); 

    Serial.print("pump: ");
    Serial.println(pump);
}

void enterButton13() {
    Serial.print(3);
    curtainOpen(CURTAIN_PIN, curtain ? 0 : 1);
    delay(200);

    String json = "{ \"ip\": \"" + String(CURTAIN_IP) + "\", \"status\": " + (curtain ? String("true") : String("false")) + ", \"gardenId\": 1" + ", \"createdBy\": " + 1 + "}";
    mqttSend(trueTopics[1], json);
    Serial.println(json); 
    Serial.println(trueTopics[1]); 

    Serial.print("curtain: ");
    Serial.println(curtain);
}

void enterButton15() {
    Serial.print(4);
    fanSpeed(FAN_PIN, fan ? 0 : 1);
    delay(200);

    String json = "{ \"ip\": \"" + String(FAN_IP) + "\", \"status\": " + (fan ? String("true") : String("false")) + ", \"gardenId\": 1" + ", \"createdBy\": " + 1 + "}";
    mqttSend(trueTopics[1], json);
    Serial.println(json); 
    Serial.println(trueTopics[1]); 

    Serial.print("fan: ");
    Serial.println(fan);
}

void initButton() {
    pinMode(12, INPUT_PULLDOWN);
    pinMode(13, INPUT_PULLDOWN);
    pinMode(14, INPUT_PULLDOWN);
    pinMode(15, INPUT_PULLDOWN);
}

void buttonRead() {
    if (digitalRead(12)) {
        enterButton12();
    }
    if (digitalRead(13)) {
        enterButton13();
    }
    if (digitalRead(14)) {
        enterButton14();
    }
    if (digitalRead(15)) {
        enterButton15();
    }
}