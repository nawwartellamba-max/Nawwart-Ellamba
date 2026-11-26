(function () {
  var DL = [];
  var st = document.createElement('style');
  st.textContent = '.dlbox{margin:12px 0;display:flex;flex-direction:column;gap:8px}.dlbtn{display:flex;align-items:center;gap:10px;min-height:52px;padding:8px 16px;border-radius:26px;background:#14b3a2;color:#fff;font-weight:800;text-decoration:none;box-shadow:0 4px 0 #0e8a7d;line-height:1.4}.dlbtn:active{transform:translateY(2px)}.dlbtn svg{flex:none;width:26px;height:26px}';
  document.head.appendChild(st);
  function clean(f) { f = String(f || '').replace(/^\/+/, ''); return /%/.test(f) ? f : encodeURI(f); }
  function inject() {
    var old = document.querySelector('.dlbox'); if (old) old.remove();
    if (!/^c\d+-\d+$/.test(view)) return;
    var items = DL.filter(function (x) { return x && x.lesson === view && x.file; });
    var tabs = document.querySelector('main .tabs');
    if (!items.length || !tabs) return;
    var box = document.createElement('div'); box.className = 'dlbox';
    items.forEach(function (x) {
      var a = document.createElement('a'); a.className = 'dlbtn'; a.href = clean(x.file); a.setAttribute('download', '');
      a.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12M7 10l5 5 5-5M5 20h14"/></svg>';
      var s = document.createElement('span'); s.textContent = (lang === 'ar' ? 'تحميل' : 'Download') + (x.title ? ': ' + x.title : ''); a.appendChild(s); box.appendChild(a);
    });
    tabs.insertAdjacentElement('afterend', box);
  }
  var orig = render;
  render = function () { orig.apply(this, arguments); inject(); };
  try {
    fetch('downloads.json?v=' + Date.now()).then(function (r) { return r.ok ? r.json() : []; }).then(function (j) { if (Array.isArray(j)) { DL = j; inject(); } }).catch(function () {});
  } catch (e) {}
  inject();
})();
(function () {
  var ev = null, box = null;
  function hide() { if (box) { box.remove(); box = null; } }
  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault(); ev = e; hide();
    box = document.createElement('button'); box.type = 'button'; box.className = 'pwa-install';
    box.style.cssText = 'position:fixed;inset-inline:16px;bottom:14px;z-index:50;min-height:52px;border:0;border-radius:26px;background:#f08a24;color:#fff;font:inherit;font-weight:800;font-size:17px;box-shadow:0 4px 0 #c46a10,0 6px 18px rgba(0,0,0,.25);cursor:pointer';
    box.textContent = '\u062b\u0628\u0651\u062a\u064a \u0643\u062a\u0637\u0628\u064a\u0642 \u2022 Install app';
    box.addEventListener('click', function () { var p = ev; ev = null; hide(); if (p) p.prompt(); });
    document.body.appendChild(box);
  });
  window.addEventListener('appinstalled', hide);
})();
