//FIX ARRAY BUG WHEN ARRAY HAS ONLY ONE ELEMENT
//FIX REMOVING WRONG CARD
//FIX UPDATING CALORIES ON DELETE
//CSS ON X BUTTON
//FIX JUMPS SO USER CAN SEE use a tag
//GET STATIC CAHCE WORKING AGAIN

const calorieApp = {
  selectedFoods: {}
  //addDialogContainer: document.getElementById("addDialogContainer")
};

/**
 * Get's the cached forecast data from the caches object.
 *
 * @param {string} coord location
 * @return {Object} The weather forecast, if the request fails, return null
 */
function getDataFromCache() {
  if (!("caches" in window)) {
    return null;
  }
  const url_fd =
    "https://api.nal.usda.gov/fdc/v1/search?api_key=6AKY2I3uUXFL2W0I4kLI40cEfI4OZ9oEweD3G3Ft";
  return caches
    .match(url_fd)
    .then(response => {
      if (response) {
        return response.json();
      }
      return null;
    })
    .catch(err => {
      console.error("Error getting data from cache", err);
      return null;
    });
} // getforecastfromcache

function saveFoodCards(cards) {
  const data = JSON.stringify(cards);
  localStorage.setItem("cardList", data);
}

/**
 * Loads the list of saved location.
 *
 * @return {Array}
 */
function loadFoodList() {
  let cards = localStorage.getItem("cardList");
  if (cards) {
    try {
      cards = JSON.parse(cards);
    } catch (ex) {
      cards = [];
    }
  } else {
    cards = [];
  }

  return cards;
} // loadLocationList

/**
 * Get's the latest forecast data from the network.
 *
 * @param {string} coords Location object to.
 * @return {Object} The weather forecast, if the request fails, return null.
 */

function getDataFromNetwork() {
  const url_fd =
    "https://api.nal.usda.gov/fdc/v1/search?api_key=6AKY2I3uUXFL2W0I4kLI40cEfI4OZ9oEweD3G3Ft"; //q1dRculyOX8TvH5PMJxPVFx2KdfJd6aZHfNE2gb6";

  let fetchData = {
    method: "POST",
    body: '{"generalSearchInput":"' + input + '"}',
    headers: {
      "Content-Type": "application/json"
    }
  };
  //running assyncrinously
  return fetch(url_fd, fetchData) //fetch((proxyUrl + url_fd), fetchData)
    .then(resp => resp.json())
    .then(data => {
      return data;
    })
    .catch(() => {
      return null;
    });
}

var input = "";
var totalCals = "";
var calNum = 0;
var cards = [];

function showCards(){
  
  // Get the cards list, and update the UI.
  cards = loadFoodList();
  for (var i = 0; i < cards.length; i++) {
    nutrientFacts(cards[i]);
    console.log(cards[i]);
  }
}


function setInput() {
  input = document.getElementById("uI").value;
  var enterInput = document.getElementById("uI");
  enterInput.addEventListener("keypress", function(event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      document.getElementById("inButtn").click();
    }
  });

  document.getElementById("top").innerHTML = "";
  dataLoad();

} //setInput

function dataLoad() {
  /*//Backup key
  //q1dRculyOX8TvH5PMJxPVFx2KdfJd6aZHfNE2gb6

  //  Food Central General Search
  const url_fd =
    "https://api.nal.usda.gov/fdc/v1/search?api_key=6AKY2I3uUXFL2W0I4kLI40cEfI4OZ9oEweD3G3Ft"; //q1dRculyOX8TvH5PMJxPVFx2KdfJd6aZHfNE2gb6";

  let fetchData = {
    method: "POST",
    body: '{"generalSearchInput":"' + input + '"}',
    headers: {
      "Content-Type": "application/json"
    }
  };*/

  var online = navigator.onLine;

  if (online) {
    let results = getDataFromNetwork();
    results.then(data => {
      fetchCardData(data);
      makeObjectList(data);
    });
  } else if (!online) {
    document.getElementById("totalCalDiv").innerHTML =
      "Your are offline. Offline you can only view your last search. Please connect to a network for full functionality.";
    let cache = getDataFromCache();
    cache.then(data => {
      makeObjectList(data);
    });
  } else {
    console.log("I failed");
  }
} //dataLoad
/*
// check if app has connection to the internet
function check() {
  var isOnline = navigator.onLine;
  
  // show JSON if online, message if offline
  if(isOnline == true){
      getJSON();
  } else {
    document.getElementById("someID").innerHTML = "You are offline";
  }// else
} // check
        */

