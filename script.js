const R2_BASE_URL = "https://pub-21131aa867534601af79c34beb746fb7.r2.dev";
const CARD_FOLDER = "quiz_cards";

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

const coverScreen = document.getElementById("coverScreen");
const chaptersScreen = document.getElementById("chaptersScreen");
const readerScreen = document.getElementById("readerScreen");
const openBookBtn = document.getElementById("openBookBtn");
const backBtn = document.getElementById("backBtn");
const closeReaderBtn = document.getElementById("closeReaderBtn");
const subtitle = document.getElementById("subtitle");
const chaptersGrid = document.getElementById("chaptersGrid");
const errorBox = document.getElementById("errorBox");
const bookPages = document.getElementById("bookPages");
const readerTitle = document.getElementById("readerTitle");
const readerStatus = document.getElementById("readerStatus");
const readerLoading = document.getElementById("readerLoading");

let currentLoadToken = 0;

function buildQuizBookImageUrl(chapterFolder, page) {
  const pageNumber = String(page).padStart(3, "0");
  return `${R2_BASE_URL}/books/quiz_book/${chapterFolder}/${chapterFolder}-page-${pageNumber}.jpg`;
}

function getChapterNumber(chapterFolder) {
  const match = chapterFolder.match(/Capitolo_(\d+)/);
  return match ? match[1] : "";
}

function getChapterTitle(chapterFolder) {
  const chapterNumber = getChapterNumber(chapterFolder);
  const chapterSubtitle = getChapterSubtitle(chapterFolder);
  return `Capitolo ${chapterNumber} - ${chapterSubtitle}`;
}

function getChapterSubtitle(chapterFolder) {
  return chapterFolder
    .replace(/^Capitolo_\d+_?/, "")
    .replace(/_/g, " ");
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function showCover() {
  coverScreen.classList.add("active");
  chaptersScreen.classList.remove("active");
  readerScreen.classList.remove("active");
  backBtn.classList.remove("show");
  subtitle.textContent = "Tocca la copertina per aprire i capitoli";
  scrollToTop();
}

function showChapters() {
  coverScreen.classList.remove("active");
  chaptersScreen.classList.add("active");
  readerScreen.classList.remove("active");
  backBtn.classList.add("show");
  subtitle.textContent = `${QUIZBOOK_CHAPTERS.length} capitoli disponibili`;
  scrollToTop();

  chaptersGrid.classList.remove("deal-cards");
  void chaptersGrid.offsetWidth;
  chaptersGrid.classList.add("deal-cards");
}

function showReader() {
  coverScreen.classList.remove("active");
  chaptersScreen.classList.remove("active");
  readerScreen.classList.add("active");
  backBtn.classList.remove("show");
  subtitle.textContent = "Lettura capitolo";
  scrollToTop();
}

function createChapterCard(chapterFolder, index) {
  const chapterNumber = getChapterNumber(chapterFolder);
  const chapterTitle = getChapterTitle(chapterFolder);

  const card = document.createElement("button");
  card.className = "chapter-card";
  card.type = "button";
  card.style.setProperty("--deal-index", index);
  card.style.setProperty("--deal-x", `${index % 2 === 0 ? -70 : 70}px`);
  card.style.setProperty("--deal-rotate", `${index % 2 === 0 ? -10 : 10}deg`);
  card.setAttribute("aria-label", `Apri ${chapterTitle}`);
  card.addEventListener("click", () => openChapter(chapterFolder));

  const image = document.createElement("img");
  image.src = `${CARD_FOLDER}/Capitolo_${chapterNumber}.png`;
  image.alt = chapterTitle;
  image.loading = "lazy";
  protectImage(image);

  image.onerror = () => {
    image.style.display = "none";
  };

  const body = document.createElement("div");
  body.className = "chapter-card-body";

  const title = document.createElement("strong");
  title.textContent = chapterTitle;

  const hint = document.createElement("span");
  hint.textContent = "Apri capitolo";

  body.append(title, hint);
  card.append(image, body);

  return card;
}

function protectImage(image) {
  image.addEventListener("contextmenu", (event) => event.preventDefault());
  image.addEventListener("dragstart", (event) => event.preventDefault());
  image.addEventListener("copy", (event) => event.preventDefault());
}

function loadImage(url, alt) {
  return new Promise((resolve, reject) => {
    const image = new Image();

    const timeout = window.setTimeout(() => {
      reject(new Error(`Tempo scaduto durante il caricamento: ${url}`));
    }, 45000);

    image.onload = () => {
      window.clearTimeout(timeout);
      resolve(image);
    };

    image.onerror = () => {
      window.clearTimeout(timeout);
      reject(new Error(`Immagine non trovata o non caricabile: ${url}`));
    };

    image.alt = alt;
    image.loading = "eager";
    image.decoding = "async";
    protectImage(image);
    image.src = url;
  });
}

async function openChapter(chapterFolder) {
  currentLoadToken++;
  const loadToken = currentLoadToken;
  const chapterTitle = getChapterTitle(chapterFolder);

  showReader();
  bookPages.innerHTML = "";
  readerTitle.textContent = chapterTitle;
  readerStatus.textContent = "Preparazione pagine...";
  readerLoading.style.display = "block";
  readerLoading.textContent = "Caricamento pagine...";

  let page = 1;
  let loadedPages = 0;

  while (loadToken === currentLoadToken) {
    const url = buildQuizBookImageUrl(chapterFolder, page);
    readerStatus.textContent = `Caricamento pagina ${page}...`;

    try {
      const image = await loadImage(url, `${chapterTitle} - pagina ${page}`);

      if (loadToken !== currentLoadToken) {
        return;
      }

      const pageWrap = document.createElement("div");
      pageWrap.className = "book-page";
      pageWrap.appendChild(image);
      bookPages.appendChild(pageWrap);

      loadedPages++;
      readerStatus.textContent = `${loadedPages} pagine caricate`;
      page++;
    } catch (error) {
      if (loadToken !== currentLoadToken) {
        return;
      }

      if (loadedPages === 0) {
        readerLoading.textContent = "Nessuna pagina trovata per questo capitolo.";
        readerStatus.textContent = "Nessuna pagina caricata";
      } else {
        readerLoading.style.display = "none";
        readerStatus.textContent = `${loadedPages} pagine caricate`;
      }

      return;
    }
  }
}

function renderChapters() {
  chaptersGrid.innerHTML = "";

  if (!QUIZBOOK_CHAPTERS.length) {
    errorBox.style.display = "block";
    return;
  }

  errorBox.style.display = "none";
  QUIZBOOK_CHAPTERS.forEach((chapterFolder, index) => {
    chaptersGrid.appendChild(createChapterCard(chapterFolder, index));
  });
}

document.addEventListener("contextmenu", (event) => {
  if (event.target instanceof HTMLImageElement) {
    event.preventDefault();
  }
});

openBookBtn.addEventListener("click", showChapters);
backBtn.addEventListener("click", showCover);
closeReaderBtn.addEventListener("click", () => {
  currentLoadToken++;
  showChapters();
});

renderChapters();
