const firebaseConfig = {
  apiKey: "AIzaSyByZ-dYXqTy3cZil8SonrnTcGcUY7Z__uA",
  authDomain: "smart-home-8c38a.firebaseapp.com",
  databaseURL: "https://smart-home-8c38a-default-rtdb.firebaseio.com",
  projectId: "smart-home-8c38a",
  storageBucket: "smart-home-8c38a.appspot.com",
  messagingSenderId: "459747935410",
  appId: "1:459747935410:web:1416419b15df5c32f435ab"
};
firebase.initializeApp(firebaseConfig);
var trang = "A1";
document.getElementById("menu-list").addEventListener("click", function(event) {
  console.log("Click event triggered on menu-list.");
  if (event.target.tagName === "A") {
    var hrefValue = event.target.getAttribute("href");
    var pageID = hrefValue.substring(1);
    trang = pageID;
    load();
  }
});
function load(){
  var gasEntriesDiv = document.getElementById("gasEntries");
  var nhandulieu = firebase.database().ref("/G1/" + trang);
  nhandulieu.on("value", function(snapshot) {
  gasEntriesDiv.innerHTML = ""; 
  snapshot.forEach(function(childSnapshot) {
    var key = childSnapshot.key;
    if (key.startsWith("Khi gas")) { 
      var value = childSnapshot.val();
      var newP = document.createElement("p");
      newP.textContent = key + ": " + value;
      gasEntriesDiv.appendChild(newP);
    }
    if (key.startsWith("Nong do khi CO")) { 
      var value = childSnapshot.val();
      var newP = document.createElement("p");
      newP.textContent = key + ": " + value;
      gasEntriesDiv.appendChild(newP);
    }
  });
  });
  coThresholdRef = database1.ref("G1/" + trang + "/CO threshold");
  canhBaoRef = database.ref("G1/" + trang + "/Canh bao");
  gasThresholdRef = database2.ref("G1/" + trang + "/Gas threshold");
  gasRef = firebase.database().ref("/G1/" + trang + "/Khi gas");
  coRef = firebase.database().ref("/G1/"+ trang+ "/Nong do khi CO");
  gasThresholdRef.on("value", function(snapshot) {
    var gasThresholdValue = snapshot.val();
    slider2.value = gasThresholdValue;
    output2.innerHTML = gasThresholdValue;
    gascanhbao = gasThresholdValue;
  });
  output2.innerHTML = slider2.value;
  slider2.oninput = function() {
    var newGasThresholdValue = parseInt(this.value);
    output2.innerHTML = newGasThresholdValue;
    gasThresholdRef.set(newGasThresholdValue);
    gascanhbao = newGasThresholdValue;
  }
  coThresholdRef.on("value", function(snapshot) {
    var coThresholdValue = snapshot.val();
    slider1.value = coThresholdValue;
    output1.innerHTML = coThresholdValue;
    cocanhbao = coThresholdValue;
  });
  output1.innerHTML = slider1.value;
  slider1.oninput = function() {
    var newCOThresholdValue = parseInt(this.value);
    output1.innerHTML = newCOThresholdValue;
    coThresholdRef.set(newCOThresholdValue);
    cocanhbao = newCOThresholdValue;
  }
  updateButtonState();
}
firebase.database().ref("/G1").once("value")
  .then(function(snapshot) {
    var menuList = document.getElementById("menu-list");
    snapshot.forEach(function(childSnapshot) {
      var key = childSnapshot.key;
      var newListItem = document.createElement("li");
      var newLink = document.createElement("a");
      newLink.href = "#" + key ;
      newLink.textContent = key;
      newListItem.appendChild(newLink);
      menuList.appendChild(newListItem);
    });
  })
  .catch(function(error) {
    console.error("Error getting data:", error);
  });
var button = document.getElementById("toggleButton");
var database = firebase.database();
var canhBaoRef = database.ref("G1/" + trang + "/Canh bao");

canhBaoRef.on("value", function(snapshot) {
  var canhBaoValue = snapshot.val();
  updateButtonState(canhBaoValue);
});

function updateButtonState(canhBaoValue) {
  if (canhBaoValue === "ON") {
    button.innerHTML = "ON";
    button.classList.remove("off");
    button.classList.add("on");
  } else if (canhBaoValue === "OFF") {
    button.innerHTML = "OFF";
    button.classList.remove("on");
    button.classList.add("off");
  }
}
function toggleButton() {
  canhBaoRef.once("value", function(snapshot) {
    var currentCanhBaoValue = snapshot.val();
    var newCanhBaoValue = currentCanhBaoValue === "ON" ? "OFF" : "ON";
    
    canhBaoRef.set(newCanhBaoValue, function(error) {
      if (error) {
        console.log("Error updating Canh bao:", error);
      } else {
        updateButtonState(newCanhBaoValue);
      }
    });
  });
}
var database1 = firebase.database();
var coThresholdRef = database1.ref("G1/" + trang + "/CO threshold");
var slider1 = document.getElementById("myRange1");
var output1 = document.getElementById("demo1");
var cocanhbao = 0;
coThresholdRef.on("value", function(snapshot) {
  var coThresholdValue = snapshot.val();
  slider1.value = coThresholdValue;
  output1.innerHTML = coThresholdValue;
  cocanhbao = coThresholdValue;
});
output1.innerHTML = slider1.value;
slider1.oninput = function() {
  var newCOThresholdValue = parseInt(this.value);
  output1.innerHTML = newCOThresholdValue;
  coThresholdRef.set(newCOThresholdValue);
  cocanhbao = newCOThresholdValue;
}

