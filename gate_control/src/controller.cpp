#include "controller.h"

extern String ip[];

bool fan = false;
bool lamp = false;
bool pump = false;
bool curtain = false;

// quat
void fanSpeed(int pin, float percent) {
    pinMode(pin, OUTPUT);
    digitalWrite(pin, percent);
    fan = percent == 1;
}

// bom
void pumpStrength(int pin, float percent) {
    pinMode(pin, OUTPUT);
    digitalWrite(pin, percent);
    pump = percent == 1;
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
    curtain = percent == 1;
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
    lamp = on;
}