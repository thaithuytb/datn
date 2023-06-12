#ifndef REAL_TIME_h
#define REAL_TIME_h

#include <Arduino.h>
#include <DS3231.h>

extern DS3231 myRTC;
extern String timeStr;

void initRealTime();
bool isTimeUp();
String getTime();

#endif