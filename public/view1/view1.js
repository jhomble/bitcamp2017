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
    var secMap = [];
    $scope.cases = [];
    $scope.caseID = ""
    $scope.firstName = ""
    $scope.lastName = ""
    $scope.flag = false; 

    var loadMap = function () {
      $.ajax({
        async: false,
        url: "/view1/map.json",
        success: function (json) {
          caseMap = json
        }
      });

      $.ajax({
        async: false,
        url: "/view1/secMap.json",
        success: function (json) {
          secMap = json
        }
      });
    }

    loadMap();
    $scope.links = [];
    $scope.findPerson = function(){
      secMap.forEach(function(x) {
        // console.log(x)
        if(x.firstName === $scope.firstName.toUpperCase()){
          if(x.lastName === $scope.lastName.toUpperCase()){
            $scope.flag = true;
            $scope.links = []
            $scope.links.push({link: x.link})
            console.log($scope.links)
          }
        }
      });
    }

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
        if (caseMap[k].id === id) {
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


    $scope.entitySearch = function (x) {
      var k = 1;
      var text = ""
      var caseEntity = [];
      for (k; k < x; k++) { // 11174
        $.ajax({
          async: false,
          url: "../data/opinions/" + caseMap[k].index.toString() + ".json",
          success: function (json) {
            var text1 = json.plain_text;
            var text2 = JSON.stringify( {text: text1.substring(0,800)}); 
            $.ajax({
              'type': 'POST',
              'url': '/nlp', 
              'data': text2,
              'contentType': "application/json",
              'dataType': 'json',
              'success': function (data) {                    
                //console.log(data);
                caseEntity.push(data)
                console.log(k, caseEntity)
                return caseEntity;
              },
              'error': function (xhr) {
                alert("fail to upload shit");
              }
            });
          }
        })
      }
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



    var parser, xmlDoc, text
    $.ajax({
      async: false,
      url: "../data/IA_Indvl_Feeds1.xml",
      success: function (xml) {
        text = xml
        console.log(text)

      }
    });

    function xmlToJson(xml) {

      // Create the return object
      var obj = {};

      if (xml.nodeType == 1) { // element
        // do attributes
        if (xml.attributes.length > 0) {
          obj["@attributes"] = {};
          for (var j = 0; j < xml.attributes.length; j++) {
            var attribute = xml.attributes.item(j);
            obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
          }
        }
      } else if (xml.nodeType == 3) { // text
        obj = xml.nodeValue;
      }

      // do children
      if (xml.hasChildNodes()) {
        for (var i = 0; i < xml.childNodes.length; i++) {
          var item = xml.childNodes.item(i);
          var nodeName = item.nodeName;
          if (typeof (obj[nodeName]) == "undefined") {
            obj[nodeName] = xmlToJson(item);
          } else {
            if (typeof (obj[nodeName].push) == "undefined") {
              var old = obj[nodeName];
              obj[nodeName] = [];
              obj[nodeName].push(old);
            }
            obj[nodeName].push(xmlToJson(item));
          }
        }
      }
      return obj;
    };

    //  var asdasd = xmlToJson(text);
    // console.log(asdasd)
    // var q = 0;
    // var lk = ""
    // for(q; q < 16713; q++){
    //     lk = lk + "{\"id\": \"" + q + "\", \"firstName\": \"" + asdasd.IAPDIndividualReport.Indvls.Indvl[q].Info['@attributes'].firstNm + "\" , \"lastName\": \"" + asdasd.IAPDIndividualReport.Indvls.Indvl[q].Info['@attributes'].lastNm +  "\" , \"link\": \"" + asdasd.IAPDIndividualReport.Indvls.Indvl[q].Info['@attributes'].link + "\"},"
    // }
    // console.log(lk)

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

