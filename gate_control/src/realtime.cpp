#include <realtime.h>
#include <DS3231.h>
#include <Wire.h>

DS3231 myRTC;

String timeStr = "";

bool century = false;
bool h12Flag = false;
bool pmFlag = false;

void initRealTime() {
    Wire.begin();
}

bool isTimeUp() {
    String str = myRTC.getDate() + "-" + myRTC.getMonth(century) + String(" ") + myRTC.getHour(h12Flag, pmFlag) + ":" + myRTC.getMinute() + ":" + myRTC.getSecond();

    return str == timeStr;
}