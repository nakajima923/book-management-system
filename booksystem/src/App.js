import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './header/header.js';
import BookList from './booklist/booklist';
import RegisterByISBN from './registerISBN/RegisterByISBN.js';

function App() {
  return (
    <Router>
      <Header />
      <main>
        <Routes>
          {/* デフォルトルートにリダイレクトを追加 */}
          <Route path="/" element={<Navigate to="/books" />} />
          <Route path="/books" element={<BookList />} />
          <Route path="/register" element={<RegisterByISBN />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
