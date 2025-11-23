fetch("data/content.json")
  .then((response) => response.json())
  .then((data) => renderWorkFeed(data.work))
  .catch((err) => console.error("Error loading content.json", err));

function renderWorkFeed(items) {
  const container = document.getElementById("work-feed");
  if (!container || !Array.isArray(items)) return;

  items.forEach((item) => {
    const card = document.createElement("article");
    card.className = "work-item card border-0 p-3 mb-3";
    card.setAttribute("data-aos", "fade-up");

    let icon = "";
    let bodyHtml = "";

    switch (item.type) {
      case "image":
        icon = '<i class="bi bi-image"></i>';
        bodyHtml = `
          <div class="ratio ratio-4x3 mb-2">
            <img src="${item.url}" class="img-fluid rounded" alt="${escapeHtml(
          item.title || "Image"
        )}" />
          </div>`;
        break;

      case "youtube":
        icon = '<i class="bi bi-play-circle-fill"></i>';
        const ytId = getYouTubeId(item.url);
        if (ytId) {
          bodyHtml = `
            <div class="ratio ratio-16x9 mb-2">
              <iframe src="https://www.youtube.com/embed/${ytId}" allowfullscreen></iframe>
            </div>`;
        }
        break;

      case "instagram":
        icon = '<i class="bi bi-instagram"></i>';
        const instaCode = extractInstaCode(item.url);
        if (instaCode) {
          bodyHtml = `
            <div class="ratio ratio-1x1 mb-2">
              <iframe src="https://www.instagram.com/p/${instaCode}/embed" allowfullscreen></iframe>
            </div>`;
        }
        break;

      case "gdrive-video":
        icon = '<i class="bi bi-play-btn-fill"></i>';
        const driveId = extractDriveId(item.url);
        if (driveId) {
          bodyHtml = `
            <div class="ratio ratio-16x9 mb-2">
              <iframe src="https://drive.google.com/file/d/${driveId}/preview" allowfullscreen></iframe>
            </div>`;
        }
        break;

      case "pdf":
        icon = '<i class="bi bi-file-earmark-pdf-fill"></i>';
        bodyHtml = `
          <div class="ratio ratio-4x3 mb-2">
            <iframe src="${item.url}"></iframe>
          </div>`;
        break;
    }

    const safeTitle = escapeHtml(item.title || "Work item");
    card.innerHTML = `
      <h5 class="mb-2 d-flex align-items-center gap-2">
        <span>${icon}</span>
        <span>${safeTitle}</span>
      </h5>
      ${bodyHtml}
      ${
        item.description
          ? `<p class="small text-muted mb-0">${escapeHtml(
              item.description
            )}</p>`
          : ""
      }
    `;

    container.appendChild(card);
  });
}

function getYouTubeId(url) {
  if (!url) return "";
  // Handles both ?v=ID and youtu.be/ID formats
  const vParam = url.split("v=")[1];
  if (vParam) {
    return vParam.split("&")[0];
  }
  const shortMatch = url.match(/youtu\.be\/([^?&]+)/);
  return shortMatch ? shortMatch[1] : "";
}

function extractDriveId(url) {
  if (!url) return "";
  const match = url.match(/\/d\/(.*?)\//);
  return match ? match[1] : "";
}

function extractInstaCode(url) {
  if (!url) return "";
  const parts = url.split("/");
  // typical: https://www.instagram.com/p/CODE/ or /reel/CODE/
  return parts[parts.length - 2] || "";
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
