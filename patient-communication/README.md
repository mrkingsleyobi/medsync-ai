# Patient Communication Services

## Overview

The Patient Communication Services module provides a comprehensive suite of tools to facilitate effective communication between patients and healthcare providers. This module includes features for document simplification, multi-lingual support, voice-to-text journaling, personalized health education, and more.

## Features

### 1. Medical Document Simplification
Simplifies complex medical documents to make them more accessible to patients.

- **Service**: `DocumentSimplificationService`
- **Key Methods**:
  - `simplifyDocument(documentText, level)`: Simplifies medical text to a specified reading level
  - `analyzeComplexity(documentText)`: Analyzes document complexity metrics
  - `replaceMedicalTerms(text)`: Replaces complex medical terms with simpler alternatives

### 2. Multi-Lingual Support
Provides translation services for medical content to support diverse patient populations.

- **Service**: `TranslationService`
- **Key Methods**:
  - `translateText(text, targetLanguage)`: Translates text to a target language
  - `translateMedicalDocument(documentText, targetLanguage)`: Translates medical documents while preserving terminology
  - `detectLanguage(text)`: Detects the language of a text

### 3. Voice-to-Text Medical Journaling
Converts spoken words to text for medical journaling and note-taking.

- **Service**: `SpeechService`
- **Key Methods**:
  - `speechToText(audioData)`: Converts speech to text
  - `processMedicalJournalEntry(audioData)`: Processes medical journal entries from speech
  - `saveAudioFile(audioBuffer, filename)`: Saves audio files

### 4. Personalized Health Education
Delivers personalized health education content based on patient profiles.

- **Service**: `EducationService`
- **Key Methods**:
  - `getPersonalizedContent(patientProfile)`: Gets personalized education content
  - `recommendContent(patientProfile, userHistory)`: Recommends content based on patient profile and history
  - `trackProgress(userId, contentId, progress)`: Tracks user progress with education content

### 5. Authentication and Authorization
Manages user authentication and authorization with secure practices.

- **Service**: `AuthService`
- **Key Methods**:
  - `registerUser(userData)`: Registers a new user
  - `authenticateUser(email, password)`: Authenticates a user
  - `enableTwoFactorAuth(userId)`: Enables two-factor authentication
  - `refreshToken(refreshToken)`: Refreshes JWT tokens

### 6. Notification System
Sends notifications to patients through multiple channels.

- **Service**: `NotificationService`
- **Key Methods**:
  - `sendNotification(notification)`: Sends a notification
  - `scheduleNotification(notification, scheduledTime)`: Schedules a notification
  - `getUserNotifications(userId, filters)`: Gets user notifications
  - `updateUserPreferences(userId, preferences)`: Updates user notification preferences

### 7. Patient Preference Management
Manages patient preferences across multiple categories.

- **Service**: `PreferenceService`
- **Key Methods**:
  - `getUserPreferences(userId)`: Gets all user preferences
  - `updateUserPreferences(userId, preferences)`: Updates user preferences
  - `resetUserPreferences(userId)`: Resets user preferences to defaults
  - `exportUserPreferences(userId)`: Exports user preferences

## API Endpoints

### Document Simplification
- `POST /api/documents/simplify` - Simplify a medical document
- `POST /api/documents/analyze` - Analyze document complexity
- `GET /api/documents/levels` - Get available simplification levels

### Translation
- `POST /api/translation/text` - Translate text
- `POST /api/translation/document` - Translate medical document
- `POST /api/translation/detect` - Detect language
- `GET /api/translation/languages` - Get supported languages

### Speech
- `POST /api/speech/to-text` - Convert speech to text
- `POST /api/speech/journal` - Process medical journal entry
- `GET /api/speech/languages` - Get supported languages

### Education
- `POST /api/education/content` - Get personalized education content
- `POST /api/education/track` - Track user progress
- `GET /api/education/progress` - Get user progress
- `POST /api/education/recommend` - Recommend content
- `GET /api/education/categories` - Get available categories

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Authenticate user login
- `POST /api/auth/verify` - Verify user email
- `POST /api/auth/reset-request` - Request password reset
- `POST /api/auth/reset` - Reset user password
- `POST /api/auth/2fa/enable` - Enable two-factor authentication
- `POST /api/auth/2fa/verify` - Verify two-factor token
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/logout` - Logout user

### Notifications
- `POST /api/notifications/send` - Send notification
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/:id/read` - Mark notification as read
- `DELETE /api/notifications/:id` - Delete notification
- `GET /api/notifications/preferences` - Get user notification preferences
- `PUT /api/notifications/preferences` - Update user notification preferences
- `POST /api/notifications/appointment` - Send appointment reminder
- `POST /api/notifications/medication` - Send medication reminder

### Preferences
- `GET /api/preferences` - Get all user preferences
- `GET /api/preferences/:category` - Get user preferences by category
- `PUT /api/preferences` - Update user preferences
- `PUT /api/preferences/:category` - Update user preferences by category
- `POST /api/preferences/reset` - Reset user preferences to defaults
- `GET /api/preferences/export` - Export user preferences
- `POST /api/preferences/import` - Import user preferences
- `GET /api/preferences/categories` - Get available preference categories
- `GET /api/preferences/defaults` - Get default preferences

## Configuration

Each service has its own configuration file in the `src/config` directory:

- `document-simplification.config.js` - Configuration for document simplification
- `translation.config.js` - Configuration for translation services
- `speech.config.js` - Configuration for speech services
- `education.config.js` - Configuration for education services
- `auth.config.js` - Configuration for authentication services
- `notifications.config.js` - Configuration for notification services
- `preferences.config.js` - Configuration for preference management

## Testing

Comprehensive tests are provided for all services and controllers in the `test` directory:

- `test/services` - Unit tests for services
- `test/controllers` - Unit tests for controllers

To run tests:
```bash
npm test
```

## Security

- All passwords are hashed using bcrypt
- JWT tokens are used for authentication
- Two-factor authentication is supported
- All communication should be over HTTPS
- HIPAA compliance is maintained through data encryption and access controls

## Compliance

- HIPAA compliant
- GDPR compliant
- Data encryption at rest and in transit
- Audit logging for all user actions
- Secure data retention and deletion policies

## Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables (see `.env.example`)

3. Run the application:
```bash
npm start
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.