export const onMessage = (
  request: any,
  _: chrome.runtime.MessageSender,
  // eslint-disable-next-line no-unused-vars
  sendResponse: (_?: any) => void,
) => {
  // Meetの画面内チェック
  if (request.event === 'ContentScripts_CommentMemo_CheckMeetScreen') {
    let allChatButtonElementClicked = false;
    let comments = '';
    const nowDate = new Date();
    const created = `${nowDate.getFullYear()}/${
      nowDate.getMonth() + 1
    }/${nowDate.getDate()} ${nowDate.getHours()}:${nowDate.getMinutes()}:${nowDate.getSeconds()}`;
    setInterval(() => {
      const allChatButtonElement = document.querySelector(
        'button[aria-label=全員とチャット]',
      );
      // このボタンがないときはまだMeetの通話に入っていない状態
      if (!(allChatButtonElement instanceof HTMLButtonElement)) return;

      if (!allChatButtonElementClicked) {
        allChatButtonElement.click();
        allChatButtonElementClicked = true;
      }

      const ariaLivePoliteElement = document.querySelector('div[aria-live=polite]');
      if (!(ariaLivePoliteElement instanceof HTMLDivElement)) return;

      if (ariaLivePoliteElement.innerText === comments) return;

      comments = ariaLivePoliteElement.innerText;
      if (!comments) return;

      const meetURL = location.origin + location.pathname;
      const meetTitle = document.title;
      chrome.runtime.sendMessage(
        {
          event: 'Background_MeetMeeting',
          meetURL,
          meetTitle,
          comments,
          created,
        },
        () => {
          // console.log(response);
        },
      );

      return;
    }, 5000);
  }

  sendResponse({
    status: 'comment_memo ok',
  });
};

/**
 * main、backgroundからのsendMessageを受け取る
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) =>
  onMessage(request, sender, sendResponse),
);
