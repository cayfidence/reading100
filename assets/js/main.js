// main.js - render books on the homepage
(async function(){
  const container = document.getElementById('books');
  const tpl = document.getElementById('book-card-tpl');

  try{
    const books = await Books.loadBooks();
    books.forEach(b => {
      const node = tpl.content.cloneNode(true);
      const a = node.querySelector('.book-card');
      const titleEl = node.querySelector('.book-title');
      titleEl.textContent = b.title;
      a.href = `reader.html?book=${encodeURIComponent(b.slug)}`;
      if(ReadingStore.isCompleted(b.slug)) a.classList.add('completed');
      a.setAttribute('data-slug', b.slug);
      a.setAttribute('aria-label', `${b.title}${ReadingStore.isCompleted(b.slug)?'（已完成）':''}`);
      container.appendChild(node);
    });
  }catch(err){
    container.innerHTML = `<p style="color:#b91c1c">加载书单失败：${err.message}</p>`;
  }
})();
