// assets/js/dynamic-content.js

// Initialize when document is ready
document.addEventListener("DOMContentLoaded", function () {
  // Load all JSON data
  loadSkills();
  loadWorkSamples();
  loadExperience();
});

// Function to load skills from JSON
async function loadSkills() {
  try {
    const response = await fetch("assets/data/skills.json");
    const skillsData = await response.json();
    displaySkills(skillsData);
  } catch (error) {
    console.error("Error loading skills:", error);
    document.getElementById("skills-container").innerHTML =
      '<div class="col-12 text-center text-muted"><p>Skills data could not be loaded.</p></div>';
  }
}

// Function to display skills
function displaySkills(skillsData) {
  const container = document.getElementById("skills-container");
  let html = "";

  skillsData.categories.forEach((category) => {
    html += `
            <div class="col-md-4 skill-category">
                <h5 class="fw-bold mb-3">${category.name}</h5>
                <ul class="list-unstyled">
        `;

    category.items.forEach((skill) => {
      html += `<li><i class="bi bi-check-circle-fill text-primary me-2"></i>${skill}</li>`;
    });

    html += `
                </ul>
            </div>
        `;
  });

  container.innerHTML = html;
}

// Function to load work samples from JSON
async function loadWorkSamples() {
  try {
    const response = await fetch("assets/data/work-samples.json");
    const workSamplesData = await response.json();
    displayWorkSamples(workSamplesData);
  } catch (error) {
    console.error("Error loading work samples:", error);
    document.getElementById("work-samples-container").innerHTML =
      '<div class="col-12 text-center text-muted"><p>Work samples could not be loaded.</p></div>';
  }
}

// Function to display work samples
function displayWorkSamples(workSamplesData) {
  const container = document.getElementById("work-samples-container");
  let html = "";

  workSamplesData.items.forEach((sample) => {
    if (sample.type === "image") {
      html += `
                <div class="col-md-4 mb-4">
                    <div class="card work-sample-card h-100">
                        <a href="${
                          sample.url
                        }" data-lightbox="work-samples" data-title="${
        sample.title
      }">
                            <img src="${
                              sample.thumbnail || sample.url
                            }" class="card-img-top" alt="${sample.title}">
                        </a>
                        <div class="card-body">
                            <h5 class="card-title">${sample.title}</h5>
                            <p class="card-text">${sample.description}</p>
                            <small class="text-muted">${sample.date}</small>
                        </div>
                    </div>
                </div>
            `;
    } else if (sample.type === "youtube") {
      const videoId = extractYouTubeId(sample.url);
      html += `
                <div class="col-md-6 mb-4">
                    <div class="card work-sample-card h-100">
                        <div class="card-body p-0">
                            <iframe width="100%" height="315" src="https://www.youtube.com/embed/${videoId}" 
                                title="${sample.title}" frameborder="0" allowfullscreen></iframe>
                        </div>
                        <div class="card-body">
                            <h5 class="card-title">${sample.title}</h5>
                            <p class="card-text">${sample.description}</p>
                            <small class="text-muted">${sample.date}</small>
                        </div>
                    </div>
                </div>
            `;
    } else if (sample.type === "instagram") {
      html += `
                <div class="col-12 mb-4">
                    <div class="card work-sample-card">
                        <div class="card-body p-0">
                            <iframe src="${sample.url}" width="100%" height="500"></iframe>
                        </div>
                        <div class="card-body">
                            <h5 class="card-title">${sample.title}</h5>
                            <p class="card-text">${sample.description}</p>
                            <small class="text-muted">${sample.date}</small>
                        </div>
                    </div>
                </div>
            `;
    } else if (sample.type === "gdrive-video") {
      html += `
                <div class="col-md-6 mb-4">
                    <div class="card work-sample-card h-100">
                        <div class="card-body p-0">
                            <video width="100%" height="315" controls>
                                <source src="https://drive.google.com/uc?export=download&id=${extractGoogleDriveId(
                                  sample.url
                                )}" type="video/mp4">
                                Your browser does not support the video tag.
                            </video>
                        </div>
                        <div class="card-body">
                            <h5 class="card-title">${sample.title}</h5>
                            <p class="card-text">${sample.description}</p>
                            <small class="text-muted">${sample.date}</small>
                        </div>
                    </div>
                </div>
            `;
    }
  });

  container.innerHTML = html;

  // Initialize lightbox for images
  if (typeof lightbox !== "undefined") {
    lightbox.option({
      resizeDuration: 200,
      wrapAround: true,
      imageFadeDuration: 300,
    });
  }
}

// Function to load experience from JSON
async function loadExperience() {
  try {
    const response = await fetch("assets/data/experience.json");
    const experienceData = await response.json();
    displayExperience(experienceData);
  } catch (error) {
    console.error("Error loading experience:", error);
    document.getElementById("experience-container").innerHTML =
      '<div class="col-12 text-center text-muted"><p>Experience data could not be loaded.</p></div>';
  }
}

// Function to display experience
function displayExperience(experienceData) {
  const container = document.getElementById("experience-container");
  let html = "";

  experienceData.items.forEach((experience) => {
    html += `
            <div class="col-md-6 mb-4">
                <div class="card h-100">
                    <div class="card-body">
                        <h5 class="card-title">${experience.title}</h5>
                        <h6 class="card-subtitle mb-2 text-muted">${experience.company} (${experience.period})</h6>
                        <ul>
        `;

    experience.responsibilities.forEach((responsibility) => {
      html += `<li>${responsibility}</li>`;
    });

    html += `
                        </ul>
                    </div>
                </div>
            </div>
        `;
  });

  container.innerHTML = html;
}

// Helper function to extract YouTube ID from URL
function extractYouTubeId(url) {
  const regExp =
    /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[7].length === 11 ? match[7] : null;
}

// Helper function to extract Google Drive ID from URL
function extractGoogleDriveId(url) {
  const regExp = /\/d\/([^\/]+)/;
  const match = url.match(regExp);
  return match ? match[1] : null;
}
