#include <mqtt.h>
#include <WiFi.h>
#include <PubSubClient.h>

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
const char* mqtt_topic = "datn/testabc/sample";

WiFiClient espClient;
PubSubClient client(espClient);

void callback(char* topic, byte* payload, unsigned int length) {
  for (int i=0;i<length;i++) {
    Serial.print((char)payload[i]);
  }
  Serial.println();
}

void reconnect() {
  
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    
    if (client.connect(mqtt_client_id)) {
      Serial.println("connected");
      
      client.setCallback(callback);
      client.publish(mqtt_topic, (char *)"yolo");
      client.subscribe(mqtt_topic);
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

  client.publish(mqtt_topic, (char *)"yolo");
}