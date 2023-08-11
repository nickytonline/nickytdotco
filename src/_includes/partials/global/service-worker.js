self.addEventListener("install", async (event) => {
  // The promise that skipWaiting() returns can be safely ignored.
  self.skipWaiting();

  const registrations = await navigator.serviceWorker.getRegistrations();

  for (let registration of registrations) {
    registration.unregister();
  }
});
