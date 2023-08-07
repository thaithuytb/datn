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
    String hour = myRTC.getHour(h12Flag, pmFlag) < 10 ? ("0" + String(myRTC.getHour(h12Flag, pmFlag))) : String(myRTC.getHour(h12Flag, pmFlag));
    String minute = myRTC.getMinute() < 10 ? ("0" + myRTC.getMinute()) : String(myRTC.getMinute());
    String second = myRTC.getSecond() < 10 ? ("0" + myRTC.getSecond()) : String(myRTC.getSecond());

    String str = String(myRTC.getDate()) + "-" + String(myRTC.getMonth(century)) + String(" ") + hour + ":" + minute;
    
    return str >= timeStr;
}

String getTime() {
    String hour = myRTC.getHour(h12Flag, pmFlag) < 10 ? ("0" + String(myRTC.getHour(h12Flag, pmFlag))) : String(myRTC.getHour(h12Flag, pmFlag));
    String minute = myRTC.getMinute() < 10 ? ("0" + myRTC.getMinute()) : String(myRTC.getMinute());
    String second = myRTC.getSecond() < 10 ? ("0" + myRTC.getSecond()) : String(myRTC.getSecond());

    String str = String(myRTC.getDate()) + "-" + String(myRTC.getMonth(century)) + String(" ") + hour + ":" + minute;

    return str;
}

String getShortTime() {
    String hour = myRTC.getHour(h12Flag, pmFlag) < 10 ? ("0" + String(myRTC.getHour(h12Flag, pmFlag))) : String(myRTC.getHour(h12Flag, pmFlag));
    String minute = myRTC.getMinute() < 10 ? ("0" + myRTC.getMinute()) : String(myRTC.getMinute());
    String second = myRTC.getSecond() < 10 ? ("0" + myRTC.getSecond()) : String(myRTC.getSecond());

    String str = hour + ":" + minute + ":" + second;

    return str;
}