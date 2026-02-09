/* =========================
   Movie Discovery App
========================= */

/** DATA */
const movies = [
  {
    id: 1,
    title: "Inception",
    year: 2010,
    genres: ["Sci-Fi", "Action", "Thriller"],
    poster: "images/inception.jpg",
    description:
      "Một tên trộm chuyên đánh cắp bí mật bằng cách xâm nhập giấc mơ nhận nhiệm vụ cấy ghép ý tưởng vào tiềm thức.",
    director: "Christopher Nolan",
    cast: "Leonardo DiCaprio, Joseph Gordon-Levitt, Ellen Page",
    runtime: "148 phút",
  },
  {
    id: 2,
    title: "The Matrix",
    year: 1999,
    genres: ["Sci-Fi", "Action"],
    poster: "images/thematrix.jpg",
    description:
      "Một lập trình viên phát hiện thế giới mình đang sống chỉ là mô phỏng và gia nhập cuộc chiến giành tự do.",
    director: "The Wachowskis",
    cast: "Keanu Reeves, Laurence Fishburne, Carrie-Anne Moss",
    runtime: "136 phút",
  },
  {
    id: 3,
    title: "Interstellar",
    year: 2014,
    genres: ["Sci-Fi", "Drama", "Adventure"],
    poster: "images/interstellar.jpg",
    description:
      "Một nhóm phi hành gia vượt không gian để tìm hành tinh mới cho nhân loại khi Trái Đất đang tàn lụi.",
    director: "Christopher Nolan",
    cast: "Matthew McConaughey, Anne Hathaway, Jessica Chastain",
    runtime: "169 phút",
  },
  {
    id: 4,
    title: "Toy Story",
    year: 1995,
    genres: ["Animation", "Family", "Comedy"],
    poster: "images/toystory.jpg",
    description:
      "Những món đồ chơi có linh hồn bắt đầu cuộc phiêu lưu khi chủ nhân của chúng mang về đồ chơi mới.",
    director: "John Lasseter",
    cast: "Tom Hanks, Tim Allen",
    runtime: "81 phút",
  },
  {
    id: 5,
    title: "Titanic",
    year: 1997,
    genres: ["Romance", "Drama"],
    poster: "images/titanic.jpg",
    description:
      "Một câu chuyện tình lãng mạn trên con tàu huyền thoại trong chuyến hải trình định mệnh.",
    director: "James Cameron",
    cast: "Leonardo DiCaprio, Kate Winslet",
    runtime: "195 phút",
  },
  {
    id: 6,
    title: "The Dark Knight",
    year: 2008,
    genres: ["Action", "Crime", "Drama"],
    poster: "images/darkknight.jpg",
    description:
      "Batman đối đầu Joker – kẻ gieo rắc hỗn loạn và thử thách ranh giới công lý của Gotham.",
    director: "Christopher Nolan",
    cast: "Christian Bale, Heath Ledger, Aaron Eckhart",
    runtime: "152 phút",
  },
];

/** DOM */
const movieGrid = document.getElementById("movieGrid");
const genreList = document.getElementById("genreList");
const searchInput = document.getElementById("searchInput");
const emptyState = document.getElementById("emptyState");
const countText = document.getElementById("countText");
const activeGenreText = document.getElementById("activeGenreText");
const activeFilterNote = document.getElementById("activeFilterNote");
const clearFiltersBtn = document.getElementById("clearFiltersBtn");

const modalOverlay = document.getElementById("modalOverlay");
const modalCloseBtn = document.getElementById("modalCloseBtn");
const modalOkBtn = document.getElementById("modalOkBtn");

const modalPoster = document.getElementById("modalPoster");
const modalTitle = document.getElementById("modalTitle");
const modalMeta = document.getElementById("modalMeta");
const modalGenres = document.getElementById("modalGenres");
const modalDesc = document.getElementById("modalDesc");
const modalDirector = document.getElementById("modalDirector");
const modalCast = document.getElementById("modalCast");
const modalRuntime = document.getElementById("modalRuntime");

