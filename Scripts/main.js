var app = angular.module('taxi-app', []);

app.controller('MainCtrl', function ($scope) {
    //Main
    $scope.xAxis = 9;
    $scope.yAxis = 9;

    $scope.taxis = [];
    $scope.clients = [];

    //Client form models
    $scope.clientName = ''
    $scope.cColumn = '';
    $scope.cRow = '';

    //Taxi form models
    $scope.taxiName = ''
    $scope.tColumn = '';
    $scope.tRow = '';

    //Matrix models
    $scope.matrix = [];


    $scope.FindTaxi = function () {
        var client = {
            Id: $scope.GenerateId($scope.clients),
            X: $scope.cRow,
            Y: $scope.cColumn,
            Name: $scope.clientName,
            IsAvailable: true,
        }
        
        let taxi = $scope.GetClosestTaxi(client);
        if (!taxi){
            alert('Laisvu Taxi automobiliu nera.');
            return;
        } 
        client.IsAvailable = false;
        $scope.clients.push(client)
        $scope.matrix[parseInt(client.X)][parseInt(client.Y)] = client;
        alert('Taxi buvo priskirtas: ' + taxi.Name + ' - ' + taxi.Id + '')
    }

    $scope.AddTaxi = function () {
        var taxi = {
            Id: $scope.GenerateId($scope.taxis),
            Name: $scope.taxiName,
            Y: $scope.tColumn,
            X: $scope.tRow,
            IsAvailable: true,
            ClientId: 0
        }
        $scope.taxis.push(taxi)
        $scope.matrix[parseInt($scope.tRow)][parseInt($scope.tColumn)] = taxi;
    }

    $scope.CalculateDistance = function(ax, ay, bx,by) {
        return Math.max(Math.abs(ax - bx), Math.abs(ay - by))
    }

    $scope.GetClosestTaxi = function(client) {
        var minDistance = null;
        var closestTaxi = null;

        for (let i = 0; i < $scope.taxis.length; i++) {
            if($scope.taxis[i].IsAvailable == false) continue //Skip taken
            var distance = $scope.CalculateDistance(client.X,client.Y, $scope.taxis[i].X,$scope.taxis[i].Y)
            if (minDistance == null || distance < minDistance){
                minDistance = distance;
                closestTaxi = $scope.taxis[i]
            }
            //Check if the taxi is in the same location, but has lower id.
            else if (distance == minDistance &&  $scope.taxis[i].Id < closestTaxi.Id){
                closestTaxi = $scope.taxis[i]
            }
        }

        if (closestTaxi == null) return null;
        closestTaxi.IsAvailable = false;
        closestTaxi.ClientId = client.Id;
        return closestTaxi;
    }

    $scope.GenerateId = function(array) {
        if (array.length == 0){
            return 1; //Start from 1
        }
        else {
            var obj = _.maxBy(array, function(item) {
                return item.Id;
            })
            return obj.Id + 1;
        }
    }


    $scope.GenerateMatrix = function () {
        if (parseInt($scope.xAxis) < 9 || parseInt($scope.yAxis) < 9) {
            alert('Matrica turi buti ne mazesne nei 9x9')
            return;
        }

        $scope.matrix = [];
        for (var i = 0; i < $scope.xAxis; i++) {
            $scope.matrix[i] = [];
            for (var j = 0; j < $scope.yAxis; j++) {
                $scope.matrix[i][j] = '';
            }
        }
    }



});
