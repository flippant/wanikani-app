wanikaniApp.controller('infoDisplay', function($scope, $rootScope) {
    $scope.faq = [
        {
            'q': "When I try to use my API key, it says there is an error.",
            'a': "<p>Please be sure you are entering your <b>Version 1 API key</b>. The Version 2 API key (still in development) will not work with the Version 1 API. If you are still running into an issue, you can <a href=\"mailto:shandra.gordon@gmail.com\">contact me</a> with your OS and browser information and I will look closer into the problem.</p>"
        },
        {
            'q': "Why does the quiz mark me wrong when my answers are close to the correct answer?",
            'a': "<p>I am using an algorithm to decide whether a submitted response is close enough to the correct answer, but I cannot ensure that this algorithm will return the same results as on WaniKani's website.</p><p>Currently, as long as at least 75% of the characters in a user's response are found in the correct answer, AND at least 75% of the characters in the correct answer are found in the user response or only one character is not found in the user response, the answer will be marked as a \"close answer.\" Submitted responses and correct answers must also exactly match when one or the other string begins with \"to\" or \"to be\".</p>"
        },   
        {
            'q': "Why does the quiz not show when I get a question right or wrong until the end?",
            'a': "<p>Being able to see your results immediately can affect how you answer other questions, whereas in real life you may not know that you've gotten something wrong.</p><p>For example, if you commonly confuse 上げる and 上がる and receive a wrong mark on the meaning of one of them, you will be able to infer the meaning of the other without actually having the chance to test your knowledge without these \"hints\". Therefore, I have opted to only show the results at the end.</p>"
        },
        {
            'q': "Why does the quiz not add a question back in the queue when I get it wrong?",
            'a': "<p>Similar to answer above.</p><p>I would consider adding wrong questions silently to the very end of the queue so that the user does not realize they got it wrong until all other questions have been asked, but then this could place the user in a lengthy loop if they continue to get the question wrong.</p>"
        },
        {
            'q': "Why can't I force correct answers when I get a question wrong?",
            'a': "<p>Since your quiz results technically don't matter on this website (your SRS level will not increase or decrease, and there are no benefits of correct answers here), there would be no purpose to have such a feature. I may reconsider in the future.</p>"
        }
    ];

    $scope.knownIssues = [
        {
            'date': '5/20/2018',
            'desc': 'Search results window does not close when navigating to a quiz.'
        },
    ]

    $scope.plannedDevelopment = [
        'Implement partial phrase matches for search. For example "take an" to return the vocabulary word for "take an exam", while currently only searchs for "take," "an," "exam," and "take an exam" will return the desired word.',
        'Give users an option during the quiz to display when an answer is correct or not.',
        'Potentially re-develop critical items review to consider user SRS data and user synonyms.',
        'Improve quiz results display. Ugly!',  
        'Display user\'s WaniKani\ % correct scores for meanings and readings',  
        'Add a data page to compare user\'s progress to JLPT and most used kanji data.',
        'Timeline view?',
        'Feature that displays which vocabulary words feature exceptional readings that do not use the primary 音読み or 訓読み readings.',
        'Feature that displays kanji with 名乗り readings.',         
        'Cookies were added, but have not tested how long the cookie saves (seems longer than one browser session). Need more testing on this when I get the chance.',
        'Implement URL parameters for data views (radicals, kanji, vocab pages).',
        'Refactor some JS files, as well as data views.'
    ]

    $scope.developerNotes = [
        {
            'date': '5/29/2018',
            'notes': [
                'Created "Verbs" view, which filters WaniKani vocabulary requested by meanings that begin with "to ". This view, like the others, can be filtered by SRS level and user level.',
                'Created "Verbs Quiz," which uses the selected WaniKani verbs, selects a random verb conjugation or expression, and quizzes the user on the reading. Current available conjugations or expressions are present, past, negative, polite present, conjunctive, volitional, and desiderative.',
                'Added "Hint" features to the Verbs Quiz where users can enable or disable: Furigana notation, verb class (godan, ichidan, or irregular, expressed by color), and stem type (a, i, u, e, o, te, ta, also expressed by color). These colors will be integrated in an independent project currently under work, called "A Visual Japanese."',
                'Fixed issue wherein search was wrongfully returning partial-word matches. Now only returning requests for perfect, whole-word matches.'
            ]
        },{
            'date': '5/27/2018',
            'notes': [
                'Added a function that rejects user quiz submissions if an English character is found when the prompt is asking for a reading.',
                'Added a "close answer" algorithm to quiz meanings. Currently, as long as at least 75% of the characters in a user\'s response are found in the correct answer, AND at least 75% of the characters in the correct answer are found in the user response or only one character is not found in the user response, the answer will be marked as a "close answer." This is currently being indicated in the quiz responses with a small black arrow until the quiz UI is revamped.'
            ]
        },
        {
            'date': '5/26/2018',
            'notes': [
                'Added visual progress bar to quiz.',
                'Created critical items review, but critical items request does not include user synonyms or SRS data.'
            ]
        },
        {
            'date': '5/25/2018',
            'notes': [
                'Fixed issue in which search results were not properly returning when querying multiple word definitions.'
            ]
        },
        {
            'date': '5/24/2018',
            'notes': [
                'Added new page for selecting options for quizzes, allowing users to take a quiz across multiple types of lessons (i.e. radicals, kanji, and vocab).',
                'Added exit button for quiz to redirect users immediately to quiz results.'
            ]
        },
        {
            'date': '5/22/2018',
            'notes': [
                'Added API verification and immediate user feedback. No longer save cookie if API key is not successfully verified.',
                'Updated quiz to be able to quiz across multiple types of lessons (i.e. radicals, kanji, and vocabulary).',
                'Resolved issue wherein radical icons were not displaying properly in quiz results.',
                'Adding loading icons and resolved flickering issues with ng-cloak.',
                'A little AngularJS refactoring.'
            ]
        },
        {
            'date': '5/21/2018',
            'notes': [
                'Resolved issue wherein radical quiz was asking for "readings" of radicals, even though they have no readings.',
                'Randomized quiz list.',
                'Sorted vocabulary page by character length to improve readability.',
                'Made this awesome page.'
            ]
        },
        {
            'date': '5/20/2018',
            'notes': [
                '"Countdown" affect was added to radicals, kanji, and vocabulary. Non-burned items will now display how many hours, days, or months are left until the next review.',
                'Further mobile support has been added, including optimizing the filter bar and quiz to be more suited for a small screen.',
                'Search feature added. Users can now search for partial match of characters, partial complete-word match of meanings, and complete match of readings for radicals, kanji, and vocabulary.',
                'Search results and data pages now display user synonyms. Kanji pages now display 名乗り (name readings for that character).',
                'Added user API key feature so that WaniKani members can use their own data. Added cookies to save their API key for the next sessions.'
            ]
        },
        {
            'date': '5/19/2018',
            'notes': [
                'Issue with radicals using images resolved.',
                'Added user synonyms as possible correct meanings to quiz feature.',
                'Changed user SRS selection from dropdown to checkboxes, allowing users to select and deselect multiple SRS levels.',
                'Optimized user experience for mobile support.',
                'Resolved issue wherein some four-character clips of romaji were not being converted to their kana counterpart.',
                'Resolved issue wherein non-primary meaning answers were not being marked correct in the quiz section.'
            ]
        },
        {
            'date': '5/18/2018',
            'notes': [
                'CSS and design completely revamped from previous project.',
                'Radicals and vocabulary data pages added.',
                'Quiz feature expanded to include radicals and vocabulary.',
            ]
        },
    ]
});