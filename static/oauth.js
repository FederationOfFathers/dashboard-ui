(function(){
    let hashValues = location.hash.substring(1);
    if (window.location.pathname == "/oauth/youtube") {
        location.href="/#/oauth/youtube?" + hashValues
    } else if (window.location.pathname == "/oauth/twitch") {
        location.href="/#/oauth/twitch?" + hashValues
    } else if (window.location.pathname == "/oauth/battlenet") {
        location.href="/#/oauth/battlenet?" + hashValues
    }
})();
