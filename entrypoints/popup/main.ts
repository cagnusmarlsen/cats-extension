import "./style.css";

const hidePage = `body > :not(.animal-image) {
  display: none;
}`;

async function getImages() {
  const url = "https://cat14.p.rapidapi.com/v1/images/search";
  const options = {
    method: "GET",
    headers: {
      "x-api-key":
        "live_tkfn5Qu13T9qimIfGmAxBAFooC12t7GvENwLXIoJQRTgUv83zQ8mjz5cSpzahmyK",
      "X-RapidAPI-Key": "67c9161915msh55df2763a824ba7p18fc83jsn999ba22017be",
      "X-RapidAPI-Host": "cat14.p.rapidapi.com",
    },
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    console.log(result[0].url);
    return result[0].url;
  } catch (error) {
    console.error(error);
  }
}

async function getCurrentTab() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  let [tab] = await browser.tabs.query(queryOptions);
  return tab;
}

const teb = await getCurrentTab();
let flag = false;
function listenForClicks() {
  document.addEventListener("click", (event) => {
    async function addPetImage() {
      if (teb.id !== undefined) {
        if (flag === false) {
          await browser.scripting.insertCSS({
            target: { tabId: teb.id },
            css: hidePage,
          });
        }
        const url = await getImages();
        console.log("this is url", url);

        if (teb.id !== undefined) {
          browser.tabs.sendMessage(teb.id, {
            command: "addImage",
            animalUrl: url,
          });
        }
        flag = true;
      }
    }

    function reset() {
      flag = false;
      if (teb.id !== undefined) {
        browser.scripting
          .removeCSS({ target: { tabId: teb.id }, css: hidePage })
          .then(() => {
            if (teb.id !== undefined) {
              console.log("removedcss");
              browser.tabs.sendMessage(teb.id, {
                command: "reset",
              });
            }
          });
      }
    }

    if ((event.target as HTMLElement).id === "cats") {
      console.log("first")
      browser.tabs
        .query({ active: true, currentWindow: true })
        .then(addPetImage);
    } else if ((event.target as HTMLElement).id === "reset") {
      browser.tabs.query({ active: true, currentWindow: true }).then(reset);
    }
  });
}

if (teb.id !== undefined) {
  browser.scripting
    .executeScript({
      target: { tabId: teb.id },
      files: ["/content-scripts/content.js"],
    })
    .then(listenForClicks);
}
