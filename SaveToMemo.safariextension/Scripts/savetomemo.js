var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9+/=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/rn/g,"n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}

function openNewTab(url) {
    var newTab = safari.application.activeBrowserWindow.openTab();
    newTab.url = url;
}

// Function to perform when event is received
function performCommand(event) {
    if (event.command === "memo-save-page") {
        var currentTabUrl = safari.application.activeBrowserWindow.activeTab.url;
        importToMemo({ 
            type: 'link', 
            url: currentTabUrl 
        });
    } else if (event.command === 'memo-save-page-newtab') {
        var currentTabUrl = safari.application.activeBrowserWindow.activeTab.url;
        openNewTab("http://memo.jul11.co/tools/import_link?url=" + encodeURIComponent(currentTabUrl));
    } else if (event.command === 'memo-save-images-newtab') {
        var currentTabUrl = safari.application.activeBrowserWindow.activeTab.url;
        openNewTab("http://memo.jul11.co/tools/import_image?url=" + encodeURIComponent(currentTabUrl));
    } else if (event.command === 'memo-save-link-a') {
        var currentTabUrl = safari.application.activeBrowserWindow.activeTab.url;
        // var currentLinkUrl = event.userInfo.replace('savetomemo:link:', ''); // url
        try {
            var importData = JSON.parse(event.userInfo.replace('savetomemo:link:', ''));
            var currentLinkUrl = importData.url;
            importToMemo({ 
                type: 'link', 
                url: currentLinkUrl,
                source: currentTabUrl
            });
        } catch(e) {
            console.log(e);
        }
    } else if (event.command === 'memo-save-image-img') {
        // var currentImageSrc = event.userInfo.replace('savetomemo:image:', ''); // url
        var currentTabUrl = safari.application.activeBrowserWindow.activeTab.url;
        var currentTabTitle = safari.application.activeBrowserWindow.activeTab.title;
        try {
            var importData = JSON.parse(event.userInfo.replace('savetomemo:image:', ''));
            var currentImageSrc = importData.src;
            var currentImageCaption = importData.title || currentTabTitle;
            importToMemo({ 
                type: 'image', 
                full: currentImageSrc,
                caption: currentImageCaption,
                source: currentTabUrl
            });
        } catch(e) {
            console.log(e);
        }
    } else if (event.command === 'memo-save-note') {
        // var currentNoteText = event.userInfo.replace('savetomemo:note:', ''); // url
        var currentTabUrl = safari.application.activeBrowserWindow.activeTab.url;
        var currentTabTitle = safari.application.activeBrowserWindow.activeTab.title;
        try {
            var importData = JSON.parse(event.userInfo.replace('savetomemo:note:', ''));
            var currentNoteText = importData.text;
            var currentNoteTitle = importData.title || currentTabTitle;
            importToMemo({ 
                type: 'note', 
                text: currentNoteText,
                title: currentNoteTitle,
                source: currentTabUrl
            });
        } catch(e) {
            console.log(e);
        }
    }
}

function handleContextMenu(event) {
    if (event.userInfo && event.userInfo.indexOf('savetomemo:') == 0) {
        var uri = event.userInfo.replace('savetomemo:', '');
        if (uri.indexOf('link:') == 0) {
            event.contextMenu.appendContextMenuItem("memo-save-link-a", "Save This Link To Memo");
        } else if (uri.indexOf('image:') == 0) {
            event.contextMenu.appendContextMenuItem("memo-save-image-img", "Save This Image To Memo");
        } else if (uri.indexOf('note:') == 0) {
            event.contextMenu.appendContextMenuItem("memo-save-note", "Save This Note To Memo");
        }
    }
}

// Set up the Listener
safari.application.addEventListener("command", performCommand, false);
safari.application.addEventListener("contextmenu", handleContextMenu, false);

function showNotification(notification, link){
    var icon = '';
    var title = notification.title || 'Save to Memo';
    var message = notification.message || '';

    if (window.webkitNotifications) {
        if (window.webkitNotifications.checkPermission() == 0) {
            var notification = window.webkitNotifications.createNotification(icon, title, message);
            if (link) {
                notification.onclick = function() { 
                    // window.location.href = link;
                    var tab = safari.application.activeBrowserWindow.openTab("foreground");
                    tab.url = link;
                };
            }
            notification.show();
        }else{
            window.webkitNotifications.requestPermission(function(){
                var notification = window.webkitNotifications.createNotification(icon, title, message);
                if (link) {
                    notification.onclick = function() { 
                        // window.location.href = link;
                        var tab = safari.application.activeBrowserWindow.openTab("foreground");
                        tab.url = link;
                    };
                }
                notification.show();
            });
        }
    } else {
        console.log('window.webkitNotifications not available!');
    }
};

