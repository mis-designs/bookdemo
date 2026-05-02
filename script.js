const R2_BASE_URL = "https://pub-21131aa867534601af79c34beb746fb7.r2.dev";

const QUIZBOOK_CHAPTERS = [
  "Capitolo_01_Definizioni_Stradali",
  "Capitolo_02_Segnali_di_Pericolo",
  "Capitolo_03_Segnali_di_Divieto",
  "Capitolo_04_Segnali_di_Obbligo",
  "Capitolo_05_Segnali_di_Precedenza",
  "Capitolo_06_Segnaletica_Orizzontale",
  "Capitolo_07_Semafori_e_Agenti",
  "Capitolo_08_Segnali_di_Indicazione",
  "Capitolo_09_Segnali_Temporanei",
  "Capitolo_10_Pannelli_Integrativi",
  "Capitolo_11_Norme_Comportamentali_e_Velocita",
  "Capitolo_12_Distanza_di_Sicurezza",
  "Capitolo_13_Posizione_dei_Veicoli",
  "Capitolo_14_Ordine_di_Precedenza",
  "Capitolo_15_Norme_sul_Sorpasso",
  "Capitolo_16_Fermata_Sosta_e_Arresto",
  "Capitolo_17_Circolazione_su_Autostrade",
  "Capitolo_18_Luci_e_Dispositivi_Acustici",
  "Capitolo_19_Casco_e_Cintura_di_Sicurezza",
  "Capitolo_20_Patente_e_Documenti",
  "Capitolo_21_Incidenti_Stradali",
  "Capitolo_22_Alcol_e_Droga",
  "Capitolo_23_Responsabilita_Civile_e_Penale",
  "Capitolo_24_Consumi_di_Carburante",
  "Capitolo_25_Manutenzione_ed_Elementi_del_Veicolo"
];

const SUCCESS_BOOK_CHAPTERS = [
  { folder: "strada", display: "Strada" },
  { folder: "segnali_di_pericolo", display: "Segnali di Pericolo" },
  { folder: "segnali_di_divieto", display: "Segnali di Divieto" },
  { folder: "segnali_di_obbligo", display: "Segnali di Obbligo" },
  { folder: "segnali_di_precedenza", display: "Segnali di Precedenza" },
  { folder: "segnaletica_orizzontale", display: "Segnaletica Orizzontale" },
  { folder: "semafori_e_agenti", display: "Semafori e Agenti" },
  { folder: "segnali_di_indicazione", display: "Segnali di Indicazione" },
  { folder: "segnali_complementari_e_delineatore", display: "Segnali Complementari e Delineatore" },
  { folder: "pnanelli_integrativi", display: "Pannelli Integrativi" },
  { folder: "word_meaning_with_photos", display: "Word Meaning" },
  { folder: "word_meaning", display: "Word Meaning with Photos" },
  { folder: "quiz_sugli_errori_commessi_più_frequentemente", display: "Quiz sugli errori commessi più frequentemente" },
  { folder: "dhada_bangla", display: "চোখের ধাঁদা", bangla: true },
  { folder: "trucchi_velocita", display: "Trucchi Velocità" },
  { folder: "trucchi_vero_falso", display: "Trucchi Vero/Falso" },
  { folder: "scheda_esame", display: "Scheda Esame" },
  { folder: "tipi_di_veicoli", display: "Tipi di Veicoli" }
];

const BOOKS = {
  quizbook: {
    key: "quizbook",
    title: "QuizBook",
    eyebrow: "25 capitoli visuali",
    description: "Segnali, norme, precedenze e situazioni d'esame in formato sfogliabile.",
    cover: "quiz_cards/quizbookcover.png",
    accent: "quiz-accent",
    chapters: QUIZBOOK_CHAPTERS.map((folder) => ({
      folder,
      display: formatQuizBookTitle(folder),
      type: "quizbook"
    }))
  },
  successbook: {
    key: "successbook",
    title: "Success Book",
    eyebrow: "18 sezioni studio",
    description: "Trucchi, parole chiave, schede e materiali di supporto per studiare meglio.",
    cover: "successbookcover.png",
    accent: "success-accent",
    chapters: SUCCESS_BOOK_CHAPTERS.map((chapter) => ({
      ...chapter,
      type: "successbook"
    }))
  }
};

