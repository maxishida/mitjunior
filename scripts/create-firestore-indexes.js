// Firestore Indexes for Engagement System
// This file contains the indexes needed for optimal performance

const indexes = [
  // Favorites Collection Indexes
  {
    collection: 'favorites',
    fields: [
      { field: 'userId', order: 'ASCENDING' },
      { field: 'addedAt', order: 'DESCENDING' }
    ]
  },
  {
    collection: 'favorites',
    fields: [
      { field: 'userId', order: 'ASCENDING' },
      { field: 'type', order: 'ASCENDING' },
      { field: 'addedAt', order: 'DESCENDING' }
    ]
  },
  {
    collection: 'favorites',
    fields: [
      { field: 'userId', order: 'ASCENDING' },
      { field: 'category', order: 'ASCENDING' },
      { field: 'addedAt', order: 'DESCENDING' }
    ]
  },

  // View History Collection Indexes
  {
    collection: 'viewHistory',
    fields: [
      { field: 'userId', order: 'ASCENDING' },
      { field: 'viewedAt', order: 'DESCENDING' }
    ]
  },
  {
    collection: 'viewHistory',
    fields: [
      { field: 'userId', order: 'ASCENDING' },
      { field: 'type', order: 'ASCENDING' },
      { field: 'viewedAt', order: 'DESCENDING' }
    ]
  },
  {
    collection: 'viewHistory',
    fields: [
      { field: 'userId', order: 'ASCENDING' },
      { field: 'completed', order: 'ASCENDING' },
      { field: 'viewedAt', order: 'DESCENDING' }
    ]
  },
  {
    collection: 'viewHistory',
    fields: [
      { field: 'viewedAt', order: 'DESCENDING' }
    ]
  },
  {
    collection: 'viewHistory',
    fields: [
      { field: 'itemId', order: 'ASCENDING' },
      { field: 'viewedAt', order: 'DESCENDING' }
    ]
  },

  // User Progress Collection Indexes
  {
    collection: 'userProgress',
    fields: [
      { field: 'userId', order: 'ASCENDING' },
      { field: 'courseId', order: 'ASCENDING' }
    ]
  },
  {
    collection: 'userProgress',
    fields: [
      { field: 'userId', order: 'ASCENDING' },
      { field: 'isCompleted', order: 'ASCENDING' },
      { field: 'updatedAt', order: 'DESCENDING' }
    ]
  },
  {
    collection: 'userProgress',
    fields: [
      { field: 'courseId', order: 'ASCENDING' },
      { field: 'videoId', order: 'ASCENDING' }
    ]
  },

  // Activities Collection Indexes
  {
    collection: 'activities',
    fields: [
      { field: 'userId', order: 'ASCENDING' },
      { field: 'timestamp', order: 'DESCENDING' }
    ]
  },
  {
    collection: 'activities',
    fields: [
      { field: 'userId', order: 'ASCENDING' },
      { field: 'type', order: 'ASCENDING' },
      { field: 'timestamp', order: 'DESCENDING' }
    ]
  },
  {
    collection: 'activities',
    fields: [
      { field: 'timestamp', order: 'DESCENDING' }
    ]
  },
  {
    collection: 'activities',
    fields: [
      { field: 'type', order: 'ASCENDING' },
      { field: 'timestamp', order: 'DESCENDING' }
    ]
  },

  // User Stats Collection Indexes
  {
    collection: 'userStats',
    fields: [
      { field: 'userId', order: 'ASCENDING' }
    ]
  },
  {
    collection: 'userStats',
    fields: [
      { field: 'totalPoints', order: 'DESCENDING' }
    ]
  },

  // Point Transactions Collection Indexes
  {
    collection: 'pointTransactions',
    fields: [
      { field: 'userId', order: 'ASCENDING' },
      { field: 'createdAt', order: 'DESCENDING' }
    ]
  },
  {
    collection: 'pointTransactions',
    fields: [
      { field: 'userId', order: 'ASCENDING' },
      { field: 'type', order: 'ASCENDING' },
      { field: 'createdAt', order: 'DESCENDING' }
    ]
  },

  // User Achievements Collection Indexes
  {
    collection: 'userAchievements',
    fields: [
      { field: 'userId', order: 'ASCENDING' },
      { field: 'isCompleted', order: 'ASCENDING' }
    ]
  },
  {
    collection: 'userAchievements',
    fields: [
      { field: 'userId', order: 'ASCENDING' },
      { field: 'unlockedAt', order: 'DESCENDING' }
    ]
  },
  {
    collection: 'userAchievements',
    fields: [
      { field: 'achievementId', order: 'ASCENDING' },
      { field: 'isCompleted', order: 'ASCENDING' }
    ]
  },

  // Course Progress Collection Indexes
  {
    collection: 'courseProgress',
    fields: [
      { field: 'userId', order: 'ASCENDING' },
      { field: 'courseId', order: 'ASCENDING' }
    ]
  },
  {
    collection: 'courseProgress',
    fields: [
      { field: 'userId', order: 'ASCENDING' },
      { field: 'isCompleted', order: 'ASCENDING' },
      { field: 'lastAccessedAt', order: 'DESCENDING' }
    ]
  },

  // Certificates Collection Indexes
  {
    collection: 'certificates',
    fields: [
      { field: 'userId', order: 'ASCENDING' },
      { field: 'createdAt', order: 'DESCENDING' }
    ]
  },
  {
    collection: 'certificates',
    fields: [
      { field: 'courseId', order: 'ASCENDING' },
      { field: 'isPublic', order: 'ASCENDING' }
    ]
  },

  // Streak Data Collection Indexes
  {
    collection: 'streakData',
    fields: [
      { field: 'userId', order: 'ASCENDING' }
    ]
  },
  {
    collection: 'streakData',
    fields: [
      { field: 'currentStreak', order: 'DESCENDING' }
    ]
  },

  // User Activity Collection Indexes
  {
    collection: 'userActivity',
    fields: [
      { field: 'userId', order: 'ASCENDING' },
      { field: 'timestamp', order: 'DESCENDING' }
    ]
  },
  {
    collection: 'userActivity',
    fields: [
      { field: 'userId', order: 'ASCENDING' },
      { field: 'type', order: 'ASCENDING' },
      { field: 'timestamp', order: 'DESCENDING' }
    ]
  },

  // Content Analytics Collection Indexes
  {
    collection: 'contentAnalytics',
    fields: [
      { field: 'viewCount', order: 'DESCENDING' }
    ]
  },
  {
    collection: 'contentAnalytics',
    fields: [
      { field: 'lastViewed', order: 'DESCENDING' }
    ]
  }
];

