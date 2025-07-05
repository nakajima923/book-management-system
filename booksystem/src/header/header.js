import React from 'react';
import './header.css';

function Header() {
  return (
    <header className="header">
      <div className="header-left">
        <h1 className="site-title">📚 書籍管理システム</h1>
      </div>

      <div className="header-center">
        <input
          type="text"
          placeholder="ISBN または 書名で検索"
          className="search-input"
        />
        <button className="search-button">検索</button>
      </div>

      <div className="header-right">
        <a href="/books" className="nav-link">一覧表示</a>
        <a href="/register" className="nav-link">登録</a>
      </div>
    </header>
  );
}

export default Header;
