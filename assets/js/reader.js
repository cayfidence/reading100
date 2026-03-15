// reader.js - load the selected book, handle answers overlay
(function(){
  const params = new URLSearchParams(location.search);
  const slug = params.get('book');
  const titleEl = document.getElementById('readerTitle');
  const frame = document.getElementById('pdfFrame');
  const finishBtn = document.getElementById('finishBtn');
  const overlay = document.getElementById('answerOverlay');
  const cancelBtn = document.getElementById('cancelOverlay');
  const form = document.getElementById('answerForm');

  if(!slug){
    titleEl.textContent = '未指定书籍';
    finishBtn.disabled = true;
    return;
  }

  // Load book metadata
  Books.loadBooks().then(list => {
    const book = list.find(b => b.slug === slug);
    if(!book){
      titleEl.textContent = '未找到指定书籍';
      finishBtn.disabled = true;
      return;
    }
    titleEl.textContent = book.title;
    frame.src = book.file;

    // preload answers if any
    const saved = ReadingStore.getAnswers(slug);
    if(saved?.answers){
      for(const [k,v] of Object.entries(saved.answers)){
        const el = form.querySelector(`[name="${k}"]`);
        if(el) el.value = v;
      }
    }
  }).catch(() => {
    titleEl.textContent = '加载书单失败';
  });

  function openOverlay(){ overlay.classList.remove('hidden'); overlay.setAttribute('aria-hidden','false'); }
  function closeOverlay(){ overlay.classList.add('hidden'); overlay.setAttribute('aria-hidden','true'); }

  finishBtn.addEventListener('click', openOverlay);
  cancelBtn.addEventListener('click', closeOverlay);

  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    ReadingStore.saveAnswers(slug, data);
    closeOverlay();
    // Visual confirmation
    finishBtn.textContent = '已完成 ✅';
    // Optional: navigate back after short delay
    setTimeout(()=>{
      if(document.referrer && new URL(document.referrer).pathname.endsWith('/reader.html')){
        // avoid loop
        location.href = './';
      } else {
        history.back();
      }
    }, 600);
  });
})();
