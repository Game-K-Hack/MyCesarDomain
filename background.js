let currentTab;
let copystatus;

function updateIcon(tabs) {
  browser.browserAction.setIcon({
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

function fallbackCopyTextToClipboard(text) {
  var textArea = document.createElement("textarea");
  textArea.value = text;
  
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.position = "fixed";

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    var successful = document.execCommand('copy');
    var msg = successful ? 'successful' : 'unsuccessful';
    console.log('Fallback: Copying text command was ' + msg);
  } catch (err) {
    console.error('Fallback: Oops, unable to copy', err);
  }

  document.body.removeChild(textArea);
}

function copyTextToClipboard(text) {
  if (!navigator.clipboard) {
    fallbackCopyTextToClipboard(text);
    return;
  }
  navigator.clipboard.writeText(text).then(function() {
    console.log('Async: Copying to clipboard was successful!');
  }, function(err) {
    console.error('Async: Could not copy text: ', err);
  });
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

browser.browserAction.onClicked.addListener(toggleBookmark);
// listen to tab URL changes
browser.tabs.onUpdated.addListener(updateIcon);
// listen to tab switching
browser.tabs.onActivated.addListener(updateIcon);
// listen for window switching
browser.windows.onFocusChanged.addListener(updateIcon);

updateIcon();