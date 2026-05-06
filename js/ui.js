/**
 * ClauseGuard — UI Controller
 * Tab management, scanning, results, library
 */
const scanner = new ContractScanner();

// ═══ THEME ═══
function toggleTheme() {
  const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  document.getElementById('themeToggle').textContent = next === 'dark' ? '☀️' : '🌙';
  localStorage.setItem('clauseguard-theme', next);
}

function initTheme() {
  const saved = localStorage.getItem('clauseguard-theme');
  if (saved) {
    document.documentElement.setAttribute('data-theme', saved);
    document.getElementById('themeToggle').textContent = saved === 'dark' ? '☀️' : '🌙';
  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.setAttribute('data-theme', 'dark');
    document.getElementById('themeToggle').textContent = '☀️';
  }
}

// ═══ TAB SWITCHING ═══
function switchTab(name) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  document.querySelector(`.tab-btn[data-tab="${name}"]`).classList.add('active');
  document.getElementById(`tab-${name}`).classList.add('active');
  // Scroll to top of content
  document.querySelector('.main-content').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ═══ INPUT ═══
function switchInputTab(tab) {
  document.querySelectorAll('.input-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.input-tab-content').forEach(t => t.classList.remove('active'));
  document.querySelector(`.input-tab[data-tab="${tab}"]`).classList.add('active');
  document.getElementById(`tab-${tab}`).classList.add('active');
}

function updateWordCount() {
  const text = document.getElementById('contractInput').value.trim();
  const count = text ? text.split(/\s+/).length : 0;
  document.getElementById('wordCount').textContent = `${count.toLocaleString()} words`;
}

// ═══ SAMPLES ═══
function renderSamples() {
  const grid = document.getElementById('sampleGrid');
  if (!grid || !SAMPLE_CONTRACTS) return;
  grid.innerHTML = SAMPLE_CONTRACTS.map((s, i) => `
    <div class="sample-card" onclick="loadSample(${i})">
      <div class="sample-card-icon">${s.icon}</div>
      <div class="sample-card-name">${escapeHtml(s.name)}</div>
      <div class="sample-card-desc">${escapeHtml(s.description)}</div>
      <div class="sample-card-tags">
        ${s.text.split(/\n\s*\n/).filter(p => p.trim().length > 0).slice(0, 3).map(p => {
          const title = p.trim().split('\n')[0].replace(/^[\d.\s#]+/, '').substring(0, 30);
          return `<span class="sample-tag">${escapeHtml(title)}</span>`;
        }).join('')}
      </div>
    </div>`).join('');
}

function loadSample(index) {
  const sample = SAMPLE_CONTRACTS[index];
  if (!sample) return;
  document.getElementById('contractInput').value = sample.text;
  switchInputTab('paste');
  updateWordCount();
}

// ═══ SCAN ═══
function runScan() {
  const text = document.getElementById('contractInput').value.trim();
  if (!text || text.length < 20) return;

  // Switch to results tab, show progress
  switchTab('results');
  const progress = document.getElementById('scanProgress');
  const fill = document.getElementById('progressFill');
  const textEl = document.getElementById('progressText');
  document.getElementById('resultsContent').style.display = 'none';
  document.getElementById('resultsEmpty').style.display = 'none';
  progress.style.display = 'block';

  const stages = [
    { pct: 25, text: 'Tokenizing contract text...' },
    { pct: 50, text: 'Running pattern matching...' },
    { pct: 75, text: 'Analyzing severity levels...' },
    { pct: 90, text: 'Building results...' },
  ];
  let si = 0;
  const interval = setInterval(() => {
    if (si < stages.length) { fill.style.width = stages[si].pct + '%'; textEl.textContent = stages[si].text; si++; }
  }, 100);

  setTimeout(() => {
    clearInterval(interval);
    fill.style.width = '100%';
    textEl.textContent = '✅ Complete!';

    const results = scanner.scan(text);

    setTimeout(() => {
      progress.style.display = 'none';
      fill.style.width = '0%';
      document.getElementById('tabBtnResults').disabled = false;
      document.getElementById('tabBtnResults').classList.add('active');

      if (results.length === 0) {
        document.getElementById('resultsContent').style.display = 'none';
        document.getElementById('resultsEmpty').style.display = 'block';
      } else {
        document.getElementById('resultsEmpty').style.display = 'none';
        renderResults(results, text);
        renderAnnotated(text, results);
        document.getElementById('resultsContent').style.display = 'block';
      }
    }, 300);
  }, 400);
}

