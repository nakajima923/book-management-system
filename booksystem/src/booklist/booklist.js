import React, { useState } from 'react';
import './booklist.css';

const bookDataInitial = [
  { id: 1, title: '吾輩は猫である', author: '夏目漱石', publisher: '青空文庫', year: 1905, isbn: '9781234567890', pages: 300, shelf: 'A-1', added: '2023-01-01' },
  { id: 2, title: '走れメロス', author: '太宰治', publisher: '文藝春秋', year: 1940, isbn: '9789876543210', pages: 150, shelf: 'B-3', added: '2023-02-01' },
  { id: 3, title: 'こころ', author: '夏目漱石', publisher: '新潮社', year: 1914, isbn: '9784567890123', pages: 280, shelf: 'A-2', added: '2023-03-01' },
  { id: 4, title: '人間失格', author: '太宰治', publisher: '角川文庫', year: 1948, isbn: '9781122334455', pages: 200, shelf: 'B-1', added: '2023-04-01' }
];

const sortBy = (key, dir) => (a, b) => {
  if (a[key] < b[key]) return dir === 'asc' ? -1 : 1;
  if (a[key] > b[key]) return dir === 'asc' ? 1 : -1;
  return 0;
};

function BookList() {
  const [bookData, setBookData] = useState(bookDataInitial);

  /* フィルター用ステート */
  const [filters, setFilters] = useState({ title: '', author: '', publisher: '', shelf: '', isbn: '' });
  const [yearMin, setYearMin] = useState('');
  const [yearMax, setYearMax] = useState('');
  const [pagesMin, setPagesMin] = useState('');
  const [pagesMax, setPagesMax] = useState('');
  const [addedMin, setAddedMin] = useState('');
  const [addedMax, setAddedMax] = useState('');

  /* 表示制御 */
  const [sort, setSort] = useState({ key: null, direction: 'asc' });
  const [editMode, setEditMode] = useState(false);

  /* テキスト入力フィルター */
  const handleChange = ({ target: { name, value } }) =>
    setFilters(prev => ({ ...prev, [name]: value }));

  /* ソート切替 */
  const toggleSort = (key) =>
    setSort(prev =>
      prev.key === key ? { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' } : { key, direction: 'asc' }
    );

  const renderSortSymbol = (key) =>
    sort.key !== key ? '⇅' : sort.direction === 'asc' ? '▲' : '▼';

  /* 編集／削除 */
  const handleEditChange = (id, field, value) =>
    setBookData(prev => prev.map(b => b.id === id ? { ...b, [field]: field === 'year' ? parseInt(value) : value } : b));

  const handleDelete = (id) =>
    setBookData(prev => prev.filter(b => b.id !== id));

  /* フィルタリング */
  const yearMinVal = yearMin ? parseInt(yearMin.slice(0, 4)) : null;
  const yearMaxVal = yearMax ? parseInt(yearMax.slice(0, 4)) : null;

  const filteredBooks = bookData
    .filter(b =>
      b.title.includes(filters.title) &&
      b.author.includes(filters.author) &&
      b.publisher.includes(filters.publisher) &&
      b.shelf.includes(filters.shelf) &&
      b.isbn.includes(filters.isbn) &&
      (!yearMinVal || b.year >= yearMinVal) &&
      (!yearMaxVal || b.year <= yearMaxVal) &&
      (!pagesMin || b.pages >= parseInt(pagesMin)) &&
      (!pagesMax || b.pages <= parseInt(pagesMax)) &&
      (!addedMin || b.added >= addedMin) &&
      (!addedMax || b.added <= addedMax)
    )
    .sort(sort.key ? sortBy(sort.key, sort.direction) : () => 0);

  return (
    <div className="book-list">
      <h2>📖 書籍一覧</h2>

      {/* ------ テキストフィルター ------ */}
      <div className="filters">
        <input name="title"     placeholder="タイトル"  value={filters.title}     onChange={handleChange} />
        <input name="author"    placeholder="著者"      value={filters.author}    onChange={handleChange} />
        <input name="publisher" placeholder="出版社"    value={filters.publisher} onChange={handleChange} />
        <input name="shelf"     placeholder="棚"        value={filters.shelf}     onChange={handleChange} />
        <input name="isbn"      placeholder="ISBN"      value={filters.isbn}      onChange={handleChange} />
      </div>

      {/* ------ 範囲フィルター ------ */}
      <div className="range-group">
        <label>発行年：</label>
        <input type="date" value={yearMin} onChange={e => setYearMin(e.target.value)} /> ～
        <input type="date" value={yearMax} onChange={e => setYearMax(e.target.value)} />
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

      {/* ------ テーブル ------ */}
      <div className="table-container">
        <div className="table-controls">
          <button className="edit-button" onClick={() => setEditMode(prev => !prev)}>
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
              <th onClick={() => toggleSort('year')}>
                発行年 <span className="sort-symbol">{renderSortSymbol('year')}</span>
              </th>
              <th>ISBN</th>
              <th onClick={() => toggleSort('pages')}>
                ページ数 <span className="sort-symbol">{renderSortSymbol('pages')}</span>
              </th>
              <th onClick={() => toggleSort('added')}>
                登録日 <span className="sort-symbol">{renderSortSymbol('added')}</span>
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
                <td>{editMode ? <input type="date" value={`${b.year}-01-01`} onChange={e => handleEditChange(b.id, 'year', parseInt(e.target.value.slice(0,4)))} /> : b.year}</td>
                <td>{editMode ? <input value={b.isbn} onChange={e => handleEditChange(b.id, 'isbn', e.target.value)} /> : b.isbn}</td>
                <td>{editMode ? <input type="number" value={b.pages} onChange={e => handleEditChange(b.id, 'pages', e.target.value)} /> : b.pages}</td>
                <td>{editMode ? <input type="date" value={b.added} onChange={e => handleEditChange(b.id, 'added', e.target.value)} /> : b.added}</td>
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
