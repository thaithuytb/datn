#include "main.h"
#include <changeTopic.h>

extern String ip[];

int fan = 2;
int lamp = 2;
int pump = 2;
int curtain = 2;

String fanLimit = "00-00 00:00";
String pumpLimit = "00-00 00:00";
String curtainLimit = "00-00 00:00";
String lampLimit = "00-00 00:00";

void fanSend() {
    String device = FAN_IP;

    String json = "{ \"ip\": \"" + device + "\", \"status\": " + (fan ? String("true") : String("false")) + ", \"gardenId\": 1" + ", \"createdBy\": " + 1 + "}";
    mqttSend(trueTopics[1], json);
    Serial.println(json); 
    Serial.println(trueTopics[1]); 

    Serial.print("fan: ");
    Serial.println(fan);
}

void pumpSend() {
    String device = PUMP_IP;

    String json = "{ \"ip\": \"" + device + "\", \"status\": " + (pump ? String("true") : String("false")) + ", \"gardenId\": 1" + ", \"createdBy\": " + 1 + "}";
    mqttSend(trueTopics[1], json);
    Serial.println(json); 
    Serial.println(trueTopics[1]); 

    Serial.print("pump: ");
    Serial.println(pump);
}

void curtainSend() {
    String device = CURTAIN_IP;

    String json = "{ \"ip\": \"" + device + "\", \"status\": " + (curtain ? String("true") : String("false")) + ", \"gardenId\": 1" + ", \"createdBy\": " + 0 + "}";
    mqttSend(trueTopics[1], json);
    Serial.println(json); 
    Serial.println(trueTopics[1]); 

    Serial.print("curtain: ");
    Serial.println(curtain);
}

void lampSend() {
    String device = LAMP_IP;

    String json = "{ \"ip\": \"" + device + "\", \"status\": " + (lamp ? String("true") : String("false")) + ", \"gardenId\": 1" + ", \"createdBy\": " + 1 + "}";
    mqttSend(trueTopics[1], json);
    Serial.println(json); 
    Serial.println(trueTopics[1]); 

    Serial.print("lamp: ");
    Serial.println(lamp);
}

// quat
void fanSpeed(int pin, float percent) {
    pinMode(pin, OUTPUT);
    digitalWrite(pin, percent);
    fan = percent == 1 ? 1 : 0;
}

// bom
void pumpStrength(int pin, float percent) {
    pinMode(pin, OUTPUT);
    digitalWrite(pin, percent);
    pump = percent == 1 ? 1 : 0;
}

// phun suong
void mistStrength(int pin, float percent) {
    pinMode(pin, OUTPUT);
    analogWrite(pin, percent * 255);
}

// man che
void curtainOpen(int pin, float percent) {
    pinMode(pin, OUTPUT);
    digitalWrite(pin, percent);
    curtain = percent == 1 ? 1 : 0;
    // analogWrite(pin, percent * 255);
}

// bong den
void lampToggle(int pin) {
    pinMode(pin, OUTPUT);
    digitalWrite(pin, digitalRead(pin) == 1 ? LOW : HIGH);
}

void lampOn(int pin, bool on) {
    pinMode(pin, OUTPUT);
    digitalWrite(pin, on ? HIGH : LOW);
    lamp = on ? 1 : 0;
}

void deviceTimeController() {
    if (!controlMode) {
        return;
    }

    int preFan = fan;
    int prePump = pump;
    int preLamp = lamp;
    int preCurtain = curtain;

    String time = getTime();

    fanSpeed(FAN_PIN, time >= fanLimit);
    pumpStrength(PUMP_PIN, time >= pumpLimit);
    lampOn(LAMP_PIN, time >= lampLimit);
    curtainOpen(CURTAIN_PIN, time >= curtainLimit);

    if (preFan != fan) {
        fanSend();
    }
    if (prePump != pump) {
        pumpSend();
    }
    if (preLamp != lamp) {
        lampSend();
    }
    if (preCurtain != curtain) {
        curtainSend();
    }
}