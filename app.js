// ====== PHONEME DEFINITIONS ======
// Only symbols & type live here. Words come from data/examples.json.

const PHONEMES = [
  { symbol: "/p/", key: "p", type: "voiceless" },
  { symbol: "/t/", key: "t", type: "voiceless" },
  { symbol: "/k/", key: "k", type: "voiceless" },
  { symbol: "/θ/", key: "theta", type: "voiceless" },
  { symbol: "/f/", key: "f", type: "voiceless" },
  { symbol: "/s/", key: "s", type: "voiceless" },
  { symbol: "/ʃ/", key: "sh", type: "voiceless" },
  { symbol: "/tʃ/", key: "tch", type: "voiceless" },
  { symbol: "/h/", key: "h", type: "voiceless" },

  { symbol: "/b/", key: "b", type: "voiced" },
  { symbol: "/d/", key: "d", type: "voiced" },
  { symbol: "/g/", key: "g", type: "voiced" },
  { symbol: "/ð/", key: "eth", type: "voiced" },
  { symbol: "/v/", key: "v", type: "voiced" },
  { symbol: "/z/", key: "z", type: "voiced" },
  { symbol: "/ʒ/", key: "zh", type: "voiced" },
  { symbol: "/dʒ/", key: "dge", type: "voiced" }

  // When you send the rest of the symbols,
  // we just add more objects here.
];

let examplesBySymbol = {}; // loaded from JSON

// ====== Helpers ======

function highlightWord(word, pattern) {
  if (!pattern) return word;
  const lower = word.toLowerCase();
  const p = pattern.toLowerCase();
  const idx = lower.indexOf(p);
  if (idx === -1) return word;

  const before = word.slice(0, idx);
  const match = word.slice(idx, idx + p.length);
  const after = word.slice(idx + p.length);
  return `${before}<span class="example-highlight">${match}</span>${after}`;
}

function normalizeQuery(q) {
  return q.trim().toLowerCase();
}

function isSymbolQuery(q) {
  if (!q) return false;
  if (q.includes("/")) return true;
  if (q.length <= 3) return true;
  return false;
}

// ====== DOM refs ======

const resultsEl = document.getElementById("results");
const wordLookupEl = document.getElementById("wordLookup");
const searchInput = document.getElementById("searchInput");
const filterChips = document.querySelectorAll(".chip");

let activeFilter = "all";
let dataLoaded = false;

// ====== Rendering ======

function getExamplesFor(symbol) {
  return examplesBySymbol[symbol] || [];
}

function renderPhonemes() {
  const q = normalizeQuery(searchInput.value);
  const symbolMode = isSymbolQuery(q);

  if (!dataLoaded) {
    resultsEl.innerHTML =
      '<p style="color:#9ca3af;font-size:0.9rem;">Loading Wizari examples…</p>';
    wordLookupEl.style.display = "none";
    return;
  }

  let filtered = PHONEMES.filter((ph) => {
    if (activeFilter !== "all" && ph.type !== activeFilter) return false;
    if (!q) return true;

    const examples = getExamplesFor(ph.symbol);
    const symbolHit =
      ph.symbol.toLowerCase().includes(q) ||
      ph.key.toLowerCase().includes(q.replace(/\//g, ""));

    const exampleHit = examples.some((ex) =>
      ex.word.toLowerCase().includes(q)
    );

    return symbolMode ? symbolHit || exampleHit : exampleHit || symbolHit;
  });

  if (filtered.length === 0) {
    resultsEl.innerHTML =
      '<p style="color:#9ca3af;font-size:0.9rem;">No sounds found for that search yet. Try another Wizari word or symbol.</p>';
  } else {
    const html = filtered
      .map((ph) => {
        const examples = getExamplesFor(ph.symbol);
        const examplesHtml = examples
          .map((ex) => {
            const rendered = highlightWord(ex.word, ex.pattern);
            return `<li><span class="example-word">${rendered}</span></li>`;
          })
          .join("");

        return `
          <article class="phoneme-card">
            <div class="card-header">
              <div>
                <div class="symbol">${ph.symbol}</div>
                <div class="symbol-type ${ph.type}">
                  ${ph.type} consonant
                </div>
              </div>
              <button class="audio-btn" data-symbol="${ph.key}">
                <span class="icon">🔊</span>
                <span>Sound</span>
              </button>
            </div>
            <div>
              <div class="examples-title">Examples</div>
              <ul class="examples-list">
                ${
                  examplesHtml ||
                  '<li style="font-size:0.8rem;color:#6b7280;">No examples added yet.</li>'
                }
              </ul>
            </div>
          </article>
        `;
      })
      .join("");

    resultsEl.innerHTML = html;
  }

  renderWordLookupSummary(q, filtered);
  attachAudioHandlers();
}

function renderWordLookupSummary(q, visiblePhonemes) {
  const query = normalizeQuery(q);
  if (!query || !dataLoaded) {
    wordLookupEl.style.display = "none";
    wordLookupEl.innerHTML = "";
    return;
  }

  const matches = [];

  visiblePhonemes.forEach((ph) => {
    const examples = getExamplesFor(ph.symbol);
    examples.forEach((ex) => {
      if (ex.word.toLowerCase() === query) {
        matches.push({ word: ex.word, symbol: ph.symbol });
      }
    });
  });

  if (matches.length === 0) {
    wordLookupEl.style.display = "block";
    wordLookupEl.innerHTML = `
      <div>
        <span class="badge">Word lookup</span>
        <span>No exact Wizari word found for "<strong>${query}</strong>" yet, but related sounds are highlighted below.</span>
      </div>
    `;
    return;
  }

  const uniqueSymbols = [...new Set(matches.map((m) => m.symbol))];
  const word = matches[0].word;
  const symbolsStr = uniqueSymbols.join(", ");

  wordLookupEl.style.display = "block";
  wordLookupEl.innerHTML = `
    <div>
      <span class="badge">Word lookup</span>
      <span>
        <strong>${word}</strong> appears under sound(s):
        <strong>${symbolsStr}</strong>
      </span>
    </div>
  `;
}

// ====== Audio handling ======

let currentAudio = null;

function symbolToAudioPath(symbolKey) {
  // Map key -> audio file path
  return `audio/symbols/${symbolKey}.mp3`;
}

function attachAudioHandlers() {
  const buttons = document.querySelectorAll(".audio-btn");
  buttons.forEach((btn) => {
    btn.onclick = () => {
      const key = btn.getAttribute("data-symbol");
      const src = symbolToAudioPath(key);

      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      }

      const audio = new Audio(src);
      currentAudio = audio;
      audio.play().catch(() => {
        alert("No recording yet for this sound. Add it at: " + src);
      });
    };
  });
}

// ====== Data loading ======

async function loadExamples() {
  try {
    const res = await fetch("data/examples.json");
    if (!res.ok) throw new Error("HTTP " + res.status);
    const json = await res.json();
    examplesBySymbol = json;
    dataLoaded = true;
  } catch (err) {
    console.error("Failed to load examples.json", err);
    dataLoaded = true;
    examplesBySymbol = {};
  } finally {
    renderPhonemes();
  }
}

// ====== Events ======

searchInput.addEventListener("input", () => {
  renderPhonemes();
});

filterChips.forEach((chip) => {
  chip.addEventListener("click", () => {
    filterChips.forEach((c) => c.classList.remove("chip-active"));
    chip.classList.add("chip-active");
    activeFilter = chip.getAttribute("data-filter");
    renderPhonemes();
  });
});

// First render (loading state) then load JSON
renderPhonemes();
loadExamples();
