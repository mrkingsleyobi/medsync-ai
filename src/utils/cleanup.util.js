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

  try {
    const now = Date.now();

    // Remove entries that are too old
    for (const [key, value] of map.entries()) {
      if (value && value[timestampField]) {
        // Handle potential invalid dates
        const timestamp = new Date(value[timestampField]).getTime();
        if (!isNaN(timestamp)) {
          const entryAge = now - timestamp;
          if (entryAge > maxAge) {
            map.delete(key);
            stats.removedByAge++;
          }
        }
      }
    }

    // Remove oldest entries if we still have too many
    if (map.size > maxEntries) {
      // Convert map entries to array and sort by timestamp
      const entries = Array.from(map.entries())
        .map(([key, value]) => ({
          key,
          value,
          timestamp: value && value[timestampField] ? new Date(value[timestampField]).getTime() : 0
        }))
        // Filter out invalid timestamps and sort by timestamp (oldest first)
        .filter(entry => !isNaN(entry.timestamp))
        .sort((a, b) => a.timestamp - b.timestamp); // Oldest first

      const excessCount = Math.min(map.size - maxEntries, entries.length);
      for (let i = 0; i < excessCount; i++) {
        map.delete(entries[i].key);
        stats.removedByCount++;
      }
    }

    stats.totalRemoved = stats.removedByAge + stats.removedByCount;
  } catch (error) {
    // Don't throw errors to prevent breaking the calling function
    // In a real implementation, you might want to log this error
    console.warn('Cleanup utility encountered an error:', error.message);
  }

  return stats;
}

module.exports = {
  cleanupOldEntries
};