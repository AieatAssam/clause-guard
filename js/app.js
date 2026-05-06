/**
 * contract-scanner — Main Application Logic
 * Clause pattern matching, text parsing, and result management
 */
class ContractScanner {
  constructor() {
    this.patterns = RED_FLAG_PATTERNS;
    this.results = [];
    this.matches = new Map(); // matchId -> { patternId, text, index, length, severity }
  }

  scan(text) {
    this.results = [];
    this.matches = new Map();
    if (!text || text.trim().length < 20) return this.results;

    const paragraphs = this.tokenize(text);

    for (const pattern of this.patterns) {
      if (!pattern.patterns || pattern.patterns.length === 0) continue;

      const matchedParas = [];

      for (let pi = 0; pi < paragraphs.length; pi++) {
        const para = paragraphs[pi];
        for (const regex of pattern.patterns) {
          const match = regex.exec(para.text);
          if (match) {
            const matchId = `${pattern.id}-${pi}-${match.index}`;
            this.matches.set(matchId, {
              patternId: pattern.id,
              text: match[0],
              index: match.index,
              length: match[0].length,
              severity: pattern.severity,
              paragraphIndex: pi,
            });
            matchedParas.push({
              paragraphIndex: pi,
              matchedText: match[0],
              fullText: para.text,
              matchId,
            });
            break; // one match per paragraph per pattern
          }
        }
      }

      if (matchedParas.length > 0) {
        this.results.push({
          ...pattern,
          matches: matchedParas,
          matchCount: matchedParas.length,
          // Pre-calculate risk score for severity (used for sorting)
          _severityScore: pattern.severity === 'critical' ? 3 : pattern.severity === 'high' ? 2 : pattern.severity === 'medium' ? 1 : 0,
        });
      }
    }

    // Sort by severity then by match count
    this.results.sort((a, b) => {
      const sevDiff = b._severityScore - a._severityScore;
      if (sevDiff !== 0) return sevDiff;
      return b.matchCount - a.matchCount;
    });

    return this.results;
  }

  tokenize(text) {
    // Split into paragraphs and sentences for smart matching
    const paragraphs = text.split(/\n\s*\n/);
    return paragraphs.map((p, i) => {
      // Clean whitespace but keep meaningful breaks
      const cleaned = p.replace(/\s+/g, ' ').trim();
      return { text: cleaned, index: i };
    }).filter(p => p.text.length > 10);
  }

  getHighlightRanges(text) {
    // Returns array of { start, end, severity, patternId, category }
    const ranges = [];
    for (const result of this.results) {
      for (const match of result.matches) {
        const para = match.fullText;
        // Find all occurrences
        let searchFrom = 0;
        for (const regex of result.patterns) {
          regex.lastIndex = 0;
          let m;
          while ((m = regex.exec(para)) !== null) {
            ranges.push({
              start: m.index,
              end: m.index + m[0].length,
              severity: result.severity,
              patternId: result.id,
              category: result.category,
              label: result.label,
            });
          }
        }
      }
    }
    return ranges;
  }

  getStats() {
    const bySeverity = { critical: 0, high: 0, medium: 0, info: 0 };
    const byCategory = {};
    
    for (const r of this.results) {
      bySeverity[r.severity] = (bySeverity[r.severity] || 0) + 1;
      byCategory[r.category] = (byCategory[r.category] || 0) + 1;
    }

    const totalMatches = Array.from(this.results).reduce((s, r) => s + r.matchCount, 0);

    return {
      totalFlags: this.results.length,
      totalMatches,
      bySeverity,
      byCategory,
      riskScore: this.calculateRiskScore(),
    };
  }

  calculateRiskScore() {
    let score = 0;
    for (const r of this.results) {
      const base = r.severity === 'critical' ? 30 : r.severity === 'high' ? 15 : r.severity === 'medium' ? 5 : 1;
      score += base * Math.min(r.matchCount, 5);
    }
    return Math.min(100, score);
  }
}

