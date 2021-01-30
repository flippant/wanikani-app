//not in use

wanikaniApp.filter('toJapanese', function() {
    return function(romaji) {
        if(!romaji) {return ''}
        
        var jpString = '';
        var enString = romaji.toLowerCase();

        while (enString.length > 0) {
            if (vowels.includes(enString.substring(0,1)) && translations[enString.substring(0,1)]!=undefined) {
                var syl = enString.substring(0,1);
                jpString = jpString + translations[syl];
                enString = enString.substring(1);
            } 
            else if (vowels.includes(enString.substring(1,2)) && translations[enString.substring(0,2)]!=undefined) {
                var syl = enString.substring(0,2);
                jpString = jpString + translations[syl];
                enString = enString.substring(2);
            }
            else if (['n','m'].includes(enString.substring(0,1)) && enString.substring(1,2)!='y') {     
                jpString = jpString + 'ん'
                enString = enString.substring(1);
            }
            else if (vowels.includes(enString.substring(2,3)) && translations[enString.substring(0,3)]!=undefined) {
                var syl = enString.substring(0,3);
                jpString = jpString + translations[syl];
                enString = enString.substring(3);
            }
            else if (vowels.includes(enString.substring(2,3)) && enString.substring(0,1)===enString.substring(1,2)) {
                var syl = enString.substring(1,3);
                jpString = jpString + 'っ' + translations[syl];
                enString = enString.substring(3);
            }
            else {
                jpString = jpString + enString.substring(0,1);
                enString = enString.substring(1);
            }
        } 

        return jpString
    };
});

var vowels = ['a','e','i','o','u']
var translations = {
    a:'あ',
    e:'え',
    i:'い',
    o:'お',
    u:'う',
    ka:'か',
    ki:'き',
    ko:'こ',
    ke:'け',
    ku:'く',
    ca:'か',
    ci:'き',
    co:'こ',
    ce:'け',
    cu:'く',
    ga:'が',
    gi:'ぎ',
    go:'ご',
    ge:'げ',
    gu:'ぐ',
    sa:'さ',
    si:'し',
    su:'す',
    se:'せ',
    so:'そ',
    za:'ざ',
    zi:'じ',
    zu:'ず',
    ze:'ぜ',
    zo:'ぞ',
    ja:'じゃ',
    ji:'じ',
    ju:'じゅ',
    je:'じぇ',
    jo:'じょ',
    ta:'た',
    ti:'ち',
    tu:'つ',
    te:'て',
    to:'と',
    da:'だ',
    di:'ぢ',
    du:'づ',
    de:'で',
    do:'ど',
    na:'な',
    ni:'に',
    nu:'ぬ',
    ne:'ね',
    no:'の',
    ha:'は',
    hi:'ひ',
    hu:'ふ',
    fu:'ふ',
    he:'へ',
    ho:'ほ',
    pa:'ぱ',
    pi:'ぴ',
    pu:'ぷ',
    pe:'ぺ',
    po:'ぽ',
    ba:'ば',
    bi:'び',
    bu:'ぶ',
    be:'べ',
    bo:'ぼ',
    ma:'ま',
    mi:'み',
    mu:'む',
    me:'め',
    mo:'も',
    ya:'や',
    yi:'い',
    yu:'ゆ',
    ye:'いぇ',
    yo:'よ',
    ra:'ら',
    ri:'り',
    ru:'る',
    re:'れ',
    ro:'ろ',
    wa:'わ',
    wi:'うぃ',
    wu:'う',
    we:'うぇ',
    wo:'を',
    la:'ぁ',
    li:'ぃ',
    lu:'ぅ',
    le:'ぇ',
    lo:'ぉ',
    kya:'きゃ',
    kyi:'きぃ',
    kyu:'きゅ',
    kye:'きぇ',
    kyo:'きょ',
    gya:'ぎゃ',
    gyi:'ぎぃ',
    gyu:'ぎゅ',
    gye:'ぎぇ',
    gyo:'ぎょ',
    sha:'しゃ',
    shi:'し',
    shu:'しゅ',
    she:'しぇ',
    sho:'しょ',
    zya:'じゃ',
    zyi:'じぃ',
    zyu:'じゅ',
    zye:'じぇ',
    zyo:'じょ',
    cha:'ちゃ',
    chi:'ち',
    chu:'ちゅ',
    che:'ちぇ',
    cho:'ちょ',
    dya:'ぢゃ',
    dyu:'ぢゅ',
    dyo:'ぢょ',
    nya:'にゃ',
    nyi:'にぃ',
    nyu:'にゅ',
    nye:'にぇ',
    nyo:'にょ',
    hya:'ひゃ',
    hyi:'ひぃ',
    hyu:'ひゅ',
    hye:'ひぇ',
    hyo:'ひょ',
    pya:'ぴゃ',
    pyi:'ぴぃ',
    pyu:'ぴゅ',
    pye:'ぴぇ',
    pyo:'ぴょ',
    bya:'びゃ',
    byi:'びぃ',
    byu:'びゅ',
    bye:'びぇ',
    byo:'びょ',
    mya:'みゃ',
    myi:'みぃ',
    myu:'みゅ',
    mye:'みぇ',
    myo:'みょ',
    rya:'りゃ',
    ryi:'りぃ',
    ryu:'りゅ',
    rye:'りぇ',
    ryo:'りょ',
}