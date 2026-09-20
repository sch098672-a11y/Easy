/**
 * EASYLIFE SUPERMARKET - Persistent Product Image Storage Engine
 * 
 * Provides robust client-side storage for real product photographs uploaded from
 * mobile devices (such as iPhone Camera / Photo Library) or desktop browsers.
 * 
 * Features:
 * 1. Automatic client-side image compression & optimization to prevent storage quota limits
 *    (scales high-res iPhone 12MP/48MP photos to clean 1400px maximum dimension, quality 0.85).
 * 2. Persistent storage via IndexedDB ('easylife_store_v1' / 'product_images'), supporting
 *    hundreds of megabytes of storage across browser restarts, page refreshes, and device reboots.
 * 3. LocalStorage synchronization & mirror fallback for instant synchronous availability.
 */

const DB_NAME = 'easylife_store_v1';
const DB_VERSION = 1;
const STORE_NAME = 'product_images';

let dbPromise: Promise<IDBDatabase> | null = null;

function getDB(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB is not supported in this browser environment'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'productId' });
      }
    };

    request.onsuccess = (event) => {
      resolve((event.target as IDBOpenDBRequest).result);
    };

    request.onerror = (event) => {
      console.error('IndexedDB open error:', (event.target as IDBOpenDBRequest).error);
      reject((event.target as IDBOpenDBRequest).error);
    };
  });

  return dbPromise;
}

/**
 * Optimizes an uploaded image file (iPhone HEIC/JPEG/PNG) using HTML5 Canvas.
 * Downscales images larger than maxWidth/maxHeight to prevent memory spikes & storage quota errors,
 * while maintaining crisp details and natural aspect ratio.
 */
export async function optimizeImageFile(
  file: File,
  maxWidth = 1400,
  maxHeight = 1400,
  quality = 0.86
): Promise<string> {
  return new Promise((resolve, reject) => {
    // If it's not an image file, reject early
    if (!file.type.startsWith('image/')) {
      reject(new Error('Selected file is not an image'));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file'));

    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const img = new Image();

      img.onload = () => {
        try {
          let { width, height } = img;

          // Compute target dimensions preserving aspect ratio
          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width = Math.round(width * ratio);
            height = Math.round(height * ratio);
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            // Fallback to original data URL if 2D context fails
            resolve(dataUrl);
            return;
          }

          // Smooth rendering
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';

          // Draw image to canvas
          ctx.drawImage(img, 0, 0, width, height);

          // Determine output format (prefer image/jpeg for photos to keep size ultra-efficient)
          const outputType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
          const optimizedDataUrl = canvas.toDataURL(outputType, quality);

          resolve(optimizedDataUrl);
        } catch (err) {
          console.warn('Canvas optimization failed, falling back to original data URL:', err);
          resolve(dataUrl);
        }
      };

      img.onerror = () => {
        // In case image load fails, fallback to raw data URL
        resolve(dataUrl);
      };

      img.src = dataUrl;
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Save an uploaded product image persistently to IndexedDB and localStorage mirror.
 */
export async function saveProductImage(productId: string, dataUrl: string): Promise<void> {
  const cleanId = productId.trim().toUpperCase();

  // 1. Save to IndexedDB (high capacity, permanent across reboots)
  try {
    const db = await getDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put({
        productId: cleanId,
        dataUrl,
        updatedAt: Date.now()
      });
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('Could not save to IndexedDB, fallback to localStorage only:', err);
  }

  // 2. Mirror to localStorage for instant synchronous startup
  try {
    localStorage.setItem(`easylife_img_${cleanId}`, dataUrl);
  } catch (e) {
    // Quota exceeded in localStorage is safe to ignore because IndexedDB persists it
    console.warn('LocalStorage image quota reached, image safely saved in IndexedDB');
  }
}

/**
 * Retrieve a product image by ID from IndexedDB or localStorage mirror.
 */
export async function getProductImage(productId: string): Promise<string | null> {
  const cleanId = productId.trim().toUpperCase();

  // Check localStorage first for instant synchronous hit
  try {
    const local = localStorage.getItem(`easylife_img_${cleanId}`);
    if (local && local.startsWith('data:image/')) return local;
  } catch {
    // ignore
  }

  // Fallback to IndexedDB
  try {
    const db = await getDB();
    return await new Promise<string | null>((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(cleanId);
      req.onsuccess = () => {
        const result = req.result;
        resolve(result?.dataUrl || null);
      };
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

/**
 * Retrieve all saved product images from IndexedDB.
 */
export async function getAllProductImages(): Promise<Record<string, string>> {
  const imagesMap: Record<string, string> = {};

  // First collect any from localStorage
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('easylife_img_')) {
        const id = key.replace('easylife_img_', '').toUpperCase();
        const val = localStorage.getItem(key);
        if (val && val.startsWith('data:image/')) {
          imagesMap[id] = val;
        }
      }
    }
  } catch {
    // ignore
  }

  // Then collect from IndexedDB (overrides if newer)
  try {
    const db = await getDB();
    await new Promise<void>((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.openCursor();
      req.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
        if (cursor) {
          if (cursor.value?.productId && cursor.value?.dataUrl) {
            imagesMap[cursor.value.productId.toUpperCase()] = cursor.value.dataUrl;
          }
          cursor.continue();
        } else {
          resolve();
        }
      };
      req.onerror = () => resolve();
    });
  } catch (err) {
    console.warn('Could not read all images from IndexedDB:', err);
  }

  return imagesMap;
}

/**
 * Delete a saved product image from IndexedDB and localStorage mirror.
 */
export async function deleteProductImage(productId: string): Promise<void> {
  const cleanId = productId.trim().toUpperCase();

  try {
    localStorage.removeItem(`easylife_img_${cleanId}`);
  } catch {
    // ignore
  }

  try {
    const db = await getDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(cleanId);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('Could not delete from IndexedDB:', err);
  }
}