function makeObjectList(data) {
  document.getElementById("top").innerHTML =
    "<div id='sr'>Search Results: </div>";
  for (var i = 0; i < data.foods.length; i++) {
    var list = document.getElementById("top");

    const url_fd3 =
      "https://api.nal.usda.gov/fdc/v1/" +
      data.foods[i].fdcId +
      "?api_key=6AKY2I3uUXFL2W0I4kLI40cEfI4OZ9oEweD3G3Ft"; //q1dRculyOX8TvH5PMJxPVFx2KdfJd6aZHfNE2gb6";

    if (data.foods[i].description) {
      list.innerHTML +=
        "<div onclick='nutrientFacts(" +
        data.foods[i].fdcId +
        ")' id='gs" +
        i +
        "' class='listItem'>" +
        "<div class='cardHead'>" +
        data.foods[i].description +
        "</div>";
      list = document.getElementById("gs" + i);

      if (data.foods[i].brandOwner) {
        list.innerHTML +=
          "<p class='listSH'>Brand: " + data.foods[i].brandOwner + "</p>";
      }

      if (data.foods[i].additionalDescriptions) {
        list.innerHTML +=
          "<p class ='listSH'>" + data.foods[i].additionalDescriptions + "</p>";
      } //if brand owner

      list.innerHTML += "</div><br>";
    } //if title
  } //for
}

function fetchCardData(data) {
  for (var i = 0; i < data.foods.length; i++) {
    //  Food Central Specific Item
    const url_fd2 =
      "https://api.nal.usda.gov/fdc/v1/" +
      data.foods[i].fdcId +
      "?api_key=6AKY2I3uUXFL2W0I4kLI40cEfI4OZ9oEweD3G3Ft";
    fetch(url_fd2);
  } //for
} //fetchCardData

function nutrientFacts(iD) {
  //  Food Central Specific Item
  const url_fd2 =
    "https://api.nal.usda.gov/fdc/v1/" +
    iD +
    "?api_key=6AKY2I3uUXFL2W0I4kLI40cEfI4OZ9oEweD3G3Ft"; //q1dRculyOX8TvH5PMJxPVFx2KdfJd6aZHfNE2gb6";

  caches
    .match(url_fd2) // fetch((proxyUrl + url_fd2))
    .then(resp => resp.json()) // Transform the data into json
    .then(function(data2) {
      document.getElementById("c").innerHTML = "Chosen Foods:";
      var visible = document.getElementById("toper");
      //ensures iD isn't given twice
      if (!cards.includes(iD)) {
        cards.push(iD);
        saveFoodCards(cards);
      }

    if (!document.getElementById(iD)){
        if (data2.description) {
          visible.innerHTML +=
            "<div class= 'card' id=r" +
            iD +
            "> " +
            " <div class='cardHead'>" +
            data2.description +
            "</div class='cardHead'>";
          visible = document.getElementById("r" + iD);
          
          visible.innerHTML +=
            "<button id=" + iD + " onClick='removeCard(this.id)'>X</button>";

          var temp_nut = findNutrient(data2, "Energy");
          if (temp_nut) {
            visible.innerHTML += "<p>Calories: " + temp_nut + "</p>";
            calNum += parseInt(temp_nut);
            totalCals = calNum;
          } //set calories

          temp_nut = findNutrient(data2, "fat");
          if (temp_nut) {
            visible.innerHTML += "<p>Fat: " + temp_nut + "</p>";
          } //set fat

          temp_nut = findNutrient(data2, "sodium");
          if (temp_nut) {
            visible.innerHTML += "<p>Sodium: " + temp_nut + "</p>";
          } //set sodium

          temp_nut = findNutrient(data2, "carbohydrate");
          if (temp_nut) {
            visible.innerHTML += "<p>Carbohydrates: " + temp_nut + "</p>";
          } //set carbs

          temp_nut = findNutrient(data2, "sugar");
          if (temp_nut) {
            visible.innerHTML += "<p>Sugar: " + temp_nut + "</p>";
          } //set sugar

          temp_nut = findNutrient(data2, "protein");
          if (temp_nut) {
            visible.innerHTML += "<p>Protein: " + temp_nut + "</p>";
          } //set protein

          visible.innerHTML += "</div>";

          document.getElementById("tCal").innerHTML = totalCals + " ";
        
          //save to local storage
        } // set name
      }
    }); //.then

  scroll(0, 300);
} //nutrientFacts

function findNutrient(data2, attribute) {
  attribute = attribute.toLowerCase();
  var nutri;
  for (nutri in data2.foodNutrients) {
    try {
      var check = data2.foodNutrients[nutri].nutrient;
      if (check.name.toLowerCase().includes(attribute)) {
        return data2.foodNutrients[nutri].amount;
      }
    } catch (e) {
      console.log(e);
    }
  }
  return null;
} //FindNutrient

function removeCard(clicked_id) {
  cards.splice(cards.indexOf(clicked_id), 1);
  saveFoodCards(cards);
  document.getElementById("r" + clicked_id).outerHTML = "";
} //removeCard
