import { Comments, IndexDB } from '@src/background/models/dexie';
import styles from '@src/main/App.module.css';
import React from 'react';

const App = () => {
  const [isOpenMenu, setIsOpenMenu] = React.useState(false);
  const onClickMenuButton = React.useCallback(() => {
    setIsOpenMenu(!isOpenMenu);
  }, [isOpenMenu]);

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
      const commentData = await IndexDB.comments.toArray();
      if (commentData.length !== 0) setComments(commentData.reverse());

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
        {isOpenMenu ? (
          <div className={styles.headerMenu}>
            <button
              className={styles.commentMemoDeleteButton}
              disabled={isMeetScreen}
              onClick={onClickCommentMemoDeleteButton}>
              ð£
              <span className={styles.commentMemoDeleteButtonDescription}>
                ã³ã¡ã³ãåé¤
                <br />
                Meetç»é¢ä¸­ã§ã¯åé¤ã§ãã¾ãã
              </span>
            </button>
          </div>
        ) : (
          <h1 className={styles.headerTitle}>meet_chrome_extention</h1>
        )}

        <button onClick={onClickMenuButton} className={styles.menuButton}>
          {isOpenMenu ? 'ð¼' : 'ð½'}
          <span className={styles.menuButtonDescription}>ã¡ãã¥ã¼</span>
        </button>
      </header>

      <h2 className={styles.commentMemoTitle}>ã³ã¡ã³ãã¡ã¢</h2>
      {comments.map((comment, index) => (
        <div key={index}>
          <h2>{comment.meet_title}</h2>
          <button
            onClick={() => {
              navigator.clipboard.writeText(comment.comment);
            }}
            className={styles.copyButton}>
            ð<span className={styles.copyButtonDescription}>ã³ãã¼</span>
          </button>

          <div>{comment.created}</div>

          <div className={styles.comment}>
            <div className={styles.commentDummy}>{comment.comment}</div>
            <textarea readOnly className={styles.commentTextarea}>
              {comment.comment}
            </textarea>
          </div>

          <div>{comment.meet_url}</div>
          <hr className={styles.border} />
        </div>
      ))}
    </>
  );
};

export default App;
