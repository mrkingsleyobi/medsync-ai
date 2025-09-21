/**
 * Cleanup Utility
 * Utility functions for cleaning up data structures and preventing memory leaks
 */

/**
 * Clean up old entries in a Map data structure
 * @param {Map} map - The Map to clean up
 * @param {Object} options - Cleanup options
 * @param {number} options.maxAge - Maximum age of entries in milliseconds (default: 24 hours)
 * @param {number} options.maxEntries - Maximum number of entries to keep (default: 1000)
 * @param {string} options.timestampField - Field name containing timestamp (default: 'createdAt')
 * @returns {Object} Statistics about removed entries
 */
function cleanupOldEntries(map, options = {}) {
  const {
    maxAge = 24 * 60 * 60 * 1000, // 24 hours
    maxEntries = 1000,
    timestampField = 'createdAt'
  } = options;

  const stats = {
    removedByAge: 0,
    removedByCount: 0,
    totalRemoved: 0
  };

  const now = Date.now();

  // Remove entries that are too old
  for (const [key, value] of map.entries()) {
    if (value && value[timestampField]) {
      const entryAge = now - new Date(value[timestampField]).getTime();
      if (entryAge > maxAge) {
        map.delete(key);
        stats.removedByAge++;
      }
    }
  }

  // Remove oldest entries if we still have too many
  if (map.size > maxEntries) {
    const entries = Array.from(map.entries())
      .sort((a, b) => {
        const timeA = a[1][timestampField] ? new Date(a[1][timestampField]).getTime() : 0;
        const timeB = b[1][timestampField] ? new Date(b[1][timestampField]).getTime() : 0;
        return timeA - timeB; // Oldest first
      });

    const excessCount = map.size - maxEntries;
    for (let i = 0; i < excessCount; i++) {
      map.delete(entries[i][0]);
      stats.removedByCount++;
    }
  }

  stats.totalRemoved = stats.removedByAge + stats.removedByCount;
  return stats;
}

module.exports = {
  cleanupOldEntries
};