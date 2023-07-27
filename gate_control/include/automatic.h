#ifndef AUTOMATIC_h
#define AUTOMATIC_h

extern float temp;
extern float air;
extern float humi;
extern float light;

extern float tempThresh[10];
extern float airThresh[10];
extern float humiThresh[10];
extern float lightThresh[10];

extern String fanOpera[2];
extern String pumpOpera[2];
extern String curtainOpera[2];
extern String lampOpera[2];

void deviceAutomatic();
void fanOnOff(bool on);
void mistOnOff(bool on);
void pumpOnOff(bool on);
void lampOnOff(bool on);

#endif