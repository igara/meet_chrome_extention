import { IndexDB } from '@src/background/models/dexie';

export const onUpdatedTabsQuery = (
  queryTab: chrome.tabs.Tab[],
  onUpdatedTabId: number,
) => {
  if (queryTab.length === 0) return;

  const tab = queryTab[0];
  if (onUpdatedTabId !== tab.id) return;

  chrome.tabs.sendMessage(
    onUpdatedTabId,
    { event: 'ContentScripts_CommentMemo_CheckMeetScreen' },
    (response) => {
      console.log(response);
    },
  );
};

export const onUpdated = (
  onUpdatedTabId: number,
  info: chrome.tabs.TabChangeInfo,
  onUpdatedTab: chrome.tabs.Tab,
) => {
  // タブのURLが存在しないとき
  if (!onUpdatedTab.url) return;
  if (info.status !== 'complete') return;

  if (/^https:\/\/meet.google.com/.test(onUpdatedTab.url)) {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, (queryTab) =>
      onUpdatedTabsQuery(queryTab, onUpdatedTabId),
    );
  }
};

/**
 * タブの変更を通知
 */
chrome.tabs.onUpdated.addListener((onUpdatedTabId, info, onUpdatedTab) =>
  onUpdated(onUpdatedTabId, info, onUpdatedTab),
);

export const onMessage = (
  request: any,
  _: chrome.runtime.MessageSender,
  // eslint-disable-next-line no-unused-vars
  sendResponse: (_?: any) => void,
) => {
  if (request.event === 'Background_MeetMeeting') {
    const nowDate = new Date();
    const modified = `${nowDate.getFullYear()}/${
      nowDate.getMonth() + 1
    }/${nowDate.getDate()} ${nowDate.getHours()}:${nowDate.getMinutes()}:${nowDate.getSeconds()}`;

    IndexDB.comments.put({
      meet_url: request.meetURL,
      meet_title: request.meetTitle,
      comment: request.comments,
      created: request.created,
      modified,
    });
  }
  sendResponse({
    status: 'background ok',
  });
};

/**
 * main、content_scriptsからのsendMessageを受け取る
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) =>
  onMessage(request, sender, sendResponse),
);