const bookScreen = document.getElementById("bookScreen");
const chaptersScreen = document.getElementById("chaptersScreen");
const viewerScreen = document.getElementById("viewerScreen");
const booksGrid = document.getElementById("booksGrid");
const chaptersGrid = document.getElementById("chaptersGrid");
const mainTitle = document.getElementById("mainTitle");
const subtitle = document.getElementById("subtitle");
const chaptersTitle = document.getElementById("chaptersTitle");
const chaptersIntro = document.getElementById("chaptersIntro");
const backToBooksBtn = document.getElementById("backToBooksBtn");
const backToChaptersBtn = document.getElementById("backToChaptersBtn");
const viewerBookTitle = document.getElementById("viewerBookTitle");
const viewerTitle = document.getElementById("viewerTitle");
const viewerStatus = document.getElementById("viewerStatus");
const loader = document.getElementById("loader");
const pageList = document.getElementById("pageList");

let activeBook = null;
let currentLoadToken = 0;

function buildImageUrl(bookKey, folder, page) {
  const pageNumber = String(page).padStart(3, "0");

  if (bookKey === "quizbook") {
    return `${R2_BASE_URL}/books/quiz_book/${folder}/${folder}-page-${pageNumber}.jpg`;
  }

  if (bookKey === "successbook") {
    return `${R2_BASE_URL}/books/success_book/${folder}/${folder}-page-${pageNumber}.jpg`;
  }

  return "";
}

function buildImageUrlVariants(bookKey, folder, page) {
  const primaryUrl = buildImageUrl(bookKey, folder, page);

  if (bookKey !== "quizbook") {
    return [primaryUrl];
  }

  const pageNumber = String(page).padStart(3, "0");

  return [
    primaryUrl,
    `${R2_BASE_URL}/books/quiz_book/${folder}/${folder}_page-${pageNumber}.jpg`,
    `${R2_BASE_URL}/books/quizbook/${folder}/${folder}-page-${pageNumber}.jpg`,
    `${R2_BASE_URL}/books/quizbook/${folder}/${folder}_page-${pageNumber}.jpg`
  ];
}

function formatQuizBookTitle(folder) {
  const match = folder.match(/^Capitolo_(\d+)_(.+)$/);

  if (!match) {
    return folder.replace(/_/g, " ");
  }

  return `Capitolo ${match[1]} - ${match[2].replace(/_/g, " ")}`;
}

function protectImage(image) {
  image.addEventListener("contextmenu", (event) => event.preventDefault());
  image.addEventListener("dragstart", (event) => event.preventDefault());
  image.addEventListener("copy", (event) => event.preventDefault());
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function setScreen(screen) {
  if (screen === bookScreen) {
    document.body.dataset.screen = "books";
  } else if (screen === chaptersScreen) {
    document.body.dataset.screen = "chapters";
  } else {
    document.body.dataset.screen = "viewer";
  }

  [bookScreen, chaptersScreen, viewerScreen].forEach((item) => {
    item.classList.toggle("active", item === screen);
  });

  backToBooksBtn.classList.toggle("hidden", screen !== chaptersScreen);
  scrollToTop();
}

function showBooks() {
  currentLoadToken++;
  activeBook = null;
  mainTitle.textContent = "Book Demo";
  subtitle.textContent = "Scegli un libro e sfoglia le pagine in anteprima.";
  setScreen(bookScreen);
}

function showChapters(bookKey) {
  currentLoadToken++;
  activeBook = BOOKS[bookKey];

  mainTitle.textContent = activeBook.title;
  subtitle.textContent = activeBook.eyebrow;
  chaptersTitle.textContent = activeBook.title;
  chaptersIntro.textContent = "Scegli un capitolo per iniziare la lettura.";

  renderChapters(activeBook);
  setScreen(chaptersScreen);
}

function showViewer() {
  setScreen(viewerScreen);
}

function createBookCard(book) {
  const card = document.createElement("button");
  card.className = `book-card ${book.accent}`;
  card.type = "button";
  card.setAttribute("aria-label", `Apri ${book.title}`);
  card.addEventListener("click", () => showChapters(book.key));

  const coverWrap = document.createElement("div");
  coverWrap.className = "book-cover";

  const cover = document.createElement("img");
  cover.src = book.cover;
  cover.alt = `Copertina ${book.title}`;
  cover.loading = "lazy";
  protectImage(cover);
  coverWrap.appendChild(cover);

  const copy = document.createElement("div");
  copy.className = "book-copy";

  const eyebrow = document.createElement("span");
  eyebrow.className = "book-eyebrow";
  eyebrow.textContent = book.eyebrow;

  const title = document.createElement("h3");
  title.textContent = book.title;

  const description = document.createElement("p");
  description.textContent = book.description;

  const action = document.createElement("span");
  action.className = "book-action";
  action.textContent = "Apri libro";

  copy.append(eyebrow, title, description, action);
  card.append(coverWrap, copy);
  return card;
}

function createChapterCard(book, chapter, index) {
  const card = document.createElement("button");
  card.className = `chapter-card ${book.accent}${chapter.bangla ? " bangla-card" : ""}`;
  card.type = "button";
  card.setAttribute("aria-label", `Apri ${chapter.display}`);
  card.addEventListener("click", () => openChapter(book, chapter));

  const number = getChapterNumber(book, chapter, index);
  const visual = document.createElement("div");
  visual.className = "chapter-visual";

  if (book.key === "quizbook") {
    const image = document.createElement("img");
    image.src = `quiz_cards/Capitolo_${number}.png`;
    image.alt = chapter.display;
    image.loading = "lazy";
    image.onerror = () => {
      visual.textContent = "";
      visual.appendChild(createChapterNumber(number));
    };
    protectImage(image);
    visual.appendChild(image);
  } else {
    visual.appendChild(createChapterNumber(number));
  }

  const body = document.createElement("div");
  body.className = "chapter-card-body";

  const title = document.createElement("strong");
  title.textContent = chapter.display;

  const hint = document.createElement("span");
  hint.textContent = book.title;

  body.append(title, hint);
  card.append(visual, body);
  return card;
}

function getChapterNumber(book, chapter, index) {
  if (book.key === "quizbook") {
    return chapter.folder.match(/Capitolo_(\d+)/)?.[1] || String(index + 1).padStart(2, "0");
  }

  return String(index + 1).padStart(2, "0");
}

function createChapterNumber(number) {
  const element = document.createElement("span");
  element.className = "chapter-number";
  element.textContent = number;
  return element;
}

function loadImage(url, alt) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const timeout = window.setTimeout(() => {
      reject(new Error(`Tempo scaduto: ${url}`));
    }, 45000);

    image.onload = () => {
      window.clearTimeout(timeout);
      image.loading = "lazy";
      resolve(image);
    };

    image.onerror = () => {
      window.clearTimeout(timeout);
      reject(new Error(`Immagine non trovata: ${url}`));
    };

    image.alt = alt;
    image.loading = "eager";
    image.decoding = "async";
    protectImage(image);
    image.src = url;
  });
}

