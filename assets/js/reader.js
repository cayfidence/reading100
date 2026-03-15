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

  // Drag to move the overlay window
  (function(){
    const content = document.querySelector('#answerOverlay .overlay-content');
    const handle = content?.querySelector('.drag-handle') || content;
    let startX=0, startY=0, startLeft=0, startTop=0, dragging=false;

    function clamp(v,min,max){ return Math.max(min, Math.min(max, v)); }

    function begin(clientX, clientY){
      const rect = content.getBoundingClientRect();
      // Switch to fixed coordinates (already fixed in CSS). Freeze current position.
      content.style.transform = 'none';
      content.style.left = rect.left + 'px';
      content.style.top = rect.top + 'px';
      startX = clientX; startY = clientY; startLeft = rect.left; startTop = rect.top; dragging = true;
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', end);
    }
    function onMove(e){
      if(!dragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      const maxL = window.innerWidth - content.offsetWidth - 8;
      const maxT = window.innerHeight - content.offsetHeight - 8;
      const left = clamp(startLeft + dx, 8, Math.max(8, maxL));
      const top  = clamp(startTop + dy, 8, Math.max(8, maxT));
      content.style.left = left + 'px';
      content.style.top  = top + 'px';
    }
    function end(){ dragging=false; document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseup', end); }

    handle.addEventListener('mousedown', (e)=>{ if(e.button===0) begin(e.clientX, e.clientY); });

    // Touch support
    handle.addEventListener('touchstart', (e)=>{ const t=e.touches[0]; begin(t.clientX, t.clientY); e.preventDefault(); }, {passive:false});
    handle.addEventListener('touchmove', (e)=>{ if(!dragging) return; const t=e.touches[0]; onMove({clientX:t.clientX, clientY:t.clientY}); e.preventDefault(); }, {passive:false});
    handle.addEventListener('touchend', end);
  })();
