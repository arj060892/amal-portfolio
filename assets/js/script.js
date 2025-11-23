document.addEventListener('DOMContentLoaded', function() {
  fetch('data.json')
    .then(response => response.json())
    .then(data => {
      const workSamplesGrid = document.getElementById('work-samples-grid');
      let portfolioHTML = '';
      const animations = ['fade-up', 'fade-down', 'fade-right', 'fade-left', 'zoom-in', 'zoom-out'];

      data.work_samples.forEach((item, index) => {
        let cardContent = '';
        const animation = animations[index % animations.length]; // Cycle through animations

        if (item.type === 'image') {
          cardContent = `<img src="${item.src}" class="card-img-top" alt="${item.title}">`;
        } else if (item.type === 'youtube') {
          cardContent = `<div class="ratio ratio-16x9"><iframe src="${item.src}" title="${item.title}" frameborder="0" allowfullscreen></iframe></div>`;
        } else if (item.type === 'instagram') {
          cardContent = `<iframe src="${item.src}" width="100%" height="500" frameborder="0" scrolling="no"></iframe>`;
        }

        portfolioHTML += `
          <div class="col-md-4 mb-4" data-aos="${animation}">
            <div class="card h-100">
              ${cardContent}
              <div class="card-body">
                <h5 class="card-title">${item.title}</h5>
              </div>
            </div>
          </div>
        `;
      });

      workSamplesGrid.innerHTML = portfolioHTML;

      // Initialize AOS after the content is loaded
      AOS.init({
        duration: 800,
        once: true,
      });
    })
    .catch(error => console.error('Error fetching portfolio data:', error));
});
