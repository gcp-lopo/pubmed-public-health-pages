// assets/js/main.js
document.addEventListener('DOMContentLoaded', function() {
  // 页面加载完成后执行的代码
  console.log('PubMed公共卫生动态网站已加载');
  
  // 调试: 记录所有导航链接和文章ID
  const navLinks = document.querySelectorAll('.nav-item a');
  const articles = document.querySelectorAll('.news-item');
  
  console.log('导航链接数量:', navLinks.length);
  console.log('文章数量:', articles.length);
  
  // 添加搜索按钮功能
  const searchTrigger = document.querySelector('.search-trigger');
  if (searchTrigger) {
    searchTrigger.addEventListener('click', function() {
      // 创建搜索覆盖层
      const searchOverlay = document.createElement('div');
      searchOverlay.className = 'search-overlay';
      searchOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
      `;
      
      // 搜索框HTML
      searchOverlay.innerHTML = `
        <div class="search-container" style="width: 80%; max-width: 600px;">
          <input type="text" placeholder="输入关键词搜索..." class="search-input" style="
            width: 100%;
            padding: 15px;
            font-size: 18px;
            border: none;
            border-radius: 4px;
            margin-bottom: 10px;
          ">
          <div class="search-buttons" style="display: flex; gap: 10px; justify-content: flex-end;">
            <button class="search-close" style="
              padding: 8px 15px;
              border: none;
              border-radius: 4px;
              background: #666;
              color: white;
              cursor: pointer;
            ">关闭</button>
            <button class="search-submit" style="
              padding: 8px 15px;
              border: none;
              border-radius: 4px;
              background: #3498db;
              color: white;
              cursor: pointer;
            ">当前页</button>
            <button class="search-global" style="
              padding: 8px 15px;
              border: none;
              border-radius: 4px;
              background: #1dd1a1;
              color: white;
              cursor: pointer;
              font-weight:700;box-shadow:0 0 8px #1dd1a1cc;
            ">全站</button>
          </div>
        </div>
      `;
      
      // 添加到页面
      document.body.appendChild(searchOverlay);
      
      // 关闭按钮事件
      searchOverlay.querySelector('.search-close').addEventListener('click', function() {
        document.body.removeChild(searchOverlay);
      });
      
      // 当前页搜索
      searchOverlay.querySelector('.search-submit').addEventListener('click', function() {
        const keyword = searchOverlay.querySelector('.search-input').value.trim().toLowerCase();
        document.body.removeChild(searchOverlay);
        if (!keyword) return;
        // 过滤首页/归档页文章
        let found = false;
        // 首页或归档列表页
        const newsItems = document.querySelectorAll('.news-item');
        if (newsItems.length > 0) {
          newsItems.forEach(item => {
            const text = item.textContent.toLowerCase();
            if (text.includes(keyword)) {
              item.style.display = '';
              found = true;
            } else {
              item.style.display = 'none';
            }
          });
        } else {
          // 详情页（每日归档）
          const articleBlocks = document.querySelectorAll('.single-article h2');
          let anyMatch = false;
          articleBlocks.forEach(h2 => {
            const block = h2.closest('section, div, article') || h2;
            if (h2.textContent.toLowerCase().includes(keyword)) {
              block.style.display = '';
              anyMatch = true;
            } else {
              block.style.display = 'none';
            }
          });
          found = anyMatch;
        }
        if (!found) {
          // 显示未找到提示
          let noti = document.createElement('div');
          noti.textContent = window.SEARCH_NOT_FOUND;
          noti.style.cssText = 'color:#fff;background:#e74c3c;padding:1rem 2rem;position:fixed;top:80px;left:50%;transform:translateX(-50%);z-index:2000;border-radius:8px;font-size:1.2rem;box-shadow:0 2px 12px rgba(0,0,0,0.2);';
          document.body.appendChild(noti);
          setTimeout(()=>{noti.remove();}, 2000);
        }
      });
      
      // 全站搜索
      searchOverlay.querySelector('.search-global').addEventListener('click', function() {
        const keyword = searchOverlay.querySelector('.search-input').value.trim();
        document.body.removeChild(searchOverlay);
        if (!keyword) return;
        showGlobalSearchResults(keyword);
      });
    });
  }
  
  // 创建详细调试信息区域
  const debugDiv = document.createElement('div');
  debugDiv.style.cssText = 'margin: 20px; padding: 15px; background: #f5f5f5; border-radius: 8px;';
  let debugHTML = '<h3>导航链接匹配详情</h3>';
  debugHTML += `<p>共 ${navLinks.length} 个链接，匹配成功 ${matchCount} 个</p>`;
  debugHTML += '<ul style="list-style: none; padding: 0;">';

  navLinks.forEach((link, index) => {
        const href = link.getAttribute('href');
        const articleId = href.substring(1); // 移除#
        const articleElement = document.getElementById(articleId);
        const isMatch = articleElement !== null;
        const position = isMatch ? articleElement.offsetTop : 'N/A';

        // 添加列表项，不匹配项标红
        debugHTML += `<li style="padding: 8px; margin: 4px 0; border-left: 4px solid ${isMatch ? 'green' : 'red'};">`;
        debugHTML += `<strong>链接 ${index + 1}:</strong> href="${href}" → `;
        debugHTML += isMatch ? `<span style="color: green;">匹配成功 (ID: ${articleId}, 位置: ${position}px)</span>` : `<span style="color: red;">匹配失败 (未找到ID: ${articleId})</span>`;
        debugHTML += '</li>';
        console.log(`链接 ${index + 1}: href="${href}", 文章ID: "${articleId}", 存在: ${isMatch}, 位置: ${position}px`);
    });

  debugHTML += '</ul>';

    // 添加页面中所有文章ID的列表
    const articleElements = document.querySelectorAll('[id^="article-"]');
    debugHTML += '<div style="margin-top: 20px;"><h4>页面中的文章ID:</h4>';
    if (articleElements.length === 0) {
        debugHTML += '<p style="color: red;">未找到任何文章元素</p>';
    } else {
        debugHTML += '<ul>';
        articleElements.forEach(el => {
            debugHTML += `<li>${el.id}</li>`;
        });
        debugHTML += '</ul>';
    }
    debugHTML += '</div>';

    debugDiv.innerHTML = debugHTML;
    document.body.appendChild(debugDiv);
  
  // 添加文章数据加载状态检查
    debugHTML += '<div style="margin-top: 20px;"><h4>文章数据加载状态:</h4>';
    if (typeof articles === 'undefined' || articles.length === 0) {
        debugHTML += '<p style="color: red;">未加载到文章数据或数据为空</p>';
    } else {
        debugHTML += `<p>成功加载 ${articles.length} 篇文章数据</p>`;
        debugHTML += '<ul>';
        articles.forEach((article, index) => {
            debugHTML += `<li>文章 ${index + 1}: ID="${article.id}"</li>`;
        });
        debugHTML += '</ul>';
    }
    debugHTML += '</div>';

    // 调试: 记录所有文章ID
  const allArticles = document.querySelectorAll('.news-item');
  console.log('所有文章元素数量:', allArticles.length);
    console.log('文章元素ID列表:');
    allArticles.forEach(el => console.log(el.id));
  allArticles.forEach(article => {
    console.log('文章ID:', article.id);
  });
  
  // 高亮当前导航项
  function highlightNavItem() {
    const scrollPosition = window.scrollY;
    const newsItems = document.querySelectorAll('.news-item');
    const navItems = document.querySelectorAll('.nav-item');
    
    newsItems.forEach((item, index) => {
      const itemTop = item.offsetTop - 100;
      const itemBottom = itemTop + item.offsetHeight;
      
      if (scrollPosition >= itemTop && scrollPosition < itemBottom) {
        navItems.forEach(navItem => navItem.classList.remove('active'));
        navItems[index].classList.add('active');
      }
    });
  }
  
  // 监听滚动事件
  window.addEventListener('scroll', highlightNavItem);
  
  // 初始化高亮
  highlightNavItem();

  // ========== 中英文切换 ==========
  function setLang(lang) {
    localStorage.setItem('lang', lang);
    // 切换导航栏
    const archiveLink = document.querySelector('.nav-link[href*="/archives/"] .article-title, .nav-link[href*="/archives/"]');
    if (archiveLink) archiveLink.innerHTML = lang === 'en' ? '<i class="fas fa-archive"></i>Archive' : '<i class="fas fa-archive"></i>历史摘要';
    // 切换返回主页
    const backHome = document.querySelector('.nav-link.back-home');
    if (backHome) backHome.innerHTML = lang === 'en' ? '<i class="fas fa-home"></i> Home' : '<i class="fas fa-home"></i> 返回主页';
    // 切换搜索按钮 placeholder
    const searchInputs = document.querySelectorAll('.search-input');
    searchInputs.forEach(input => input.placeholder = lang === 'en' ? 'Enter keyword...' : '输入关键词搜索...');
    // 切换搜索弹窗按钮
    document.querySelectorAll('.search-submit').forEach(btn => btn.textContent = lang === 'en' ? 'Current Page' : '当前页');
    document.querySelectorAll('.search-global').forEach(btn => btn.textContent = lang === 'en' ? 'Global' : '全站');
    document.querySelectorAll('.search-close').forEach(btn => btn.textContent = lang === 'en' ? 'Close' : '关闭');
    // 切换弹窗未找到提示
    window.SEARCH_NOT_FOUND = lang === 'en' ? 'No results found' : '未找到相关内容';
    // 切换语言按钮文本
    const langBtn = document.querySelector('.lang-switch');
    if (langBtn) langBtn.textContent = lang === 'en' ? '中/EN' : 'EN/中';
  }

  function toggleLang() {
    const current = localStorage.getItem('lang') || 'zh';
    setLang(current === 'zh' ? 'en' : 'zh');
  }

  // 语言切换按钮事件
  const langBtn = document.querySelector('.lang-switch');
  if (langBtn) {
    langBtn.addEventListener('click', toggleLang);
    // 页面加载时自动切换
    setLang(localStorage.getItem('lang') || 'zh');
  }
});

// ========== 全站关键词搜索 ==========
function showGlobalSearchResults(keyword) {
  // 1. 读取 window.allArticles，如果没有则 fetch
  function renderResults(articles) {
    const overlay = document.createElement('div');
    overlay.className = 'search-global-overlay';
    overlay.style.cssText = `
      position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 2000;
      background: rgba(10,18,32,0.98); overflow-y: auto; display: flex; flex-direction: column; align-items: center; padding: 3rem 0;`;
    const closeBtn = document.createElement('button');
    closeBtn.textContent = '关闭';
    closeBtn.className = 'glow-btn';
    closeBtn.style.cssText = 'position:fixed;top:2.2rem;right:3.5rem;z-index:2100;font-size:1.1rem;';
    closeBtn.onclick = () => overlay.remove();
    overlay.appendChild(closeBtn);
    const title = document.createElement('h2');
    title.textContent = `"${keyword}" 的全站搜索结果 (${articles.length} 条)`;
    title.style.cssText = 'color:#1dd1a1;margin-bottom:2rem;text-shadow:0 0 12px #3498db88;font-size:1.5rem;';
    overlay.appendChild(title);
    if (articles.length === 0) {
      const empty = document.createElement('div');
      empty.textContent = '未找到相关内容';
      empty.style.cssText = 'color:#fff;background:#e74c3c;padding:1.5rem 2.5rem;border-radius:10px;font-size:1.2rem;box-shadow:0 2px 12px #0003;';
      overlay.appendChild(empty);
    } else {
      articles.forEach(article => {
        const card = document.createElement('div');
        card.className = 'content-card bg-glass section-fadein';
        card.style.cssText = 'max-width:700px;margin-bottom:2.2rem;box-shadow:0 4px 24px #3498db22;';
        card.innerHTML = `
          <h3 style="margin-bottom:0.7rem;"><a href="${article.link}" target="_blank" style="color:#3498db;text-decoration:underline;">${article.title}</a></h3>
          <div style="color:#7f8c8d;font-size:0.98rem;margin-bottom:0.5rem;">${article.journal} | ${article.pubDate}</div>
          <div style="color:#e2e8f0;font-size:1.05rem;line-height:1.7;">${article.abstract ? article.abstract.replace(new RegExp(keyword,'gi'), m=>`<mark style='background:#1dd1a1;color:#222;border-radius:3px;'>${m}</mark>`) : ''}</div>
          <div style="margin-top:0.7rem;text-align:right;"><a href="${article.link}" target="_blank" class="glow-btn" style="font-size:0.98rem;">阅读全文 <i class="fas fa-external-link-alt"></i></a></div>
        `;
        overlay.appendChild(card);
      });
    }
    document.body.appendChild(overlay);
  }
  if (window.allArticles) {
    const keywordLower = keyword.toLowerCase();
    const results = window.allArticles.filter(a =>
      (a.title && a.title.toLowerCase().includes(keywordLower)) ||
      (a.abstract && a.abstract.toLowerCase().includes(keywordLower)) ||
      (a.journal && a.journal.toLowerCase().includes(keywordLower))
    );
    renderResults(results);
  } else {
    fetch('/_data/articles.json').then(r=>r.json()).then(data=>{
      window.allArticles = data.articles || [];
      const keywordLower = keyword.toLowerCase();
      const results = window.allArticles.filter(a =>
        (a.title && a.title.toLowerCase().includes(keywordLower)) ||
        (a.abstract && a.abstract.toLowerCase().includes(keywordLower)) ||
        (a.journal && a.journal.toLowerCase().includes(keywordLower))
      );
      renderResults(results);
    });
  }
}
