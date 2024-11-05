// Keep track of whether the navigation was referred from Medium
let isRedirectedFromMedium = false;

const mediumDomains = ["medium.com"];

function isMediumDomain(url) {
  return mediumDomains.some((domain) => url.includes(domain));
}

chrome.webNavigation.onBeforeNavigate.addListener((details) => {
  const referrer = details.transitionQualifiers.includes("from_address_bar")
    ? ""
    : details.transitionType === "link"
    ? details.url
    : document.referrer;

  isRedirectedFromMedium = referrer && isMediumDomain(referrer);
});

chrome.webNavigation.onCompleted.addListener(
  (details) => {
    if (isRedirectedFromMedium) {
      isRedirectedFromMedium = false;

      chrome.scripting.executeScript({
        target: { tabId: details.tabId },
        files: ["content.js"],
      });
    }
  },
  {
    url: [
      { urlMatches: "*://*/*" }, // Track any URL (can be modified to specific domains)
    ],
  }
);