function clearResults() {
  document.getElementById('resultsContent').style.display = 'none';
  document.getElementById('resultsEmpty').style.display = 'none';
  document.getElementById('scanProgress').style.display = 'none';
  document.getElementById('resultsList').innerHTML = '';
  document.getElementById('annotatedContract').innerHTML = '';
  document.getElementById('annotatedWrapper').style.display = 'none';
  document.getElementById('tabBtnResults').disabled = true;
  document.getElementById('tabBtnResults').classList.remove('active');
}

// ═══ RENDER RESULTS ═══
function renderResults(results, text) {
  const list = document.getElementById('resultsList');
  const stats = scanner.getStats();

  document.getElementById('scoreCritical').textContent = stats.bySeverity.critical || 0;
  document.getElementById('scoreHigh').textContent = stats.bySeverity.high || 0;
  document.getElementById('scoreMedium').textContent = stats.bySeverity.medium || 0;
  document.getElementById('scoreInfo').textContent = stats.bySeverity.info || 0;
  document.getElementById('scoreRisk').textContent = stats.riskScore + '/100';
  document.getElementById('resultsCount').textContent = `${results.length} flags found`;
  document.getElementById('resultsTimestamp').textContent = `Scanned ${new Date().toLocaleTimeString()}`;

  const sevColors = { critical: '#e74c3c', high: '#e67e22', medium: '#b8860b', info: '#3498db' };

  list.innerHTML = results.map((r, i) => {
    const riskPct = (r.riskLevel / 10) * 100;
    return `
    <div class="result-card" data-severity="${r.severity}" style="animation-delay:${i * 0.03}s">
      <div class="result-card-header" onclick="toggleResult(this.closest('.result-card'))">
        <div>
          <div class="result-badges">
            <span class="badge badge-${r.severity}">${r.severity === 'critical' ? '🔴' : r.severity === 'high' ? '🟠' : r.severity === 'medium' ? '🟡' : '🔵'} ${r.severity.toUpperCase()}</span>
            <span class="badge badge-category">${CATEGORY_META[r.category]?.icon || '📌'} ${r.category}</span>
            <span class="badge badge-match">${r.matchCount} match${r.matchCount !== 1 ? 'es' : ''}</span>
          </div>
          <div class="result-title">${r.label}</div>
        </div>
        <div class="result-card-toggle">▼</div>
      </div>
      <div class="result-card-body">
        <div class="result-body-content">
          <div class="result-section">
            <div class="result-section-label">What This Means</div>
            <div class="result-section-text">${r.description}</div>
          </div>
          <div class="result-section">
            <div class="result-section-label">Why It's Risky</div>
            <div class="result-section-text">${r.whyRisky}</div>
          </div>
          <div class="result-section">
            <div class="result-section-label">Risk Level</div>
            <div class="result-risk-meter">
              <div class="risk-bar"><div class="risk-fill risk-fill-${r.severity}" style="width:${riskPct}%"></div></div>
              <span style="font-size:11px;font-weight:600;color:${sevColors[r.severity]}">${r.riskLevel}/10</span>
            </div>
          </div>
          <div class="result-section">
            <div class="result-section-label">Ask Your Lawyer</div>
            <div class="result-section-text">${r.askLawyer}</div>
          </div>
          <div class="result-section">
            <div class="result-section-label">Suggested Fix</div>
            <div class="result-section-text">${r.suggestedFix}</div>
          </div>
          <div class="result-section">
            <div class="result-section-label">Matched Text</div>
            <div class="result-section-text" style="font-family:var(--font-mono);font-size:11px;background:var(--bg-alt);padding:8px 10px;border-radius:6px;color:var(--text-secondary)">
              ${r.matches.map(m => `"<span style="color:${sevColors[r.severity]};font-weight:500">${escapeHtml(m.matchedText)}</span>"`).join('<br/><br/>')}
            </div>
          </div>
        </div>
      </div>
    </div>`;
  }).join('');
}

function toggleResult(card) { card.classList.toggle('expanded'); }

