import React, { Component, useState, useEffect, useRef } from "react";
import { Window, App, Text, View } from "proton-native"; // import the proton-native components
const axios = require('axios');
import { useInterval, isEmpty } from "./components/tools"
const cardData = require("./components/card_data.json")

const MainApp = (props) => {
  const [deckActive, setDeckActive] = useState(false);
  const [errState, setErrorState] = useState({});

  // Maps CardID to CardCode
  const [handHistory, setHandHistory] = useState({});

  // Maps CardID to current count of cards in deck
  const [currDeckList, setCurrDeckList] = useState([]);

  // Server polling circuit
  useInterval(() => {
    if (!deckActive){
      getInitialState();
    }
    else{
      updateDeckState();
    }
  }, 1100);

  // Setting initial deck state if a new deck deck is detected
  const getInitialState = () => {
    axios.get('http://127.0.0.1:21337/static-decklist')
      .then(function (response){
        if ((response.data.DeckCode) != null && !isEmpty(response.data.CardsInDeck)){
          const initialDeckList = []

          // Getting relevant response data
          for(var cardCode in response.data.CardsInDeck){
            initialDeckList.push(
              {
                name: cardData[cardCode].name,
                cost: cardData[cardCode].cost,
                count: response.data.CardsInDeck[cardCode],
                key: cardCode
              }
            )
          }

          // Sorting data
          initialDeckList.sort(function(a, b){
            return a.cost - b.cost  ||  a.name - b.name;
          });

          setCurrDeckList(initialDeckList);
          setDeckActive(true);

        }
        else{
          console.log("Waiting for game")
        }
      })
      .catch(function (error) {
        console.log("LOR window is not active");
      })
  }

  /*
  Parsing rectangle API for the data:

  Get current hand state:
    - compare to previous hand state and get difference
    - subtract from deck if new on board
  */
  const updateDeckState = () => {

    axios.get('http://127.0.0.1:21337/positional-rectangles')
      .then(function (response){
          if (response.data.GameState == "Menus"){
            //cleanup
            setDeckActive(false)
            setHandHistory({})
            setCurrDeckList([])
          }

          else {

            const height = response.data.Screen.ScreenHeight
            const width = response.data.Screen.ScreenWidth
            const newCards = {}

            //Iterate over rectangles and collect new cards not found in handhistory
            // Map the unique { cardID : cardCode }
            response.data.Rectangles.forEach(function (item, index) {
              if (item.LocalPlayer && item.CardCode != "face" && item.TopLeftY <= 0.5*height && !(item.CardID in handHistory)){
                newCards[item.CardID] = item.CardCode
              }
            });

            // If there are new cards this update
            if (!isEmpty(newCards)) {

              let newDeckState = [...currDeckList]
              let newHandHistory = Object.assign({}, handHistory);

              // For each new card, subtract 1 count from the deck state
              // and update the hand history
              for (const key in newCards) {
                for (let i = 0; i < newDeckState.length; i++){
                  if (newCards[key] == newDeckState[i].key) {
                    newDeckState[i].count = newDeckState[i].count - 1;
                  }
                }
                newHandHistory[key] = newCards[key];
              }
              setHandHistory(newHandHistory);
              setCurrDeckList(newDeckState);
            }
          }
      })

      .catch(function (error){
        console.log(error);
      });
    }


  /*
    Main display function for the card data and current counts
  */

  const textStyle = {
    fontSize:18,
    margin:7
  }

  const displayList = currDeckList.map((card) =>
    <View
      key={card.key}
      style={{
        flex:1,
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:"center",
        borderBottom:"2px solid black",
      }}
    >

      <View
        style = {{
          flexDirection:"row",
          justifyContent:"flex-start",
          alignItems:"center",
          border:null
        }}
      >
        <Text style={textStyle}>
          {card.cost}
        </Text>
        <Text  style={textStyle}>
          {card.name}
        </Text>
      </View>

      <View
        style = {{
          border:null
        }}
      >
        <Text  style={textStyle}>
          {"x"+card.count}
        </Text>
      </View>

    </View>
  );

  // Main render window
  return (
    deckActive ? (
      <View
        style={{
          flex:1,
          flexDirection:"column",
        }}
      >
        {displayList}
      </View>
    ) : (
        <Text style={textStyle}> Waiting for active game </Text>
     )

  );
}


const Example = () => {

  const [windowSize, setWindowSize] = useState({width: 270, height: 590})
  return(
    <App>
      <Window
        style={windowSize}
        onResize={(size) =>
            setWindowSize({width:size.w, height:size.h})
        }
      >
        <MainApp windowSize={windowSize}/>
      </Window>
    </App>
  );
}

export default Example
