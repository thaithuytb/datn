#ifndef CONTROLLER_h
#define CONTROLLER_h

#include <Arduino.h>

extern bool fan;
extern bool lamp;
extern bool pump;
extern bool curtain;

void fanSpeed(int pin, float percent);
void pumpStrength(int pin, float percent);
void mistStrength(int pin, float percent);
void curtainOpen(int pin, float percent);
void lampToggle(int pin);
void lampOn(int pin, bool on);

#endif