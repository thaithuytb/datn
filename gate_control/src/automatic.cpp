#include <automatic.h>
#include <controller.h>
#include <main.h>

String fanOpera[2] = {"", ""};
String pumpOpera[2] = {"", ""};
String curtainOpera[2] = {"", ""};
String lampOpera[2] = {"", ""};

void deviceAutomatic() {
    String time = getShortTime();

    if (air < airThresh[0] && digitalRead(PUMP_PIN) == 0) {
        pumpStrength(PUMP_PIN, 1);
    }
    if (air > airThresh[1] && digitalRead(PUMP_PIN) == 1) {
        pumpStrength(PUMP_PIN, 0);
    }
//
    if (humi < humiThresh[0] && digitalRead(PUMP_PIN) == 0) {
        pumpStrength(PUMP_PIN, 1);
    }
    if (humi > humiThresh[1] && digitalRead(PUMP_PIN) == 1) {
        pumpStrength(PUMP_PIN, 0);
    }
//
    if (time < pumpOpera[0] || time > pumpOpera[1]) {
        pumpStrength(PUMP_PIN, 0);
    }
//
    if (temp > tempThresh[1] && digitalRead(FAN_PIN) == 0) {
        fanSpeed(FAN_PIN, 1);
    }
    if (temp < (tempThresh[0] + tempThresh[1]) / 2  && digitalRead(FAN_PIN) == 1) {
        fanSpeed(FAN_PIN, 0);
    }
//
    if (time < fanOpera[0] || time > fanOpera[1]) {
        fanSpeed(FAN_PIN, 0);
    }

    if (light < lightThresh[0] && digitalRead(FAN_PIN) == 0) {
        lampOn(LAMP_PIN, 1);
    }
    if (light > lightThresh[1] && digitalRead(FAN_PIN) == 1) {
        lampOn(LAMP_PIN, 0);
    }
//
    if (time < lampOpera[0] || time > lampOpera[1]) {
        lampOn(FAN_PIN, 0);
    }

    if (temp < tempThresh[0] && digitalRead(FAN_PIN) == 0) {
        lampOn(LAMP_PIN, 1);
    }
    if (temp > (tempThresh[0] + tempThresh[1]) / 2 && digitalRead(FAN_PIN) == 1) {
        lampOn(LAMP_PIN, 0);
    }
}