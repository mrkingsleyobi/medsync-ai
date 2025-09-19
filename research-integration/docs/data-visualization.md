# Data Visualization Documentation

## Overview

The Data Visualization system provides researchers with powerful tools to create visual representations of research data and metrics. It supports multiple chart types and visualization components designed specifically for medical research data.

## Available Visualization Components

### 1. Citation Network Visualization

Visualizes citation relationships between research papers as a network diagram.

**Features:**
- Node sizing based on citation count
- Color coding for different research areas
- Interactive exploration with zoom and pan
- Tooltips with detailed paper information

**Required Data:**
```json
{
  "citations": [
    {
      "paper": "string",
      "citedBy": "string",
      "count": 0
    }
  ]
}
```

### 2. Research Trends Visualization

Shows research trends over time using line charts.

**Features:**
- Multiple series for different metrics
- Interactive exploration
- Time range selection
- Export capabilities

**Required Data:**
```json
{
  "trends": [
    {
      "date": "string",
      "metric": "string",
      "value": 0
    }
  ]
}
```

### 3. Collaboration Map Visualization

Displays research collaborations geographically.

**Features:**
- Geographic mapping of collaborating institutions
- Connection lines between collaborators
- Marker sizing based on collaboration intensity
- Interactive filtering

**Required Data:**
```json
{
  "collaborations": [
    {
      "institution1": "string",
      "institution2": "string",
      "intensity": 0,
      "location1": {
        "lat": 0,
        "lng": 0
      },
      "location2": {
        "lat": 0,
        "lng": 0
      }
    }
  ]
}
```

### 4. Impact Metrics Visualization

Visualizes research impact metrics using bar charts.

**Features:**
- Comparison views for different metrics
- Time-series analysis
- Sorting and filtering options
- Statistical summaries

**Required Data:**
```json
{
  "metrics": {
    "citations": 0,
    "downloads": 0,
    "socialMentions": 0
  }
}
```

### 5. Trial Matching Results Visualization

Visualizes clinical trial matching results.

**Features:**
- Score comparison between trials
- Eligibility criteria visualization
- Ranking display
- Detailed trial information

**Required Data:**
```json
{
  "trials": [
    {
      "id": "string",
      "title": "string",
      "score": 0,
      "criteriaMet": ["string"],
      "criteriaNotMet": ["string"]
    }
  ]
}
```

### 6. Literature Entities Visualization

Visualizes entities extracted from literature.

**Features:**
- Entity type categorization
- Frequency analysis
- Contextual relationships
- Interactive filtering

**Required Data:**
```json
{
  "entities": [
    {
      "type": "string",
      "text": "string",
      "frequency": 0,
      "confidence": 0
    }
  ]
}
```

### 7. Literature Topics Visualization

Visualizes topics identified in literature.

**Features:**
- Topic clustering
- Relevance scoring
- Keyword analysis
- Temporal trends

**Required Data:**
```json
{
  "topics": [
    {
      "label": "string",
      "relevance": 0,
      "keywords": ["string"]
    }
  ]
}
```

### 8. Literature Sentiment Visualization

Visualizes sentiment in literature.

**Features:**
- Sentiment distribution charts
- Temporal sentiment analysis
- Comparative sentiment views
- Confidence intervals

**Required Data:**
```json
{
  "sentiment": {
    "positive": 0,
    "neutral": 0,
    "negative": 0
  }
}
```

## API Endpoints

### Generate Visualization
```
POST /api/visualization/generate
```

**Request Body:**
```json
{
  "componentType": "string",
  "data": {},
  "visualizationConfig": {
    "chartType": "string",
    "colorScheme": "string",
    "showTooltips": true,
    "animationEnabled": true
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Visualization generated successfully",
  "visualizationId": "string",
  "status": "string",
  "componentType": "string",
  "result": {},
  "generationTime": 0
}
```

### Export Visualization
```
GET /api/visualization/export/{visualizationId}?format=png
```

**Response:**
```json
{
  "success": true,
  "message": "Visualization exported successfully",
  "visualizationId": "string",
  "format": "string",
  "url": "string",
  "status": "string"
}
```

### Get Visualization Status
```
GET /api/visualization/status/{visualizationId}
```

**Response:**
```json
{
  "success": true,
  "status": {
    "visualizationId": "string",
    "componentType": "string",
    "status": "string",
    "createdAt": "string",
    "completedAt": "string"
  }
}
```

