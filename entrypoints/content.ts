export default defineContentScript({
  matches: ["*://*.google.com/*"],
  main() {
    if ((window as any).hasRun) {
      return;
    }
    (window as any).hasRun = true;

    browser.runtime.onMessage.addListener((message) => {
      if (message.command === "addImage") {
        const container = document.createElement("div");
        container.style.height = "100vh";
        container.className = "animal-image-container";
        container.style.display = "flex";
        container.style.alignItems = "center";
        container.style.justifyContent = "center";
        container.style.background = "#e283ac";

        const img = document.createElement("img");
        img.src = message.animalUrl;
        img.style.height = "50vh";
        img.style.width = "500px";
        img.style.paddingBottom = "20px";
        img.style.borderRadius = "10px";
        img.className = "animal-image";
        container.appendChild(img);
        document.body.appendChild(container);
      }

      if (message.command === "reset") {
        const existingContainer = document.querySelectorAll(
          ".animal-image-container"
        );
        if (existingContainer) {
          console.log("removed container");
          for (const container of existingContainer) {
            container.remove();
          }
        }
      }
    });
  },
});