var database2 = firebase.database();
var gasThresholdRef = database2.ref("G1/" + trang + "/Gas threshold");
var slider2 = document.getElementById("myRange2");
var output2 = document.getElementById("demo2");
var gascanhbao = 0;
gasThresholdRef.on("value", function(snapshot) {
  var gasThresholdValue = snapshot.val();
  slider2.value = gasThresholdValue;
  output2.innerHTML = gasThresholdValue;
  gascanhbao = gasThresholdValue;
});
output2.innerHTML = slider2.value;
slider2.oninput = function() {
  var newGasThresholdValue = parseInt(this.value);
  output2.innerHTML = newGasThresholdValue;
  gasThresholdRef.set(newGasThresholdValue);
  gascanhbao = newGasThresholdValue;
}
function startBlinking() {
  var image = document.getElementById("blinkingImage");
  image.classList.add("blinking");
}
function stopBlinking() {
  var image = document.getElementById("blinkingImage");
  image.classList.remove("blinking");
  image.style.opacity = 0.0;
}
var gasRef = firebase.database().ref("/G1/" + trang + "/Khi gas");
gasRef.on("value", function(gasSnapshot) {
  var gasValue = gasSnapshot.val();
  var canhBaoValue = button.innerHTML;
    if (gasValue > gascanhbao && canhBaoValue=="ON") {
      startBlinking();
    } else {
      stopBlinking();
    }
});
var coRef = firebase.database().ref("/G1/"+ trang+ "/Nong do khi CO");
coRef.on("value", function(coSnapshot) {
  var coValue = coSnapshot.val();
  var canhBaoValue = button.innerHTML;
    if (coValue > cocanhbao && canhBaoValue=="ON") {
      startBlinking();
    } else {
      stopBlinking();
    }
});
function openModal() {
  var modal = document.getElementById('modal');
  modal.style.display = 'block';
  var m = document.querySelector('.nhap');
  m.style.display = 'none';
}
function closeModal() {
  var modal = document.getElementById('modal');
  modal.style.display = 'none';
  var m = document.querySelector('.nhap');
  m.style.display = 'block';
  var newNameInput = document.getElementById('newName');
  var newName = newNameInput.value; 
  if (newName !== "") {
    var menuList = document.getElementById("menu-list");
    var newListItem = document.createElement("li");
    var newLink = document.createElement("a");
    newLink.href = "#" + newName;
    newLink.textContent = newName;
    newListItem.appendChild(newLink);
    menuList.appendChild(newListItem);
    var database = firebase.database();
    database.ref("/G1" ).update({
      [newName]: ""
    });
    database.ref("/G1/" + newName ).update({
      "CO threshold": 500,
      "Gas threshold": 500,
      "Canh bao": "ON",
      "Khi gas": "",
      "Nong do khi CO": ""
    });
  }
}
function openModal1() {
  var modal = document.getElementById('modal1');
  modal.style.display = 'block';
  var m = document.querySelector('.nhap');
  m.style.display = 'none';
}
function closeModal1() {
  var modal = document.getElementById('modal1');
  modal.style.display = 'none';
  var m = document.querySelector('.nhap');
  m.style.display = 'block';
  var idInput = document.getElementById('id');
  var id = idInput.value;
  var optionSelect = document.getElementById('option');
  var selectedOption = optionSelect.value;
  if (id !== "") {
    var database = firebase.database();
    database.ref("/G1/" + trang ).update({
      [selectedOption + id]: ""
    });
  }
}

var gasEntriesDiv = document.getElementById("gasEntries");
var nhandulieu = firebase.database().ref("/G1/" + trang);
nhandulieu.on("value", function(snapshot) {
  gasEntriesDiv.innerHTML = ""; 
  snapshot.forEach(function(childSnapshot) {
    var key = childSnapshot.key;
    if (key.startsWith("Khi gas")) { 
      var value = childSnapshot.val();
      var newP = document.createElement("p");
      newP.textContent = key + ": " + value;
      gasEntriesDiv.appendChild(newP);
    }
    if (key.startsWith("Nong do khi CO")) { 
      var value = childSnapshot.val();
      var newP = document.createElement("p");
      newP.textContent = key + ": " + value;
      gasEntriesDiv.appendChild(newP);
    }
  });
});