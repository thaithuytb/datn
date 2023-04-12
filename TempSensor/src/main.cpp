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
  // Loop đến khi kết nối lại với MQTT broker
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    // Đăng ký với MQTT broker với ID và mật khẩu của bạn (nếu cần)
    if (client.connect(mqtt_client_id)) {
      Serial.println("connected");
      // Đăng ký callback function để xử lý dữ liệu nhận được từ MQTT
      client.setCallback(callback);
      // Đăng ký theo dõi topic cần subscribe
      client.publish(mqtt_topic, (char *)"yolo");
      client.subscribe(mqtt_topic);
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      // Đợi 5 giây trước khi thử lại kết nối
      delay(5000);
    }
  }
}

void setup() {
  Serial.begin(115200);

  setup_wifi();

  client.setServer(mqtt_server, mqtt_port);
}

void loop() {
  // Kiểm tra kết nối WiFi, nếu mất kết nối thì kết nối lại
  if (!client.connected()) {
    reconnect();
  }
  // Xử lý các tin nhắn MQTT
  client.loop();
  // Các hoạt động khác trong loop

  client.publish(mqtt_topic, (char *)"yolo");

  delay(1000);
}
