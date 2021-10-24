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

  React.useEffect(() => {
    (async () => {
      const comments = await IndexDB.comments.toArray();
      if (comments.length !== 0) setComments(comments.reverse());
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
          <textarea>{comment.comment}</textarea>
          <div>{comment.meet_url}</div>
          <hr />
        </div>
      ))}
      <button onClick={onClickCommentMemoDeleteButton}>コメントメモ全削除</button>
    </>
  );
};

export default App;
