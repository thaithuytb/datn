#include "main.h"

void enterButton14() {
    Serial.print(1);
    lampOn(LAMP_PIN, lamp == 1 ? 0 : 1);
    lampLimit = lamp == 0 ? "99:9" : "00:0";
    delay(200);
}

void enterButton12() {
    Serial.print(2);
    pumpStrength(PUMP_PIN, pump == 1 ? 0 : 1);
    pumpLimit = pump == 0 ? "99:9" : "00:0";
    delay(200);
}

void enterButton13() {
    Serial.print(3);
    curtainOpen(CURTAIN_PIN, curtain == 1 ? 0 : 1);
    curtainLimit = curtain == 0 ? "99:9" : "00:0";
    delay(200);
}

void enterButton15() {
    Serial.print(4);
    fanSpeed(FAN_PIN, fan == 1 ? 0 : 1);
    fanLimit = fan == 0 ? "99:9" : "00:0";
    delay(200);
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