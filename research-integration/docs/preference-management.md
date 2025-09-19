# Preference Management Documentation

## Overview

The Preference Management system allows researchers to customize their experience with the Research Integration Services. It provides a comprehensive set of preferences organized by categories, enabling personalized workflows and interfaces.

## Preference Categories

### 1. Literature Analysis Preferences

Controls how medical literature is analyzed and processed.

**Preferences:**
- `defaultSources`: Default sources for literature collection
- `analysisDepth`: Depth of literature analysis
- `entityTypes`: Types of entities to extract
- `topicModeling`: Enable topic modeling in analysis
- `sentimentAnalysis`: Enable sentiment analysis in analysis

### 2. Clinical Trial Matching Preferences

Controls clinical trial matching behavior and notifications.

**Preferences:**
- `matchingThreshold`: Minimum threshold for trial matching
- `trialDatabases`: Databases to search for clinical trials
- `notificationMethods`: Methods for receiving trial notifications
- `autoRefresh`: Automatically refresh trial matches
- `refreshInterval`: Interval for refreshing trial matches

### 3. Research Impact Preferences

Controls research impact tracking and reporting.

**Preferences:**
- `trackedMetrics`: Metrics to track for research impact
- `trackingPeriods`: Periods for tracking research impact
- `reportFrequency`: Frequency of impact reports
- `visualizationType`: Type of visualization for impact data

### 4. Collaborative Research Preferences

Controls collaborative research features and permissions.

**Preferences:**
- `collaborationNotifications`: Enable notifications for collaboration activities
- `defaultPermissions`: Default permissions for new collaborators
- `fileSharing`: Enable file sharing in collaborations
- `realTimeCollaboration`: Enable real-time collaborative editing
- `versionControl`: Enable version control for shared documents

### 5. Visualization Preferences

Controls data visualization appearance and behavior.

**Preferences:**
- `defaultChartType`: Default chart type for visualizations
- `showTooltips`: Display tooltips on visualizations
- `animationEnabled`: Enable animations in visualizations
- `colorScheme`: Color scheme for visualizations
- `exportFormats`: Preferred formats for exporting visualizations

### 6. Workflow Preferences

Controls research workflow execution and notifications.

**Preferences:**
- `defaultWorkflow`: Default workflow for research tasks
- `parallelExecution`: Execute workflow steps in parallel
- `maxConcurrentWorkflows`: Maximum number of concurrent workflows
- `notificationLevel`: Level of workflow notifications

### 7. Interface Preferences

Controls user interface appearance and behavior.

**Preferences:**
- `theme`: User interface theme (light/dark)
- `language`: Interface language
- `fontSize`: Interface font size
- `autoRefresh`: Automatically refresh dashboard data
- `refreshInterval`: Dashboard refresh interval

### 8. Notification Preferences

Controls system notification behavior.

**Preferences:**
- `emailNotifications`: Receive email notifications
- `smsNotifications`: Receive SMS notifications
- `pushNotifications`: Receive push notifications
- `notificationSound`: Play sound for notifications
- `quietHours`: Enable quiet hours for notifications
- `quietHoursStart`: Start time for quiet hours
- `quietHoursEnd`: End time for quiet hours

### 9. Privacy Preferences

Controls privacy and data handling settings.

**Preferences:**
- `anonymousMode`: Hide researcher identifiers in shared data
- `dataRetention`: Data retention period
- `auditLogging`: Enable detailed audit logging
- `exportData`: Allow exporting of personal research data

## API Endpoints

### Get Researcher Preferences
```
GET /api/preferences/researcher/{researcherId}?scope=researcher
```

**Response:**
```json
{
  "success": true,
  "researcherId": "string",
  "scope": "string",
  "preferences": {}
}
```

### Set Researcher Preference
```
POST /api/preferences/researcher/{researcherId}
```

**Request Body:**
```json
{
  "category": "string",
  "preferenceKey": "string",
  "value": "any",
  "scope": "string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Researcher preference updated successfully",
  "researcherId": "string",
  "scope": "string",
  "preferences": {}
}
```

### Update Researcher Preferences
```
PUT /api/preferences/researcher/{researcherId}
```

**Request Body:**
```json
{
  "preferences": {},
  "scope": "string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Researcher preferences updated successfully",
  "researcherId": "string",
  "scope": "string",
  "preferences": {}
}
```

### Reset Researcher Preferences
```
DELETE /api/preferences/researcher/{researcherId}/reset
```

**Request Body:**
```json
{
  "scope": "string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Researcher preferences reset to defaults successfully",
  "researcherId": "string",
  "scope": "string",
  "preferences": {}
}
```

### Get Available Categories
```
GET /api/preferences/categories
```

**Response:**
```json
{
  "success": true,
  "categories": ["string"]
}
```

### Get Category Configuration
```
GET /api/preferences/category/{category}
```

**Response:**
```json
{
  "success": true,
  "category": "string",
  "configuration": {
    "name": "string",
    "description": "string",
    "preferences": {}
  }
}
```

### Get Preference Configuration
```
GET /api/preferences/category/{category}/preference/{preferenceKey}
```