async function loadPageImage(book, chapter, page) {
  const urls = buildImageUrlVariants(book.key, chapter.folder, page);
  let lastError = null;

  for (const url of urls) {
    try {
      const image = await loadImage(url, `${book.title} - ${chapter.display} - pagina ${page}`);
      return { image, url };
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error("Immagine non trovata");
}

async function openChapter(book, chapter) {
  currentLoadToken++;
  const loadToken = currentLoadToken;

  showViewer();
  pageList.innerHTML = "";
  loader.style.display = "block";
  loader.textContent = "Caricamento pagine...";
  viewerBookTitle.textContent = book.title;
  viewerTitle.textContent = chapter.display;
  viewerStatus.textContent = "Preparazione pagine...";

  let page = 1;
  let loadedPages = 0;

  while (loadToken === currentLoadToken) {
    viewerStatus.textContent = `Caricamento pagina ${page}...`;

    try {
      const { image } = await loadPageImage(book, chapter, page);

      if (loadToken !== currentLoadToken) {
        return;
      }

      const pageWrap = document.createElement("div");
      pageWrap.className = "page-wrap";
      pageWrap.appendChild(image);
      pageList.appendChild(pageWrap);

      loadedPages++;
      loader.style.display = "none";
      viewerStatus.textContent = `${loadedPages} pagine caricate`;
      page++;
    } catch (error) {
      if (loadToken !== currentLoadToken) {
        return;
      }

      if (loadedPages === 0) {
        loader.textContent = "Nessuna pagina trovata per questo capitolo.";
        viewerStatus.textContent = "Nessuna pagina caricata";
      } else {
        loader.style.display = "none";
        viewerStatus.textContent = `${loadedPages} pagine caricate`;
      }

      return;
    }
  }
}

function renderBooks() {
  booksGrid.innerHTML = "";
  Object.values(BOOKS).forEach((book) => {
    booksGrid.appendChild(createBookCard(book));
  });
}

function renderChapters(book) {
  chaptersGrid.innerHTML = "";
  book.chapters.forEach((chapter, index) => {
    chaptersGrid.appendChild(createChapterCard(book, chapter, index));
  });
}

document.addEventListener("contextmenu", (event) => {
  if (event.target instanceof HTMLImageElement) {
    event.preventDefault();
  }
});

document.addEventListener("selectstart", (event) => {
  if (event.target instanceof HTMLImageElement) {
    event.preventDefault();
  }
});

backToBooksBtn.addEventListener("click", showBooks);
backToChaptersBtn.addEventListener("click", () => {
  if (activeBook) {
    currentLoadToken++;
    showChapters(activeBook.key);
  } else {
    showBooks();
  }
});

document.body.dataset.screen = "books";
renderBooks();
