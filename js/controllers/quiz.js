wanikaniApp.controller('quizDisplay', function($scope, $rootScope, $routeParams, wanikaniAPI) {
    $scope.APIlevels = $routeParams.levels=='all' ? '' : $routeParams.levels;
    $scope.selectedSRS = $routeParams.srs ? $routeParams.srs.split(',') : 'all';
    $scope.selectedTypes = $routeParams.type ? $routeParams.type.split(',') : 'kanji';

    $scope.summary = {'correct':[],'incorrect':[]};
    $scope.finished = false;
    $scope.quizList = []

    //get list
    $scope.selectedTypes.forEach(function(type) {
        wanikaniAPI.requestAPI($rootScope.requestURL + type + '/' + $scope.APIlevels)
        .then(function(response) {  
            $scope.isLoaded = true;
                          
            const itemArray = response['requested_information'].general ? response['requested_information'].general : response['requested_information']
            itemArray.forEach(function(item) {        
                if((item.user_specific && $scope.selectedSRS.includes(item.user_specific.srs)) || $scope.selectedSRS=='all') {
                    let qtype = item.kana ? 'vocabulary' : item.important_reading ? 'kanji' : 'radicals'
                    //push reading if not radical
                    if(item.kana || item.important_reading) {
                        $scope.quizList.push({
                            character: item.character,
                            type: qtype,
                            image: item.image,
                            important_reading: item.important_reading,
                            onyomi: item.onyomi && item.onyomi.split(', '),
                            kunyomi: item.kunyomi && item.kunyomi.split(', '),
                            kana: item.kana && item.kana.split(', ')
                        });
                    }
                    //push meanings
                    $scope.quizList.push({
                        character: item.character,
                        type: qtype,
                        image: item.image,
                        meaning: item.meaning.split(', ').concat(item.user_specific.user_synonyms || [])
                    })
                    $scope.quizList[$scope.quizList.length-1].meaning.map(x => x.toLowerCase())
                }
            })

            //if last run through types
            if($scope.selectedTypes[$scope.selectedTypes.length-1] == type) {
                //randomize array
                $scope.quizList = shuffle($scope.quizList);
            
                //select first question
                $scope.currentQuestion = $scope.quizList.pop();
            }           
        })
    });
    
    //run guess and select new currentQuestion
    $scope.submitGuess = function() {
        $scope.response = '';

        if($scope.userGuess=='') {
            return;
        } else if($scope.currentQuestion.important_reading && $scope.currentQuestion[$scope.currentQuestion.important_reading=='kunyomi' ? 'onyomi' : 'kunyomi'] && $scope.currentQuestion[$scope.currentQuestion.important_reading=='kunyomi' ? 'onyomi' : 'kunyomi'].includes($scope.userGuess)) {
            $scope.response = 'Wrong reading! We are looking for the ' + $scope.currentQuestion.important_reading + ' pronounciation. Try again.'
            $scope.userGuess = '';
            return;
        }

        $scope.correct = false;

        if($scope.currentQuestion.meaning && $scope.currentQuestion.meaning.includes($scope.userGuess.toLowerCase())) {
            $scope.correct = true; //meaning ************** NEED TO LOOK FOR SIMILAR TEXT
        } else if(($scope.currentQuestion.kana && $scope.currentQuestion.kana.includes($scope.userGuess)) || ($scope.currentQuestion.important_reading && $scope.currentQuestion[$scope.currentQuestion.important_reading=='kunyomi' ? 'kunyomi' : 'onyomi'].includes($scope.userGuess))) {
            $scope.correct = true; //reading
        }

        if(!$scope.correct) {   
            $scope.summary.incorrect.push({
                question: $scope.currentQuestion, 
                guess: $scope.userGuess, 
                answer: $scope.currentQuestion.kana ? $scope.currentQuestion.kana : $scope.currentQuestion.meaning ? $scope.currentQuestion.meaning : $scope.currentQuestion[$scope.currentQuestion.important_reading]
            });
        } else {
            $scope.summary.correct.push({
                question: $scope.currentQuestion, 
                guess: $scope.userGuess, 
                answer: $scope.currentQuestion.kana ? $scope.currentQuestion.kana : $scope.currentQuestion.meaning ? $scope.currentQuestion.meaning : $scope.currentQuestion[$scope.currentQuestion.important_reading]
            });
        }

        //end of quiz
        if($scope.quizList.length==0) {
            //report summary
            $scope.endQuiz();
            return;
        }

        //get next question
        $scope.userGuess = '';
        $scope.currentQuestion = $scope.quizList.pop();
    };

    $scope.endQuiz = function() {
        $scope.finished = true;
    }

    //function for changing reading to hiragana
    $scope.toJapanese = function() {
        let jpString = '';
        let enString = $scope.userGuess.toLowerCase();

        while (enString.length > 0) {
            if (vowels.includes(enString.substring(0,1)) && translations[enString.substring(0,1)]!=undefined) {
                let syl = enString.substring(0,1);
                jpString = jpString + translations[syl];
                enString = enString.substring(1);
            } 
            else if (vowels.includes(enString.substring(1,2)) && translations[enString.substring(0,2)]!=undefined) {
                let syl = enString.substring(0,2);
                jpString = jpString + translations[syl];
                enString = enString.substring(2);
            }
            else if (['nn','mm'].includes(enString.substring(0,2))) {     
                jpString = jpString + 'ん'
                enString = enString.substring(2);
            }
            else if (vowels.includes(enString.substring(2,3)) && translations[enString.substring(0,3)]!=undefined) {
                let syl = enString.substring(0,3);
                jpString = jpString + translations[syl];
                enString = enString.substring(3);
            }
            else if (vowels.includes(enString.substring(2,3)) && enString.substring(0,1)===enString.substring(1,2) && translations[enString.substring(1,3)]!=undefined) {
                let syl = enString.substring(1,3);
                jpString = jpString + 'っ' + translations[syl];
                enString = enString.substring(3);
            }
            else if (vowels.includes(enString.substring(3,4)) && enString.substring(0,1)===enString.substring(1,2) && translations[enString.substring(1,4)]!=undefined) {
                let syl = enString.substring(1,4);
                jpString = jpString + 'っ' + translations[syl];
                enString = enString.substring(4);
            }
            else {
                jpString = jpString + enString.substring(0,1);
                enString = enString.substring(1);
            }
        } 

        $scope.userGuess = jpString;
    }
});

function shuffle(arr) {
    let currentIndex = arr.length, tempVal, randomIndex;

    while(0 !== currentIndex) {
        //get random index
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        //swap current object with random object
        tempVal = arr[currentIndex];
        arr[currentIndex] = arr[randomIndex];
        arr[randomIndex] = tempVal;
    }

    return arr;
}