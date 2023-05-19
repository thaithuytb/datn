#include "controller.h"

void fanSpeed(int pin, float percent) {
    analogWrite(pin, percent);
}
void pumpStrength(int pin, float percent) {
    analogWrite(pin, percent);
}
void mistStrength(int pin, float percent) {
    analogWrite(pin, percent);
}
void curtainOpen(int pin, float percent) {
    analogWrite(pin, percent);
}
void lightToggle(int pin) {
    digitalWrite(pin, digitalRead(pin) == 1 ? LOW : HIGH);
}