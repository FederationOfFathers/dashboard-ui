(function(){

    console.log("pathname:");
    console.log(window.location.pathname);
    if (window.location.pathname == "/oauth/youtube") {
        hashValues = location.hash.substring(1);
        location.href="/#/oauth/youtube?" + hashValues
    } else if (window.location.pathname == "/oauth/twitch") {
        hashValues = location.hash.substring(1);
        location.href="/#/oauth/twitch?" + hashValues
    } else if (window.location.pathname == "/oauth/battlenet") {
        hashValues = location.hash.substring(1);
        location.href="/#/oauth/battlenet?" + hashValues
    }
})();
