import React, { useState } from 'react';
import './registerByISBN.css';

function RegisterByISBN() {
  /* --- タブ状態 --- */
  const [mode, setMode] = useState('isbn'); // 'isbn' | 'manual'

  /* --- ISBN一括登録 --- */
  const [isbns, setIsbns] = useState(Array(10).fill(''));

  const handleISBNChange = (index, value) => {
    const updated = [...isbns];
    updated[index] = value;
    setIsbns(updated);
  };

  const submitISBNs = (e) => {
    e.preventDefault();
    const toRegister = isbns.filter(v => v.trim() !== '');
    console.log('登録するISBN:', toRegister);
    // TODO: サーバー送信やバリデーション
  };

  /* --- 手動登録 --- */
  const [manual, setManual] = useState({
    title: '', author: '', publisher: '', shelf: '', year: '', pages: '', isbn: '', added: ''
  });

  const handleManualChange = ({ target: { name, value } }) =>
    setManual(prev => ({ ...prev, [name]: value }));

  const submitManual = (e) => {
    e.preventDefault();
    console.log('手動登録データ:', manual);
    // TODO: サーバー送信やバリデーション
  };

  /* --- JSX --- */
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

      {/* 手動登録フォーム */}
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
