/**
 * Cleanup Utility
 * Shared utility functions for cleaning up data structures
 */

/**
 * Clean up old entries in a Map to prevent memory leaks
 * @param {Map} map - The Map to clean up
 * @param {Object} options - Cleanup options
 * @param {number} options.maxAge - Maximum age in milliseconds (default: 24 hours)
 * @param {number} options.maxEntries - Maximum number of entries to keep (default: 1000)
 * @param {string} options.timestampField - Field name for timestamp (default: 'createdAt')
 * @returns {Object} Cleanup statistics
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

  try {
    const now = Date.now();

    // If we have too many entries, remove the oldest ones first
    if (map.size > maxEntries) {
      const entries = Array.from(map.entries())
        .sort((a, b) => new Date(a[1][timestampField]) - new Date(b[1][timestampField]))
        .slice(0, map.size - maxEntries);

      entries.forEach(([key]) => {
        map.delete(key);
        stats.removedByCount += 1;
      });
    }

    // Remove entries older than maxAge
    Array.from(map.entries()).forEach(([key, entry]) => {
      if (entry[timestampField] && (now - new Date(entry[timestampField]).getTime()) > maxAge) {
        map.delete(key);
        stats.removedByAge += 1;
      }
    });

    stats.totalRemoved = stats.removedByAge + stats.removedByCount;
  } catch (error) {
    // Log error but don't throw to prevent breaking the calling function
    // eslint-disable-next-line no-console
    console.error('Cleanup failed:', error.message);
  }

  return stats;
}

module.exports = {
  cleanupOldEntries
};