const themeToggle = document.getElementById("themeToggle");
const modeLabel = document.getElementById("modeLabel");

const bt30Link = document.getElementById("bt30Link");

/** STATE */
let selectedGenres = new Set();
let searchKeyword = "";

/** Utils */
function escapeHTML(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function debounce(fn, delay = 350) {
  let t = null;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), delay);
  };
}

/** SVG fallback poster */
function svgFallback(title) {
  const safe = String(title).slice(0, 18);
  return `
  <svg xmlns="http://www.w3.org/2000/svg" width="600" height="900">
    <defs>
      <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0" stop-color="#6b7280"/>
        <stop offset="1" stop-color="#111827"/>
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#g)"/>
    <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle"
          font-family="Arial" font-size="48" fill="white">${safe}</text>
  </svg>`;
}

/** Genre auto detect */
function getAllGenres(data) {
  const set = new Set();
  data.forEach((m) => m.genres.forEach((g) => set.add(g)));
  return Array.from(set).sort((a, b) => a.localeCompare(b, "vi"));
}

function renderGenreCheckboxes() {
  if (!genreList) return;
  const genres = getAllGenres(movies);

  genreList.innerHTML = genres
    .map(
      (g) => `
      <label class="chk">
        <input type="checkbox" value="${escapeHTML(g)}" />
        <span>${escapeHTML(g)}</span>
      </label>
    `
    )
    .join("");

  genreList.querySelectorAll('input[type="checkbox"]').forEach((cb) => {
    cb.addEventListener("change", () => {
      const val = cb.value;
      if (cb.checked) selectedGenres.add(val);
      else selectedGenres.delete(val);
      applyFiltersAndRender();
    });
  });
}

/** Filter logic (genre + search hoạt động đồng thời) */
function filterMovies(data) {
  const kw = searchKeyword.trim().toLowerCase();

  return data.filter((m) => {
    const passGenre =
      selectedGenres.size === 0 ||
      m.genres.some((g) => selectedGenres.has(g));

    const passSearch =
      kw === "" || m.title.toLowerCase().includes(kw);

    return passGenre && passSearch;
  });
}

/** Render cards */
function renderMovies(list) {
  if (!movieGrid) return;

  movieGrid.innerHTML = list
    .map((m) => {
      const chips = m.genres
        .slice(0, 3)
        .map((g) => `<span class="chip">${escapeHTML(g)}</span>`)
        .join("");

      return `
        <article class="card" data-id="${m.id}" tabindex="0" role="button">
          <img class="poster" src="${escapeHTML(m.poster)}" alt="${escapeHTML(m.title)}"
               onerror="this.onerror=null;this.src='data:image/svg+xml;utf8,${encodeURIComponent(svgFallback(m.title))}'" />
          <div class="card-body">
            <h3 class="card-title">${escapeHTML(m.title)}</h3>
            <p class="card-year">Năm: ${escapeHTML(m.year)}</p>
            <div class="card-genres">${chips}</div>
          </div>
        </article>
      `;
    })
    .join("");

  movieGrid.querySelectorAll(".card").forEach((card) => {
    card.addEventListener("click", () => openModalById(Number(card.dataset.id)));
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openModalById(Number(card.dataset.id));
      }
    });
  });
}

/** Modal open/close */
function openModalById(id) {
  const movie = movies.find((m) => m.id === id);
  if (!movie || !modalOverlay) return;

  modalPoster.src = movie.poster;
  modalPoster.onerror = () => {
    modalPoster.onerror = null;
    modalPoster.src =
      "data:image/svg+xml;utf8," + encodeURIComponent(svgFallback(movie.title));
  };

  modalTitle.textContent = movie.title;
  modalMeta.textContent = `Năm ${movie.year}`;

  modalGenres.innerHTML = movie.genres
    .map((g) => `<span class="chip">${escapeHTML(g)}</span>`)
    .join("");

  modalDesc.textContent = movie.description || "Chưa có mô tả.";
  modalDirector.textContent = movie.director || "—";
  modalCast.textContent = movie.cast || "—";
  modalRuntime.textContent = movie.runtime || "—";

  modalOverlay.hidden = false;
  document.body.style.overflow = "hidden";
}

