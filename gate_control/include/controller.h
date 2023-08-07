#ifndef CONTROLLER_h
#define CONTROLLER_h

#include <Arduino.h>

extern int fan;
extern int lamp;
extern int pump;
extern int curtain;

extern String fanLimit;
extern String pumpLimit;
extern String curtainLimit;
extern String lampLimit;

void fanSend();
void pumpSend();
void curtainSend();
void lampSend();

void fanSpeed(int pin, float percent);
void pumpStrength(int pin, float percent);
void mistStrength(int pin, float percent);
void curtainOpen(int pin, float percent);
void lampToggle(int pin);
void lampOn(int pin, bool on);
void deviceTimeController();

#endif