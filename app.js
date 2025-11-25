// ====== DATA ======
// Initial set using the words you typed. You can expand this later.

const PHONEMES = [
  {
    symbol: "/p/",
    key: "p",
    type: "voiceless",
    examples: [
      { word: "pen", pattern: "p" },
      { word: "top", pattern: "p" },
      { word: "supper", pattern: "pp" },
    ],
  },
  {
    symbol: "/t/",
    key: "t",
    type: "voiceless",
    examples: [
      { word: "Ten", pattern: "T" },
      { word: "cut", pattern: "t" },
      { word: "letter", pattern: "tt" },
    ],
  },
  {
    symbol: "/k/",
    key: "k",
    type: "voiceless",
    examples: [
      { word: "kind", pattern: "k" },
      { word: "inquire", pattern: "qu" },
      { word: "come", pattern: "c" },
      { word: "fix", pattern: "x" },
      { word: "pick", pattern: "ck" },
    ],
  },
  {
    symbol: "/θ/",
    key: "theta",
    type: "voiceless",
    examples: [
      { word: "three", pattern: "th" },
      { word: "think", pattern: "th" },
      { word: "breath", pattern: "th" },
      { word: "cloth", pattern: "th" },
    ],
  },
  {
    symbol: "/f/",
    key: "f",
    type: "voiceless",
    examples: [
      { word: "friend", pattern: "fr" },
      { word: "life", pattern: "f" },
      { word: "death", pattern: "th" }, // /θ/ in spelling but /f/ in sound mix
      { word: "enough", pattern: "gh" },
      { word: "laugh", pattern: "gh" },
      { word: "tough", pattern: "gh" },
    ],
  },
  {
    symbol: "/s/",
    key: "s",
    type: "voiceless",
    examples: [
      { word: "sir", pattern: "s" },
      { word: "site", pattern: "s" },
      { word: "boss", pattern: "ss" },
      { word: "glass", pattern: "ss" },
      { word: "sites", pattern: "s" },
      { word: "lakes", pattern: "s" },
      { word: "city", pattern: "c" },
      { word: "fix", pattern: "x" },
    ],
  },
  {
    symbol: "/ʃ/",
    key: "sh",
    type: "voiceless",
    examples: [
      { word: "ancient", pattern: "ci" },
      { word: "partial", pattern: "ti" },
      { word: "action", pattern: "ti" },
      { word: "schedule", pattern: "sch" },
      { word: "sugar", pattern: "s" },
      { word: "sure", pattern: "s" },
      { word: "machine", pattern: "ch" },
    ],
  },
  {
    symbol: "/tʃ/",
    key: "tch",
    type: "voiceless",
    examples: [
      { word: "rich", pattern: "ch" },
      { word: "reach", pattern: "ch" },
      { word: "future", pattern: "ture" },
    ],
  },
  {
    symbol: "/h/",
    key: "h",
    type: "voiceless",
    examples: [
      { word: "while", pattern: "wh" },
      { word: "white", pattern: "wh" },
      { word: "honor", pattern: "h" }, // silent in spelling but helps memory
      { word: "honest", pattern: "h" },
      { word: "borough", pattern: "h" },
      { word: "through", pattern: "h" },
    ],
  },

  // ---- Voiced consonants ----
  {
    symbol: "/b/",
    key: "b",
    type: "voiced",
    examples: [
      { word: "climb", pattern: "b" }, // silent spelling, but Wizari cares
      { word: "bomb", pattern: "b" },
      { word: "comb", pattern: "b" },
      { word: "bed", pattern: "b" },
      { word: "lamv", pattern: "v" }, // keeping your text exactly
    ],
  },
  {
    symbol: "/d/",
    key: "d",
    type: "voiced",
    examples: [
      { word: "do", pattern: "d" },
      { word: "double", pattern: "d" },
      { word: "hand", pattern: "d" },
      { word: "riddle", pattern: "dd" },
    ],
  },
  {
    symbol: "/g/",
    key: "g",
    type: "voiced",
    examples: [
      { word: "go", pattern: "g" },
      { word: "game", pattern: "g" },
      { word: "bigger", pattern: "gg" },
      { word: "foggy", pattern: "gg" },
      { word: "hungry", pattern: "gr" },
      { word: "sing", pattern: "ng" }, // here the spelling shows nasal, but OK
    ],
  },
  {
    symbol: "/ð/",
    key: "eth",
    type: "voiced",
    examples: [
      { word: "breathe", pattern: "th" },
      { word: "bathe", pattern: "th" },
      { word: "though", pattern: "th" },
      { word: "wether", pattern: "th" }, // as you typed
    ],
  },
  {
    symbol: "/v/",
    key: "v",
    type: "voiced",
    examples: [
      { word: "very", pattern: "v" },
      { word: "view", pattern: "v" },
      { word: "every", pattern: "v" },
      { word: "move", pattern: "v" },
    ],
  },
  {
    symbol: "/z/",
    key: "z",
    type: "voiced",
    examples: [
      { word: "quiz", pattern: "z" },
      { word: "rise", pattern: "s" },
      { word: "muesum", pattern: "s" }, // museum, but keeping it
      { word: "please", pattern: "s" },
      { word: "resource", pattern: "s" },
    ],
  },
  {
    symbol: "/ʒ/",
    key: "zh",
    type: "voiced",
    examples: [
      { word: "massage", pattern: "ge" },
      { word: "regime", pattern: "g" },
      { word: "garage", pattern: "ge" },
      { word: "genre", pattern: "re" },
    ],
  },
  {
    symbol: "/dʒ/",
    key: "dge",
    type: "voiced",
    examples: [
      { word: "join", pattern: "j" },
      { word: "enjoy", pattern: "j" },
      { word: "educate", pattern: "du" },
      { word: "graduate", pattern: "du" },
    ],
  },
];

