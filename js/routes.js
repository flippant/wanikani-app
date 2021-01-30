var wanikaniApp = angular.module('wanikaniApp',['ngRoute','ngCookies']);

wanikaniApp.config(function($routeProvider) {
    $routeProvider
    .when("/quiz/verbs/:levels/:srs", {
        templateUrl: 'verbsQuiz.html',
        controller: 'verbsQuiz'
    })
    .when("/quiz/:type/:levels/:srs", {
        templateUrl: 'quiz.html',
        controller: 'quizDisplay'
    })
    .when("/quiz/:type/:levels/:srs/:crit", {
        templateUrl: 'quiz.html',
        controller: 'quizDisplay'
    })
    .when("/quiz", {
        templateUrl: 'quizOptions.html',
        controller: 'quizOptions'
    })
    .when("/data/:type/:levels/:addlfilter", {
        templateUrl: function(params) {
            return params.type+'.html';
        },
        controller: 'dataDisplay'
    })
    .when("/data/:type/:levels", {
        templateUrl: function(params) {
            return params.type+'.html';
        },
        controller: 'dataDisplay'
    })
    .when("/data/:type", {
        templateUrl: function(params) {
            return params.type+'.html';
        },
        controller: 'dataDisplay'
    })
    .when("/data", {
        templateUrl: function(params) {
            return params.type+'.html';
        },
        controller: 'dataDisplay'
    })
    .when("/info", {
        templateUrl: 'info.html',
        controller: 'infoDisplay'
    })
    .when("/verbs", {
        templateUrl: 'verbs.html',
        controller: 'verbsDisplay'
    })
    .when("/", {
        templateUrl: 'home.html',
        controller: 'homeDisplay'
    })
    .otherwise({
        templateUrl: '404.html',
        controller: 'homeDisplay'
    })
})