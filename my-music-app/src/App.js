import React, { useState, useEffect, useRef } from 'react'; 
import YouTube from 'react-youtube';
import { musicData } from './data';
import './App.css';
// 零件範本 (印章)
function MusicCard({ title, img, link, artist,isFavorite, onToggleFavorite, onPlay }) {
  const handlePlay = () => {
    if (link) {
      onPlay(title);

      const cleanLink = link.split('&')[0];
      window.open(cleanLink, '_blank');
    } else {
      alert("這首歌暫時沒有播放連結喔！");
    }
  };

  return (
    <div className="music-card">
      <div className="img-container" onClick={handlePlay}>
        <img src={img} className="album-art" alt={title} />

        <button
      className={`fav-btn ${isFavorite ? 'active' : ''}`}
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        onToggleFavorite();
      }}
      >
        {isFavorite ? '❤️' : '🤍'}
      </button>
        <div className="play-overlay">▶</div>
      </div>
      <h2>{title}</h2>
      <p className="artist-name" style={{ color: 'white', fontSize: '20px' }}>{artist}</p>
    </div>
  );
}

// 主程式 (工廠)
function App() {
  // 2.在app內設定狀態
  //def every situation
  const [volume, setVolume] = useState(20); // 預設值 20
   const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('my-music-favorites');
    return saved ? JSON.parse(saved) : [];// 如果有存過就拿出來，沒有就給空陣列
  });
      const [currentTrackName, setCurrentTrackName] = useState("NCS - 背景音樂");
   const [activeGenre, setActiveGenre] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSidebarOpen,  setIsSidebarOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const playerRef = useRef(null);
  const handleVolumeChange = (e) => {
    const newVolume = e.target.value;
    setVolume(newVolume);
    if (playerRef.current) {
    playerRef.current.setVolume(newVolume);
  }
  };
      useEffect(() => {
    localStorage.setItem('my-music-favorites', JSON.stringify(favorites));
  }, [favorites]);
    const opts = {
    height: '0',
    width:'0',
    playerVars: {
      autoplay: 0,
      loop: 1,
    } };

const onReady = (event) => {
  if (event && event.target) {
    playerRef.current = event.target;
    
    // 使用 setTimeout 是為了繞過瀏覽器的初始載入限制
    setTimeout(() => {
      try {
        event.target.unMute();     // 先解除靜音
        event.target.setVolume(20); // 再設定音量
        console.log("音量已成功設定為 20");
      } catch (error) {
        // 如果瀏覽器還是擋住，至少程式不會崩潰
        console.log("音量自動設定受阻，請在頁面點擊任意處啟動控制");
      }
    }, 500);
  }
};
  const toggleMusic = () => {
    if (isPlaying) playerRef.current.pauseVideo();
  else playerRef.current.playVideo();
  setIsPlaying(!isPlaying);
};
  const toggleFavorite = (id) => {
      setFavorites((prev) =>
      prev.includes(id)
    ? prev.filter(favId => favId !== id)
    : [...prev, id]
  );};
      const filteredSongs = musicData.filter(song => {
         const isGenreMatch = activeGenre === 'All' || song.genre === activeGenre;
    const isSearchMatch = song.title.toLowerCase().includes(searchTerm.toLowerCase());
          if (activeGenre === 'Favorite') {
        return favorites.includes(song.id) && song.title.toLowerCase().includes(searchTerm.toLowerCase());
      }
    return isGenreMatch && isSearchMatch;
  });
  return (
  // 3. 過濾邏輯 (篩選器)

<div className="container">
        <YouTube videoId="kGW5XXYqXkY" opts={opts} onReady={onReady} />
      <button className="music-toggle" onClick={toggleMusic}>{isPlaying ? '⏸' : '▶'}</button>  
  {/* 2. 側邊欄本體 */}
      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <button className="close-btn" onClick={() => setIsSidebarOpen(false)}>×</button>
        <div className="now-playing-box" style={{ padding: '20px', borderBottom: '1px solid #444' }}>
    <h4 style={{ color: '#1DB954' }}>🎧 正在播放</h4>
    <p style={{ color: 'white', fontWeight: 'bold' }}>{currentTrackName}</p>
  </div>
        <nav className="sidebar-nav">
          <li onClick={() => { setActiveGenre('Favorite'); setIsSidebarOpen(false); }}>
            ❤️ 我的收藏 ({favorites.length})
          </li>
          <h3>個人選單</h3>
          <p>目前已收錄 {musicData.length} 首歌</p>
          <div className="volume-control" style={{ marginTop: '20px', padding: '10px', color: 'white' }}>
                      <span>🔈</span>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={volume} 
              onChange={handleVolumeChange} 
            />
            <span>{volume}%</span>
            </div>
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
        {['All', 'Favorite', 'Electronic', 'Rock', 'Lo-fi', 'Classic'].map(g => (
          <span 
            key={g}
            className={`tag ${activeGenre === g ? 'active' : ''}`}
            onClick={() => setActiveGenre(g)}
            >
            {g ==='Favorite' ? `❤️ 我的收藏 (${favorites.length})` : g}
          </span>
        ))}
      </nav>
      <div className="card-list">
        {filteredSongs.map((song, index) => (
          <MusicCard 
            key={song.id} 
            {...song}
            isFavorite={favorites.includes(song.id)}
            onToggleFavorite={() =>toggleFavorite(song.id)}
            onPlay={(name) => setCurrentTrackName(name)}
            title={song.title}  
            img={song.img} 
            link={song.link}
            artist={song.artist}
          />
        ))}
      </div> {/* 這是對應 card-list 的關閉 */}
      <footer className="footer">
        <hr className="footer-line" />
        <h3>聯絡我們</h3>
        <p>有想推薦的音樂嗎?歡迎來信:<a href="mailto:banhang666@gmail.com">banhang666@gmail.com</a></p>
        <div className="social-links">
          <a href="https://www.instagram.com/gbm_1004/" target="_blank" rel="noreferrer">Instagram</a>
        </div>
      </footer>
    </div>   /* 這是對應 container 的關閉 */
  );
}// 這是 App 函式的結束大括號

export default App;