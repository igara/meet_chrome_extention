import { Comments, IndexDB } from '@src/background/models/dexie';
import styles from '@src/main/App.module.css';
import React from 'react';

const App = () => {
  const [comments, setComments] = React.useState<Comments[]>([]);
  const onClickCommentMemoDeleteButton = React.useCallback(async () => {
    const comments = await IndexDB.comments.toArray();
    if (comments.length !== 0) await IndexDB.delete();
    setComments([]);
  }, []);

  const [isCheckMeetScreen, setIsCheckMeetScreen] = React.useState(false);
  const [isMeetScreen, setIsMeetScreen] = React.useState(false);
  React.useEffect(() => {
    (async () => {
      const comments = await IndexDB.comments.toArray();
      if (comments.length !== 0) setComments(comments.reverse());

      if (!isCheckMeetScreen) {
        chrome.tabs.query({ active: true, lastFocusedWindow: true }, (queryTab) => {
          if (queryTab.length === 0) return;
          const tab = queryTab[0];
          if (!tab) return;
          if (!tab.id) return;
          if (!tab.url) return;

          if (/^https:\/\/meet.google.com/.test(tab.url)) {
            setIsMeetScreen(true);
          }
          setIsCheckMeetScreen(true);
        });
      }
    })();
  });

  return (
    <>
      <header className={styles.header}>
        <h1>meet_chrome_extention</h1>
      </header>
      <h2>コメントメモ</h2>
      {comments.map((comment, index) => (
        <div key={index}>
          <h2>{comment.meet_title}</h2>
          <div>{comment.created}</div>
          <textarea readOnly>{comment.comment}</textarea>
          <div>{comment.meet_url}</div>
          <hr />
        </div>
      ))}
      <button disabled={isMeetScreen} onClick={onClickCommentMemoDeleteButton}>
        コメントメモ全削除
      </button>
      <br />
      <span>Meet画面中では削除できません</span>
    </>
  );
};

export default App;
