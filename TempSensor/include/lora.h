#ifndef LORA_h
#define LORA_h

#include <Arduino.h>

void initLora();
void loraRead();

extern void loraCallback(char c);

#endif