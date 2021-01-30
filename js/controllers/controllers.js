const apiUrl = 'https://www.wanikani.com/v2/';
const defaultKey = '3e81faf4130a42db9e9ca87ae459f0e0';

wanikaniApp.factory('wanikaniAPI', function($http, $q, $log) {
    this.requestAPI = function(url) {
        return $http.get(url, {'Access-Control-Allow-Origin': 'localhost:*'})
        .then(function(response) {
            return response.data;
        }, function(error) {
            return error;
        })
    }
    return this;
})

wanikaniApp.controller('mainController', function($scope, $rootScope, $http, wanikaniAPI, $log, $cookies) {

    $log.log("Obtaining cookie: " + $cookies.get("apikey"));
    $rootScope.userToken = $cookies.get("apikey") || defaultKey;
    $log.log("API token set to: " + $rootScope.userToken);
    $rootScope.requestURL = apiUrl + $rootScope.userToken + '/';

    $scope.storeCookie = function(cookie) {       
        $rootScope.userToken = cookie || defaultKey
        $rootScope.requestURL = apiUrl + $rootScope.userToken + '/';
        
        wanikaniAPI.requestAPI($rootScope.requestURL+'srs-distribution')
        .then(function(response) {
            $scope.cookieSubmitted = true;
            if(!response['user_information']) {
                $log.log(cookie + ' not saved')
                $scope.cookieResponse = false;

                //back to default
                $rootScope.userToken = defaultKey
                $rootScope.requestURL = apiUrl + $rootScope.userToken + '/';
            } else {
                let expireDate = new Date();
                expireDate.setDate(expireDate.getDate() + 30);
                $cookies.put('apikey', cookie, {'expires': expireDate});   
                $log.log(cookie+' saved')    
                $scope.cookieResponse = response;
            }
        });
        
    }

    $scope.submitSearch = function() {
        let query = $scope.search.toLowerCase();
        $scope.searchResults = []
        let types = ['radicals','kanji','vocabulary']

        types.forEach(function(type) {
            wanikaniAPI.requestAPI($rootScope.requestURL + type + '/1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60')
            .then(function(response) {          
                (response['requested_information'].general || response['requested_information']).forEach(function(item) {     
                    // search partial, whole-word match in meanings array
                    if(item.meaning.toLowerCase().split(', ').some(def => def===query || def.split(' ').some(word => word===query))) {
                        $scope.searchResults.push(item)
                    }
                    if(item.user_specific && item.user_specific.user_synonyms && item.user_specific.user_synonyms.some(def => def.toLowerCase()===query || def.split(' ').some(word => word===query))) {
                        $scope.searchResults.push(item)
                    }

                    // *********** NEED TO MATCH WHOLE WORD PHRASES TOO ***************

                    // search partial match in character
                    if(item.character && item.character.includes(query)) {
                        $scope.searchResults.push(item)
                    } 
    
                    // search exact match in onyomi, kunyomi, and kana
                    if((item.kana && item.kana.split(', ').includes(query)) || (item.onyomi && item.onyomi.split(', ').includes(query)) || (item.kunyomi && item.kunyomi.split(', ').includes(query))) {
                        $scope.searchResults.push(item)
                    } 
                    
                });
            });
        });
    }
});