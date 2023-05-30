#include "controller.h"

extern String ip[];

// quat
void fanSpeed(int pin, float percent) {
    pinMode(pin, OUTPUT);
    digitalWrite(pin, percent);
}

// bom
void pumpStrength(int pin, float percent) {
    pinMode(pin, OUTPUT);
    analogWrite(pin, percent * 255);
}

// phun suong
void mistStrength(int pin, float percent) {
    pinMode(pin, OUTPUT);
    analogWrite(pin, percent * 255);
}

// man che
void curtainOpen(int pin, float percent) {
    pinMode(pin, OUTPUT);
    analogWrite(pin, percent * 255);
}

// bong den
void lampToggle(int pin) {
    pinMode(pin, OUTPUT);
    digitalWrite(pin, digitalRead(pin) == 1 ? LOW : HIGH);
}

void lampOn(int pin, bool on) {
    pinMode(pin, OUTPUT);
    digitalWrite(pin, on ? HIGH : LOW);
}