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

    $scope.cases = [];
    $scope.caseID = ""

    $scope.loadCases = function () {
      count = 0;
      for (i; count <= 5 && total < 1763; i++) {
        $.ajax({
          async: false,
          url: "../data/opinions/" + i.toString() + ".json",
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
      for (k; k < 1763; k++) {
        $.ajax({
          async: false,
          url: "../data/opinions/" + k.toString() + ".json",
          success: function (json) {
            if (id == json.sha1) {
              total = 1;
              $scope.cases = []
              $scope.cases.push({
                sha1: json.sha1,
                date: json.date_created.substring(0, 10),
                absoluteUrl: "https://www.courtlistener.com" + json.absolute_url,
                resource_uri: json.resource_uri,
                opinion: json.plain_text
              })

              check = true;
            }
          }
        });
        if (check === true)
          return;
      }
      alert("Couldn't Find Case")
    }
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

