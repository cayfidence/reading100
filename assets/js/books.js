// books.js - load the generated library list
(function(){
  async function loadBooks(){
    try {
      const res = await fetch('library/library.json', { cache: 'no-store' });
      if(!res.ok) throw new Error('status '+res.status);
      let items = await res.json();
      if (Array.isArray(items) && items.length) {
        return items.map(it => ({
          slug: it.slug || it.name?.replace(/\.[Pp][Dd][Ff]$/,'') || it.replace(/\.[Pp][Dd][Ff]$/,''),
          title: it.title || it.name || it,
          file: 'library/' + (it.file || it.name || it)
        }));
      }
    } catch(_) {}
    // Fallback to global list if present
    if (Array.isArray(window.__LIBRARY__)) {
      return window.__LIBRARY__.map(it => ({
        slug: it.slug || (it.name||'').replace(/\.[Pp][Dd][Ff]$/,''),
        title: it.title || it.name,
        file: 'library/' + (it.file || it.name)
      }));
    }
    throw new Error('ÎŞ·¨¼ÓÔØ library/library.json');
  }

  function slugify(name){
    return name.replace(/\.[Pp][Dd][Ff]$/,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
  }

  window.Books = { loadBooks, slugify };
})();
    // Sort by day number if present: ensure day100/day101 appear after day99
    (function(){
      const arr = Array.isArray(items) ? items : [];
      const withNum = arr.map(it => {
        const t = it.title || it.name || it;
        const m = /^day\s*(\d+)/i.exec(t);
        const num = m ? parseInt(m[1],10) : null;
        return { it, num };
      });
      withNum.sort((a,b)=>{
        if (a.num!=null && b.num!=null) return a.num-b.num;
        if (a.num!=null) return -1; if (b.num!=null) return 1; return 0;
      });
      items = withNum.map(x=>x.it);
    })();
