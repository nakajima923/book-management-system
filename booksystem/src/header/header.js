import React from 'react';
import { Link } from 'react-router-dom';
import './header.css';

function Header() {
  return (
    <header className="header">
      <div className="header-left">
        <h1 className="site-title">書籍管理システム</h1>
      </div>

      <div className="header-right">
        <Link to="/books" className="nav-link">一覧表示</Link>
        <Link to="/register" className="nav-link">登録</Link>
      </div>
    </header>
  );
}

export default Header;
