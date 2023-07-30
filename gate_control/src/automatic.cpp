#include <automatic.h>
#include <controller.h>
#include <main.h>
#include <changeTopic.h>

String fanOpera[2] = {"00:00", "98"};
String pumpOpera[2] = {"00:00", "98"};
String curtainOpera[2] = {"00:00", "98"};
String lampOpera[2] = {"00:00", "98"};

void deviceAutomatic() {
    String time = getShortTime();

    int preFan = fan;
    int prePump = pump;
    int preLamp = lamp;
    int preCurtain = curtain;

    bool pumpHumiOn = humiValue < humiThresh[0];
    bool pumpHumiOff = humiValue > humiThresh[1];

    bool pumpOffTime = time < pumpOpera[0] || time > pumpOpera[1];

    if (pumpHumiOff || pumpOffTime) {
        if(pump != 0) {
            pumpStrength(PUMP_PIN, 0);
        }
    } else if (pumpHumiOn) {
        if(pump != 1) {
            pumpStrength(PUMP_PIN, 1);
        }
    }

    bool fanTempOn = tempValue > tempThresh[1];
    bool fanTempOff = tempValue < (tempThresh[1] - 5);
    
    bool fanOffTime = time < fanOpera[0] || time > fanOpera[1];

    if (fanTempOff || fanOffTime) {
        if(fan != 0) {
            fanSpeed(FAN_PIN, 0);
        }
    } else if (fanTempOn) {
        if(fan != 1) {
            fanSpeed(FAN_PIN, 1);
        }
    }

    bool lampTimeOff = time < lampOpera[0] || time > lampOpera[1];

    bool lampLightOn = lightValue < lightThresh[0] && !lampTimeOff;
    bool lampLightOff = lightValue > lightThresh[1];

    bool lampTempOn = tempValue < tempThresh[0];
    bool lampTempOff = tempValue > (tempThresh[0] + 5);

    if (lampLightOn || lampTempOn) {
        if(lamp != 1) {
            lampOn(LAMP_PIN, 1);
        }
    } else if (lampTempOff && lampLightOff) {
        if(lamp != 0) {
            lampOn(LAMP_PIN, 0);
        }
    }

    if (preFan != fan) {
        fanSend();
    }
    if (prePump != pump) {
        pumpSend();
    }
    if (preLamp != lamp) {
        lampSend();
    }
    if (preCurtain != curtain) {
        curtainSend();
    }
}