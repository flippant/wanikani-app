let forms = {}

forms.verb = [
    {
        meaning: 'present',
        stem: 'u',
        suffix: '',
        pos: 'conjugation',
        verbtype: null,
        terminal: true,
        attributive: true,
    },
    {
        meaning: 'past',
        stem: 'ta',
        suffix: '',
        pos: 'conjugation',
        verbtype: null,
        terminal: true,
        attributive: true
    },
    {
        meaning: 'negative',
        stem: 'a',
        suffix: 'ない',
        pos: 'i-adjective',
        verbtype: null,
        terminal: true,
        attributive: true
    },
    {
        meaning: 'polite',
        stem: 'i',
        suffix: 'ます',
        pos: 'verb',
        verbtype: 'irregular',
        terminal: true,
        attributive: false
    },
    {
        meaning: 'want to',
        stem: 'i',
        suffix: 'たい',
        pos: 'i-adjective',
        verbtype: null,
        terminal: true,
        attributive: false
    },
    {
        meaning: 'conjunction',
        stem: 'te',
        suffix: '',
        pos: 'conjugation',
        verbtype: null,
        terminal: false,
        attributive: false
    },
    {
        meaning: 'continuous',
        stem: 'te',
        suffix: 'いる',
        pos: 'verb',
        verbtype: 'godan',
        terminal: true,
        attributive: true
    },
    {
        meaning: 'conjunction',
        stem: 'te',
        suffix: '',
        pos: 'conjugation',
        verbtype: null,
        terminal: false,
        attributive: false
    },
    {
        meaning: 'volitional',
        stem: 'o',
        suffix: '',
        pos: 'conjugation',
        verbtype: null,
        terminal: true,
        attributive: false
    },
    {
        meaning: 'hypothetical',
        stem: 'e',
        suffix: 'ば',
        pos: 'particle',
        verbtype: null,
        terminal: false,
        attributive: false
    },
    {
        meaning: 'conditional',
        stem: 'ta',
        suffix: 'ら',
        pos: 'particle',
        verbtype: null,
        terminal: false,
        attributive: false
    },
    {
        meaning: 'causative',
        stem: 'a',
        suffix: 'させる',
        pos: 'verb',
        verbtype: 'ichidan',
        terminal: true,
        attributive: true
    },
    {
        meaning: 'passive',
        stem: 'a',
        suffix: 'られる',
        pos: 'verb',
        verbtype: 'ichidan',
        terminal: true,
        attributive: true
    },
]

// only levels 1-22 added so far for testing
ichidans = ['入れる','下げる','上げる','出る','立てる','生まれる','止める','用いる','分ける','切れる','外れる','生きる','足りる','出かける','見せる','見分ける','交ぜる','生える','考える','出来る',
'代える','売れる','教える','欠ける','付ける','投げる','点ける','向ける','助ける','化ける','決める','曲げる','当てる','支える','答える','数える','乗せる','負ける','見付ける','始める','待たせる','受ける',
'落ちる','集める','投げ付ける','開ける','調べる','起きる','食べる','見る','合わせる','別れる','感じる','晴れる','用いる','分ける','見分ける','考える','代える','教える','付ける','当てる','投げる','向ける',
'助ける','化ける','支える','数える','乗せる','待たせる','投げ付ける','調べる','伝える','合わせる','見返る','着る','植える','感じる','追いかける','別れる','放れる','育てる','着ける','温める','消える',
'求める','流れる','変える','信じる','建てる','帰る','晴れる','整える','存じる','固める','浴びる','辞める','折れる','栄える','敗れる','果てる','借りる','書き入れる','忘れる','報じる','試みる','取れる',
'告げる','暴れる','覚える','加える','混ぜる','乱れる','得る','比べる','減る','連れる','妨げる','焼ける','続ける','設ける','責める','増える','務める','企てる','解ける','認める','震える','応じる',
'確かめる','寝る','過ぎる','観る','倒れる']



