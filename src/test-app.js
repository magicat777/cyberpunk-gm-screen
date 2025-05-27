// Test application to verify infrastructure
import { eventBus, Events } from './lib/EventBus.js';
import { appStore, actions, selectors, thunks } from './stores/appStore.js';

// Update store state display
function updateStoreDisplay() {
  const stateElement = document.getElementById('storeState');
  if (stateElement) {
    const state = appStore.getState();
    stateElement.textContent = JSON.stringify(state, null, 2);
  }
}

// Subscribe to store changes
appStore.subscribe((state, prevState) => {
  window.addToEventLog('Store state changed');
  updateStoreDisplay();
});

// Subscribe to events
eventBus.on('*', ({ event, data }) => {
  window.addToEventLog(`Event: ${event}`);
});

// Test buttons
document.getElementById('testStore')?.addEventListener('click', () => {
  // Update settings
  appStore.dispatchAction(actions.updateSettings({
    fontSize: Math.floor(Math.random() * 8) + 14,
    animations: Math.random() > 0.5
  }));
  
  // Add a notification
  appStore.dispatchAction(thunks.showNotification({
    title: 'Store Test',
    message: 'Settings updated successfully',
    type: 'success',
    duration: 3000
  }));
  
  window.showNotification('Store updated!', 'success');
});

document.getElementById('testEvents')?.addEventListener('click', () => {
  // Emit various events
  eventBus.emit(Events.PANEL_CREATE, { type: 'dice-roller' });
  eventBus.emit(Events.THEME_CHANGE, { theme: 'test-theme' });
  eventBus.emit(Events.UI_SIDEBAR_TOGGLE, { open: true });
  
  window.showNotification('Events emitted!', 'info');
});

document.getElementById('testNotification')?.addEventListener('click', () => {
  const types = ['info', 'success', 'warning', 'error'];
  const type = types[Math.floor(Math.random() * types.length)];
  
  appStore.dispatchAction(thunks.showNotification({
    title: `Test ${type.toUpperCase()}`,
    message: `This is a ${type} notification`,
    type: type,
    duration: 5000
  }));
  
  window.showNotification(`${type} notification added to store`, type);
});

// Initial display
updateStoreDisplay();
window.addToEventLog('Infrastructure loaded successfully');

// Export for testing
export { eventBus, appStore, Events, actions, selectors };

console.log('Test app initialized', {
  eventBus,
  appStore,
  storeState: appStore.getState()
});