import React, { useState } from 'react'; 
import { musicData } from './data';
import './App.css';

// 零件範本 (印章)
function MusicCard({ title, img, link }) {
  const handlePlay = () => {
    // 原理：window.open(網址, 方式) 
    // '_blank' 代表在「新分頁」打開，這對使用者體驗最好，因為他們不會離開你的網站
    if (link) {
      const cleanLink = link.split('&')[0];
      window.open(link, '_blank');
    } else {
      alert("這首歌暫時沒有播放連結喔！");
    }
  };
  return (
    <div className="music-card">
      <div className="img-container" onClick={handlePlay}>
      <img src={img} className="album-art" alt={title} />
      {/* 這裡可以加一個播放小圖示的視覺提示 */}
        <div className="play-overlay">▶</div>
        </div>
      <h2>{title}</h2>
    </div>
  );
}

// 主程式 (工廠)
function App() {
  // 1. 定義狀態 (開關)
  const [activeGenre, setActiveGenre] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSidebarOpen,  setIsSidebarOpen] = useState(false);
 


  // 2. 資料清單 (原物料)
  const songs = [
    { title: "Push the feeling on", genre: "Electronic", desc: "近期最喜歡的一首歌", img: "push.jpg" },
    { title: "Drift", genre: "Lo-fi", desc: "從影音平台上的意外收穫", img: "drift.jpg" },
    { title: "Washing machine heart", genre: "Rock", desc: "這首歌節拍很強烈", img: "heart.jpg" },
    { title: "I want you", genre: "Classic", desc: "歷久不衰的金曲", img: "want.jpg" }
  ];

  // 3. 過濾邏輯 (篩選器)
       const filteredSongs = musicData.filter(song => {
    const isGenreMatch = activeGenre === 'All' || song.genre === activeGenre;
    const isSearchMatch = song.title.toLowerCase().includes(searchTerm.toLowerCase());
    return isGenreMatch && isSearchMatch;
  });
  return (
<div className="container">
  {/* 1. 背景遮罩 (Overlay) */}
      {/* 原理：條件渲染 (Conditional Rendering) */}
      {isSidebarOpen && (
        <div 
          className="overlay" 
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
  {/* 2. 側邊欄本體 */}
      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <button className="close-btn" onClick={() => setIsSidebarOpen(false)}>×</button>
        <nav className="sidebar-nav">
          <h3>個人選單</h3>
          <ul>
            {/* 原理：事件處理 (Event Handling) */}
            <li onClick={() => { setActiveGenre('All'); setIsSidebarOpen(false); }}>🏠所有音樂</li>
            <li onClick={() => { setActiveGenre('Electronic'); setIsSidebarOpen(false); }}>⚡電子音樂</li>
            <li onClick={() => { setActiveGenre('Rock'); setIsSidebarOpen(false); }}>
            🎸 搖滾專區
            </li>
          </ul>
        </nav>
      </div>
  <header className="main-header">
    <button className="menu-btn" onClick={() => setIsSidebarOpen(true)}>☰</button>
        <h1>My Music Collection</h1>
        <div className="search-container">
          <input 
            type="text" 
            placeholder="搜尋你想找的歌名..." 
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} // 關鍵：打字時同步更新狀態
          />
        </div>
      </header>

      <nav className="genre-filter">
        {['All', 'Electronic', 'Rock', 'Lo-fi', 'Classic'].map(g => (
          <span 
            key={g}
            className={`tag ${activeGenre === g ? 'active' : ''}`}
            onClick={() => setActiveGenre(g)}
          >
            {g}
          </span>
        ))}
      </nav>
      

      <div className="card-list">
        {filteredSongs.map((song, index) => (
          <MusicCard 
            key={song.id} 
            title={song.title}  
            img={song.img} 
            link={song.link}
          />
        ))}
      </div> {/* 這是對應 card-list 的關閉 */}
    </div>   /* 這是對應 container 的關閉 */
  );
} // 這是 App 函式的結束大括號

export default App;