wanikaniApp.controller('verbsQuiz', function($scope, $rootScope, $routeParams, wanikaniAPI, $log) {
    $scope.APIlevels = $routeParams.levels=='all' ? '' : $routeParams.levels;
    $scope.selectedSRS = $routeParams.srs ? $routeParams.srs.split(',') : 'all';
    $scope.hints = {'Verb Class': false, 'Furigana': false, 'Stem Type': false}

    $scope.summary = {'correct':[],'incorrect':[]};
    $scope.finished = false;
    $scope.quizList = []

    //get list
    wanikaniAPI.requestAPI($rootScope.requestURL + 'vocabulary/' + $scope.APIlevels)
    .then(function(response) {  
        $scope.isLoaded = true;
                      
        const itemArray = response['requested_information'].general ? response['requested_information'].general : response['requested_information']
        itemArray.forEach(function(item) {        
            if(item.meaning.startsWith('to ') && (item.user_specific && $scope.selectedSRS.includes(item.user_specific.srs)) || $scope.selectedSRS=='all') {
                //get a random form
                let randForm = forms.verb[Math.floor(Math.random() * forms.verb.length)]

                //get conjugation of that form
                let conj = conjugate(item,randForm)

                $scope.quizList.push({
                    character: item.character,
                    dictionaryKana: item.kana,
                    kana: conj,
                    form: randForm,
                    meaning: item.meaning,
                    verbType: getVerbType(item),
                });
            }
        });

        $scope.quizList = shuffle($scope.quizList);
        $scope.currentQuestion = $scope.quizList.pop();         
    })
       
    //run guess and select new currentQuestion
    $scope.submitGuess = function() {
        $scope.response = '';

        if($scope.userGuess=='') {
            $('#quizForm').effect("shake");
            return;           
        } else if($scope.userGuess.match(/[a-z]/i)) {
            $scope.response = 'We are looking for the reading. Try again.'
            $('#quizForm').effect("shake");
            return;
        }

        $scope.correct = $scope.userGuess === $scope.currentQuestion.kana;

        $scope.summary[$scope.correct ? 'correct' : 'incorrect'].push({
            question: $scope.currentQuestion, 
            correct: $scope.correct,
            guess: $scope.userGuess, 
            answer: $scope.currentQuestion.kana
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
            else {
                jpString = jpString + enString.substring(0,1);
                enString = enString.substring(1);
            }
        } 

        $scope.userGuess = jpString;
    }
});

conjugate = function(verb, form) {
    let suffix = form.suffix; 

    //special conjugations
    if((form.meaning=='causative' || form.meaning=='passive')) {
        if (getVerbType(verb)=='godan') {
            suffix = form.meaning=='causative' ? 'せる' : 'れる';
        } else if(verb.kana.match(/する$/)) {
            return form.meaning=='causative' ? verb.kana.replace(/する$/,'させる') : verb.kana.replace(/する$/,'される')
        }        
    }

    return getStem(verb, form.stem) + suffix
}

getStem = function(verb, stem) {
    if(verb.kana.isArray) {
        verb.kana == verb.kana.split(', ')[0];
    }

    if(stem=='u') {
        return verb.kana;
    }

    const verbType = getVerbType(verb);
    let inflectedStem = verb.kana;

    let stemSyllabary = []
    stemSyllabary.godan = {
        'う' : {a:'わ',i:'い',e:'え',o:'おう',te:'って',ta:'った'},
        'る' : {a:'ら',i:'り',e:'れ',o:'ろう',te:'って',ta:'った'},
        'く' : {a:'か',i:'き',e:'け',o:'こう',te:'いて',ta:'いた'},
        'ぐ' : {a:'が',i:'ぎ',e:'げ',o:'ごう',te:'いで',ta:'いだ'},
        'す' : {a:'さ',i:'し',e:'せ',o:'そう',te:'して',ta:'した'},
        'つ' : {a:'た',i:'ち',e:'て',o:'とう',te:'って',ta:'った'},
        'ぶ' : {a:'ば',i:'び',e:'べ',o:'ぼう',te:'んで',ta:'んだ'},
        'ぬ' : {a:'な',i:'に',e:'ね',o:'のう',te:'んで',ta:'んだ'},
        'む' : {a:'ま',i:'み',e:'め',o:'もう',te:'んで',ta:'んだ'},        
    }
    stemSyllabary.ichidan = {'る' : {a:'',i:'',e:'れ',o:'よう',te:'て',ta:'た'}}
    stemSyllabary.suru = {'する' : {a:'し',i:'し',e:'すれ',o:'しよう',te:'して',ta:'した'}}
    stemSyllabary.kuru = {'くる' : {a:'こ',i:'き',e:'くれ',o:'こよう',te:'きて',ta:'きた'}}

    switch(verbType) {
        case 'ichidan':
            for(suffix in stemSyllabary.ichidan) {
                inflectedStem = inflectedStem.replace(new RegExp(suffix+'$'),stemSyllabary.ichidan[suffix][stem]);
            }
            break;
        case 'godan':
            if(stem=='i' && ['くださる','ござる','なさる','いらっしゃる','おっしゃる'].includes(verb.kana)) {
                inflectedStem.replace(/る$/,'い');
            } else if((stem=='ta' || stem=='te') && verb.kana=='いく') {
                inflectedStem = stem=='ta' ? 'いった' : 'いって';
            } else {
                for(suffix in stemSyllabary.godan) {
                    inflectedStem = inflectedStem.replace(new RegExp(suffix+'$'),stemSyllabary.godan[suffix][stem]);
                }
            }
            break;
        case 'irregular':
            if(verb.kana.match(/する$/)) {
                for(suffix in stemSyllabary.suru) {
                    inflectedStem = inflectedStem.replace(new RegExp(suffix+'$'),stemSyllabary.suru[suffix][stem]);
                }
            } else if(verb.kana.match(/くる$/)) {
                for(suffix in stemSyllabary.kuru) {
                    inflectedStem = inflectedStem.replace(new RegExp(suffix+'$'),stemSyllabary.kuru[suffix][stem]);
                }
            }
            break;
    }

    return inflectedStem;
}

getVerbType = function(verb) {
    let verbType = 'godan';
    if(verb.kana.isArray) {
        verb.kana == verb.kana.split(', ')[0];
    }

    //determine if verb is irregular (ends in kuru, suru, desu, masu, da)
    if(verb.kana.endsWith('する') || verb.kana=='くる' || verb.kana=='です' || verb.kana.endsWith('ます') || verb.kana.endsWith('だ')) {
        verbType = 'irregular';
    } else if( verb.kana.endsWith('る') && ichidans.includes(verb.character) ) {
        verbType = 'ichidan';
    }

    return verbType;
}