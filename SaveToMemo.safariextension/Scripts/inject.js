document.addEventListener("contextmenu", handleContextMenu, false);

function handleContextMenu(event) {
    if (event.target && event.target.nodeName === 'A') {
        var link_href = event.target.href;
        if (link_href && link_href.indexOf('http') == 0) {
            var linkData = { url: link_href };
            safari.self.tab.setContextMenuEventUserInfo(event, 'savetomemo:link:' + JSON.stringify(linkData));
        }
    } else if (event.target && event.target.nodeName === 'IMG') {
    	var image_src = event.target.src;
    	if (image_src && image_src.indexOf('http') == 0) {
            var imageData = { src: image_src };
            if (event.target.title && event.target.title != '') {
                imageData.title = event.target.title;
            }
    		safari.self.tab.setContextMenuEventUserInfo(event, 'savetomemo:image:' + JSON.stringify(imageData));
    	}
    } else {
        var selection_text = '';
        selection_text = window.parent.getSelection()+'';
        // console.log(selection_text);
        if (selection_text && selection_text != '') {
            var noteData = { text: selection_text };
            safari.self.tab.setContextMenuEventUserInfo(event, 'savetomemo:note:' + JSON.stringify(noteData));
        }
    }
}
