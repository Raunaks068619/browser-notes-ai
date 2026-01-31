const BUTTON_ID = "lo-note-trigger";

function createButton() {
  if (document.getElementById(BUTTON_ID)) {
    return document.getElementById(BUTTON_ID) as HTMLButtonElement;
  }

  const button = document.createElement("button");
  button.id = BUTTON_ID;
  button.type = "button";
  button.textContent = "Lo";
  button.setAttribute("aria-label", "Open Lo-Note side panel");

  Object.assign(button.style, {
    position: "fixed",
    right: "20px",
    top: "50%",
    transform: "translateY(-50%)",
    zIndex: "2147483647",
    width: "44px",
    height: "44px",
    minWidth: "44px",
    minHeight: "44px",
    maxWidth: "44px",
    maxHeight: "44px",
    aspectRatio: "1 / 1",
    borderRadius: "50%",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    background: "#121212",
    color: "#ffffff",
    fontFamily: "system-ui, -apple-system, sans-serif",
    fontWeight: "600",
    fontSize: "14px",
    cursor: "pointer",
    boxShadow: "0 6px 18px rgba(0,0,0,0.35)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0",
    lineHeight: "1",
    boxSizing: "border-box"
  });

  button.addEventListener("click", () => {
    chrome.runtime.sendMessage({ type: "OPEN_PANEL" });
  });

  document.documentElement.appendChild(button);
  return button;
}

createButton();

// Theme Detection Logic
function getBackgroundColor() {
  const bodyBg = window.getComputedStyle(document.body).backgroundColor;
  const htmlBg = window.getComputedStyle(document.documentElement).backgroundColor;
  if (bodyBg === "rgba(0, 0, 0, 0)" || bodyBg === "transparent") {
    return htmlBg === "rgba(0, 0, 0, 0)" ? "rgb(255, 255, 255)" : htmlBg;
  }
  return bodyBg;
}

function sendTheme() {
  try {
    const color = getBackgroundColor();
    chrome.runtime.sendMessage({ type: "SET_THEME_COLOR", color });
  } catch {
    // Extension context might be invalidated
  }
}

// Send initially
setTimeout(sendTheme, 500);

// Watch for changes
window.addEventListener("focus", sendTheme);