// generic cross-origin AJAX function
// http://blog.jetboystudio.com/articles/safari-extension/
function ajax(method, url, data, cb, headers){
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = readystatechange;
    xhr.open(method, url);
    xhr.setRequestHeader("Content-Type", "application/json");

    if (headers){
        for(i in headers){
            xhr.setRequestHeader(i, headers[i]);
        }
    }

    if (data){
        data = JSON.stringify(data);
    }

    xhr.send(data);

    function readystatechange(){
        if(this.readyState === this.DONE) {
            if (this.status == 200){
                if(this.getResponseHeader("Content-Type").split(";")[0] === "application/json"){
                    return cb(null, JSON.parse(this.response), this);
                }else{
                    return cb(null, this.response, this);
                }
            }else{
                return cb(this.status, this.response, this);
            }
        }
    }
}

var getToken = function() {
    if (!settings.username || settings.username == ''
        || !settings.password || settings.username == '') {
        token = '';
        return;
    }
    // console.log(settings);
    var basicAuth = Base64.encode(settings.username + ':' + settings.password);
    var authUrl = 'http://memo.jul11.co/api/v1/auth/token';
    ajax(
        'GET', 
        authUrl, 
        {},
        function(err, res, req){
            if (err){
                console.log('unknown err', err);
            } else {
                // console.log(res);
                if (res.token) {
                    token = res.token;
                    localStorage.setItem('savetomemo-token', token);
                    // console.log(token);
                }
            }
        },
        { "Authorization": "Basic " + basicAuth }
    );
}

var importToMemo = function(item){
    // console.log('importToMemo:', item);
    var importUrl = 'http://memo.jul11.co/api/v1/tools/import';
    ajax(
        'POST', 
        importUrl, 
        {
            imports: [ item ]
        },
        function(err, res, req){
            if (err){
                console.log('unknown err', err);
            } else {
                console.log(res);
                if (!res.error && res.items && res.items.length > 0) {
                    var title = '';
                    var message = '';
                    if (res.items.length == 1) {
                        if (res.items[0].type == 'image') {
                            title = "Image saved to Memo";
                            message = res.items[0].caption;
                            showNotification({
                                title: title,
                                message: message
                            }, 'http://memo.jul11.co/images');
                        } else if (res.items[0].type == 'link') {
                            title = "Link saved to Memo";
                            message = res.items[0].title;
                            showNotification({
                                title: title,
                                message: message
                            }, 'http://memo.jul11.co/links');
                        } else if (res.items[0].type == 'note') {
                            title = "Note saved to Memo";
                            var note = res.items[0].text;
                            if (note && note.length > 60) {
                                note = note.substring(0, 60) + '...';
                            }
                            message = note;
                            showNotification({
                                title: title,
                                message: message
                            }, 'http://memo.jul11.co/notes');
                        }
                    } else {
                        title = "" + res.items.length + " items saved to Memo";
                        var links_count = 0;
                        var images_count = 0;
                        var notes_count = 0;
                        res.items.forEach(function(imported_item) {
                            if (imported_item.type == 'link') links_count++;
                            else if (imported_item.type == 'image') images_count++;
                            else if (imported_item.type == 'note') notes_count++;
                        });
                        if (links_count > 0) {
                            message += '' + links_count + ' link(s)';
                        }
                        if (images_count > 0) {
                            message += ' ' + images_count + ' image(s)';
                        }
                        if (notes_count > 0) {
                            message += ' ' + notes_count + ' note(s)';
                        }
                        showNotification({
                            title: title,
                            message: message
                        }, 'http://memo.jul11.co/');
                    }
                } else if (res.error) {
                    // console.log(res);
                    showNotification({
                        title: "Error",
                        message: res.error.message
                    });
                }
            }
        },
        { "Authorization": "Bearer " + token }
    );
};

var settings = {};
var token = '';

// global settings
function settingsChanged(){
    settings = {
        username: safari.extension.secureSettings.getItem('username'),
        password: safari.extension.secureSettings.getItem('password'),
    };
    var username = localStorage.getItem('savetomemo-username');
    if (username != settings.username) {
        // console.log('Username changed:', settings.username);
        localStorage.setItem('savetomemo-username', settings.username);
        localStorage.setItem('savetomemo-token', '');
    }
    token = localStorage.getItem("savetomemo-token");
    if (!token || token == '') {
        getToken();
    }
}

safari.extension.settings.addEventListener("change", settingsChanged, false);
settingsChanged();

console.log('SaveToMemo: loaded');

