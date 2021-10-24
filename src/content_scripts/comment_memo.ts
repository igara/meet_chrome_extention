type States = {
  [key: string]: {
    allChatButtonElementClicked: boolean;
    comments: string;
    created: string;
    meetURL: string;
  };
};
let states: States = {};

export const intervalCheckMeetScreen = (meetURL: string, created: string) => {
  const state = states[`${meetURL}:${created}`];
  if (!states) return;

  const allChatButtonElement = document.querySelector(
    'button[aria-label=全員とチャット]',
  );
  // このボタンがないときはまだMeetの通話に入っていない状態
  if (!(allChatButtonElement instanceof HTMLButtonElement)) return;

  if (!state.allChatButtonElementClicked) {
    allChatButtonElement.click();
    states[`${meetURL}:${created}`].allChatButtonElementClicked = true;
  }

  const ariaLivePoliteElement = document.querySelector('div[aria-live=polite]');
  if (!(ariaLivePoliteElement instanceof HTMLDivElement)) return;

  if (ariaLivePoliteElement.innerText === state.comments) return;

  const innerText = ariaLivePoliteElement.innerText;
  if (!innerText) return;

  states[`${meetURL}:${created}`].comments = innerText;

  const meetTitle = document.title;
  chrome.runtime.sendMessage(
    {
      event: 'Background_MeetMeeting',
      meetURL,
      meetTitle,
      comments: innerText,
      created,
    },
    () => {
      // console.log(response);
    },
  );

  return;
};

export const onMessage = (
  request: any,
  _: chrome.runtime.MessageSender,
  // eslint-disable-next-line no-unused-vars
  sendResponse: (_?: any) => void,
) => {
  // Meetの画面内チェック
  if (request.event === 'ContentScripts_CommentMemo_CheckMeetScreen') {
    const allChatButtonElementClicked = false;
    const comments = '';
    const nowDate = new Date();
    const created = `${nowDate.getFullYear()}/${('0' + nowDate.getMonth() + 1).slice(
      -2,
    )}/${('0' + nowDate.getDate()).slice(-2)} ${('0' + nowDate.getHours()).slice(-2)}:${(
      '0' + nowDate.getMinutes()
    ).slice(-2)}:${('0' + nowDate.getSeconds()).slice(-2)}`;
    const meetURL = location.origin + location.pathname;
    states = {
      ...states,
      [`${meetURL}:${created}`]: {
        allChatButtonElementClicked,
        comments,
        created,
        meetURL,
      },
    };

    setInterval(() => {
      intervalCheckMeetScreen(meetURL, created);
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
