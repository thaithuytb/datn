#include <sensorReceiver.h>
#include <controller.h>

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
    if (light > lightThresh) {
        curtainOpen(CURTAIN_PIN, max(float(0), min(float(1), (0 - light) / (0 - lightThresh))));
    }
}