// ═══ ANNOTATED ═══
function renderAnnotated(text, results) {
  if (!text || results.length === 0) return;

  const ranges = [];
  for (const result of results) {
    for (const match of result.matches) {
      let searchIdx = 0, foundIdx;
      while ((foundIdx = text.indexOf(match.matchedText, searchIdx)) !== -1) {
        ranges.push({ start: foundIdx, end: foundIdx + match.matchedText.length, severity: result.severity, label: result.label });
        searchIdx = foundIdx + 1;
      }
    }
  }
  ranges.sort((a, b) => a.start - b.start);

  const merged = [];
  for (const r of ranges) {
    if (merged.length === 0) { merged.push(r); continue; }
    const last = merged[merged.length - 1];
    if (r.start <= last.end) {
      last.end = Math.max(last.end, r.end);
      const ord = { critical: 0, high: 1, medium: 2, info: 3 };
      if (ord[r.severity] < ord[last.severity]) last.severity = r.severity;
    } else {
      merged.push(r);
    }
  }

  let html = '', lastIdx = 0;
  for (const range of merged) {
    if (range.start > lastIdx) html += escapeHtml(text.substring(lastIdx, range.start));
    html += `<mark class="mark-${range.severity}" title="${escapeAttr(range.label)}">${escapeHtml(text.substring(range.start, range.end))}</mark>`;
    lastIdx = range.end;
  }
  if (lastIdx < text.length) html += escapeHtml(text.substring(lastIdx));

  document.getElementById('annotatedContract').innerHTML = html;
  document.getElementById('annotatedWrapper').style.display = 'block';
}

// ═══ FILTER ═══
function filterResults(severity) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  document.querySelector(`.filter-btn[data-filter="${severity}"]`).classList.add('active');
  document.querySelectorAll('.result-card').forEach(card => {
    card.style.display = (severity === 'all' || card.dataset.severity === severity) ? '' : 'none';
  });
  const visible = document.querySelectorAll('.result-card:not([style*="display: none"])').length;
  document.getElementById('resultsCount').textContent = `${visible} flag${visible !== 1 ? 's' : ''} found`;
}

function scrollToHighlights() {
  const w = document.getElementById('annotatedWrapper');
  if (w.style.display !== 'none') w.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ═══ EXPORT ═══
function exportCSV() { exportResultsCSV(scanner.results); }
function exportHTML() { exportResultsHTML(scanner.results, document.getElementById('contractInput').value); }

function escapeHtml(str) {
  const d = document.createElement('div'); d.textContent = str; return d.innerHTML;
}
function escapeAttr(str) {
  return str.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

// ═══ LIBRARY ═══
let patternCache = null;

function renderLibrary() {
  const grid = document.getElementById('libraryGrid');
  if (!grid) return;
  if (!patternCache) {
    const cats = {};
    for (const p of RED_FLAG_PATTERNS) {
      if (!cats[p.category]) cats[p.category] = { count: 0, icon: (CATEGORY_META[p.category] || {}).icon || '📌', items: [] };
      cats[p.category].count++;
      cats[p.category].items.push(p);
    }
    patternCache = Object.entries(cats).sort((a, b) => b[1].count - a[1].count);
  }
  grid.innerHTML = patternCache.map(([name, meta]) => `
    <div class="lib-card" onclick="showLibraryCategory('${escapeAttr(name)}')">
      <div class="lib-card-icon">${meta.icon}</div>
      <div class="lib-card-title">${escapeHtml(name)}</div>
      <div class="lib-card-count">${meta.count} patterns</div>
    </div>`).join('');
}

function showLibraryCategory(name) {
  const detail = document.getElementById('libraryDetail');
  const entry = patternCache.find(e => e[0] === name);
  if (!entry) return;
  const [catName, meta] = entry;
  sevIcon = { critical: '🔴', high: '🟠', medium: '🟡', info: '🔵' };
  sevClass = { critical: 'badge-critical', high: 'badge-high', medium: 'badge-medium', info: 'badge-info' };
  detail.innerHTML = `
    <div class="lib-detail-header">
      <span>${meta.icon} ${escapeHtml(catName)} — ${meta.count} pattern${meta.count !== 1 ? 's' : ''}</span>
      <button class="lib-detail-close" onclick="closeLibraryDetail()">✕</button>
    </div>
    <div class="lib-detail-list">
      ${meta.items.map(p => `
        <div class="lib-detail-item">
          <span class="badge ${sevClass[p.severity]}">${sevIcon[p.severity]} ${p.severity.toUpperCase()}</span>
          <span class="lib-detail-item-text">${escapeHtml(p.label)}</span>
        </div>`).join('')}
    </div>`;
  detail.style.display = 'block';
  detail.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function closeLibraryDetail() {
  document.getElementById('libraryDetail').style.display = 'none';
}

// ═══ KEYBOARD ═══
document.addEventListener('keydown', e => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); runScan(); }
});

// ═══ INIT ═══
initTheme();
renderLibrary();
renderSamples();
