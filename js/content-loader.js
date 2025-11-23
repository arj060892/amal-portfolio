// Load everything from content.json
fetch("data/content.json")
  .then((res) => res.json())
  .then((data) => {
    renderImagesCarousel(data.images || []);
    renderVideosCarousel(data.videos || []);
    renderPdfsCarousel(data.pdfs || []);
    renderPhotography(data.photos || []);
    initSwipers();
  })
  .catch((err) => console.error("Content load error:", err));

// ============================
// IMAGES CAROUSEL
// ============================
function renderImagesCarousel(items) {
  const wrapper = document.getElementById("images-swiper-wrapper");
  if (!wrapper) return;

  items.forEach((url) => {
    const slide = document.createElement("div");
    slide.className = "swiper-slide p-0";
    slide.innerHTML = `
      <div class="ratio ratio-4x3">
        <img src="${url}"
             loading="lazy"
             style="width:100%;height:100%;object-fit:cover;border-radius:14px;">
      </div>
    `;
    slide.onclick = () => openImageModal(url);
    wrapper.appendChild(slide);
  });
}

// ============================
// VIDEOS CAROUSEL
// ============================
function renderVideosCarousel(items) {
  const wrapper = document.getElementById("videos-swiper-wrapper");
  if (!wrapper) return;

  items.forEach((url) => {
    const slide = document.createElement("div");
    slide.className = "swiper-slide p-0";

    let inner = "";

    // YouTube
    if (url.includes("youtube") || url.includes("youtu.be")) {
      const id = getYouTubeId(url);
      inner = `
        <div class="ratio ratio-16x9">
          <iframe 
            src="https://www.youtube.com/embed/${id}" 
            allowfullscreen
            loading="lazy"
            style="border:none;width:100%;height:100%;border-radius:14px;">
          </iframe>
        </div>
      `;
    } else if (url.includes("instagram.com")) {
  inner = `
    <div class="ratio ratio-16x9">
      <div class="ig-simple-block"
           style="
             position:absolute;
             top:0;
             left:0;
             width:100%;
             height:100%;
             border-radius:18px;
             overflow:hidden;
             background: linear-gradient(135deg, #feda75, #fa7e1e, #d62976, #962fbf, #4f5bd5);
             background-size: 300% 300%;
             animation: igGradient 6s ease infinite;
             display:flex;
             align-items:center;
             justify-content:center;
             cursor:pointer;
           ">
        
        <i class="bi bi-instagram" 
           style="
             font-size:72px;
             color:white;
             opacity:0.95;
             filter: drop-shadow(0 3px 10px rgba(0,0,0,0.5));
           ">
        </i>

      </div>
    </div>
  `;
}


    slide.innerHTML = inner;
    slide.addEventListener("click", () => {
      if (url.includes("instagram.com")) {
        window.open(url, "_blank");
      }
    });

    wrapper.appendChild(slide);
  });

  // Reprocess Instagram embeds
  if (window.instgrm && window.instgrm.Embeds) {
    window.instgrm.Embeds.process();
  }
}

function getInstagramThumbnail(url) {
  const match = url.match(/(?:reel|p)\/([^/?]+)/);
  if (!match) return null;

  const id = match[1];
  return `https://www.instagram.com/p/${id}/media/?size=l`;
}

// ============================
// PDF CAROUSEL (thumbnail via PDF.js)
// ============================
function renderPdfsCarousel(items) {
  const wrapper = document.getElementById("pdfs-swiper-wrapper");
  if (!wrapper) return;

  items.forEach((url) => {
    const slide = document.createElement("div");
    slide.className = "swiper-slide p-0";

    slide.innerHTML = `
      <div class="ratio ratio-4x3"
           style="border-radius:14px;background:#111830;cursor:pointer;">
        <canvas class="pdf-thumb" style="width:100%;border-radius:14px;"></canvas>
      </div>
    `;

    wrapper.appendChild(slide);

    const canvas = slide.querySelector(".pdf-thumb");
    generatePdfThumbnail(url, canvas);

    slide.onclick = () => openPdfModal(url);
  });
}

