// Wizari Phonetics 12 – full JS

window.addEventListener("DOMContentLoaded", () => {
  console.log("🔥 Wizari Phonetics JS booted");

  // ===== PHONEME DEFINITIONS =====

  const PHONEMES = [
    // voiceless consonants
    { symbol: "/p/", key: "p", type: "voiceless" },
    { symbol: "/t/", key: "t", type: "voiceless" },
    { symbol: "/k/", key: "k", type: "voiceless" },
    { symbol: "/θ/", key: "theta", type: "voiceless" },
    { symbol: "/f/", key: "f", type: "voiceless" },
    { symbol: "/s/", key: "s", type: "voiceless" },
    { symbol: "/ʃ/", key: "sh", type: "voiceless" },
    { symbol: "/tʃ/", key: "tch", type: "voiceless" },
    { symbol: "/h/", key: "h", type: "voiceless" },

    // voiced consonants
    { symbol: "/b/", key: "b", type: "voiced" },
    { symbol: "/d/", key: "d", type: "voiced" },
    { symbol: "/g/", key: "g", type: "voiced" },
    { symbol: "/ð/", key: "eth", type: "voiced" },
    { symbol: "/v/", key: "v", type: "voiced" },
    { symbol: "/z/", key: "z", type: "voiced" },
    { symbol: "/ʒ/", key: "zh", type: "voiced" },
    { symbol: "/dʒ/", key: "dge", type: "voiced" },
    { symbol: "/l/", key: "l", type: "voiced" },
    { symbol: "/r/", key: "r", type: "voiced" },
    { symbol: "/m/", key: "m", type: "voiced" },
    { symbol: "/n/", key: "n", type: "voiced" },
    { symbol: "/ŋ/", key: "ng", type: "voiced" },
    { symbol: "/j/", key: "j", type: "voiced" },
    { symbol: "/w/", key: "w", type: "voiced" },

    // vowels (pure)
    { symbol: "/I/", key: "I", type: "vowel" },
    { symbol: "/i/", key: "i_short", type: "vowel" },
    { symbol: "/i:/", key: "i_long", type: "vowel" },
    { symbol: "/e/", key: "e", type: "vowel" },
    { symbol: "/3:/", key: "3_long", type: "vowel" },
    { symbol: "/æ/", key: "ae", type: "vowel" },
    { symbol: "/a:/", key: "a_long", type: "vowel" },
    { symbol: "/ɒ/", key: "o_short", type: "vowel" },
    { symbol: "/ɔː/", key: "o_long", type: "vowel" },
    { symbol: "/ʊ/", key: "u_short", type: "vowel" },
    { symbol: "/ʌ/", key: "uh", type: "vowel" },
    { symbol: "/ə/", key: "schwa", type: "vowel" }
  ];

  let examplesBySymbol = {};
  let dataLoaded = false;
  let currentAudio = null;
  let activeFilter = "all";

  // ===== DOM =====

  const resultsEl = document.getElementById("results");
  const wordLookupEl = document.getElementById("wordLookup");
  const searchInput = document.getElementById("searchInput");
  const filterChips = document.querySelectorAll(".chip");

  if (!resultsEl || !searchInput) {
    console.error("❌ Critical DOM elements not found.");
    return;
  }

  // ===== Helpers =====

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

  function getExamplesFor(symbol) {
    return examplesBySymbol[symbol] || [];
  }

  function labelForType(type) {
    if (type === "vowel") return "vowel";
    if (type === "diphthong") return "diphthong";
    return `${type} consonant`;
  }

  function symbolToAudioPath(symbolKey) {
    return `audio/symbols/${symbolKey}.mp3`;
  }

  // ===== Rendering =====

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
                    ${labelForType(ph.type)}
                  </div>
                </div>
                <button class="audio-btn" type="button" data-symbol="${ph.key}">
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

  // ===== GLOBAL CLICK HANDLER FOR AUDIO =====

  document.addEventListener("click", (event) => {
    const btn = event.target.closest(".audio-btn");
    if (!btn) return;

    const key = btn.getAttribute("data-symbol");
    const src = symbolToAudioPath(key);

    console.log("▶️ Clicked audio for:", key, "->", src);

    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }

    const audio = new Audio(src);
    currentAudio = audio;
    audio
      .play()
      .catch((err) => {
        console.error("Audio play error:", err);
        alert("No recording yet for this sound. Add it at: " + src);
      });
  });

  // ===== Data loading =====

  async function loadExamples() {
    try {
      const res = await fetch("data/examples.json");
      if (!res.ok) throw new Error("HTTP " + res.status);
      const json = await res.json();
      examplesBySymbol = json;
      dataLoaded = true;
      console.log("✅ examples.json loaded");
    } catch (err) {
      console.error("Failed to load examples.json", err);
      dataLoaded = true;
      examplesBySymbol = {};
    } finally {
      renderPhonemes();
    }
  }

  // ===== Events =====

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

  // ===== Initial =====
  renderPhonemes();
  loadExamples();
});
