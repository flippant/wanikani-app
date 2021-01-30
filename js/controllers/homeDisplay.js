wanikaniApp.controller('homeDisplay', function($scope, $rootScope, $routeParams, wanikaniAPI) {
    // Get generic user data
    wanikaniAPI.requestAPI($rootScope.requestURL+'srs-distribution')
    .then(function(response) {
        $scope.isLoaded = true;
        $scope.srsData = response;
    });
 
});