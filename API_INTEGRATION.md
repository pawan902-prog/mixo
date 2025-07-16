# API Integration Documentation

## Overview
This document describes the API integration implemented in the IHCL Photo Booth application.

## Integrated APIs

### 1. Avatar List API
**Endpoint:** `https://tagglabsapi.logarithm.co.in/TagglabsServer1api/avatars/avatar-list`
**Method:** GET
**Parameters:**
- `projectId`: 68772bdaf74c1a12f0ae347b
- `gender`: 1 for male, 2 for female (based on user selection)
- `pageNumber`: 1
- `itemsPerPage`: 100

**Response:** Returns a list of avatars with `avatarId` and `image` properties.

### 2. User Registration API
**Endpoint:** `https://tagglabsapi.logarithm.co.in/TagglabsServer1api/ihcl/register-ihcl-user`
**Method:** POST
**Content-Type:** `multipart/form-data`
**Parameters:**
- `sourceImage`: File (captured user photo)
- `avatarId`: String (selected avatar ID)

**Response:**
```json
{
    "result": {
        "imageURL": "https://data.logarithm.co.in/Tagglabs/Deepfake/Generated/v-1752644682.jpg",
        "downloadLink": "https://data.logarithm.co.in/Tagglabs/Deepfake/Generated/d-1752644682.jpg"
    }
}
```
- `imageURL`: URL of the generated superhero image to display
- `downloadLink`: URL for QR code that users can scan to download

## Implementation Details

### Gender Mapping
The application maps user gender selections to API parameters:
- **Male selection** → API parameter `gender=1`
- **Female selection** → API parameter `gender=2`
- **Default** → API parameter `gender=2` (female) if no selection is made

### Photo Capture Flow
1. User takes photo in `photoClick.jsx`
2. Photo is captured as base64 and stored in localStorage
3. User navigates to photo booth selection

### Avatar Selection Flow
1. User selects gender (male/female) in `genderSelection.jsx`
2. Gender selection is stored in localStorage
3. `photoBooth.jsx` fetches avatars from the avatar list API using the correct gender parameter
4. User selects an avatar from the carousel
5. Selected avatar ID is stored in localStorage

### Registration Flow
1. User clicks "Next" button in photo booth to navigate to photo capture
2. User takes photo and clicks "Submit" button
3. System retrieves selected avatar ID from localStorage
4. FormData is created with captured image and avatar ID
5. Registration API is called from photoClick component
6. API response contains `imageURL` and `downloadLink`
7. Response is stored in localStorage
8. On success, user is navigated to ScannerOutput screen
9. ScannerOutput displays generated image and QR code with download link
10. On error, user is shown specific error message and can retry

## Error Handling

### Network Errors
- Connection timeout (30 seconds)
- Network connectivity issues
- CORS issues (if applicable)

### Data Validation
- Avatar selection validation
- Source image validation
- API response validation

### User Feedback
- Loading states during API calls
- Error messages for different failure scenarios
- Success confirmation

## Local Storage Usage

### Keys Used
- `userRegistration`: User registration data
- `selectedGender`: User's gender selection ('male' or 'female')
- `activeAvatarId`: Currently selected avatar ID
- `sourceImage`: Captured user photo (base64)
- `registrationResponse`: API response from registration

## CORS Considerations

If you encounter CORS issues with the registration API (`http://192.168.1.4:5004`), ensure that:

1. The API server allows requests from your frontend domain
2. The API server includes proper CORS headers
3. For development, you might need to configure a proxy in your development server

## Testing

### Manual Testing Steps
1. Select gender (male/female)
2. Select an avatar from the carousel
3. Click "Next" to navigate to photo capture
4. Take a photo using the camera
5. Click "Submit" to trigger registration
6. Check browser console for API logs
7. Verify successful navigation to ScannerOutput screen

### Debug Information
The application logs the following information to the console:
- Selected avatar ID
- Source image availability
- API request/response details
- Error details if registration fails

## Troubleshooting

### Common Issues
1. **"Source image not found"**: Ensure photo was captured before proceeding
2. **"Please select an avatar first"**: Ensure an avatar is selected from the carousel
3. **Network errors**: Check API server availability and CORS configuration
4. **Timeout errors**: Check API server response time

### Development Tips
- Use browser developer tools to monitor network requests
- Check localStorage for data persistence
- Monitor console logs for debugging information 