### Get Available Components
```
GET /api/visualization/components
```

**Response:**
```json
{
  "success": true,
  "components": ["string"]
}
```

### Get Component Configuration
```
GET /api/visualization/component/{componentType}
```

**Response:**
```json
{
  "success": true,
  "configuration": {
    "name": "string",
    "description": "string",
    "chartType": "string",
    "dataType": "string",
    "enabled": true
  }
}
```

## Configuration

Visualization components are configured through the `visualization.config.js` file:

```javascript
{
  engine: {
    name: 'Research Visualization Engine',
    version: '1.0.0',
    maxConcurrentVisualizations: 100,
    timeout: 30000
  },
  chartTypes: {
    citationNetwork: {
      name: 'Citation Network',
      description: 'Network visualization of citation relationships',
      supportedDataTypes: ['citations', 'references', 'collaborations']
    }
  },
  components: {
    citationNetwork: {
      name: 'Citation Network Visualization',
      description: 'Visualization of citation relationships between research papers',
      chartType: 'citationNetwork',
      dataType: 'citations',
      enabled: true
    }
  },
  colorSchemes: {
    citationNetwork: {
      node: '#3498db',
      edge: '#95a5a6',
      highlight: '#e74c3c'
    }
  },
  chartSettings: {
    responsive: true,
    animations: true,
    showTooltips: true,
    showLegend: true
  },
  export: {
    enabled: true,
    formats: ['png', 'jpg', 'pdf', 'svg', 'csv', 'json'],
    quality: 'high'
  }
}
```

## Export Options

Visualizations can be exported in multiple formats:

### Image Formats
- **PNG**: High-quality raster graphics
- **JPG**: Compressed raster graphics
- **SVG**: Scalable vector graphics

### Document Formats
- **PDF**: Portable Document Format for printing and sharing

### Data Formats
- **CSV**: Comma-separated values for data analysis
- **JSON**: Raw data in JSON format

## Customization

### Color Schemes
Researchers can customize visualization appearance through color schemes defined in the configuration.

### Chart Settings
Various chart settings can be adjusted:
- Animation enable/disable
- Tooltip visibility
- Legend display
- Responsive behavior

### Interactive Features
- Zoom and pan capabilities
- Tooltips with detailed information
- Filtering and sorting options
- Export functionality

## Performance Considerations

### Data Size Limits
- Maximum 10,000 data points per visualization
- Large datasets automatically sampled
- Pagination for very large datasets

### Rendering Performance
- Asynchronous rendering to prevent UI blocking
- Progressive loading for complex visualizations
- Caching of rendered visualizations

### Memory Management
- Automatic cleanup of unused visualizations
- Memory limits for concurrent visualizations
- Efficient data structure usage

## Error Handling

### Visualization Generation Errors

**400 Bad Request**
- Missing component type
- Missing data
- Invalid component type
- Invalid data format

**500 Internal Server Error**
- Service failures
- Timeout errors
- Configuration issues

### Export Errors

**404 Not Found**
- Visualization not found
- Unsupported export format

**500 Internal Server Error**
- Export service failures
- File generation errors

## Best Practices

### Data Preparation
1. **Clean Data**: Ensure data is clean and consistent
2. **Appropriate Sampling**: Sample large datasets appropriately
3. **Data Validation**: Validate data before visualization
4. **Metadata Inclusion**: Include relevant metadata

### Visualization Design
1. **Clear Labels**: Use clear, descriptive labels
2. **Appropriate Colors**: Use color schemes that are accessible
3. **Consistent Styling**: Maintain consistent styling across visualizations
4. **Meaningful Interactions**: Provide meaningful interactive features

### Performance Optimization
1. **Efficient Data Structures**: Use efficient data structures
2. **Lazy Loading**: Load data only when needed
3. **Caching**: Cache frequently used visualizations
4. **Asynchronous Operations**: Use asynchronous operations to prevent blocking

## Extending Visualizations

### Adding New Components
1. Define the component in `visualization.config.js`
2. Implement the visualization logic
3. Add the component to available components list
4. Update API endpoints if needed
5. Create tests for the new component

### Custom Chart Types
1. Define the chart type in configuration
2. Implement the rendering logic
3. Add support in the visualization service
4. Update documentation
5. Create tests

### New Export Formats
1. Add the format to supported formats list
2. Implement the export logic
3. Update the export service
4. Add tests for the new format