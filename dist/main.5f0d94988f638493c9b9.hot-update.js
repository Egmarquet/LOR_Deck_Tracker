exports.id = "main";
exports.modules = {

/***/ "./app.js":
/*!****************!*\
  !*** ./app.js ***!
  \****************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var proton_native__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! proton-native */ "proton-native");
/* harmony import */ var proton_native__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(proton_native__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _components_tools__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components/tools */ "./components/tools.js");
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }


 // import the proton-native components

var axios = __webpack_require__(/*! axios */ "axios");



var cardData = __webpack_require__(/*! ./components/card_data.json */ "./components/card_data.json");

var MainApp = function MainApp(props) {
  var _useState = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])(false),
      _useState2 = _slicedToArray(_useState, 2),
      deckActive = _useState2[0],
      setDeckActive = _useState2[1];

  var _useState3 = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])({}),
      _useState4 = _slicedToArray(_useState3, 2),
      errState = _useState4[0],
      setErrorState = _useState4[1]; // Maps CardID to CardCode


  var _useState5 = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])({}),
      _useState6 = _slicedToArray(_useState5, 2),
      handHistory = _useState6[0],
      setHandHistory = _useState6[1]; // Maps CardID to current count of cards in deck


  var _useState7 = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])([]),
      _useState8 = _slicedToArray(_useState7, 2),
      currDeckList = _useState8[0],
      setCurrDeckList = _useState8[1]; // Server polling circuit


  Object(_components_tools__WEBPACK_IMPORTED_MODULE_2__["useInterval"])(function () {
    if (!deckActive) {
      getInitialState();
    } else {
      updateDeckState();
    }
  }, 1100); // Setting initial deck state if a new deck deck is detected

  var getInitialState = function getInitialState() {
    axios.get('http://127.0.0.1:21337/static-decklist').then(function (response) {
      if (response.data.DeckCode != null && !Object(_components_tools__WEBPACK_IMPORTED_MODULE_2__["isEmpty"])(response.data.CardsInDeck)) {
        var initialDeckList = []; // Getting relevant response data

        for (var cardCode in response.data.CardsInDeck) {
          initialDeckList.push({
            name: cardData[cardCode].name,
            cost: cardData[cardCode].cost,
            count: response.data.CardsInDeck[cardCode],
            key: cardCode
          });
        } // Sorting data


        initialDeckList.sort(function (a, b) {
          return a.cost - b.cost || a.name - b.name;
        });
        setCurrDeckList(initialDeckList);
        setDeckActive(true);
      } else {
        console.log("Waiting for game");
      }
    })["catch"](function (error) {
      console.log("LOR window is not active");
    });
  };
  /*
  Parsing rectangle API for the data:
   Get current hand state:
    - compare to previous hand state and get difference
    - subtract from deck if new on board
  */


  var updateDeckState = function updateDeckState() {
    axios.get('http://127.0.0.1:21337/positional-rectangles').then(function (response) {
      if (response.data.GameState == "Menus") {
        //cleanup
        setDeckActive(false);
        setHandHistory({});
        setCurrDeckList([]);
      } else {
        var height = response.data.Screen.ScreenHeight;
        var width = response.data.Screen.ScreenWidth;
        var newCards = {}; //Iterate over rectangles and collect new cards not found in handhistory
        // Map the unique { cardID : cardCode }

        response.data.Rectangles.forEach(function (item, index) {
          if (item.LocalPlayer && item.CardCode != "face" && item.TopLeftY <= 0.5 * height && !(item.CardID in handHistory)) {
            newCards[item.CardID] = item.CardCode;
          }
        }); // If there are new cards this update

        if (!Object(_components_tools__WEBPACK_IMPORTED_MODULE_2__["isEmpty"])(newCards)) {
          var newDeckState = _toConsumableArray(currDeckList);

          var newHandHistory = Object.assign({}, handHistory); // For each new card, subtract 1 count from the deck state
          // and update the hand history

          for (var key in newCards) {
            for (var i = 0; i < newDeckState.length; i++) {
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
    })["catch"](function (error) {
      console.log(error);
    });
  };
  /*
    Main display function for the card data and current counts
  */


  var textStyle = {
    fontSize: 18,
    margin: 7
  };
  var displayList = currDeckList.map(function (card) {
    return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(proton_native__WEBPACK_IMPORTED_MODULE_1__["View"], {
      key: card.key,
      style: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "2px solid black"
      }
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(proton_native__WEBPACK_IMPORTED_MODULE_1__["View"], {
      style: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        border: null
      }
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(proton_native__WEBPACK_IMPORTED_MODULE_1__["Text"], {
      style: textStyle
    }, card.cost), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(proton_native__WEBPACK_IMPORTED_MODULE_1__["Text"], {
      style: textStyle
    }, card.name)), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(proton_native__WEBPACK_IMPORTED_MODULE_1__["View"], {
      style: {
        border: null
      }
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(proton_native__WEBPACK_IMPORTED_MODULE_1__["Text"], {
      style: textStyle
    }, "x" + card.count)));
  }); // Main render window

  return deckActive ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(proton_native__WEBPACK_IMPORTED_MODULE_1__["View"], {
    style: {
      flex: 1,
      flexDirection: "column"
    }
  }, displayList) : react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(proton_native__WEBPACK_IMPORTED_MODULE_1__["Text"], {
    style: textStyle
  }, " Waiting for active game ");
};

var Example = function Example() {
  var _useState9 = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])({
    width: 270,
    height: 590
  }),
      _useState10 = _slicedToArray(_useState9, 2),
      windowSize = _useState10[0],
      setWindowSize = _useState10[1];

  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(proton_native__WEBPACK_IMPORTED_MODULE_1__["App"], null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(proton_native__WEBPACK_IMPORTED_MODULE_1__["Window"], {
    style: windowSize,
    onResize: function onResize(size) {
      return setWindowSize({
        width: size.w,
        height: size.h
      });
    }
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(MainApp, {
    windowSize: windowSize
  })));
};

/* harmony default export */ __webpack_exports__["default"] = (Example);

/***/ })

};
//# sourceMappingURL=main.5f0d94988f638493c9b9.hot-update.js.map