// ============================
// PHOTOGRAPHY – Pinterest Grid
// ============================
function renderPhotography(items) {
  const gallery = document.getElementById("photo-gallery");
  if (!gallery) return;

  // Make sure it's not constrained by Bootstrap row
  gallery.classList.remove("row", "g-3");

  items.forEach((url) => {
    const img = document.createElement("img");
    img.src = url;
    img.loading = "lazy";
    img.style.width = "100%";
    img.style.marginBottom = "16px";
    img.style.borderRadius = "14px";
    img.style.cursor = "pointer";
    img.style.display = "inline-block";
    img.style.breakInside = "avoid";

    img.onclick = () => openImageModal(url);
    gallery.appendChild(img);
  });
}

// ============================
// SWIPER INIT
// ============================
function initSwipers() {
  const options = {
    spaceBetween: 20,
    slidesPerView: 1.15,
    loop: false,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    breakpoints: {
      640: { slidesPerView: 1.4 },
      768: { slidesPerView: 1.8 },
      1200: { slidesPerView: 2.3 },
    },
  };

  if (document.querySelector("#images-swiper")) {
    new Swiper("#images-swiper", options);
  }
  if (document.querySelector("#videos-swiper")) {
    new Swiper("#videos-swiper", options);
  }
  if (document.querySelector("#pdfs-swiper")) {
    new Swiper("#pdfs-swiper", options);
  }
}

// ============================
// PDF.js Thumbnail + Modal
// ============================
function generatePdfThumbnail(pdfUrl, canvasEl) {
  if (!window.pdfjsLib || !canvasEl) {
    console.warn("pdfjsLib missing, skipping PDF thumbnail");
    return;
  }

  pdfjsLib
    .getDocument(pdfUrl)
    .promise.then((pdf) => pdf.getPage(1))
    .then((page) => {
      const viewport = page.getViewport({ scale: 0.4 });
      const ctx = canvasEl.getContext("2d");
      canvasEl.width = viewport.width;
      canvasEl.height = viewport.height;
      return page.render({ canvasContext: ctx, viewport }).promise;
    })
    .catch((err) => console.error("PDF thumb error:", err));
}

function openPdfModal(url) {
  if (!window.pdfjsLib) {
    window.open(url, "_blank");
    return;
  }

  let modal = document.getElementById("pdfModal");
  if (!modal) {
    modal = document.createElement("div");
    modal.className = "modal fade";
    modal.id = "pdfModal";
    modal.innerHTML = `
      <div class="modal-dialog modal-xl modal-dialog-centered">
        <div class="modal-content bg-dark">
          <button type="button" class="btn-close position-absolute end-0 m-3" data-bs-dismiss="modal"></button>
          <div class="modal-body p-2" style="max-height:80vh; overflow-y:auto;">
            <div id="pdfPagesContainer"
                 class="w-100 d-flex flex-column align-items-center">
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  const pagesContainer = document.getElementById("pdfPagesContainer");
  pagesContainer.innerHTML = ""; // Clear previous pages

  pdfjsLib
    .getDocument(url)
    .promise.then(async (pdf) => {
      console.log(`PDF loaded: ${pdf.numPages} pages`);

      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: 1.2 });

        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        canvas.style.marginBottom = "20px";
        canvas.style.borderRadius = "12px";

        const ctx = canvas.getContext("2d");

        await page.render({ canvasContext: ctx, viewport }).promise;

        pagesContainer.appendChild(canvas);
      }
    })
    .catch((err) => console.error("Error loading multi-page PDF:", err));

  new bootstrap.Modal(modal).show();
}

// ============================
// IMAGE MODAL
// ============================
function openImageModal(url) {
  let modal = document.getElementById("imageModal");
  if (!modal) {
    modal = document.createElement("div");
    modal.className = "modal fade";
    modal.id = "imageModal";
    modal.innerHTML = `
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content bg-dark">
          <button type="button" class="btn-close position-absolute end-0 m-3" data-bs-dismiss="modal"></button>
          <div class="modal-body p-0 text-center">
            <img id="imageModalImg" src="" class="img-fluid rounded">
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  document.getElementById("imageModalImg").src = url;
  new bootstrap.Modal(modal).show();
}

// ============================
// HELPERS
// ============================
function getYouTubeId(url) {
  if (!url) return "";
  const match = url.match(/(youtu\.be\/|v=)([^&]+)/);
  return match ? match[2] : "";
}
