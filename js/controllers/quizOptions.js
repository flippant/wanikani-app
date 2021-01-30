wanikaniApp.controller('quizOptions', function($scope, $rootScope, $routeParams, wanikaniAPI, $log) {
    $scope.selectTypes = {"radicals":true,"kanji":true,"vocabulary":true};
    $scope.selectSRS = {"apprentice":false,"guru":false,"master":false,"enlighten":false,"burned":true};
    $scope.levelsDisplay = 0;
    $scope.listLength = 0;
    $scope.criticalOnly = false;
    $scope.criticalLevel = 85;

    $scope.levels = {}
    for(i=1;i<=60;i++) {
        $scope.levels[i] = false;
    }

    $scope.runParameters = function() {
        if($scope.criticalOnly) {
            $scope.listLength = 0;
            
            wanikaniAPI.requestAPI($rootScope.requestURL + 'critical-items/' + $scope.criticalLevel)
            .then(function(response) {
                response['requested_information'].forEach(function(item) {
                    item.type = item.type == 'radical' ? 'radicals' : item.type;
                    if( (Object.keys($scope.levels).every(level => !$scope.levels[level]) || $scope.levels[item.level]) && $scope.selectTypes[item.type] ) {
                        $scope.listLength += 1;
                    } else {
                        $log.log(item)
                    }
                })               
            })
        } else {
            $scope.APIlevels = '';
            $scope.levelsDisplay = 0;
            for (var level in $scope.levels) {
                if($scope.levels[level]) {
                    $scope.levelsDisplay += 1
                    $scope.APIlevels = $scope.APIlevels + level + ','
                }
            }
    
            $scope.listLength = 0;
    
            for(type in $scope.selectTypes) {
                if($scope.selectTypes[type]===true) {
                    wanikaniAPI.requestAPI($rootScope.requestURL + type + '/' + $scope.APIlevels)
                    .then(function(response) {     
                        const itemArray = response['requested_information'].general ? response['requested_information'].general : response['requested_information']
                        itemArray.forEach(function(item) {       
                            if((item.user_specific && $scope.selectSRS[item.user_specific.srs]) || Object.keys($scope.selectSRS).every(k => !$scope.selectSRS[k])) {
                                $scope.listLength += 1;
                            }
                        })
                    })
                }
            }  
        }
              
    };

    $scope.runParameters();
});