#include <sensorReceiver.h>
#include <controller.h>
#include <main.h>

void deviceAutomatic() {
    if (temp > tempThresh) {
        fanSpeed(FAN_PIN, max(float(0), min(float(1), 1 - (40 - temp) / (40 - tempThresh))));
    }
    if (air > airThresh) {
        mistStrength(MIST_PIN, max(float(0), min(float(1), 1 - (40 - air) / (40 - airThresh))));
    }
    if (humi > humiThresh) {
        pumpStrength(PUMP_PIN, max(float(0), min(float(1), 1 - (40 - humi) / (40 - humiThresh))));
    }
    // if (light > lightThresh) {
    //     curtainOpen(CURTAIN_PIN, max(float(0), min(float(1), (0 - light) / (0 - lightThresh))));
    // }
    lampOn(LAMP_PIN, light > lightThresh);
}

void fanOnOff(bool on) {
    // if (temp > tempThresh) {
    //     fanSpeed(FAN_PIN, on ? max(float(0), min(float(1), 1 - (40 - temp) / (40 - tempThresh))) : 0);
    // } else {
    // }
        fanSpeed(FAN_PIN, on ? 1 : 0);
}
void mistOnOff(bool on) {
    if (air > airThresh) {
        mistStrength(MIST_PIN, on ? max(float(0), min(float(1), 1 - (40 - air) / (40 - airThresh))) : 0);
    } else {
        mistStrength(MIST_PIN, on ? 1 : 0);
    }
}
void pumpOnOff(bool on) {
    if (humi > humiThresh) {
        pumpStrength(PUMP_PIN, on ? max(float(0), min(float(1), 1 - (40 - humi) / (40 - humiThresh))) : 0);
    } else {
        pumpStrength(PUMP_PIN, on ? 1 : 0);
    }
}
void lampOnOff(bool on) {
    lampOn(LAMP_PIN, on);
}