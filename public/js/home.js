$(document).ready(() => {
    $.get("/api/posts", results => {
        outputPosts(results, $(".postsContainer"));
    })
})


function outputPosts(results, container) {
    container.html("");

    results.forEach(result => {
        var html = createPostHtml(result)
        container.append(html);
    });
    if (results.length == 0) {
        container.append("<span class='noResults'>Nothing to show.</span>")
    }
}


document.addEventListener("DOMContentLoaded", () => {
    axios.get("http://localhost:8080/api/ads")
      .then(response => {
        const ads = response.data;
        const advertContainer = document.querySelector(".advertContainer");
  
        ads.forEach(ad => {
          const adEl = document.createElement("div");
          adEl.className = "advert";
  
          adEl.innerHTML = `
            <a href="${ad.link}" target="_blank">
              <img src="${ad.imageUrl}" alt="${ad.title}" style="width: 100%;">
              <p>${ad.title}</p>
            </a>
          `;
  
          advertContainer.appendChild(adEl);
        });
      })
      .catch(error => {
        console.error("Failed to load ads:", error);
      });
  });
  

