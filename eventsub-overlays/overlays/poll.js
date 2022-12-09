listItems = document.getElementsByTagName('div');
for (let i = 0; i < listItems.length; i++) {
    const item = listItems[i];
    const widthPx = item.getAttribute('width')
    item.style.width = widthPx;
}