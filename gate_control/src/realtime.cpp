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
    String str = String(myRTC.getDate()) + "-" + String(myRTC.getMonth(century)) + String(" ") + String(myRTC.getHour(h12Flag, pmFlag)) + ":" + String(myRTC.getMinute());
    
    return str == timeStr;
}

String getTime() {
    String str = String(myRTC.getDate()) + "-" + String(myRTC.getMonth(century)) + String(" ") + String(myRTC.getHour(h12Flag, pmFlag)) + ":" + String(myRTC.getMinute());

    return str;
}