#ifndef SENSOR_RECEIVE_h
#define SENSOR_RECEIVE_h

extern float temp;
extern float air;
extern float humi;
extern float light;

extern float tempThresh;
extern float airThresh;
extern float humiThresh;
extern float lightThresh;

void deviceAutomatic();
void fanOnOff(bool on);
void mistOnOff(bool on);
void pumpOnOff(bool on);
void lampOnOff(bool on);

#endif