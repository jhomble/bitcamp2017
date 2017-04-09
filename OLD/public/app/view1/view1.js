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

    $.ajax({
      async: false,
      url: "../data/opinions/1.json",
      success: function (json) {
        console.log(json);
        $scope.sha1 = json.sha1
        $scope.date = json.date_created.substring(0, 10)
        $scope.absoluteUrl = "https://www.courtlistener.com" + json.absolute_url
        $scope.resource_uri = json.resource_uri
        $scope.opinion = json.plain_text;
      }
    });

    $scope.loadCases = function () {
      count = 0;
      for (i; count <= 5 && total < 249672; i++) {
        console.log(i)
        $.ajax({
          async: false,
          url: "../data/opinions/" + i.toString() + ".json",
          success: function (json) {
            count++;
            total++;
            console.log(json);
            $scope.cases.push( {
              sha1 : json.sha1,
              date : json.date_created.substring(0, 10),
              absoluteUrl : "https://www.courtlistener.com" + json.absolute_url,
              resource_uri : json.resource_uri,
              opinion : json.plain_text
            })
          }
        });
      }
      console.log($scope.cases[1])
      console.log($scope.cases[2])
      analyzeEntitiesOfText($scope.cases[1].opinion)
    }
    $scope.loadCases()
  }]);

  function analyzeEntitiesOfText (text) {
    // Instantiates a client
    const language = Language();

    // Instantiates a Document, representing the provided text
    const document = language.document({
      // The document text, e.g. "Hello, world!"
      content: text
    });

    // Detects entities in the document
    return document.detectEntities()
      .then((results) => {
        const entities = results[0];

        console.log('Entities:');
        for (let type in entities) {
          console.log(`${type}:`, entities[type]);
        }

        return entities;
      });
  }

