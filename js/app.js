(() => {
  const data = window.portfolioData || portfolioData;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (v = '') => String(v).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));

  const logos = {
  LinkedIn: {src:'assets/linkedin-logo.png', wide:false},
  GitHub: {src:'assets/github-logo.png', wide:true},
  ORCID: {src:'assets/orcid-logo.png', wide:true},
  'Google Scholar': {src:'assets/scholar-logo.png', wide:true},
  ResearchGate: {src:'assets/researchgate-logo.png', wide:false},
  Phone: {text:'CALL', wide:false},
  WhatsApp: {text:'WA', wide:false}
};

  const linkDescriptor = name => ({
  LinkedIn:'Professional profile',
  GitHub:'Code portfolio',
  ORCID:'Research identity',
  'Google Scholar':'Academic profile',
  ResearchGate:'Research network',
  Phone:'Direct call',
  WhatsApp:'Message me'
}[name] || 'Profile');
  
  const icons = {
    skill: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2 4 6.2v11.6L12 22l8-4.2V6.2L12 2Zm0 2.25 5.9 3.1L12 10.45 6.1 7.35 12 4.25Zm-6 5L11 12v7.2l-5-2.62V9.25Zm7 9.95V12l5-2.75v7.33l-5 2.62Z"/></svg>',
    cert: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a7 7 0 0 0-4 12.74V22l4-2 4 2v-7.26A7 7 0 0 0 12 2Zm0 2a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm-2 12.7c.63.2 1.3.3 2 .3s1.37-.1 2-.3v2.06l-2-1-2 1V16.7Z"/></svg>'
  };

  const state = { query: '', category: 'All', archiveOpen: false };

  function renderProfile() {
    $('#heroSummary').textContent = data.profile.summary;
    $('#emailAction').href = `mailto:${data.profile.email}`;
    const linkOrder = ['LinkedIn', 'GitHub', 'ORCID', 'Google Scholar', 'ResearchGate', 'Phone', 'WhatsApp'];
    $('#profileLinks').innerHTML = linkOrder.map(name => {
      const url = data.profile.links[name];
      if (!url) return '';
      const logo = logos[name];
      return `<a class="profile-link" href="${esc(url)}" target="_blank" rel="noreferrer" aria-label="${esc(name)}">
        <span class="logo-box${logo.wide ? ' word' : ''}"><img src="${logo.src}" alt="${esc(name)} logo" loading="lazy"></span>
        <span><strong>${esc(name)}</strong><span>${esc(linkDescriptor(name))}</span></span>
      </a>`;
    }).join('');
    $('#footerLinks').innerHTML = linkOrder.slice(0,4).map(k => `<a href="${esc(data.profile.links[k])}" target="_blank" rel="noreferrer">${esc(k)}</a>`).join('');
    $('#stats').innerHTML = data.profile.metrics.map(m => `<article class="metric-card"><strong>${esc(m.value)}</strong><span>${esc(m.label)}</span></article>`).join('');
  }

  function renderSkills() {
    const order = ['Programming', 'AI & Machine Learning', 'Computer Vision & NLP', 'Statistics & Data Science', 'Libraries & Tools', 'Backend & Databases'];
    $('#skillsList').innerHTML = order.filter(k => data.skills[k]).map(group => `<article class="skill-card reveal"><h3>${icons.skill}${esc(group)}</h3><div class="tags">${data.skills[group].map(s => `<span class="tag">${esc(s)}</span>`).join('')}</div></article>`).join('');
  }

  function renderEducation() {
    const e = data.education;
    $('#educationCard').innerHTML = `<div class="education-top"><div class="edu-title"><img src="assets/academy-logo.png" alt="AASTMT logo" loading="lazy"><div><h3>${esc(e.school)}</h3><p>${esc(e.degree)}</p></div></div><span class="edu-meta">${esc(e.location)} · ${esc(e.period)}</span></div><div class="highlight-grid">${e.highlights.map(h => `<span class="highlight">${esc(h)}</span>`).join('')}</div>`;
  }

  const projectCard = (p, index) => `<article class="project-card reveal" style="--i:${index}"><div class="card-meta"><span>${esc(p.category)}</span><span>${esc(p.date)}</span></div><h3><a href="${esc(p.url)}" target="_blank" rel="noreferrer">${esc(p.title)}</a></h3><p>${esc(p.summary)}</p><div class="impact-row">${(p.impact || []).slice(0,3).map(i => `<span class="impact">${esc(i)}</span>`).join('')}</div><div class="tags">${(p.stack || []).slice(0,5).map(t => `<span class="tag">${esc(t)}</span>`).join('')}</div><a class="project-link" href="${esc(p.url)}" target="_blank" rel="noreferrer">Open repository →</a></article>`;

  const archiveItem = p => `<a class="archive-item" href="${esc(p.url)}" target="_blank" rel="noreferrer"><strong>${esc(p.title)}</strong><span>${esc(p.category || 'Project')} · ${(p.stack || []).slice(0,3).map(esc).join(', ')}</span></a>`;

  function allArchiveProjects() {
    const featured = new Set(data.projects.filter(p => p.featured).map(p => p.title.toLowerCase().trim()));
    const merged = [...data.projects.filter(p => !p.featured), ...(data.otherRepos || [])];
    const seen = new Set();
    return merged.filter(p => {
      const key = (p.title || '').toLowerCase().trim();
      if (!key || featured.has(key) || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  function renderProjects() {
    $('#featuredProjects').innerHTML = data.projects.filter(p => p.featured).slice(0,3).map(projectCard).join('');
    const categories = ['All', ...new Set(allArchiveProjects().map(p => p.category).filter(Boolean))].slice(0,9);
    $('#filterRow').innerHTML = categories.map(c => `<button class="filter-btn${c === state.category ? ' active' : ''}" data-category="${esc(c)}" type="button">${esc(c)}</button>`).join('');
    renderArchive();
  }

  function renderArchive() {
    const q = state.query.toLowerCase().trim();
    const items = allArchiveProjects().filter(p => {
      const okCat = state.category === 'All' || p.category === state.category;
      const hay = [p.title, p.category, ...(p.stack || [])].join(' ').toLowerCase();
      return okCat && (!q || hay.includes(q));
    }).slice(0,24);
    $('#archiveGrid').innerHTML = items.length ? items.map(archiveItem).join('') : '<p>No matching projects.</p>';
  }

  function renderPublications() {
    $('#publicationList').innerHTML = data.publications.map(p => `<article class="publication-card reveal"><div><h3><a href="${esc(p.url)}" target="_blank" rel="noreferrer">${esc(p.title)}</a></h3><p>${esc(p.venue)} · ${esc(p.year)} · ${esc(p.area)}</p></div><div class="pub-side"><span class="pub-type">${esc(p.type)}</span><a class="pub-doi" href="${esc(p.url)}" target="_blank" rel="noreferrer">DOI</a></div></article>`).join('');
  }

  function timelineItem(item) {
    const points = item.points || (item.point ? [item.point] : []);
    return `<article class="timeline-item reveal"><div class="timeline-top"><div><h3>${esc(item.role || item.title || '')}</h3><p>${esc(item.org || item.organization || item.company || '')}</p></div><span>${esc(item.period || '')}</span></div><ul>${points.map(p => `<li>${esc(p)}</li>`).join('')}</ul></article>`;
  }

  function renderExperience() {
    $('#experienceList').innerHTML = data.experience.map(timelineItem).join('');
    $('#leadershipList').innerHTML = data.leadership.map(timelineItem).join('');
  }

  function renderCerts() {
    $('#certGrid').innerHTML = data.certifications.map(c => `<a class="cert-card reveal" href="${esc(c.url)}" target="_blank" rel="noreferrer">${icons.cert}<div><strong>${esc(c.title)}</strong><span>${esc(c.issuer)} · ${esc(c.date)}</span></div></a>`).join('');
  }

  function initTheme() {
    const saved = localStorage.getItem('theme');
    if (saved) document.documentElement.dataset.theme = saved;
    const label = () => $('#themeToggle').textContent = document.documentElement.dataset.theme === 'dark' ? 'Light' : 'Dark';
    label();
    $('#themeToggle').addEventListener('click', () => {
      const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
      document.documentElement.dataset.theme = next;
      localStorage.setItem('theme', next);
      label();
    });
  }

  function initNav() {
    $('#navToggle').addEventListener('click', () => {
      const open = !document.body.classList.contains('nav-open');
      document.body.classList.toggle('nav-open', open);
      $('#navToggle').setAttribute('aria-expanded', String(open));
    });
    $$('#navPanel a').forEach(a => a.addEventListener('click', () => document.body.classList.remove('nav-open')));
  }

  function initArchive() {
    $('#toggleArchive').addEventListener('click', () => {
      state.archiveOpen = !state.archiveOpen;
      $('#archivePanel').hidden = !state.archiveOpen;
      $('#toggleArchive').textContent = state.archiveOpen ? 'Hide Archive' : 'Show Archive';
    });
    $('#projectSearch').addEventListener('input', e => { state.query = e.target.value; renderArchive(); });
    $('#filterRow').addEventListener('click', e => {
      const btn = e.target.closest('[data-category]');
      if (!btn) return;
      state.category = btn.dataset.category;
      $$('.filter-btn').forEach(b => b.classList.toggle('active', b === btn));
      renderArchive();
    });
  }

  function initReveal() {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      $$('.reveal').forEach(el => el.classList.add('is-visible'));
      return;
    }
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -46px 0px' });
    $$('.reveal').forEach(el => io.observe(el));
  }

  function boot() {
    renderProfile(); renderProjects(); renderPublications(); renderSkills(); renderEducation(); renderExperience(); renderCerts(); initTheme(); initNav(); initArchive(); initReveal(); $('#year').textContent = new Date().getFullYear();
  }

  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', boot) : boot();
})();
