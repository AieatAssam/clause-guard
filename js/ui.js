/**
 * ClauseGuard — UI Controller
 * Theme management, scanning, results rendering, library browser
 */
const scanner = new ContractScanner();

// ═══ THEME ═══
function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
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

// ═══ MOBILE NAV ═══
function toggleMobileNav() {
  document.getElementById('mobileNav').classList.toggle('active');
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

// ═══ SAMPLE CONTRACT ═══
function loadSample() {
  const sample = `SaaS MASTER SERVICES AGREEMENT

This Master Services Agreement (the "Agreement") is entered into by and between TechVantage Inc. ("Company") and the undersigned customer ("Customer").

1. TERM AND AUTO-RENEWAL
This Agreement shall commence on the Effective Date and continue for an initial term of twelve (12) months. Thereafter, this Agreement shall automatically renew for successive twelve (12) month periods unless either party provides written notice of non-renewal at least sixty (60) days prior to the end of the then-current term. If Customer fails to provide such notice, the Agreement will be deemed renewed.

2. FEES AND PAYMENT
Customer shall pay all fees as set forth in the applicable Order Form. All fees are non-refundable. Company reserves the right to increase fees upon thirty (30) days written notice. Payment terms are net sixty (60) days from the date of invoice. Customer agrees that time is of the essence for all payment obligations.

3. INDEMNIFICATION
Customer agrees to indemnify, defend, and hold harmless Company, its affiliates, officers, directors, employees, and agents from and against any and all claims, damages, losses, liabilities, costs, and expenses (including reasonable attorneys' fees) arising out of or relating to Customer's use of the Services, including but not limited to any claim that Customer's content infringes third-party intellectual property rights. This indemnification obligation shall survive any termination of this Agreement and shall not be subject to any limitation of liability set forth herein.

4. LIMITATION OF LIABILITY
IN NO EVENT SHALL EITHER PARTY BE LIABLE FOR ANY CONSEQUENTIAL, INCIDENTAL, INDIRECT, SPECIAL, EXEMPLARY, OR PUNITIVE DAMAGES, INCLUDING LOST PROFITS, LOSS OF BUSINESS, OR LOSS OF DATA. COMPANY'S TOTAL AGGREGATE LIABILITY UNDER THIS AGREEMENT SHALL NOT EXCEED THE TOTAL FEES PAID BY CUSTOMER IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM. THE FOREGOING LIMITATIONS SHALL NOT APPLY TO: (i) CUSTOMER'S INDEMNIFICATION OBLIGATIONS, (ii) BREACH OF CONFIDENTIALITY, OR (iii) INFRINGEMENT OF INTELLECTUAL PROPERTY RIGHTS.

5. INTELLECTUAL PROPERTY
All work product, deliverables, software, and materials created by Company for Customer shall be deemed "work made for hire" and shall be the sole and exclusive property of Company. Company grants Customer a non-exclusive, non-transferable, revocable license to use the deliverables solely for Customer's internal business purposes. Customer shall not, directly or indirectly: reverse engineer, decompile, disassemble, modify, create derivative works of, or sublicense any Company intellectual property.

6. CONFIDENTIALITY
Confidential Information shall include all information disclosed by either party to the other, whether orally or in writing. The receiving party shall hold such information in strict confidence and shall not disclose it to any third party. These obligations shall survive for a period of five (5) years from disclosure. Nothing in this section shall limit either party from seeking injunctive relief, as a breach of this section would cause irreparable harm.

7. DISPUTE RESOLUTION
Any dispute arising out of or relating to this Agreement shall be resolved through binding arbitration administered by the American Arbitration Association in San Francisco, California. The parties waive any right to a jury trial and agree that any arbitration shall be conducted on an individual basis and not as a class action. This Agreement shall be governed by the laws of the State of California, without regard to its conflict of laws principles.

8. ASSIGNMENT
Customer may not assign this Agreement or any rights or obligations hereunder without Company's prior written consent. Company may assign this Agreement without Customer's consent to an affiliate or in connection with a merger, acquisition, or sale of all or substantially all assets.

9. TERMINATION
Company may terminate this Agreement immediately upon written notice if Customer breaches any provision hereof. Customer may terminate this Agreement for convenience upon ninety (90) days written notice. Upon termination for any reason, Customer shall pay all fees and amounts accrued through the termination date, and all rights granted to Customer shall immediately cease.

10. FORCE MAJEURE
Neither party shall be liable for delays or non-performance caused by events beyond its reasonable control. Notwithstanding the foregoing, payment obligations shall not be excused by any force majeure event.

11. ENTIRE AGREEMENT
This Agreement constitutes the entire agreement between the parties and supersedes all prior agreements, understandings, negotiations, and discussions, whether oral or written. Customer acknowledges that it has not relied upon any representations or warranties not expressly set forth herein.

12. WAIVER AND SEVERABILITY
The failure of either party to enforce any provision hereof shall not constitute a waiver of such provision. If any provision is found unenforceable, the remaining provisions shall continue in full force and effect.

13. NO ORAL MODIFICATION
This Agreement may not be modified except by a written instrument signed by both parties.

14. WARRANTY DISCLAIMER
THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.`;

  document.getElementById('contractInput').value = sample;
  switchInputTab('paste');
  updateWordCount();
}

// ═══ MAIN SCAN ═══
function runScan() {
  const text = document.getElementById('contractInput').value.trim();
  if (!text || text.length < 20) {
    document.getElementById('contractInput').focus();
    document.getElementById('contractInput').style.border = '2px solid var(--critical)';
    setTimeout(() => {
      document.getElementById('contractInput').style.border = 'none';
    }, 2000);
    return;
  }

  // Show progress
  const progress = document.getElementById('scanProgress');
  const fill = document.getElementById('progressFill');
  const textEl = document.getElementById('progressText');
  progress.style.display = 'block';
  
  const stages = [
    { pct: 25, text: 'Tokenizing contract text...' },
    { pct: 50, text: 'Running pattern matching...' },
    { pct: 75, text: 'Analyzing severity levels...' },
    { pct: 90, text: 'Building results...' },
  ];

  let si = 0;
  const progressInterval = setInterval(() => {
    if (si < stages.length && stages[si]) {
      fill.style.width = stages[si].pct + '%';
      textEl.textContent = stages[si].text;
      si++;
    }
  }, 120);

  // Run scan (async for UI update)
  setTimeout(() => {
    clearInterval(progressInterval);
    fill.style.width = '100%';
    textEl.textContent = '✅ Scan complete!';

    const results = scanner.scan(text);

    setTimeout(() => {
      progress.style.display = 'none';
      fill.style.width = '0%';

      if (results.length === 0) {
        document.getElementById('results-section').style.display = 'none';
        document.getElementById('empty-section').style.display = 'block';
        document.getElementById('empty-section').scrollIntoView({ behavior: 'smooth' });
      } else {
        document.getElementById('empty-section').style.display = 'none';
        renderResults(results, text);
        renderAnnotated(text, results);
        document.getElementById('results-section').style.display = 'block';
        setTimeout(() => {
          document.getElementById('results-section').scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }, 400);
  }, 500);
}

function clearResults() {
  document.getElementById('results-section').style.display = 'none';
  document.getElementById('empty-section').style.display = 'none';
  document.getElementById('scanProgress').style.display = 'none';
  document.getElementById('resultsList').innerHTML = '';
  document.getElementById('annotatedContract').innerHTML = '';
  document.getElementById('annotatedWrapper').style.display = 'none';
}

// ═══ RENDER RESULTS ═══
function renderResults(results, originalText) {
  const list = document.getElementById('resultsList');
  const stats = scanner.getStats();

  document.getElementById('scoreCritical').textContent = stats.bySeverity.critical || 0;
  document.getElementById('scoreHigh').textContent = stats.bySeverity.high || 0;
  document.getElementById('scoreMedium').textContent = stats.bySeverity.medium || 0;
  document.getElementById('scoreInfo').textContent = stats.bySeverity.info || 0;
  document.getElementById('scoreRisk').textContent = stats.riskScore + '/100';
  document.getElementById('resultsCount').textContent = `${results.length} flags found`;
  document.getElementById('resultsTimestamp').textContent = `Scanned ${new Date().toLocaleTimeString()}`;

  // Color the risk score
  const riskEl = document.querySelector('.score-risk .score-num');
  if (stats.riskScore >= 70) riskEl.style.color = 'var(--critical)';
  else if (stats.riskScore >= 40) riskEl.style.color = 'var(--high)';
  else riskEl.style.color = 'var(--medium)';

  list.innerHTML = results.map((r, i) => {
    const severityColors = { critical: '#e74c3c', high: '#e67e22', medium: '#b8860b', info: '#3498db' };
    const riskPct = (r.riskLevel / 10) * 100;

    return `
    <div class="result-card" data-severity="${r.severity}" style="animation-delay:${i * 0.04}s">
      <div class="result-card-header" onclick="toggleResult(this.closest('.result-card'))">
        <div class="result-card-header-left">
          <div class="result-badges">
            <span class="badge badge-${r.severity}">
              ${r.severity === 'critical' ? '🔴' : r.severity === 'high' ? '🟠' : r.severity === 'medium' ? '🟡' : '🔵'} 
              ${r.severity.toUpperCase()}
            </span>
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
              <div class="risk-bar">
                <div class="risk-fill risk-fill-${r.severity}" style="width:${riskPct}%"></div>
              </div>
              <span style="font-size:12px;font-weight:600;color:${severityColors[r.severity]}">${r.riskLevel}/10</span>
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
            <div class="result-section-text" style="font-family:var(--font-mono);font-size:12px;background:var(--bg-alt);padding:8px 12px;border-radius:6px;color:var(--text-secondary)">
              ${r.matches.map(m => `"<span style="color:${severityColors[r.severity]};font-weight:500">${escapeHtml(m.matchedText)}</span>"`).join('<br/><br/>')}
            </div>
          </div>
        </div>
      </div>
    </div>`;
  }).join('');
}

// ═══ TOGGLE RESULT EXPAND ═══
function toggleResult(card) {
  card.classList.toggle('expanded');
}

// ═══ RENDER ANNOTATED ═══
function renderAnnotated(text, results) {
  if (!text || results.length === 0) return;

  // Build smarter highlighting — mark exact matched phrases
  let annotated = escapeHtml(text);
  
  // Sort by position, handle nesting
  const ranges = [];
  for (const result of results) {
    for (const match of result.matches) {
      const para = match.fullText;
      // Find the matched text position within the full text
      let searchIdx = 0;
      let foundIdx;
      while ((foundIdx = text.indexOf(match.matchedText, searchIdx)) !== -1) {
        ranges.push({
          start: foundIdx,
          end: foundIdx + match.matchedText.length,
          severity: result.severity,
          label: result.label,
        });
        searchIdx = foundIdx + 1;
      }
    }
  }

  // Sort by start
  ranges.sort((a, b) => a.start - b.start);

  // Merge overlapping ranges (take highest severity)
  const merged = [];
  for (const r of ranges) {
    if (merged.length === 0) {
      merged.push(r);
      continue;
    }
    const last = merged[merged.length - 1];
    if (r.start <= last.end) {
      // Overlap — extend to furthest end, keep highest severity
      last.end = Math.max(last.end, r.end);
      const sevOrder = { critical: 0, high: 1, medium: 2, info: 3 };
      if (sevOrder[r.severity] < sevOrder[last.severity]) {
        last.severity = r.severity;
      }
    } else {
      merged.push(r);
    }
  }

  // Build annotated HTML
  let html = '';
  let lastIdx = 0;
  for (const range of merged) {
    if (range.start > lastIdx) {
      html += escapeHtml(text.substring(lastIdx, range.start));
    }
    const severityClass = `mark-${range.severity}`;
    html += `<mark class="${severityClass}" title="${escapeAttr(range.label)} - ${range.severity.toUpperCase()} risk">${escapeHtml(text.substring(range.start, range.end))}</mark>`;
    lastIdx = range.end;
  }
  if (lastIdx < text.length) {
    html += escapeHtml(text.substring(lastIdx));
  }

  document.getElementById('annotatedContract').innerHTML = html;
  document.getElementById('annotatedWrapper').style.display = 'block';
}

// ═══ FILTER ═══
function filterResults(severity) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  document.querySelector(`.filter-btn[data-filter="${severity}"]`).classList.add('active');

  document.querySelectorAll('.result-card').forEach(card => {
    if (severity === 'all') {
      card.style.display = '';
    } else {
      card.style.display = card.dataset.severity === severity ? '' : 'none';
    }
  });

  const visible = document.querySelectorAll('.result-card[style*="display: none"]').length === 0 
    ? document.querySelectorAll('.result-card').length
    : document.querySelectorAll('.result-card:not([style*="display: none"])').length;
  document.getElementById('resultsCount').textContent = `${visible} flag${visible !== 1 ? 's' : ''} found`;
}

// ═══ SCROLL TO HIGHLIGHTS ═══
function scrollToHighlighted() {
  const annotated = document.getElementById('annotatedWrapper');
  if (annotated.style.display !== 'none') {
    annotated.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// ═══ EXPORT ═══
function exportCSV() {
  exportResultsCSV(scanner.results);
}

function exportHTML() {
  exportResultsHTML(scanner.results, document.getElementById('contractInput').value);
}

// ═══ HELPERS ═══
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function escapeAttr(str) {
  return str.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

// ═══ LIBRARY BROWSER ═══
function renderLibrary() {
  const grid = document.getElementById('libraryGrid');
  const categories = {};
  
  for (const pattern of RED_FLAG_PATTERNS) {
    if (!categories[pattern.category]) {
      categories[pattern.category] = { count: 0, icon: CATEGORY_META[pattern.category]?.icon || '📌' };
    }
    categories[pattern.category].count++;
  }

  grid.innerHTML = Object.entries(categories)
    .sort((a, b) => b[1].count - a[1].count)
    .map(([name, meta]) => `
      <div class="lib-card">
        <div class="lib-card-icon">${meta.icon}</div>
        <div class="lib-card-title">${name}</div>
        <div class="lib-card-count">${meta.count} patterns</div>
      </div>
    `).join('');
}

// ═══ INIT ═══
initTheme();
renderLibrary();

// Keyboard shortcut: Ctrl/Cmd + Enter to scan
document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
    e.preventDefault();
    runScan();
  }
});
