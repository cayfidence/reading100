// main.js - render books on the homepage
(async function(){
  const container = document.getElementById("books");
  try{
    const books = await Books.loadBooks();
    container.innerHTML = '';
    for (const b of books){
      const a = document.createElement('a');
      a.className = 'book-card';
      a.href = `reader.html?book=${encodeURIComponent(b.slug)}`;
      a.innerHTML = '<div class="book-spine"></div><div class="book-cover"><span class="book-title"></span></div>';
      a.querySelector('.book-title').textContent = b.title;
      if (ReadingStore.isCompleted(b.slug)) a.classList.add('completed');
      a.setAttribute('data-slug', b.slug);
      a.setAttribute('aria-label', `${b.title}${ReadingStore.isCompleted(b.slug)?'（已完成）':''}`);
      container.appendChild(a);
    }
  }catch(err){
    container.innerHTML = `<p style="color:#b91c1c">加载书单失败：${err.message}</p>`;
  }
})();
