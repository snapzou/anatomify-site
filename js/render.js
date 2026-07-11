const LANGS = {
    pt: 'Português',
    en: 'English',
    es: 'Español',
    fr: 'Français',
    it: 'Italiano',
    de: 'Deutsch',
  };
  
  const DOC_TYPE = document.body.dataset.doc;
  
  const UI = {
    pt: { privacy: 'Privacidade', terms: 'Termos', otherLang: 'Também disponível em:' },
    en: { privacy: 'Privacy',      terms: 'Terms',  otherLang: 'Also available in:'    },
    es: { privacy: 'Privacidad',   terms: 'Términos', otherLang: 'También disponible en:' },
    fr: { privacy: 'Confidentialité', terms: 'Conditions', otherLang: 'Aussi disponible en :' },
    it: { privacy: 'Privacy',      terms: 'Termini', otherLang: 'Disponibile anche in:' },
    de: { privacy: 'Datenschutz',  terms: 'Bedingungen', otherLang: 'Auch verfügbar in:' },
  };
  
  function detectLang() {
    const params = new URLSearchParams(location.search);
    const q = params.get('lang');
    if (q && LANGS[q]) return q;
    const nav = (navigator.language || 'pt').slice(0, 2);
    return LANGS[nav] ? nav : 'pt';
  }
  
  let currentLang = detectLang();
  
  async function render() {
    renderChrome();
    const path = `/docs/${DOC_TYPE}_${currentLang}.md`;
    try {
      const res = await fetch(path);
      if (!res.ok) throw new Error('Failed to load');
      const md = await res.text();
      document.getElementById('content').innerHTML = marked.parse(md);
      window.scrollTo(0, 0);
    } catch (e) {
      document.getElementById('content').innerHTML =
        `<p class="loading">Failed to load document. Please try again.</p>`;
    }
  }
  
  function renderChrome() {
    const switcher = document.getElementById('lang-switcher');
    switcher.innerHTML = '';
    Object.keys(LANGS).forEach(code => {
      const btn = document.createElement('button');
      btn.className = 'lang-btn' + (code === currentLang ? ' active' : '');
      btn.textContent = code.toUpperCase();
      btn.title = LANGS[code];
      btn.addEventListener('click', () => changeLang(code));
      switcher.appendChild(btn);
    });
  
    const t = UI[currentLang];
    const privacyTab = document.getElementById('tab-privacy');
    const termsTab = document.getElementById('tab-terms');
    privacyTab.textContent = t.privacy;
    termsTab.textContent = t.terms;
    privacyTab.href = `/privacy?lang=${currentLang}`;
    termsTab.href = `/terms?lang=${currentLang}`;
  }
  
  function changeLang(code) {
    currentLang = code;
    const url = new URL(location);
    url.searchParams.set('lang', code);
    history.replaceState(null, '', url);
    render();
  }
  
  render();