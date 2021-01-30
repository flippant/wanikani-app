wanikaniApp.controller('quizDisplay', function($scope, $rootScope, $routeParams, wanikaniAPI, $log) {
    $scope.APIlevels = $routeParams.levels=='all' ? '' : $routeParams.levels;
    $scope.selectedSRS = $routeParams.srs ? $routeParams.srs.split(',') : 'all';
    $scope.selectedSRS = $scope.selectedSRS.filter(srs => srs!=='');
    $scope.selectedTypes = $routeParams.type ? $routeParams.type.split(',') : 'kanji';
    $scope.selectedTypes = $scope.selectedTypes.filter(type => type!=='');
    $scope.criticalOnly = $routeParams.crit || false
    $scope.criticalPercent = 85;

    $scope.summary = {'correct':[],'incorrect':[]};
    $scope.finished = false;
    $scope.quizList = []

    //get list
    if($scope.criticalOnly=='crit') {
        wanikaniAPI.requestAPI($rootScope.requestURL + 'critical-items/' + $scope.criticalPercent)
        .then(function(response) {
            $scope.isLoaded = true;

            response['requested_information'].forEach(function(item) {
                item.type = item.type == 'radical' ? 'radicals' : item.type;
                if( ($scope.APIlevels == '' || $scope.APIlevels.split(',').includes(item.level)) && $scope.selectedTypes.includes(item.type)) {
                    //push reading if not radical
                    if(item.kana || item.important_reading) {
                        $scope.quizList.push({
                            character: item.character,
                            type: item.type,
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
                        type: item.type,
                        image: item.image,
                        meaning: item.meaning.toLowerCase().split(', ')//.concat(item.user_specific.user_synonyms || [])
                    })
                }
            })

            //randomize array
            $scope.quizList = shuffle($scope.quizList);
        
            //select first question
            $scope.currentQuestion = $scope.quizList.pop();
        })
    } else {
        $scope.selectedTypes.forEach(function(type) {
            console.log($rootScope.requestURL + type + '/' + $scope.APIlevels);
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
                            meaning: item.meaning.toLowerCase().split(', ').concat(item.user_specific.user_synonyms || [])
                        })
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
    }

    compareAnswer = function(wanikaniAnswer,userAnswer) {
        userAnswer = userAnswer.replace(/[' ]/g,'').toLowerCase();
        wanikaniAnswerArray = wanikaniAnswer.replace(/[' ]/g, '').toLowerCase().split('');
        matched = 0;
        unmatched = 0;

        wanikaniAnswerArray.forEach((character) => {
            if(userAnswer.includes(character)) {
                matched++;
            } else {
                unmatched++;
            }
        });

        // if 75% of wanikani answer was matched and 75% of user answer was matched
        if((matched / userAnswer.length) >= .75 && ( unmatched < 2 || (matched / wanikaniAnswer.length) >= .75 )) {
            // if verb, must check that active/passivity match; if not, match is rejected
            if( ( wanikaniAnswer.startsWith('to be') && !userAnswer.startsWith('to be') ) || ( wanikaniAnswer.startsWith('to') && !userAnswer.startsWith('to') ) || ( userAnswer.startsWith('to be') && !wanikaniAnswer.startsWith('to be') ) ) {
                return false;
            }
            return true;
        }

        return false;
    }
       
    //run guess and select new currentQuestion
    $scope.submitGuess = function() {
        

        $scope.response = '';

        if($scope.userGuess=='') {
            $('#quizForm').effect("shake");
            return;           
        } else if(!$scope.currentQuestion.meaning && $scope.userGuess.match(/[a-z]/i)) {
            $scope.response = 'We are looking for the reading. Try again.'
            $('#quizForm').effect("shake");
            return;
        } else if($scope.currentQuestion.important_reading && $scope.currentQuestion[$scope.currentQuestion.important_reading=='kunyomi' ? 'onyomi' : 'kunyomi'] && $scope.currentQuestion[$scope.currentQuestion.important_reading=='kunyomi' ? 'onyomi' : 'kunyomi'].includes($scope.userGuess)) {
            $scope.response = 'Wrong reading! We are looking for the ' + $scope.currentQuestion.important_reading + ' pronounciation. Try again.'
            $scope.userGuess = '';
            $('#quizForm').effect("shake");
            return;
        }

        $scope.correct = false;

        if($scope.currentQuestion.meaning) {
            if($scope.currentQuestion.meaning.includes($scope.userGuess.toLowerCase())) {
                $scope.correct = 'perfect';
            } else if($scope.currentQuestion.meaning.some((x) => compareAnswer(x,$scope.userGuess))) {
                $scope.correct = 'close';
            }
        } else if(($scope.currentQuestion.kana && $scope.currentQuestion.kana.includes($scope.userGuess)) || ($scope.currentQuestion.important_reading && $scope.currentQuestion[$scope.currentQuestion.important_reading=='kunyomi' ? 'kunyomi' : 'onyomi'].includes($scope.userGuess))) {
            $scope.correct = true; //reading
        }

        $scope.summary[$scope.correct ? 'correct' : 'incorrect'].push({
            question: $scope.currentQuestion, 
            correct: $scope.correct,
            guess: $scope.userGuess, 
            answer: $scope.currentQuestion.kana ? $scope.currentQuestion.kana : $scope.currentQuestion.meaning ? $scope.currentQuestion.meaning : $scope.currentQuestion[$scope.currentQuestion.important_reading]
        });

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
            else if (enString.substring(0,1) === '-') {
                jpString = jpString + 'ー';
                enString = enString.substring(1);
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