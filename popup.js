// Get the links from the text file
fetch(chrome.runtime.getURL("leetcode_links.txt"))
  .then((response) => response.text())
  .then((text) => {
    const links = text.split("\n").map((link) => link.trim());
    const visitedLinks = JSON.parse(localStorage.getItem("visitedLinks") || "[]");

    // Render the links
    const linksDiv = document.getElementById("links");
    links.forEach((link) => {
      const linkDiv = document.createElement("div");
      linkDiv.className = "link";
      const excludedString = "https://leetcode.com/problems/";
      const excludedCharacter = "/"
      let linkname = link
// Remove the excluded string from the link
      linkname = linkname.replace(excludedString, '');
      linkname = linkname.replace(excludedCharacter, '');

// Set the modified link to the linkDiv's innerText
        linkDiv.innerText = linkname;
      if (visitedLinks.includes(link)) {
        linkDiv.classList.add("visited");
      }
      linkDiv.addEventListener("click", () => {
        if (!visitedLinks.includes(link)) {
          visitedLinks.push(link);
          localStorage.setItem("visitedLinks", JSON.stringify(visitedLinks));
          linkDiv.classList.add("visited");
        }
        chrome.tabs.create({ url: link, active: false }, () => {
          // Remove the link from the UI when it's opened
          linkDiv.remove();
        });
      });
      linksDiv.appendChild(linkDiv);
    });
  });

// Reset the visited links
document.getElementById("reset").addEventListener("click", () => {
  localStorage.removeItem("visitedLinks");
  document.querySelectorAll(".link.visited").forEach((linkDiv) => {
    linkDiv.classList.remove("visited");
  });
});

