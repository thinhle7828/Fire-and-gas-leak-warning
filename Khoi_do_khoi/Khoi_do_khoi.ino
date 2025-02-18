#include <ESP8266WiFi.h>
#include <WiFiUdp.h>
#include <WiFiManager.h>
#include <FirebaseESP8266.h>
#define FIREBASE_HOST "smart-home-8c38a-default-rtdb.firebaseio.com"
#define FIREBASE_AUTH "aW0tmhbIFkfcdxufW4Mx7nz7vhj4mUuxy0Po0Vtm"

const char* ssid = "..."; 
const char* password = "thinh321";
const IPAddress serverIP(172, 20, 10, 3);
const int serverPort = 20001;

uint8_t macAddress[6] = { 0x00, 0x01, 0x02, 0x03, 0x04, 0x05 };
IPAddress ip(172, 20, 10, 5);
IPAddress subnet(255, 255, 255, 240);
IPAddress gateway(172, 20, 10, 1);

WiFiUDP udpClient;
FirebaseData firebaseData;
const int readDelay = 200;
WiFiManager wifiManager;
float CO_Value;
const int SPEAKER_PIN = D1;
int THRESHOLD = 100;
const int LED = D2;
String canhBao;

void setup() {
  Serial.begin(9600);
  WiFi.softAPmacAddress(macAddress);
  wifiManager.autoConnect("ESP8266_2", "password");
  Serial.println("Connected to WiFi.");
  WiFi.config(ip, gateway, subnet);
  pinMode(SPEAKER_PIN, OUTPUT);
  pinMode(LED, OUTPUT);
  udpClient.beginPacket(serverIP, serverPort);
  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
  digitalWrite(LED, LOW);
}

void loop() {
  struct SensorData {
  int sensorId;
  int sensorValue;
  };
  int val = analogRead(A0); 
  float voltage = val * (3.3 / 1023.0); 
  CO_Value = (voltage - 0.4) * 10 / 0.6;
  SensorData smokeData = {1, CO_Value};
  Serial.print("Giá trị CO: ");
  Serial.print(CO_Value);
  Serial.println(" ppm");
  Firebase.getString(firebaseData, "/G1/A1/Canh bao");
  canhBao = firebaseData.stringData();
  Serial.print("Canh bao: ");
  Serial.println(canhBao);
  Firebase.getInt(firebaseData, "/G1/A1/CO threshold");
  THRESHOLD = firebaseData.intData();
  Serial.print("THRESHOLD: ");
  Serial.println(THRESHOLD);
  if ((CO_Value > THRESHOLD)&&(canhBao == "ON")) {
    digitalWrite(SPEAKER_PIN, HIGH);
    Serial.print("SPEAKER_PIN: ON ");
  } else {
    digitalWrite(SPEAKER_PIN, LOW);
  }
  udpClient.beginPacket(serverIP, serverPort);
  udpClient.write((uint8_t*)&smokeData, sizeof(smokeData));
  udpClient.endPacket();
  digitalWrite(LED, ~digitalRead(LED));
  delay(5000); 
}
