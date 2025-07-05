import React, { useState } from 'react';
import './booklist.css';

const bookData = [
  { id: 1, title: '吾輩は猫である', author: '夏目漱石', publisher: '青空文庫', year: 1905, isbn: '9781234567890', pages: 300, shelf: 'A-1', added: '2023-01-01' },
  { id: 2, title: '走れメロス', author: '太宰治', publisher: '文藝春秋', year: 1940, isbn: '9789876543210', pages: 150, shelf: 'B-3', added: '2023-04-15' },
  { id: 3, title: 'こころ', author: '夏目漱石', publisher: '新潮社', year: 1914, isbn: '9784567890123', pages: 280, shelf: 'A-2', added: '2023-02-28' },
  { id: 4, title: '人間失格', author: '太宰治', publisher: '角川文庫', year: 1948, isbn: '9781122334455', pages: 200, shelf: 'B-1', added: '2023-05-10' }
];

const sortBy = (key, dir) => (a, b) => {
  if (a[key] < b[key]) return dir === 'asc' ? -1 : 1;
  if (a[key] > b[key]) return dir === 'asc' ? 1 : -1;
  return 0;
};

function BookList() {
  const [filters, setFilters] = useState({ title: '', author: '', publisher: '', shelf: '', isbn: '' });
  const [yearMin, setYearMin] = useState('');
  const [yearMax, setYearMax] = useState('');
  const [pagesMin, setPagesMin] = useState('');
  const [pagesMax, setPagesMax] = useState('');
  const [addedMin, setAddedMin] = useState('');
  const [addedMax, setAddedMax] = useState('');
  const [sort, setSort] = useState({ key: null, direction: 'asc' });

  const handleChange = ({ target: { name, value } }) => setFilters(prev => ({ ...prev, [name]: value }));

  const toggleSort = (key) => {
    setSort(prev => prev.key === key ? { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' } : { key, direction: 'asc' });
  };

  const renderSortSymbol = (key) => {
    if (sort.key !== key) return '⇅';
    return sort.direction === 'asc' ? '▲' : '▼';
  };

  const filteredBooks = bookData.filter(b => {
    const year = b.year;
    const pages = b.pages;
    const yearMinVal = yearMin ? parseInt(yearMin.slice(0, 4)) : null;
    const yearMaxVal = yearMax ? parseInt(yearMax.slice(0, 4)) : null;
    const pagesMinVal = pagesMin ? parseInt(pagesMin) : null;
    const pagesMaxVal = pagesMax ? parseInt(pagesMax) : null;

    return (
      b.title.includes(filters.title) &&
      b.author.includes(filters.author) &&
      b.publisher.includes(filters.publisher) &&
      b.shelf.includes(filters.shelf) &&
      b.isbn.includes(filters.isbn) &&
      (!yearMinVal || year >= yearMinVal) &&
      (!yearMaxVal || year <= yearMaxVal) &&
      (!pagesMinVal || pages >= pagesMinVal) &&
      (!pagesMaxVal || pages <= pagesMaxVal) &&
      (!addedMin || b.added >= addedMin) &&
      (!addedMax || b.added <= addedMax)
    );
  }).sort(sort.key ? sortBy(sort.key, sort.direction) : () => 0);

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
        <input type="date" value={yearMin} onChange={(e) => setYearMin(e.target.value)} />
        <span>〜</span>
        <input type="date" value={yearMax} onChange={(e) => setYearMax(e.target.value)} />
      </div>

      <div className="range-group">
        <label>ページ数：</label>
        <input type="number" placeholder="最小" value={pagesMin} onChange={(e) => setPagesMin(e.target.value)} />
        <span>〜</span>
        <input type="number" placeholder="最大" value={pagesMax} onChange={(e) => setPagesMax(e.target.value)} />
      </div>

      <div className="range-group">
        <label>登録日：</label>
        <input type="date" value={addedMin} onChange={(e) => setAddedMin(e.target.value)} />
        <span>〜</span>
        <input type="date" value={addedMax} onChange={(e) => setAddedMax(e.target.value)} />
      </div>

      <table>
        <thead>
          <tr>
            <th>タイトル</th>
            <th>著者</th>
            <th>出版社</th>
            <th>棚</th>
            <th onClick={() => toggleSort('year')}>発行年 <span className="sort-symbol">{renderSortSymbol('year')}</span></th>
            <th>ISBN</th>
            <th onClick={() => toggleSort('pages')}>ページ数 <span className="sort-symbol">{renderSortSymbol('pages')}</span></th>
            <th onClick={() => toggleSort('added')}>登録日 <span className="sort-symbol">{renderSortSymbol('added')}</span></th>
          </tr>
        </thead>
        <tbody>
          {filteredBooks.map(b => (
            <tr key={b.id}>
              <td>{b.title}</td>
              <td>{b.author}</td>
              <td>{b.publisher}</td>
              <td>{b.shelf}</td>
              <td>{b.year}</td>
              <td>{b.isbn}</td>
              <td>{b.pages}</td>
              <td>{b.added}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BookList;