function closeModal() {
  if (!modalOverlay) return;
  modalOverlay.hidden = true;
  document.body.style.overflow = "";
}

function bindModalClose() {
  if (!modalOverlay) return;

  modalCloseBtn && modalCloseBtn.addEventListener("click", closeModal);
  modalOkBtn && modalOkBtn.addEventListener("click", closeModal);

  // click ra ngoài modal để đóng
  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  // ESC để đóng
  document.addEventListener("keydown", (e) => {
    if (!modalOverlay.hidden && e.key === "Escape") closeModal();
  });
}

/** Update UI notes */
function updateNotes(list) {
  countText && (countText.textContent = String(list.length));
  activeGenreText && (activeGenreText.textContent = String(selectedGenres.size));

  const kw = searchKeyword.trim();
  const genreText =
    selectedGenres.size === 0
      ? "Tất cả thể loại"
      : `Thể loại: ${Array.from(selectedGenres).join(", ")}`;

  const searchText = kw === "" ? "Không tìm kiếm" : `Từ khoá: "${kw}"`;

  activeFilterNote && (activeFilterNote.textContent = `${genreText} • ${searchText}`);

  if (emptyState) emptyState.hidden = list.length !== 0;
}

function applyFiltersAndRender() {
  const filtered = filterMovies(movies);
  renderMovies(filtered);
  updateNotes(filtered);
}

/** Search with debounce */
const onSearchDebounced = debounce(() => {
  searchKeyword = searchInput ? (searchInput.value || "") : "";
  applyFiltersAndRender();
}, 350);

searchInput && searchInput.addEventListener("input", onSearchDebounced);

/** Clear filters */
clearFiltersBtn &&
  clearFiltersBtn.addEventListener("click", () => {
    selectedGenres.clear();
    genreList &&
      genreList
        .querySelectorAll('input[type="checkbox"]')
        .forEach((cb) => (cb.checked = false));

    if (searchInput) searchInput.value = "";
    searchKeyword = "";
    applyFiltersAndRender();
  });

/** Light/Dark + localStorage */
const THEME_KEY = "movie_app_theme";

function applyTheme(mode) {
  const isDark = mode === "dark";
  document.body.classList.toggle("dark-mode", isDark);
  if (themeToggle) themeToggle.checked = isDark;
  if (modeLabel) modeLabel.textContent = isDark ? "Dark" : "Light";
}

function loadTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === "dark" || saved === "light") applyTheme(saved);
  else applyTheme("light");
}

themeToggle &&
  themeToggle.addEventListener("change", () => {
    const mode = themeToggle.checked ? "dark" : "light";
    localStorage.setItem(THEME_KEY, mode);
    applyTheme(mode);
  });

/** Link bài tập 30 */
function initBt30Link() {
  // DÁN URL BÀI TẬP 30 CỦA BẠN Ở ĐÂY:
  const urlBai30 = "./images/baitap30.jpg";

  if (!bt30Link) return;

  if (urlBai30.startsWith("http")) {
    bt30Link.href = urlBai30;
  } else {
    bt30Link.href = "#";
    bt30Link.addEventListener("click", (e) => {
      e.preventDefault();
      alert("Bạn chưa dán URL bài tập 30. Mở js/app.js và thay PASTE_YOUR_EXERCISE_30_URL_HERE");
    });
  }
}

/** INIT */
document.addEventListener("DOMContentLoaded", () => {
  // đảm bảo vừa vào trang modal tắt
  if (modalOverlay) modalOverlay.hidden = true;
  document.body.style.overflow = "";

  loadTheme();
  initBt30Link();
  renderGenreCheckboxes();
  bindModalClose();
  applyFiltersAndRender();
});
