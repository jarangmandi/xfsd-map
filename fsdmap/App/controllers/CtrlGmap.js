'use strict';
gApp.controller('GmapController', ['$scope', '$http', '$interval',
    function GmapController($scope, $http, $interval) {
        console.info("GmapController");

        $interval(function () {
            fnLoadData();
        }, 10000);

        this.map = {
            Lon: -113.970889,
            Lat: 51.098945,
            showError: function (status) {
                toastr.error(status);
            }
        };

        this.pilots = [];
        this.controllers = [];
        var instance = this;

        var fnLoadData = function () {
            console.info("fnLoadData");
            $http({
                method: "GET",
                url: "../fsdmap3/fsd_data.php",
                responseType: "document",
                headers: {
                    Accept: "text/xml",
                    AcceptEncoding: "none"
                }
            }).success(function (clientData, status) {
                //console.log(clientData);
                instance.pilots = [];
                instance.controllers = [];
                if (clientData == null) {
                    console.error("got no data");
                    return;
                }
                var clients = clientData.lastElementChild ? clientData.lastElementChild.children : clientData.lastChild.childNodes;

                for (var i = 0; i < clients.length; i++) {
                    var clientElem = clients[i];
                    //console.log(clientElem);
                    var s = "";
                    for (var j = 0; j < clientElem.attributes.length; j++) {
                        s = s + '"' + clientElem.attributes.item(j).name + '":"' + clientElem.attributes.item(j).value
                        if (j + 1 < clientElem.attributes.length) {
                            s = s + '",'
                        }
                    }
                    s = '{' + s + '"}';
                    var pilot = JSON.parse(s);
                    if (pilot.type == "P") {
                        instance.pilots.push(pilot);
                    } else {
                        instance.controllers.push(pilot);
                    }
                }
            }).error(function (data, status) {

            });
        };

        fnLoadData();

    }]);