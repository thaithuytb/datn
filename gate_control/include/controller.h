#ifndef CONTROLLER_h
#define CONTROLLER_h

#include <Arduino.h>

#define FAN_PIN 6
#define PUMP_PIN 6
#define MIST_PIN 6
#define CURTAIN_PIN 6
#define LIGHT_PIN 6

void fanSpeed(int pin, float percent);
void pumpStrength(int pin, float percent);
void mistStrength(int pin, float percent);
void curtainOpen(int pin, float percent);
void lightToggle(int pin);

#endif