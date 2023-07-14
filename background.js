let currentTab;
let copystatus;

function updateIcon(tabs) {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    if (tabs && tabs.length > 0) {
      chrome.browserAction.setIcon({
        path: copystatus ? {
          16: "icons/check-button-16.png",
          24: "icons/check-button-24.png",
          32: "icons/check-button-32.png",
          64: "icons/check-button-64.png",
          128: "icons/check-button-128.png",
          256: "icons/check-button-256.png",
          512: "icons/check-button-512.png"
        } : {
          16: "icons/laurier-16.png",
          24: "icons/laurier-24.png",
          32: "icons/laurier-32.png",
          64: "icons/laurier-64.png",
          128: "icons/laurier-128.png",
          256: "icons/laurier-256.png",
          512: "icons/laurier-512.png"
        },
        tabId: tabs.id
      });
    }
  });
}

function copyTextToClipboard(text) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  document.body.appendChild(textArea);

  textArea.select();
  textArea.setSelectionRange(0, textArea.value.length);

  document.execCommand("copy");

  document.body.removeChild(textArea);
  console.log("Async: Copying to clipboard was successful!");
}


function Ceasar(word, offset) {
  let newArray = [];
  for (let i = 0; i < word.length; i++) {
      if (word.charCodeAt(i) >= 65 && word.charCodeAt(i) <= 90) {
          newArray.push((((word.charCodeAt(i) - 65) + offset) % 26) + 65);
      }
      else {
          newArray.push((((word.charCodeAt(i) - 97) + offset) % 26) + 97);
      }
  }
  let newWords = "";
  for (let j = 0; j < newArray.length; j++) {
      newWords += String.fromCharCode(newArray[j])
  }
  return newWords;
}

function toggleBookmark(tabs) {
  copystatus = true;
  updateIcon(tabs);

  setTimeout(function() {
    copystatus = false;
    updateIcon(tabs);
  }, 800);

  let domain = (new URL(tabs.url));
  domain = domain.hostname;
  var dl = domain.split('.')

  copyTextToClipboard(Ceasar(dl[dl.length-2], 12))

}

chrome.browserAction.onClicked.addListener(toggleBookmark);
// listen to tab URL changes
chrome.tabs.onUpdated.addListener(updateIcon);
// listen to tab switching
chrome.tabs.onActivated.addListener(updateIcon);
// listen for window switching
chrome.windows.onFocusChanged.addListener(updateIcon);

updateIcon();