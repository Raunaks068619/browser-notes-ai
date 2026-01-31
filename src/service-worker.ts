chrome.runtime.onMessage.addListener((message, sender) => {
  if (message?.type === "OPEN_PANEL") {
    const windowId = sender.tab?.windowId;
    if (typeof windowId !== "number") {
      return;
    }
    chrome.sidePanel.open({ windowId });
  }
});

// Handle keyboard shortcut command
chrome.commands.onCommand.addListener(async (command) => {
  if (command !== "toggle-sidepanel") return;

  // Get the current window
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const windowId = tab?.windowId;

  if (typeof windowId !== "number") return;

  // Just open the panel (Chrome doesn't have a close API for side panels)
  chrome.sidePanel.open({ windowId });
});
