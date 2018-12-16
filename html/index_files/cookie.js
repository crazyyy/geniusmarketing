function createCookie(name, value, expires, path, domain) {
    var cookie = name + "=" + escape(value) + ";";

    if (expires) {
        // If it's a date
        if(expires instanceof Date) {
            // If it isn't a valid date
            if (isNaN(expires.getTime()))
                expires = new Date();
        }
        else
            expires = new Date(new Date().getTime() + parseInt(expires) * 1000 * 60 * 60 * 24);

        cookie += "expires=" + expires.toGMTString() + ";";
    }

    if (path)
        cookie += "path=" + path + ";";
    if (domain)
        cookie += "domain=" + domain + ";";

    document.cookie = cookie;
}

function deleteCookie(name, path, domain) {
    // If the cookie exists
    if (getCookie(name))
        createCookie(name, "", -1, path, domain);
}

function getCookie(name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length == 2) return parts.pop().split(";").shift();
}