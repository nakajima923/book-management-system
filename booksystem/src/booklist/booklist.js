// ✅ 完全な修正済み booklist.js

import React, { useEffect, useState } from 'react';
import './booklist.css';

function BookList() {
  const [bookData, setBookData] = useState([]);
  const [filters, setFilters] = useState({ title: '', author: '', publisher: '', shelf: '', isbn: '' });
  const [yearMin, setYearMin] = useState('');
  const [yearMax, setYearMax] = useState('');
  const [pagesMin, setPagesMin] = useState('');
  const [pagesMax, setPagesMax] = useState('');
  const [addedMin, setAddedMin] = useState('');
  const [addedMax, setAddedMax] = useState('');
  const [sort, setSort] = useState({ key: null, direction: 'asc' });
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    fetch('/fetch_books.php')
      .then(res => res.json())
      .then(data => {
        setBookData(data.books || []);
      })
      .catch(err => console.error('データ取得エラー:', err));
  }, []);

  const handleChange = ({ target: { name, value } }) =>
    setFilters(prev => ({ ...prev, [name]: value }));

  const toggleSort = (key) =>
    setSort(prev =>
      prev.key === key ? { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' } : { key, direction: 'asc' }
    );

  const renderSortSymbol = (key) =>
    sort.key !== key ? '⇅' : sort.direction === 'asc' ? '▲' : '▼';

  const handleEditChange = (id, field, value) =>
    setBookData(prev =>
      prev.map(b => b.id === id ? { ...b, [field]: field === 'pages' ? parseInt(value) : value } : b)
    );

  const handleDelete = (id) =>
    setBookData(prev => prev.filter(b => b.id !== id));

  const saveEditedBooks = () => {
    fetch('/update_books.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ books: bookData })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          alert('更新完了しました');
          setEditMode(false);
        } else {
          alert('更新失敗: ' + data.message);
        }
      })
      .catch(err => {
        console.error('更新エラー:', err);
        alert('エラーが発生しました');
      });
  };

  const yearMinVal = yearMin ? parseInt(yearMin.slice(0, 4)) : null;
  const yearMaxVal = yearMax ? parseInt(yearMax.slice(0, 4)) : null;

  const normalizeMonthFormat = (date) => {
    if (!date) return '';
    const normalized = date.replace('.', '-');
    return /^\d{4}-\d{2}$/.test(normalized) ? normalized : '';
  };

  const sortBy = (key, dir) => (a, b) => {
    if (a[key] < b[key]) return dir === 'asc' ? -1 : 1;
    if (a[key] > b[key]) return dir === 'asc' ? 1 : -1;
    return 0;
  };

  const filteredBooks = bookData
    .filter(b =>
      (b.title || '').includes(filters.title) &&
      (b.author || '').includes(filters.author) &&
      (b.publisher || '').includes(filters.publisher) &&
      (b.shelf || '').includes(filters.shelf) &&
      (b.isbn || '').includes(filters.isbn) &&
      (!yearMinVal || parseInt((b.published_date || '').slice(0, 4)) >= yearMinVal) &&
      (!yearMaxVal || parseInt((b.published_date || '').slice(0, 4)) <= yearMaxVal) &&
      (!pagesMin || b.pages >= parseInt(pagesMin)) &&
      (!pagesMax || b.pages <= parseInt(pagesMax)) &&
      (!addedMin || b.added_at >= addedMin) &&
      (!addedMax || b.added_at <= addedMax)
    )
    .sort(sort.key ? sortBy(sort.key, sort.direction) : () => 0);

  const sanitizeDate = (date) => {
    return date && date !== '0000-00-00' ? date : '';
  };

  return (
    <div className="book-list">
      <h2>📖 書籍一覧</h2>

      <div className="filters">
        <input name="title" placeholder="タイトル" value={filters.title} onChange={handleChange} />
        <input name="author" placeholder="著者" value={filters.author} onChange={handleChange} />
        <input name="publisher" placeholder="出版社" value={filters.publisher} onChange={handleChange} />
        <input name="shelf" placeholder="棚" value={filters.shelf} onChange={handleChange} />
        <input name="isbn" placeholder="ISBN" value={filters.isbn} onChange={handleChange} />
      </div>

      <div className="range-group">
        <label>発行年：</label>
        <input type="month" value={yearMin} onChange={e => setYearMin(e.target.value)} /> ～ 
        <input type="month" value={yearMax} onChange={e => setYearMax(e.target.value)} />
      </div>

      <div className="range-group">
        <label>ページ数：</label>
        <input type="number" value={pagesMin} onChange={e => setPagesMin(e.target.value)} placeholder="最小" /> ～ 
        <input type="number" value={pagesMax} onChange={e => setPagesMax(e.target.value)} placeholder="最大" />
      </div>

      <div className="range-group">
        <label>登録日：</label>
        <input type="date" value={addedMin} onChange={e => setAddedMin(e.target.value)} /> ～ 
        <input type="date" value={addedMax} onChange={e => setAddedMax(e.target.value)} />
      </div>

      <div className="table-container">
        <div className="table-controls">
          <button className="edit-button" onClick={editMode ? saveEditedBooks : () => setEditMode(true)}>
            {editMode ? '✔ 編集完了' : '✎ 編集モード'}
          </button>
        </div>

        <table className="book-table">
          <thead>
            <tr>
              <th>タイトル</th>
              <th>著者</th>
              <th>出版社</th>
              <th>棚</th>
              <th onClick={() => toggleSort('published_date')}>
                発行年 <span className="sort-symbol">{renderSortSymbol('published_date')}</span>
              </th>
              <th>ISBN</th>
              <th onClick={() => toggleSort('pages')}>
                ページ数 <span className="sort-symbol">{renderSortSymbol('pages')}</span>
              </th>
              <th onClick={() => toggleSort('added_at')}>
                登録日 <span className="sort-symbol">{renderSortSymbol('added_at')}</span>
              </th>
              {editMode && <th>削除</th>}
            </tr>
          </thead>
          <tbody>
            {filteredBooks.map(b => (
              <tr key={b.id}>
                <td>{editMode ? <input value={b.title} onChange={e => handleEditChange(b.id, 'title', e.target.value)} /> : b.title}</td>
                <td>{editMode ? <input value={b.author} onChange={e => handleEditChange(b.id, 'author', e.target.value)} /> : b.author}</td>
                <td>{editMode ? <input value={b.publisher} onChange={e => handleEditChange(b.id, 'publisher', e.target.value)} /> : b.publisher}</td>
                <td>{editMode ? <input value={b.shelf} onChange={e => handleEditChange(b.id, 'shelf', e.target.value)} /> : b.shelf}</td>
                <td>{editMode
                  ? <input type="month" value={normalizeMonthFormat(b.published_date)} onChange={e => handleEditChange(b.id, 'published_date', e.target.value)} />
                  : normalizeMonthFormat(b.published_date)}
                </td>
                <td>{editMode ? <input value={b.isbn} onChange={e => handleEditChange(b.id, 'isbn', e.target.value)} /> : b.isbn}</td>
                <td>{editMode ? <input type="number" value={b.pages} onChange={e => handleEditChange(b.id, 'pages', e.target.value)} /> : b.pages}</td>
                <td>{editMode
                  ? <input type="date" value={sanitizeDate(b.added_at)} onChange={e => handleEditChange(b.id, 'added_at', e.target.value)} />
                  : sanitizeDate(b.added_at)}
                </td>
                {editMode && <td><button className="delete-button" onClick={() => handleDelete(b.id)}>🗑</button></td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default BookList;