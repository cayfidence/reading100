// storage.js - localStorage helpers
(function(){
  const NS = 'reading100';

  function keyFor(slug){ return `${NS}:answers:${slug}`; }
  function completeKey(slug){ return `${NS}:completed:${slug}`; }

  function saveAnswers(slug, answers){
    const data = { slug, answers, savedAt: new Date().toISOString() };
    localStorage.setItem(keyFor(slug), JSON.stringify(data));
    localStorage.setItem(completeKey(slug), '1');
  }

  function getAnswers(slug){
    const raw = localStorage.getItem(keyFor(slug));
    if(!raw) return null;
    try { return JSON.parse(raw); } catch { return null; }
  }

  function isCompleted(slug){ return localStorage.getItem(completeKey(slug)) === '1'; }

  function setCompleted(slug, done=true){
    if(done) localStorage.setItem(completeKey(slug),'1'); else localStorage.removeItem(completeKey(slug));
  }

  window.ReadingStore = { saveAnswers, getAnswers, isCompleted, setCompleted };
})();