// ====== Helpers ======

function highlightWord(word, pattern) {
  if (!pattern) return word;

  const idx = word.toLowerCase().indexOf(pattern.toLowerCase());
  if (idx === -1) return word;

  const before = word.slice(0, idx);
  const match = word.slice(idx, idx + pattern.length);
  const after = word.slice(idx + pattern.length);

  return `${before}<span class="example-highlight">${match}</span>${after}`;
}

function normalizeQuery(q) {
  return q.trim().toLowerCase();
}

function isSymbolQuery(q) {
  // if contains IPA characters or slashes or is very short, treat as symbol-ish
  if (!q) return false;
  if (q.includes("/")) return true;
  if (q.length <= 3) return true;
  return false;
}

// ====== Rendering ======

const resultsEl = document.getElementById("results");
const wordLookupEl = document.getElementById("wordLookup");
const searchInput = document.getElementById("searchInput");
const filterChips = document.querySelectorAll(".chip");

let activeFilter = "all";

function renderPhonemes() {
  const q = normalizeQuery(searchInput.value);
  const symbolMode = isSymbolQuery(q);

  let filtered = PHONEMES.filter((ph) => {
    if (activeFilter !== "all" && ph.type !== activeFilter) return false;
    if (!q) return true;

    const symbolHit =
      ph.symbol.toLowerCase().includes(q) ||
      ph.key.toLowerCase().includes(q.replace(/\//g, ""));

    const exampleHit = ph.examples.some((ex) =>
      ex.word.toLowerCase().includes(q)
    );

    // If query looks like symbol, prefer symbol matches
    return symbolMode ? symbolHit || exampleHit : exampleHit || symbolHit;
  });

  if (filtered.length === 0) {
    resultsEl.innerHTML =
      '<p style="color:#9ca3af;font-size:0.9rem;">No sounds found for that search yet. Try another word or symbol.</p>';
  } else {
    const html = filtered
      .map((ph) => {
        const examplesHtml = ph.examples
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
              ${examplesHtml}
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
  if (!query) {
    wordLookupEl.style.display = "none";
    wordLookupEl.innerHTML = "";
    return;
  }

  // exact word matches
  const matches = [];
  visiblePhonemes.forEach((ph) => {
    ph.examples.forEach((ex) => {
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
  // Map key -> audio file path. You can rename these however you like.
  // For now we assume: audio/symbols/<key>.mp3
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
        alert(
          "Audio file not found yet for this sound. Add it under " + src
        );
      });
    };
  });
}

// ====== Event listeners ======

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

// Initial render
renderPhonemes();
