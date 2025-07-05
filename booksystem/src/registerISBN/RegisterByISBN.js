import React, { useState } from 'react';
import './registerByISBN.css';

function RegisterByISBN() {
  const [mode, setMode] = useState('isbn');
  const [isbns, setIsbns] = useState(Array(10).fill(''));
  const [manual, setManual] = useState({
    title: '', author: '', publisher: '', shelf: '', year: '', pages: '', isbn: '', added: ''
  });
  const [message, setMessage] = useState('');

  const handleISBNChange = (index, value) => {
    const updated = [...isbns];
    updated[index] = value;
    setIsbns(updated);
  };

  const submitISBNs = async (e) => {
    e.preventDefault();
    const toRegister = isbns.filter(v => v.trim() !== '');
    if (toRegister.length === 0) {
      alert("1件以上のISBNを入力してください。");
      return;
    }

    try {
      const res = await fetch('/index.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isbns: toRegister })
      });

      const result = await res.json();

      if (result.success) {
        setMessage('登録処理が完了しました。');
        console.log('登録結果:', result.results);
        // 必要なら登録結果ごとに画面表示
      } else {
        setMessage(`エラー: ${result.message || '登録に失敗しました。'}`);
      }
    } catch (error) {
      console.error("通信エラー:", error);
      setMessage("通信エラーが発生しました。");
    }
  };

  const handleManualChange = ({ target: { name, value } }) =>
    setManual(prev => ({ ...prev, [name]: value }));

  const submitManual = (e) => {
    e.preventDefault();
    console.log('手動登録データ:', manual);
    // TODO: 後ほど index.php に送信する処理を追加
  };

  return (
    <div className="isbn-register">
      {/* タブ */}
      <div className="tab-container">
        <button
          className={`tab ${mode === 'isbn' ? 'active' : ''}`}
          onClick={() => setMode('isbn')}
        >ISBNで登録</button>
        <button
          className={`tab ${mode === 'manual' ? 'active' : ''}`}
          onClick={() => setMode('manual')}
        >手動で登録</button>
      </div>

      {/* メッセージ表示 */}
      {message && <div className="message">{message}</div>}

      {/* ISBN一括登録フォーム */}
      {mode === 'isbn' && (
        <>
          <h2>📚 ISBN一括登録（最大10件）</h2>
          <form onSubmit={submitISBNs}>
            {isbns.map((isbn, idx) => (
              <div key={idx} className="isbn-input-row">
                {idx === 0 && <label>ISBN</label>}
                <input
                  type="text"
                  value={isbn}
                  onChange={(e) => handleISBNChange(idx, e.target.value)}
                  placeholder="ISBNを入力"
                />
              </div>
            ))}
            <button type="submit">登録</button>
          </form>
        </>
      )}

      {/* 手動登録フォーム（未接続） */}
      {mode === 'manual' && (
        <>
          <h2>✍️ 手動登録フォーム</h2>
          <form onSubmit={submitManual} className="manual-form">
            <div className="form-row"><label>タイトル</label><input name="title" value={manual.title} onChange={handleManualChange} required /></div>
            <div className="form-row"><label>著者</label><input name="author" value={manual.author} onChange={handleManualChange} required /></div>
            <div className="form-row"><label>出版社</label><input name="publisher" value={manual.publisher} onChange={handleManualChange} /></div>
            <div className="form-row"><label>棚</label><input name="shelf" value={manual.shelf} onChange={handleManualChange} /></div>
            <div className="form-row"><label>発行年</label><input type="number" name="year" value={manual.year} onChange={handleManualChange} /></div>
            <div className="form-row"><label>ページ数</label><input type="number" name="pages" value={manual.pages} onChange={handleManualChange} /></div>
            <div className="form-row"><label>ISBN</label><input name="isbn" value={manual.isbn} onChange={handleManualChange} required /></div>
            <div className="form-row"><label>登録日</label><input type="date" name="added" value={manual.added} onChange={handleManualChange} required /></div>
            <button type="submit">登録</button>
          </form>
        </>
      )}
    </div>
  );
}

export default RegisterByISBN;
