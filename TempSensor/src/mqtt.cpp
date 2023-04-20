#include <mqtt.h>
#include <WiFi.h>
#include <PubSubClient.h>
#include <CustomJWT.h>
#include <Crypto.h>
#include <SHA512.h>
#include <ArduinoJson.h>

const char* ssid = "Azuby";
const char* password = "desolator";

void setup_wifi() {
    delay(10);
    Serial.println();
    Serial.print("Connecting to ");
    Serial.println(ssid);
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED) {
        delay(1000);
        Serial.print(".");
    }
    Serial.println("");
    Serial.println("WiFi connected");
    Serial.println("IP address: ");
    Serial.println(WiFi.localIP());
}

const char* mqtt_server = "broker.hivemq.com";
const int mqtt_port = 1883;
const char* mqtt_client_id = "esp32";

//Topic
char actuatorTopic[30] = "datn/test/actuator";
char uuidTopic[30] = "datn/changeTopic";
char secret[30] = "haithai";

CustomJWT jwt(secret, 256);

WiFiClient espClient;
PubSubClient client(espClient);

void callback(char* topic, byte* payload, unsigned int length) {
  char mes[length] = {0};

  for (int i=0;i<length;i++) {
    mes[i] = (char)payload[i];
    Serial.print((char)payload[i]);
  }
  mes[length] = '\0';

  Serial.println();
  Serial.println(mes);

  jwt.allocateJWTMemory();
  jwt.decodeJWT(mes);

  DynamicJsonDocument doc(1024);
  deserializeJson(doc, jwt.payload);

  Serial.println(doc["newTopic"].as<String>());

  jwt.clear();
}

void reconnect() {
  
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    
    if (client.connect(mqtt_client_id)) {
      Serial.println("connected");
      
      client.setCallback(callback);
      client.subscribe(uuidTopic);
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      
      delay(5000);
    }
  }
}

void initMQTT() {
    setup_wifi();
    client.setServer(mqtt_server, mqtt_port);
}

void reconnectMQTTHandle() {
    if (!client.connected()) {
    reconnect();
  }
  
  client.loop();

  String object = R"rawliteral(
    {"data":{"actuatorName":"fan","status":false,"ip":"test_1"},"gardenName":"name_1"}
  )rawliteral";

  // client.publish(actuatorTopic, (char *)object.c_str());

}