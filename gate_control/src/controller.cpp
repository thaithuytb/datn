#include "controller.h"

// quat
void fanSpeed(int pin, float percent) {
    analogWrite(pin, percent);
}

// bom
void pumpStrength(int pin, float percent) {
    analogWrite(pin, percent);
}

// phun suong
void mistStrength(int pin, float percent) {
    analogWrite(pin, percent);
}

// man che
void curtainOpen(int pin, float percent) {
    analogWrite(pin, percent);
}

// bong den
void lightToggle(int pin) {
    digitalWrite(pin, digitalRead(pin) == 1 ? LOW : HIGH);
}