
(() => {
  "use strict";

  const SITE_ORIGIN = "https://scoutdelsf.github.io";
  const SITE_PATH = "/mediasaver-site/";

  if (
    location.origin !== SITE_ORIGIN ||
    !location.pathname.startsWith(SITE_PATH)
  ) {
    return;
  }

  const CHANNEL = "MEDIASAVER_INSTALL_CENTER_V1";

  function reply(requestId) {
    if (typeof requestId !== "string" ||
        requestId.length > 100) return;

    if (!chrome.runtime?.id) return;

    const manifest = chrome.runtime.getManifest();

    window.postMessage({
      channel: CHANNEL,
      type: "EXTENSION_STATUS_RESPONSE",
      requestId,
      installed: true,
      extensionVersion: manifest.version,
      extensionName: manifest.name
    }, SITE_ORIGIN);
  }

  window.addEventListener("message", event => {
    if (
      event.source !== window ||
      event.origin !== SITE_ORIGIN
    ) return;

    const data = event.data;

    if (
      data?.channel !== CHANNEL ||
      data?.type !== "EXTENSION_STATUS_REQUEST"
    ) return;

    reply(data.requestId);
  });

  // 告訴網站：擴充功能已準備好接受版本查詢。
  window.postMessage({
    channel: CHANNEL,
    type: "EXTENSION_BRIDGE_READY"
  }, SITE_ORIGIN);
})();
