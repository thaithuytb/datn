#include <main.h>

HardwareSerial SerialPort(2);

void initLora() {
    SerialPort.begin(9600, SERIAL_8N1, 16, 17); 
}

void loraWrite(String string) {
    SerialPort.print(string);
}

void loraRead() {
    if (SerialPort.available()) {
        loraCallback(SerialPort.read());
    }
}