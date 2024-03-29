#ifndef CONTROLLER_h
#define CONTROLLER_h

#include <Arduino.h>

void fanSpeed(int pin, float percent);
void pumpStrength(int pin, float percent);
void mistStrength(int pin, float percent);
void curtainOpen(int pin, float percent);
void lightToggle(int pin);

#endif