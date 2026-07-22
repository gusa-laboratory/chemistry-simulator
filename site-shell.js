(() => {
  const tabsIn = tablist => [...tablist.querySelectorAll('[role="tab"]')]
    .filter(tab => !tab.disabled && tab.getAttribute('aria-disabled') !== 'true');

  const syncTabStops = tablist => {
    const tabs = tabsIn(tablist);
    if (!tabs.length) return;
    const selected = tabs.find(tab => tab.getAttribute('aria-selected') === 'true') || tabs[0];
    tabs.forEach(tab => { tab.tabIndex = tab === selected ? 0 : -1; });
  };

  const syncAllTabStops = () => {
    document.querySelectorAll('[role="tablist"]').forEach(syncTabStops);
  };

  document.addEventListener('keydown', event => {
    const current = event.target.closest('[role="tab"]');
    if (!current) return;
    const tablist = current.closest('[role="tablist"]');
    if (!tablist) return;
    const tabs = tabsIn(tablist);
    const index = tabs.indexOf(current);
    if (index < 0) return;

    let nextIndex = null;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') nextIndex = (index + 1) % tabs.length;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') nextIndex = (index - 1 + tabs.length) % tabs.length;
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = tabs.length - 1;
    if (nextIndex === null) return;

    event.preventDefault();
    tabs[nextIndex].focus();
    tabs[nextIndex].click();
    requestAnimationFrame(() => syncTabStops(tablist));
  });

  document.addEventListener('click', event => {
    const tab = event.target.closest('[role="tab"]');
    if (!tab) return;
    const tablist = tab.closest('[role="tablist"]');
    if (tablist) requestAnimationFrame(() => syncTabStops(tablist));
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', syncAllTabStops, { once: true });
  } else {
    syncAllTabStops();
  }

})();