// Generate Firestore index definitions
function generateIndexDefinitions() {
  return indexes.map((index, i) => {
    const indexName = `engagement_index_${i + 1}`;
    const fieldSpecs = index.fields.map(field => {
      return `${field.field}_${field.order.toLowerCase()}`;
    }).join('_');

    return `
// Index ${i + 1}: ${index.collection} collection
// Fields: ${index.fields.map(f => `${f.field} (${f.order})`).join(', ')}
{
  "indexes": [
    {
      "collectionGroup": "${index.collection}",
      "queryScope": "COLLECTION",
      "fields": [
        ${index.fields.map(f => `{
          "fieldPath": "${f.field}",
          "order": "${f.order}"
        }`).join(',\n        ')}
      ]
    }
  ],
  "fieldOverrides": []
}
`;
  }).join('\n');
}

// Generate Firebase CLI commands for creating indexes
function generateIndexCommands() {
  return indexes.map((index, i) => {
    const fields = index.fields.map(f => `${f.field}:${f.order.toLowerCase()}`).join(',');
    return `firebase firestore:indexes create --collection-group ${index.collection} --fields ${fields}`;
  }).join('\n');
}

// Output for different uses
console.log('=== FIRESTORE INDEX DEFINITIONS ===');
console.log(generateIndexDefinitions());

console.log('\n=== FIREBASE CLI COMMANDS ===');
console.log(generateIndexCommands());

console.log('\n=== MANUAL INSTRUCTIONS ===');
console.log(`
To create these indexes manually:

1. Go to Firebase Console > Firestore > Indexes
2. Create the following composite indexes:

${indexes.map((index, i) => `
Index ${i + 1}:
- Collection: ${index.collection}
- Fields: ${index.fields.map(f => `${f.field} (${f.order})`).join(', ')}
`).join('')}

Alternatively, use the Firebase CLI:
1. Run: firebase init firestore
2. Add the index definitions to firestore.indexes.json
3. Run: firebase deploy --only firestore:indexes

Note: Index creation can take several minutes to complete.
`);

// Export for programmatic use
module.exports = {
  indexes,
  generateIndexDefinitions,
  generateIndexCommands
};