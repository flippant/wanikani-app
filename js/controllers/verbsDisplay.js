wanikaniApp.controller('verbsDisplay', function($scope, $rootScope, $routeParams, wanikaniAPI) {
    $scope.selectSRS = {"apprentice":false,"guru":false,"master":false,"enlighten":false,"burned":true};
    $scope.levelsDisplay = 0;

    $scope.levels = {}
    for(i=1;i<=60;i++) {
        $scope.levels[i] = false;
    }

    //get list
    $scope.getData = function() {
        // get generic user data
        wanikaniAPI.requestAPI($rootScope.requestURL + 'srs-distribution')
        .then(function(response) {           
            $scope.user = response['requested_information'];
        })

        // get data based on URL variables
        $scope.APIlevels = '';
        $scope.levelsDisplay = 0;
        for (var level in $scope.levels) {
            if($scope.levels[level]) {
                $scope.levelsDisplay += 1
                $scope.APIlevels = $scope.APIlevels + level + ','
            }
        }
        
        wanikaniAPI.requestAPI($rootScope.requestURL + 'vocabulary/' + $scope.APIlevels)
        .then(function(response) {     
            $scope.isLoaded = true;
                  
            $scope.leveledList = {}
            $scope.listLength = 0;
            const itemArray = response['requested_information'].general ? response['requested_information'].general : response['requested_information']
            itemArray.forEach(function(item) {       
                if(item.meaning.startsWith('to ') && ((item.user_specific && $scope.selectSRS[item.user_specific.srs]) || Object.keys($scope.selectSRS).every(k => !$scope.selectSRS[k]))) {
                    if(item.user_specific && item.user_specific.available_date > 0) {
                        const revDate = new Date(item.user_specific.available_date * 1000);
                        const nowUTC = new Date(Math.floor(Date.now()));
                        const hours = Math.ceil((revDate-nowUTC) / 3.6e6) > 1 ? Math.ceil((revDate-nowUTC) / 3.6e6) : 'now';

                        if (hours == 'now') {
                            item.countdown = 'now'
                        } else if (hours > 2520) { //105 days
                            item.countdown = '4m'
                        } else if (hours > 1800) { //75 days
                            item.countdown = '3m'
                        } else if (hours > 1080) { //45 days
                            item.countdown = '2m'
                        } else if (hours > 720) { //30 days
                            item.countdown = '1m'
                        } else if (hours > 23) {
                            item.countdown = Math.floor(hours/24) + 'd'
                        } else {
                            item.countdown = hours + 'h'
                        }
                    }

                    if(!$scope.leveledList[item.level]) {
                        $scope.leveledList[item.level] = []
                    }
                    $scope.leveledList[item.level].push(item);
                    $scope.listLength += 1;
                    if($scope.type=='vocabulary') {
                        $scope.leveledList[item.level].sort((a,b) => a.character.length - b.character.length)
                    }
                }
            })
            $scope.list = response['requested_information'];
            
        })
    };

    $scope.getData();
});
