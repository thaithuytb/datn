#ifndef SENSOR_h
#define SENSOR_h

void initSensor(int pin);
float meansureTemp();
float meansureAir();
float meansureHumi(int pin);
float meansureLight(int pin);

#endif