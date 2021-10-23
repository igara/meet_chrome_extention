export {};

/**
 * ContentScript、BackGroundのイベントを拾う
 */
chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
  // 保存されているXPathをaction_scriptに送る
  if (request.event === 'GetXPath') {
    const xpath = localStorage.getItem('xpath');
    sendResponse({ xpath: xpath });
  }
});
