(() => {
  const data = window.portfolioData || portfolioData;

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const esc = (value = '') =>
    String(value).replace(/[&<>'"]/g, char => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[char]));

  const logos = {
    LinkedIn: { src: 'assets/linkedin-logo.png', wide: false },
    GitHub: { src: 'assets/github-logo.png', wide: true },
    ORCID: { src: 'assets/orcid-logo.png', wide: true },
    'Google Scholar': { src: 'assets/scholar-logo.png', wide: true },
    ResearchGate: { src: 'assets/researchgate-logo.png', wide: false }
  };

  const linkDescriptor = name => ({
    LinkedIn: ,
    GitHub: ,
    ORCID: ,
    'Google Scholar': ,
    ResearchGate: 
  }[name] || 'Profile');

  const icons = {
    skill: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2 4 6.2v11.6L12 22l8-4.2V6.2L12 2Zm0 2.25 5.9 3.1L12 10.45 6.1 7.35 12 4.25Zm-6 5L11 12v7.2l-5-2.62V9.25Zm7 9.95V12l5-2.75v7.33l-5 2.62Z"/></svg>',
    cert: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a7 7 0 0 0-4 12.74V22l4-2 4 2v-7.26A7 7 0 0 0 12 2Zm0 2a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm-2 12.7c.63.2 1.3.3 2 .3s1.37-.1 2-.3v2.06l-2-1-2 1V16.7Z"/></svg>'
  };

  const state = {
    query: '',
    category: 'All',
    archiveOpen: false
  };

  function renderProfile() {
    $('#heroSummary').textContent = data.profile.summary;
    $('#emailAction').href = `mailto:${data.profile.email}`;

    const profileLinkOrder = [
      'LinkedIn',
      'GitHub',
      'ORCID',
      'Google Scholar',
      'ResearchGate'
    ];

    $('#profileLinks').innerHTML = profileLinkOrder.map(name => {
      const url = data.profile.links[name];
      if (!url) return '';

      const logo = logos[name];

      return `<a class="profile-link" href="${esc(url)}" target="_blank" rel="noreferrer" aria-label="${esc(name)}">
        <span class="logo-box${logo.wide ? ' word' : ''}">
          <img src="${esc(logo.src)}" alt="${esc(name)} logo" loading="lazy">
        </span>
        <span>
          <strong>${esc(name)}</strong>
          <span>${esc(linkDescriptor(name))}</span>
        </span>
      </a>`;
    }).join('');

    $('#footerLinks').innerHTML = profileLinkOrder
      .filter(name => data.profile.links[name])
      .map(name => `<a href="${esc(data.profile.links[name])}" target="_blank" rel="noreferrer">${esc(name)}</a>`)
      .join('');

    $('#stats').innerHTML = data.profile.metrics
      .map(metric => `<article class="metric-card"><strong>${esc(metric.value)}</strong><span>${esc(metric.label)}</span></article>`)
      .join('');

    renderContactButtons();
  }

  function renderContactButtons() {
    const emailButton = $('#emailAction');
    if (!emailButton) return;

    const actions = emailButton.parentElement;
    if (!actions) return;

    $$('.contact-extra', actions).forEach(button => button.remove());

    const whatsappUrl = data.profile.links.WhatsApp;
    const phoneUrl = data.profile.links.Phone;

    const whatsappIcon = `<svg viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M12.04 2C6.55 2 2.08 6.47 2.08 11.96c0 1.76.46 3.48 1.34 5L2 22l5.18-1.36a9.9 9.9 0 0 0 4.86 1.24h.01c5.49 0 9.96-4.47 9.96-9.96C22 6.47 17.53 2 12.04 2Zm0 18.18h-.01a8.2 8.2 0 0 1-4.18-1.14l-.3-.18-3.07.8.82-2.99-.2-.31a8.18 8.18 0 1 1 6.94 3.82Zm4.49-6.13c-.25-.12-1.46-.72-1.69-.8-.23-.08-.4-.12-.56.12-.17.25-.65.8-.8.97-.15.17-.29.19-.54.06-.25-.12-1.04-.38-1.98-1.22-.73-.65-1.23-1.46-1.37-1.71-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.44.12-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.12-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.09s.9 2.42 1.03 2.59c.12.17 1.77 2.7 4.3 3.79.6.26 1.07.41 1.44.53.6.19 1.15.16 1.58.1.48-.07 1.46-.6 1.67-1.18.21-.58.21-1.08.15-1.18-.06-.1-.23-.16-.48-.29Z"/>
    </svg>`;

    const phoneIcon = `<svg viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M6.62 10.79a15.1 15.1 0 0 0 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1C10.61 21 3 13.39 3 4c0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.24.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2Z"/>
    </svg>`;

    const buttons = [
      whatsappUrl ? `<a class="btn contact-extra contact-whatsapp" href="${esc(whatsappUrl)}" target="_blank" rel="noreferrer" aria-label="WhatsApp">
        ${whatsappIcon}
        <span>WhatsApp</span>
      </a>` : '',
      phoneUrl ? `<a class="btn contact-extra contact-phone" href="${esc(phoneUrl)}" aria-label="Call">
        ${phoneIcon}
        <span>Call</span>
      </a>` : ''
    ].join('');

    emailButton.insertAdjacentHTML('afterend', buttons);
  }

  function renderSkills() {
    const order = [
      'Programming',
      'AI & Machine Learning',
      'Computer Vision & NLP',
      'Statistics & Data Science',
      'Libraries & Tools',
      'Backend & Databases'
    ];

    $('#skillsList').innerHTML = order
      .filter(group => data.skills[group])
      .map(group => `<article class="skill-card reveal">
        <h3>${icons.skill}${esc(group)}</h3>
        <div class="tags">
          ${data.skills[group].map(skill => `<span class="tag">${esc(skill)}</span>`).join('')}
        </div>
      </article>`)
      .join('');
  }

  function renderEducation() {
    const education = data.education;

    $('#educationCard').innerHTML = `<div class="education-top">
      <div class="edu-title">
        <img src="assets/academy-logo.png" alt="AASTMT logo" loading="lazy">
        <div>
          <h3>${esc(education.school)}</h3>
          <p>${esc(education.degree)}</p>
        </div>
      </div>
      <span class="edu-meta">${esc(education.location)} · ${esc(education.period)}</span>
    </div>
    <div class="highlight-grid">
      ${education.highlights.map(highlight => `<span class="highlight">${esc(highlight)}</span>`).join('')}
    </div>`;
  }

  const projectCard = (project, index) => `<article class="project-card reveal" style="--i:${index}">
    <div class="card-meta">
      <span>${esc(project.category)}</span>
      <span>${esc(project.date)}</span>
    </div>
    <h3>
      <a href="${esc(project.url)}" target="_blank" rel="noreferrer">${esc(project.title)}</a>
    </h3>
    <p>${esc(project.summary)}</p>
    <div class="impact-row">
      ${(project.impact || []).slice(0, 3).map(item => `<span class="impact">${esc(item)}</span>`).join('')}
    </div>
    <div class="tags">
      ${(project.stack || []).slice(0, 5).map(item => `<span class="tag">${esc(item)}</span>`).join('')}
    </div>
    <a class="project-link" href="${esc(project.url)}" target="_blank" rel="noreferrer">Open repository →</a>
  </article>`;

  const archiveItem = project => `<a class="archive-item" href="${esc(project.url)}" target="_blank" rel="noreferrer">
    <strong>${esc(project.title)}</strong>
    <span>${esc(project.category || 'Project')} · ${(project.stack || []).slice(0, 3).map(esc).join(', ')}</span>
  </a>`;

  function allArchiveProjects() {
    const featured = new Set(
      data.projects
        .filter(project => project.featured)
        .map(project => project.title.toLowerCase().trim())
    );

    const merged = [
      ...data.projects.filter(project => !project.featured),
      ...(data.otherRepos || [])
    ];

    const seen = new Set();

    return merged.filter(project => {
      const key = (project.title || '').toLowerCase().trim();

      if (!key || featured.has(key) || seen.has(key)) return false;

      seen.add(key);
      return true;
    });
  }

  function renderProjects() {
    $('#featuredProjects').innerHTML = data.projects
      .filter(project => project.featured)
      .slice(0, 3)
      .map(projectCard)
      .join('');

    const categories = [
      'All',
      ...new Set(allArchiveProjects().map(project => project.category).filter(Boolean))
    ].slice(0, 9);

    $('#filterRow').innerHTML = categories
      .map(category => `<button class="filter-btn${category === state.category ? ' active' : ''}" data-category="${esc(category)}" type="button">${esc(category)}</button>`)
      .join('');

    renderArchive();
  }

  function renderArchive() {
    const query = state.query.toLowerCase().trim();

    const items = allArchiveProjects()
      .filter(project => {
        const matchesCategory = state.category === 'All' || project.category === state.category;
        const searchableText = [project.title, project.category, ...(project.stack || [])].join(' ').toLowerCase();

        return matchesCategory && (!query || searchableText.includes(query));
      })
      .slice(0, 24);

    $('#archiveGrid').innerHTML = items.length
      ? items.map(archiveItem).join('')
      : '<p>No matching projects.</p>';
  }

  function renderPublications() {
    $('#publicationList').innerHTML = data.publications
      .map(publication => `<article class="publication-card reveal">
        <div>
          <h3>
            <a href="${esc(publication.url)}" target="_blank" rel="noreferrer">${esc(publication.title)}</a>
          </h3>
          <p>${esc(publication.venue)} · ${esc(publication.year)} · ${esc(publication.area)}</p>
        </div>
        <div class="pub-side">
          <span class="pub-type">${esc(publication.type)}</span>
          <a class="pub-doi" href="${esc(publication.url)}" target="_blank" rel="noreferrer">DOI</a>
        </div>
      </article>`)
      .join('');
  }

  function timelineItem(item) {
    const points = item.points || (item.point ? [item.point] : []);

    return `<article class="timeline-item reveal">
      <div class="timeline-top">
        <div>
          <h3>${esc(item.role || item.title || '')}</h3>
          <p>${esc(item.org || item.organization || item.company || '')}</p>
        </div>
        <span>${esc(item.period || '')}</span>
      </div>
      <ul>
        ${points.map(point => `<li>${esc(point)}</li>`).join('')}
      </ul>
    </article>`;
  }

  function renderExperience() {
    $('#experienceList').innerHTML = data.experience.map(timelineItem).join('');
    $('#leadershipList').innerHTML = data.leadership.map(timelineItem).join('');
  }

  function renderCerts() {
    $('#certGrid').innerHTML = data.certifications
      .map(certification => `<a class="cert-card reveal" href="${esc(certification.url)}" target="_blank" rel="noreferrer">
        ${icons.cert}
        <div>
          <strong>${esc(certification.title)}</strong>
          <span>${esc(certification.issuer)} · ${esc(certification.date)}</span>
        </div>
      </a>`)
      .join('');
  }

  function initTheme() {
    const saved = localStorage.getItem('theme');

    if (saved) {
      document.documentElement.dataset.theme = saved;
    }

    const label = () => {
      $('#themeToggle').textContent =
        document.documentElement.dataset.theme === 'dark' ? 'Light' : 'Dark';
    };

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
      const isOpen = !document.body.classList.contains('nav-open');

      document.body.classList.toggle('nav-open', isOpen);
      $('#navToggle').setAttribute('aria-expanded', String(isOpen));
    });

    $$('#navPanel a').forEach(link => {
      link.addEventListener('click', () => {
        document.body.classList.remove('nav-open');
      });
    });
  }

  function initArchive() {
    $('#toggleArchive').addEventListener('click', () => {
      state.archiveOpen = !state.archiveOpen;

      $('#archivePanel').hidden = !state.archiveOpen;
      $('#toggleArchive').textContent = state.archiveOpen ? 'Hide Archive' : 'Show Archive';
    });

    $('#projectSearch').addEventListener('input', event => {
      state.query = event.target.value;
      renderArchive();
    });

    $('#filterRow').addEventListener('click', event => {
      const button = event.target.closest('[data-category]');
      if (!button) return;

      state.category = button.dataset.category;

      $$('.filter-btn').forEach(filterButton => {
        filterButton.classList.toggle('active', filterButton === button);
      });

      renderArchive();
    });
  }

  function initReveal() {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      $$('.reveal').forEach(element => element.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -46px 0px'
    });

    $$('.reveal').forEach(element => observer.observe(element));
  }

  function boot() {
    renderProfile();
    renderProjects();
    renderPublications();
    renderSkills();
    renderEducation();
    renderExperience();
    renderCerts();

    initTheme();
    initNav();
    initArchive();
    initReveal();

    $('#year').textContent = new Date().getFullYear();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
