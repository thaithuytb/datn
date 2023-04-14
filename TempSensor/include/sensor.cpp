#include <sensor.h>
#include <DHT.h>

DHT dht;

void initSensor(int pin) {
    dht = DHT(pin, DHT22);
    dht.begin();
}

float meansureTemp() {
    return dht.readTemperature();
}

float meansureAir() {
    return dht.readHumidity();
}

float meansureHumi(int pin) {
    float value = analogRead(pin);
    return 100 * (1 - (value - 1380.0) / 2170.0);
}

float meansureLight(int pin) {
    float alpha = analogRead(pin) / 4095.0;
    return 1356500.0 / pow(10000 * alpha / (1 - alpha), 0.815) - 300;
}