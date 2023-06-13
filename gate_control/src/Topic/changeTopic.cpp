#include <changeTopic.h>

void __changeTopic(String topic, DynamicJsonDocument doc, DynamicJsonDocument docJWT) {
  // changeTopic
  generateTopics();
  unSubscribe(trueTopics);
  uuid = docJWT["newTopic"].as<String>();
  generateTopics();
  subscribe(trueTopics);
  isValidUUID = true;

  Serial.println(docJWT.as<String>());

  myRTC.setMonth(docJWT["month"].as<byte>());
  myRTC.setDate(docJWT["day"].as<byte>());
  myRTC.setHour(docJWT["hour"].as<byte>());
  myRTC.setMinute(docJWT["minute"].as<byte>());

  Serial.println(getTime());

  delay(2000);

  publish("datn/" + uuid + "/initStatusDevice", "{ \"gardenId\": 1 }");
  Serial.println("This: " + String("datn/" + uuid + "/initStatusDevice") + String("{ \"gardenId\": 1 }"));

  Serial.println(uuid);
}