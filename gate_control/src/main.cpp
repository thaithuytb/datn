#include <main.h>

#include <actuator.h>
#include <changeTopic.h>
#include <regime.h>
#include <threshold.h>

String string = "";

String uuid = "thaihai";

String topics[] = {
  "changeTopic",
  "actuator",
  "regime",
  "threshold",
};

String trueTopics[] = {
  "changeTopic",
  "actuator",
  "regime",
  "threshold",
};

int topicCount = 4;

bool controlMode = false;

bool isLoraBusy = false;

float timeTick = 0;

void generateTopics() {
  for(int i = 0; i < topicCount; i++) {
    if (i == 0 || i == 5) {
      trueTopics[i] = "datn/" + topics[i];
    } else {
      trueTopics[i] = "datn/" + uuid + "/" + topics[i];
    }
  }
}

void setup() {
  Serial.begin(115200);
  
  initRealTime();
  initMQTT();
  initLora();
}

void loop() {
  loraRead();

  while (isLoraBusy) {
    loraRead();
  }

  generateTopics();
  reconnectMQTTHandle(trueTopics);
  if (!controlMode) {
    deviceAutomatic();
  } else {
    if (isTimeUp()) {
      controlMode = false;
      String json = "{ \"isAuto\": " + (controlMode ? String("false") : String("true")) + ", \"gardenId\": 1" + "}";
      mqttSend(trueTopics[2], json);
      Serial.println(json); 
      Serial.println(trueTopics[2]); 
      Serial.println("Is time up");
    }
  }
}

void handleLoraString() {
  DynamicJsonDocument doc(1024);
  deserializeJson(doc, string);

  if (doc["receiver"] != "gate_control") {
    return;
  }

  if (doc["sender"] == "sensor") {
    float _temp = doc["temp"].as<float>();
    float _air = doc["air"].as<float>();
    float _humi = doc["humi"].as<float>();
    float _light = doc["light"].as<float>();

    temp = _temp;
    air = _air;
    humi = _humi;
    light = _light;

    String json = "{ \"ip\": \"" + String(sen_temp_air_IP) + "\", \"temp\": " + (temp) + ", \"airHumidity\": " + (air) + ", \"gardenId\": 1" + "}";
    mqttSend("datn/" + uuid + "/sensor", json);
    Serial.println(json); 
    Serial.println("datn/" + uuid + "/sensor"); 

    String json1 = "{ \"ip\": \"" + String(sen_light_IP) + "\", \"value\": " + (light) + ", \"gardenId\": 1" + "}";
    mqttSend("datn/" + uuid + "/sensor", json1);
    Serial.println(json1); 
    Serial.println("datn/" + uuid + "/sensor"); 

    String json2 = "{ \"ip\": \"" + String(sen_humi_IP) + "\", \"value\": " + (humi) + ", \"gardenId\": 1" + "}";
    mqttSend("datn/" + uuid + "/sensor", json2);
    Serial.println(json2); 
    Serial.println("datn/" + uuid + "/sensor"); 

    Serial.println("Sender");
    Serial.println(temp);
    Serial.println(air);
    Serial.println(humi);
    Serial.println(light);
    Serial.println("end");
  }
}

void loraCallback(char c) {
  if (c == '$') {
    string = "";
    isLoraBusy = true;
    Serial.println("Start");
    return;
  }

  if (c == '#') { 
    Serial.println(string);
    handleLoraString();
    isLoraBusy = false;
    return;
  }

  string = string + c;
}

// called loop
void mqttAction() {
  if (timeTick > 20000) {
    Serial.print(temp);
  }
  if (timeTick > 20000) {
    Serial.print(air);
  }
  if (timeTick > 20000) {
    Serial.print(humi);
  }
  if (timeTick > 20000) {
    Serial.print(light);
  }
}

void mqttCallback(String topic, DynamicJsonDocument doc, DynamicJsonDocument docJWT) {
  Serial.println(topic);
  Serial.println(doc.as<String>());

  // changeTopic
  if (topic == trueTopics[0]) {
    __changeTopic(topic, doc, docJWT);

    return;
  }
  
  // actuator
  if (topic == trueTopics[1]) {
    __actuator(topic, doc, docJWT);

    return;
  }

  // regime
  if (topic == trueTopics[2]) {
    __regime(topic, doc, docJWT);

    return;
  }

  // threshold
  if (topic == trueTopics[3]) {
    __threshold(topic, doc, docJWT);

    return;
  }
}