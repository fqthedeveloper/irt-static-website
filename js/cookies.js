// script.js
document.addEventListener('DOMContentLoaded', function() {
    var acceptCookies = document.getElementById('acceptCookies');
    var declineCookies = document.getElementById('declineCookies');
    var cookieConsent = document.getElementById('cookieConsent');

    // Function to set a cookie
    function setCookie(name, value, daysToLive) {
        var cookie = name + "=" + encodeURIComponent(value);
        if (typeof daysToLive === "number") {
            cookie += "; max-age=" + (daysToLive*24*60*60*1000);
        }
        document.cookie = cookie;
    }

    // Function to hide the cookie consent banner
    function hideCookieConsent() {
        cookieConsent.style.display = 'none';
    }

    // Check if the 'acceptCookies' cookie is already set
    if (document.cookie.indexOf('acceptCookies=') === -1) {
        // Show the cookie consent banner if the user hasn't accepted yet
        cookieConsent.style.display = 'block';
    } else {
        // Hide the cookie consent banner if the user has already accepted
        hideCookieConsent();
    }

    // Event listener for the 'Accept Cookies' button
    acceptCookies.addEventListener('click', function() {
        setCookie('acceptCookies', 'true', 30); // Set for 30 days
        hideCookieConsent();
    });

});