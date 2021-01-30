const apiUrl = 'https://www.wanikani.com/api/user/';
let userToken = '3e81faf4130a42db9e9ca87ae459f0e0/'
const requestURL = apiUrl + userToken;

function getList(API,type,levels) {
    // type = radical | kanji | vocabulary
    // levels = 1 | 1,2 | etc
    API.requestAPI(requestURL + type + '/' + levels)
    .then(function(response) {
        return response;
    });
}

wanikaniApp.factory('wanikaniAPI', function($http, $q) {
    this.requestAPI = function(url) {
        return $http.get(url, {'Access-Control-Allow-Origin': 'localhost:*'})
        .then(function(response) {
            return response.data;
        }, function(response) {
            return response;
        })
    }
    return this;
})

wanikaniApp.filter('titleCase', function() {
    return function(str) {
        if(!str){return ''}
        const strSplit = str.split('-');
        return $.map(strSplit, function(i) {
            return i.charAt(0).toUpperCase() + i.slice(1);
        }).join(' ');
    }
})

wanikaniApp.filter('romanCase', function() {
    return function(str) {
        const strSplit = str.split('-');
        return $.map(strSplit, function(word) {
            return word.charAt(0).toUpperCase() + word.slice(1);
        }).join(' ');
    }
})

wanikaniApp.controller('mainController', function($scope, $http, wanikaniAPI) {
    //$scope.kanjiList = getList(wanikaniAPI,'kanji','').requested_information

    //get Kanji
    wanikaniAPI.requestAPI(requestURL+'kanji')
    .then(function(response) {
        $scope.kanjiList = response['requested_information'];
    });

});

wanikaniApp.controller('dataDisplay', function($scope, $routeParams, wanikaniAPI) {
    $scope.type = $routeParams.type || 'kanji'
    //$scope.levels = $routeParams.levels || ''

    $scope.levels = {}
    for(i=1;i<=60;i++) {
        $scope.levels[i] = false;
    }

    //get list
    $scope.getData = function() {
        //alert('call')
        $scope.APIlevels = '';
        for (var level in $scope.levels) {
            if($scope.levels[level]) {
                $scope.APIlevels = $scope.APIlevels + level + ','
            }
        }
        
        wanikaniAPI.requestAPI(requestURL + $scope.type + '/' + $scope.APIlevels)
        .then(function(response) {
            $scope.list = response['requested_information'];
        })
    };

    $scope.getData();
});

wanikaniApp.controller('quizDisplay', function($scope, $routeParams, $http, wanikaniAPI, $sce) {
    $scope.type = $routeParams.type || 'kanji'
    $scope.levels = $routeParams.levels || ''

    //get list
    wanikaniAPI.requestAPI(requestURL + $scope.type + '/' + $scope.levels)
    .then(function(response) {
        $scope.list = response['requested_information'];
    });
});

wanikaniApp.controller('homeDisplay', function($scope, $routeParams, $http, wanikaniAPI, $sce) {

    // Get generic user data
    wanikaniAPI.requestAPI(requestURL+'srs-distribution')
    .then(function(response) {
        $scope.response = response;
    });
    //$scope.response = getList(wanikaniAPI,'srs-distribution','')

    $scope.test = 'hello'
});

