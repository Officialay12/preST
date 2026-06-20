/**
 * preST Service Worker v1.0
 * Cache-First strategy with offline fallback and background sync
 * Optimized for CBT platform with Dexie/IndexedDB persistence
 */

const CACHE_VERSION = "prest-v1.0.0";
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const DYNAMIC_CACHE = `${CACHE_VERSION}-dynamic`;
const API_CACHE = `${CACHE_VERSION}-api`;

const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/css/style.css",
  "/js/script.js",
  "/manifest.json",
  "/icons/icon-72.png",
  "/icons/icon-96.png",
  "/icons/icon-128.png",
  "/icons/icon-144.png",
  "/icons/icon-152.png",
  "/icons/icon-192.png",
  "/icons/icon-256.png",
  "/icons/icon-384.png",
  "/icons/icon-512.png",
  "/icons/favicon.ico",
  "https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap",
  "https://cdnjs.cloudflare.com/ajax/libs/dexie/3.2.4/dexie.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/canvas-confetti/1.9.2/confetti.browser.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.28/jspdf.plugin.autotable.min.js",
];

// ─── OFFLINE FALLBACK HTML ──────────────────────────────────────────────────
const OFFLINE_FALLBACK = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>preST — Offline</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            background: #080c18;
            color: #eef2ff;
            font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            text-align: center;
            padding: 2rem;
        }
        .container { max-width: 400px; }
        .icon { font-size: 4rem; margin-bottom: 1.5rem; }
        .gradient {
            background: linear-gradient(135deg, #1e3a5f 0%, #3b82f6 50%, #38bdf8 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        h1 { font-size: 2rem; font-weight: 800; margin-bottom: 0.75rem; font-family: 'Syne', sans-serif; }
        p { color: #94a3b8; line-height: 1.7; }
        .badge {
            display: inline-block;
            margin-top: 1.5rem;
            padding: 0.5rem 1.5rem;
            background: rgba(59, 130, 246, 0.1);
            border: 1px solid rgba(59, 130, 246, 0.2);
            border-radius: 9999px;
            font-size: 0.75rem;
            color: #60a5fa;
            letter-spacing: 0.05em;
        }
        .status {
            margin-top: 1rem;
            font-size: 0.875rem;
            color: #64748b;
        }
        .retry-btn {
            margin-top: 1.5rem;
            padding: 0.75rem 2rem;
            background: linear-gradient(135deg, #1e3a5f 0%, #3b82f6 100%);
            border: none;
            border-radius: 8px;
            color: #fff;
            font-family: 'DM Sans', sans-serif;
            font-weight: 600;
            font-size: 0.875rem;
            cursor: pointer;
            transition: transform 0.2s ease;
        }
        .retry-btn:hover { transform: scale(1.05); }
        .retry-btn:active { transform: scale(0.95); }
    </style>
</head>
<body>
    <div class="container">
        <div class="icon">📡</div>
        <h1><span class="gradient">preST</span></h1>
        <h2 style="font-size:1.25rem;font-weight:600;margin-bottom:0.5rem;color:#eef2ff;">You're Offline</h2>
        <p>preST will automatically sync your progress when your connection returns. Your answers are safely saved locally.</p>
        <div class="badge">⚡ Offline Mode</div>
        <div class="status">📦 All data is stored locally</div>
        <button class="retry-btn" onclick="location.reload()">🔄 Try Again</button>
    </div>
</body>
</html>`;

// ─── INSTALL ──────────────────────────────────────────────────────────────────
self.addEventListener("install", (event) => {
  console.log("[SW] Installing preST v1.0...");
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => {
        console.log("[SW] Caching static assets...");
        return Promise.allSettled(
          STATIC_ASSETS.map((url) =>
            cache
              .add(url)
              .catch(() => console.warn("[SW] Could not cache:", url)),
          ),
        );
      })
      .then(() => {
        console.log("[SW] Static assets cached successfully");
        return self.skipWaiting();
      }),
  );
});

// ─── ACTIVATE ─────────────────────────────────────────────────────────────────
self.addEventListener("activate", (event) => {
  console.log("[SW] Activating preST v1.0...");
  event.waitUntil(
    caches
      .keys()
      .then((keys) => {
        const toDelete = keys.filter(
          (k) => k !== STATIC_CACHE && k !== DYNAMIC_CACHE && k !== API_CACHE,
        );
        return Promise.all(
          toDelete.map((k) => {
            console.log("[SW] Deleting old cache:", k);
            return caches.delete(k);
          }),
        );
      })
      .then(() => {
        console.log("[SW] Cache cleanup complete");
        return self.clients.claim();
      }),
  );
});

// ─── FETCH ────────────────────────────────────────────────────────────────────
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== "GET" || url.protocol === "chrome-extension:") {
    return;
  }

  if (url.pathname.startsWith("/api/")) {
    event.respondWith(networkFirst(request));
    return;
  }

  if (
    url.hostname === "fonts.googleapis.com" ||
    url.hostname === "fonts.gstatic.com" ||
    url.hostname === "cdnjs.cloudflare.com"
  ) {
    event.respondWith(cacheFirst(request));
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(navigationHandler(request));
    return;
  }

  event.respondWith(cacheFirst(request));
});

// ─── CACHE STRATEGIES ─────────────────────────────────────────────────────────

async function cacheFirst(request) {
  try {
    const cached = await caches.match(request);
    if (cached) return cached;

    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.warn("[SW] CacheFirst error:", error);
    if (request.destination === "image") {
      return new Response("", { status: 404 });
    }
    throw error;
  }
}

async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(API_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.warn("[SW] NetworkFirst error, falling back to cache:", error);
    const cached = await caches.match(request);
    if (cached) return cached;
    return new Response(
      JSON.stringify({
        error: "Offline",
        message: "You are currently offline.",
      }),
      {
        status: 503,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}

async function navigationHandler(request) {
  try {
    const cached = await caches.match(request);
    if (cached) return cached;

    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, response.clone());
      return response;
    }

    return new Response(OFFLINE_FALLBACK, {
      headers: { "Content-Type": "text/html" },
    });
  } catch (error) {
    console.warn("[SW] Navigation error, serving offline fallback:", error);
    return new Response(OFFLINE_FALLBACK, {
      headers: { "Content-Type": "text/html" },
    });
  }
}

// ─── BACKGROUND SYNC ──────────────────────────────────────────────────────────
self.addEventListener("sync", (event) => {
  console.log("[SW] Background sync triggered:", event.tag);

  if (event.tag === "sync-exam-results") {
    event.waitUntil(syncExamResults());
  }

  if (event.tag === "sync-answers") {
    event.waitUntil(syncAnswers());
  }

  if (event.tag === "sync-profile") {
    event.waitUntil(syncProfile());
  }
});

async function syncExamResults() {
  try {
    console.log("[SW] Syncing exam results...");
    const clients = await self.clients.matchAll();
    clients.forEach((client) => {
      client.postMessage({
        type: "SYNC_RESULTS",
        timestamp: Date.now(),
      });
    });
    console.log("[SW] Exam results sync complete");
  } catch (error) {
    console.error("[SW] Sync error:", error);
    throw error;
  }
}

async function syncAnswers() {
  try {
    console.log("[SW] Syncing answers...");
    const clients = await self.clients.matchAll();
    clients.forEach((client) => {
      client.postMessage({
        type: "SYNC_ANSWERS",
        timestamp: Date.now(),
      });
    });
    console.log("[SW] Answers sync complete");
  } catch (error) {
    console.error("[SW] Sync error:", error);
    throw error;
  }
}

async function syncProfile() {
  try {
    console.log("[SW] Syncing profile...");
    const clients = await self.clients.matchAll();
    clients.forEach((client) => {
      client.postMessage({
        type: "SYNC_PROFILE",
        timestamp: Date.now(),
      });
    });
    console.log("[SW] Profile sync complete");
  } catch (error) {
    console.error("[SW] Sync error:", error);
    throw error;
  }
}

// ─── PUSH NOTIFICATIONS ───────────────────────────────────────────────────────
self.addEventListener("push", (event) => {
  console.log("[SW] Push notification received");

  const data = event.data ? event.data.json() : {};
  const title = data.title || "📚 preST Update";
  const options = {
    body: data.body || "You have new announcements or updates.",
    icon: "/icons/icon-192.png",
    badge: "/icons/icon-72.png",
    vibrate: [200, 100, 200, 100, 200],
    silent: false,
    data: {
      url: data.url || "/",
      type: data.type || "announcement",
    },
    actions: [
      { action: "open", title: "📖 Open" },
      { action: "dismiss", title: "Dismiss" },
    ],
    tag: data.tag || "prest-notification",
    requireInteraction: true,
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  console.log("[SW] Notification clicked:", event.action);

  event.notification.close();

  if (event.action === "open" || !event.action) {
    event.waitUntil(
      self.clients
        .matchAll({ type: "window", includeUncontrolled: true })
        .then((clientList) => {
          const url = event.notification.data?.url || "/";
          for (const client of clientList) {
            if (client.url === url && "focus" in client) {
              return client.focus();
            }
          }
          return self.clients.openWindow(url);
        }),
    );
  }
});

// ─── MESSAGE HANDLER ──────────────────────────────────────────────────────────
self.addEventListener("message", (event) => {
  console.log("[SW] Message received:", event.data?.type);

  switch (event.data?.type) {
    case "SKIP_WAITING":
      console.log("[SW] Skipping waiting...");
      self.skipWaiting();
      break;

    case "GET_VERSION":
      console.log("[SW] Sending version...");
      event.ports[0].postMessage({ version: CACHE_VERSION });
      break;

    case "REGISTER_SYNC":
      console.log("[SW] Registering sync...");
      const tag = event.data.tag || "sync-exam-results";
      event.waitUntil(self.registration.sync.register(tag));
      break;

    case "FORCE_CACHE_UPDATE":
      console.log("[SW] Forcing cache update...");
      event.waitUntil(
        caches.delete(STATIC_CACHE).then(() => {
          return caches.open(STATIC_CACHE).then((cache) => {
            return Promise.allSettled(
              STATIC_ASSETS.map((url) =>
                cache
                  .add(url)
                  .catch(() => console.warn("[SW] Could not cache:", url)),
              ),
            );
          });
        }),
      );
      break;

    default:
      console.log("[SW] Unknown message type:", event.data?.type);
  }
});

// ─── PERIODIC BACKGROUND SYNC ────────────────────────────────────────────────
if ("periodicSync" in self.registration) {
  self.addEventListener("periodicsync", (event) => {
    console.log("[SW] Periodic sync triggered:", event.tag);

    if (event.tag === "periodic-sync") {
      event.waitUntil(
        (async () => {
          try {
            console.log("[SW] Performing periodic sync...");
            const clients = await self.clients.matchAll();
            clients.forEach((client) => {
              client.postMessage({
                type: "PERIODIC_SYNC",
                timestamp: Date.now(),
              });
            });
          } catch (error) {
            console.error("[SW] Periodic sync error:", error);
          }
        })(),
      );
    }
  });
}

// ─── INSTALLATION LOG ─────────────────────────────────────────────────────────
console.log(`[SW] preST Service Worker v${CACHE_VERSION} loaded successfully`);
console.log(
  `[SW] ${STATIC_ASSETS.length} static assets registered for caching`,
);
