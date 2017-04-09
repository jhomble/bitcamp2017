'use strict';

angular.module('myApp.view1', ['ngRoute'])

  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/view1', {
      templateUrl: 'view1/view1.html',
      controller: 'View1Ctrl'
    });
  }])

  .controller('View1Ctrl', ['$scope', function ($scope) {

    var total = 0;
    var count = 0;
    var i = 1;

    var caseMap = [];

    $scope.cases = [];
    $scope.caseID = ""

    var loadMap = function () {
      $.ajax({
        async: false,
        url: "/view1/map.json",
        success: function (json) {
          caseMap = json
        }
      });
    }

    loadMap();
    $scope.loadCases = function () {
      count = 0;
      for (i; count <= 5 && total < 11174; i++) {
        $.ajax({
          async: false,
          url: "../data/opinions/" + caseMap[i].index.toString() + ".json",
          success: function (json) {
            count++;
            total++;
            $scope.cases.push({
              sha1: json.sha1,
              date: json.date_created.substring(0, 10),
              absoluteUrl: "https://www.courtlistener.com" + json.absolute_url,
              resource_uri: json.resource_uri,
              opinion: json.plain_text
            })
          }
        });
      }
    }


    $scope.findCase = function () {
      var k = 1;
      var check = false;
      var id = $scope.caseID
      for (k; k < 11174; k++) {
        if(caseMap[k].id === id){
          $.ajax({
            async: false,
            url: "../data/opinions/" + caseMap[k].index.toString() + ".json",
            success: function (json) {
                total = 1;
                $scope.cases = []
                $scope.cases.push({
                  sha1: json.sha1,
                  date: json.date_created.substring(0, 10),
                  absoluteUrl: "https://www.courtlistener.com" + json.absolute_url,
                  resource_uri: json.resource_uri,
                  opinion: json.plain_text
                })
            }
          });
          return;
        }
      }
      alert("Couldn't Find Case")
    }

    // var asd = function () {
    //   var h = 220073;
    //   var type = ""
    //   for (h; h < 249672; h++) {
    //     $.ajax({
    //       async: false,
    //       url: "../data/opinions/" + h.toString() + ".json",
    //       success: function (json) {
    //         type = type + "{\"index\": \"" + h + "\", \"id\": \"" + json.sha1 + "\"},"
    //       }
    //     });
    //   }
    //   console.log(type)
    // }
    // asd()

    $scope.loadCases()
    // analyzeEntitiesOfText($scope.cases[1].opinion)
  }]);

  // function analyzeEntitiesOfText (text) {
  //   // Instantiates a client
  //   const language = Language();

  //   // Instantiates a Document, representing the provided text
  //   const document = language.document({
  //     // The document text, e.g. "Hello, world!"
  //     content: text
  //   });

  //   // Detects entities in the document
  //   return document.detectEntities()
  //     .then((results) => {
  //       const entities = results[0];

  //       console.log('Entities:');
  //       for (let type in entities) {
  //         console.log(`${type}:`, entities[type]);
  //       }

  //       return entities;
  //     });
  // }

