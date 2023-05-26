#ifndef LORA_h
#define LORA_h

#include <Arduino.h>

void initLora();
void loraRead();
void loraWrite(String string);

extern void loraCallback(char c);

#endif