// Export CSV report
function exportResultsCSV(results) {
  const headers = ['Category', 'Severity', 'Clause', 'Matches', 'Description', 'Risk Level'];
  const rows = results.map(r => [
    r.category,
    r.severity.toUpperCase(),
    r.label,
    r.matchCount,
    r.description.substring(0, 100) + '...',
    r.riskLevel + '/10',
  ]);
  
  const csv = [headers, ...rows].map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'contract-scan-results.csv';
  a.click();
  URL.revokeObjectURL(url);
}

// Export results as PDF (using browser print or simple HTML generation)
function exportResultsHTML(results, contractText) {
  const severityColors = { critical: '#e74c3c', high: '#e67e22', medium: '#f1c40f', info: '#3498db' };
  
  let html = `<!DOCTYPE html>
<html><head><meta charset="utf-8">
<style>
body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 900px; margin: 40px auto; padding: 20px; color: #1a1a2e; }
h1 { font-size: 28px; margin-bottom: 5px; }
h2 { font-size: 20px; margin-top: 30px; border-bottom: 2px solid #eee; padding-bottom: 8px; }
.meta { color: #666; margin-bottom: 20px; }
.flag { margin: 16px 0; padding: 16px; border-radius: 8px; border-left: 4px solid #ccc; }
.flag.critical { border-left-color: #e74c3c; background: #fdf2f2; }
.flag.high { border-left-color: #e67e22; background: #fef5e7; }
.flag.medium { border-left-color: #f1c40f; background: #fef9e7; }
.flag.info { border-left-color: #3498db; background: #ebf5fb; }
.tag { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; margin-right: 6px; }
.severity-tag { color: white; }
.matches { font-size: 13px; color: #666; margin-top: 6px; }
.section { margin-bottom: 20px; }
.summary { display: flex; gap: 16px; margin: 20px 0; }
.stat-box { flex: 1; padding: 16px; text-align: center; border-radius: 8px; background: #f8f9fa; }
.stat-num { font-size: 28px; font-weight: 700; }
.stat-label { font-size: 12px; color: #666; margin-top: 4px; }
</style></head><body>
<h1>🔍 Contract Scan Report</h1>
<p class="meta">Generated ${new Date().toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
<div class="summary">
  <div class="stat-box"><div class="stat-num">${results.length}</div><div class="stat-label">Red Flags Found</div></div>
  <div class="stat-box"><div class="stat-num">${results.filter(r => r.severity === 'critical').length}</div><div class="stat-label">Critical</div></div>
  <div class="stat-box"><div class="stat-num">${results.filter(r => r.severity === 'high').length}</div><div class="stat-label">High Risk</div></div>
  <div class="stat-box"><div class="stat-num">${results.filter(r => r.severity === 'medium').length}</div><div class="stat-label">Medium</div></div>
</div>`;

  // Group by category
  const byCategory = {};
  for (const r of results) {
    if (!byCategory[r.category]) byCategory[r.category] = [];
    byCategory[r.category].push(r);
  }

  for (const [category, flags] of Object.entries(byCategory)) {
    html += `<h2>${CATEGORY_META[category]?.icon || '📌'} ${category}</h2>`;
    for (const flag of flags) {
      html += `
<div class="flag ${flag.severity}">
  <div>
    <span class="tag severity-tag" style="background:${severityColors[flag.severity]}">${flag.severity.toUpperCase()}</span>
    <strong>${flag.label}</strong>
  </div>
  <p style="margin: 8px 0; font-size: 14px; line-height: 1.5;">${flag.description}</p>
  <div class="matches">⚠️ ${flag.matchCount} match(es) found • Risk Level: ${flag.riskLevel}/10</div>
</div>`;
    }
  }

  html += `</body></html>`;
  
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'contract-scan-report.html';
  a.click();
  URL.revokeObjectURL(url);
}
