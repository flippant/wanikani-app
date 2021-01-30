wanikaniApp.filter('to_trusted', ['$sce', function($sce){
    return function(text) {
        return $sce.trustAsHtml(text)
    };
}]);

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

wanikaniApp.filter('objToComma', function() {
    return function(obj) {
        let str = ''
        let count = 0
        for (var i in obj) {
            count++;
            if(obj[i]) {
                str += i + (count===Object.keys(obj).length ? "" : ",")
            }
        }
        return str;
    }
})

wanikaniApp.filter('floor', function(){
    
        return function(n){
            return Math.floor(n);
        };
    });