#include <WiFiUdp.h>
#include <WiFi.h>
#include <Adafruit_SSD1306.h>
#include <Wire.h>
#include <FirebaseESP32.h>

#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
#define FIREBASE_HOST "smart-home-8c38a-default-rtdb.firebaseio.com"
#define FIREBASE_AUTH "aW0tmhbIFkfcdxufW4Mx7nz7vhj4mUuxy0Po0Vtm"
#define OLED_RESET     -1 
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);
#define SERVER_PORT 20001
WiFiClient client; 
FirebaseData firebaseData;
WiFiUDP UDP;
char packetBuffer[255];
IPAddress local_IP(172, 20, 10, 3);
IPAddress gateway(172, 20, 10, 1);
IPAddress subnet(255, 255, 255, 240);
IPAddress primaryDNS(8, 8, 8, 8);
IPAddress secondaryDNS(8, 8, 4, 4);
const char* ssid = "...";
const char* password = "thinh321";
int gasThreshold = 100; 
int COThreshold = 50;
int SPEAKER_PIN = 12; 
int gasValue = 0;
int CO_Value = 0;
String canhBao;
const int LED = 2;

void setup() {
  Serial.begin(115200);
  if(!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) { 
    Serial.println(F("SSD1306 allocation failed"));
    for(;;);
  }
  display.clearDisplay();
  WiFi.config(local_IP, gateway, subnet, primaryDNS, secondaryDNS);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.println("Connecting to WiFi...");
  }
  Serial.print("Connected. My IP address is: ");
  Serial.println(WiFi.localIP());
  pinMode(SPEAKER_PIN, OUTPUT);
  pinMode(LED, OUTPUT);
  UDP.begin(SERVER_PORT);
  Serial.print("Listening on UDP port ");
  Serial.println(SERVER_PORT);
  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
  digitalWrite(LED, LOW);
}
void loop() {
  struct SensorData {
    int sensorId;
    int sensorValue;
  };
  display.clearDisplay();
  display.setTextColor(WHITE);
  display.setCursor(0,0);
  SensorData receivedData;
  int packetSize = UDP.parsePacket();
  if (packetSize) {
    UDP.read((uint8_t*)&receivedData, sizeof(receivedData));
    if (receivedData.sensorId == 0) {
      Serial.print("Gas value: ");
      Serial.println(receivedData.sensorValue);
      gasValue = receivedData.sensorValue;
    }
    else if (receivedData.sensorId == 1) {
      Serial.print("CO_Value: ");
      Serial.println(receivedData.sensorValue);
      CO_Value = receivedData.sensorValue;
    }
  }
  Firebase.setInt(firebaseData, "/G1/A1/Khi gas", gasValue);
  Firebase.setInt(firebaseData, "/G1/A1/Nong do khi CO", CO_Value); 
  Firebase.getString(firebaseData, "/G1/A1/Canh bao");
  canhBao = firebaseData.stringData();
  Serial.print("Canh bao: ");
  Serial.println(canhBao);
  Firebase.getInt(firebaseData, "/G1/A1/Gas threshold");
  gasThreshold = firebaseData.intData();
  Serial.print("gasThreshold: ");
  Serial.println(gasThreshold);
  Firebase.getInt(firebaseData, "/G1/A1/CO threshold");
  COThreshold = firebaseData.intData();
  Serial.print("COThreshold: ");
  Serial.println(COThreshold);
  if ((gasValue > gasThreshold || CO_Value > COThreshold)&&(canhBao == "ON")) {
    digitalWrite(SPEAKER_PIN, HIGH);
    Serial.print("SPEAKER_PIN: ON ");
  } else {
    digitalWrite(SPEAKER_PIN, LOW);
  }
  display.println("Gas: " + String(gasValue));
  display.println("CO: " + String(CO_Value));
  display.display();
  digitalWrite(LED, ~digitalRead(LED));
  delay (5000);
}