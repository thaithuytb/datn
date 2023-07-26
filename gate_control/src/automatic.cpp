#include <automatic.h>
#include <controller.h>
#include <main.h>

void deviceAutomatic() {
    if (temp < tempThresh[0]) {
        fanSpeed(FAN_PIN, 1);
    }
    if (air < airThresh[0]) {
        pumpStrength(PUMP_PIN, 1);
    }
    if (humi < humiThresh[0]) {
        pumpStrength(PUMP_PIN, 1);
    }
    if (light < lightThresh[0]) {
        // curtainOpen(CURTAIN_PIN, max(float(0), min(float(1), (0 - light) / (0 - lightThresh))));
        lampOn(LAMP_PIN, 1);
    }

    if (temp > tempThresh[1]) {
        fanSpeed(FAN_PIN, 0);
    }
    if (air > airThresh[1]) {
        pumpStrength(PUMP_PIN, 0);
    }
    if (humi > humiThresh[1]) {
        pumpStrength(PUMP_PIN, 0);
    }
    if (light > lightThresh[1]) {
        // curtainOpen(CURTAIN_PIN, max(float(0), min(float(1), (0 - light) / (0 - lightThresh))));
        lampOn(LAMP_PIN, 0);
    }
}