**Response:**
```json
{
  "success": true,
  "category": "string",
  "preference": "string",
  "configuration": {
    "name": "string",
    "description": "string",
    "type": "string",
    "defaultValue": "any",
    "options": ["string"]
  }
}
```

### Export Researcher Preferences
```
GET /api/preferences/researcher/{researcherId}/export?scope=researcher
```

**Response:**
```json
{
  "success": true,
  "message": "Researcher preferences exported successfully",
  "exportedPreferences": {}
}
```

### Import Researcher Preferences
```
POST /api/preferences/researcher/{researcherId}/import
```

**Request Body:**
```json
{
  "preferences": {},
  "scope": "string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Researcher preferences imported successfully",
  "importedPreferences": {}
}
```

## Configuration

Preferences are configured through the `preferences.config.js` file:

```javascript
{
  categories: {
    literatureAnalysis: {
      name: 'Literature Analysis',
      description: 'Preferences for literature analysis functionality',
      preferences: {
        defaultSources: {
          name: 'Default Sources',
          description: 'Default sources for literature analysis',
          type: 'array',
          defaultValue: ['pubmed', 'ieee', 'nature'],
          options: ['pubmed', 'ieee', 'nature', 'science', 'springer', 'elsevier', 'clinicaltrials']
        },
        analysisDepth: {
          name: 'Analysis Depth',
          description: 'Depth of literature analysis',
          type: 'string',
          defaultValue: 'comprehensive',
          options: ['basic', 'intermediate', 'comprehensive', 'full']
        }
      }
    }
  },
  scopes: {
    researcher: {
      name: 'Researcher',
      description: 'Preferences specific to individual researcher',
      inheritable: false
    },
    team: {
      name: 'Team',
      description: 'Preferences for research team',
      inheritable: true
    }
  },
  validation: {
    enabled: true,
    strictValidation: true
  }
}
```

## Preference Scopes

### Researcher Scope
Preferences specific to an individual researcher. These are the most granular preferences and override team or institution preferences.

### Team Scope
Preferences that apply to an entire research team. These can be inherited by individual team members.

### Institution Scope
Preferences that apply to an entire institution. These can be inherited by teams and individual researchers.

### System Scope
System-wide default preferences that serve as fallbacks when no other preferences are set.

## Validation

The preference management system includes robust validation to ensure data integrity:

### Type Validation
- **String**: Validates that preference is a string
- **Number**: Validates that preference is a number with optional min/max constraints
- **Boolean**: Validates that preference is a boolean
- **Array**: Validates that preference is an array with optional item validation

### Value Validation
- **Options**: Validates that preference value is within a predefined set of options
- **Range**: Validates that numeric preferences are within specified ranges
- **Format**: Validates that preferences match expected formats (e.g., email, date)

### Cross-Field Validation
- Validates relationships between different preferences
- Ensures consistency between related settings

## Inheritance

Preferences support inheritance across scopes:

1. **System Defaults**: Base preferences that apply to all users
2. **Institution Preferences**: Can override system defaults
3. **Team Preferences**: Can override institution preferences
4. **Researcher Preferences**: Can override all other scopes

The inheritance system ensures that researchers get appropriate defaults while maintaining the ability to customize their experience.

## Security and Privacy

### Access Control
- Researchers can only access their own preferences
- Administrators can manage team and institution preferences
- Proper authentication and authorization for all preference operations

### Data Protection
- Preferences are encrypted at rest
- Audit logs track all preference changes
- Data retention policies apply to preference data

### Privacy Features
- Anonymous mode hides researcher identifiers
- Export controls allow researchers to manage their data
- Granular privacy settings for different types of preferences

## Error Handling

### Validation Errors

**400 Bad Request**
- Invalid preference category
- Invalid preference key
- Invalid preference value
- Missing required fields

**404 Not Found**
- Researcher not found
- Preference category not found
- Preference not found

**500 Internal Server Error**
- Service failures
- Database errors
- Configuration issues

## Best Practices

### Preference Organization
1. **Logical Grouping**: Group related preferences into categories
2. **Clear Naming**: Use clear, descriptive names for preferences
3. **Comprehensive Descriptions**: Provide detailed descriptions for each preference
4. **Sensible Defaults**: Set reasonable default values

### User Experience
1. **Progressive Disclosure**: Show advanced preferences only when needed
2. **Immediate Feedback**: Provide feedback when preferences are updated
3. **Easy Reset**: Allow easy resetting to default values
4. **Export/Import**: Support exporting and importing preference sets

### Performance
1. **Efficient Storage**: Store preferences efficiently
2. **Caching**: Cache frequently accessed preferences
3. **Batch Updates**: Support batch updates for multiple preferences
4. **Asynchronous Operations**: Use asynchronous operations to prevent blocking

## Extending Preferences

### Adding New Categories
1. Define the category in `preferences.config.js`
2. Add preference definitions
3. Update the available categories list
4. Add API endpoints if needed
5. Create tests for the new category

### Adding New Preferences
1. Define the preference in the appropriate category
2. Specify validation rules
3. Set default values
4. Update documentation
5. Create tests

### Custom Validation
1. Implement custom validation logic
2. Add validation to the preference definition
3. Update the validation service
4. Add tests for custom validation