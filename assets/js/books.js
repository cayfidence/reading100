// books.js - load the generated library list
(function(){
  async function loadBooks(){
    try {
      const res = await fetch('library/library.json', { cache: 'no-store' });
      if(!res.ok) throw new Error('status '+res.status);
      const items = await res.json();
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
    throw new Error('Œﬁ∑®º”‘ÿ library/library.json');
  }

  function slugify(name){
    return name.replace(/\.[Pp][Dd][Ff]$/,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
  }

  window.Books = { loadBooks, slugify };
})();
