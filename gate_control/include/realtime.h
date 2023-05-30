#ifndef REAL_TIME_h
#define REAL_TIME_h

#include <Arduino.h>

extern String timeStr;

void initRealTime();
bool isTimeUp();

#endif