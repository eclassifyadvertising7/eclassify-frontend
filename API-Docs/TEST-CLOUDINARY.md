# Cloudinary Test Guide

## Test Endpoints Created

### 1. Check Configuration
```bash
GET http://localhost:5000/api/test/cloudinary/config
```

**Response:**
```json
{
  "success": true,
  "message": "Cloudinary configuration",
  "data": {
    "storageType": "cloudinary",
    "cloudName": "dgz9xfu1f",
    "folder": "eclassify_app",
    "apiKeyConfigured": true,
    "apiSecretConfigured": true
  }
}
```

### 2. Upload Test Images/Videos
```bash
POST http://localhost:5000/api/test/cloudinary/upload
Content-Type: multipart/form-data

# Body: form-data
# Key: media (file)
# Value: Select your image or video file(s)
```

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/test/cloudinary/upload \
  -F "media=@test-image.jpg" \
  -F "media=@test-image2.jpg"
```

**Response:**
```json
{
  "success": true,
  "message": "Test upload completed",
  "storageType": "cloudinary",
  "data": [
    {
      "file": "test-image.jpg",
      "mediaType": "image",
      "uploadResult": {
        "url": "https://res.cloudinary.com/dgz9xfu1f/image/upload/v1234567890/eclassify_app/test/images/abc123.jpg",
        "publicId": "eclassify_app/test/images/abc123",
        "storageType": "cloudinary",
        "width": 1920,
        "height": 1080
      },
      "databaseRecord": {
        "id": 1,
        "listingId": 1,
        "mediaType": "image",
        "mediaUrl": "https://res.cloudinary.com/dgz9xfu1f/image/upload/v1234567890/eclassify_app/test/images/abc123.jpg",
        "storageType": "cloudinary"
      }
    }
  ]
}
```

### 3. List All Test Media
```bash
GET http://localhost:5000/api/test/cloudinary/list
```

**Response:**
```json
{
  "success": true,
  "message": "Test media list",
  "storageType": "cloudinary",
  "count": 2,
  "data": [
    {
      "id": 1,
      "listingId": 1,
      "mediaType": "image",
      "mediaUrl": "https://res.cloudinary.com/dgz9xfu1f/...",
      "storageType": "cloudinary"
    }
  ]
}
```

### 4. Delete Test Media
```bash
DELETE http://localhost:5000/api/test/cloudinary/delete/:mediaId
```

**Example:**
```bash
curl -X DELETE http://localhost:5000/api/test/cloudinary/delete/1
```

**Response:**
```json
{
  "success": true,
  "message": "Test delete completed",
  "data": {
    "mediaId": "1",
    "publicId": "eclassify_app/test/images/abc123",
    "storageType": "cloudinary",
    "deleteResult": {
      "result": "ok"
    }
  }
}
```

## Testing Steps

### Step 1: Start Server
```bash
npm run dev
```

### Step 2: Check Configuration
```bash
curl http://localhost:5000/api/test/cloudinary/config
```

Verify:
- ✅ `storageType: "cloudinary"`
- ✅ `apiKeyConfigured: true`
- ✅ `apiSecretConfigured: true`

### Step 3: Upload Test Image

**Using cURL:**
```bash
curl -X POST http://localhost:5000/api/test/cloudinary/upload \
  -F "media=@path/to/your/image.jpg"
```

**Using Postman:**
1. Method: POST
2. URL: `http://localhost:5000/api/test/cloudinary/upload`
3. Body → form-data
4. Key: `media` (type: File)
5. Value: Select your image file
6. Click Send

### Step 4: Verify Upload

**Check Response:**
- Look for `uploadResult.url` - Should be Cloudinary URL
- Look for `uploadResult.publicId` - Should start with `eclassify_app/test/`

**Check Cloudinary Dashboard:**
1. Visit: https://console.cloudinary.com/console/media_library
2. Navigate to `eclassify_app/test/images/`
3. Verify your image is there

**Check Database:**
```bash
curl http://localhost:5000/api/test/cloudinary/list
```

### Step 5: Test Delete

Get media ID from list response, then:
```bash
curl -X DELETE http://localhost:5000/api/test/cloudinary/delete/1
```

Verify:
- File deleted from Cloudinary dashboard
- Record removed from database

## What Gets Tested

✅ **Cloudinary Configuration** - Credentials are correct
✅ **Image Upload** - Files upload to Cloudinary
✅ **Image Optimization** - Sharp compresses before upload
✅ **Database Storage** - publicId stored correctly
✅ **URL Generation** - Full Cloudinary URLs returned
✅ **File Deletion** - Files removed from Cloudinary
✅ **Video Upload** - Videos upload correctly (if tested)

## Expected Behavior

### Local Storage (STORAGE_TYPE=local)
- Files saved to `uploads/` folder
- URLs: `http://localhost:5000/uploads/...`
- Database stores relative path

### Cloudinary Storage (STORAGE_TYPE=cloudinary)
- Files uploaded to Cloudinary
- URLs: `https://res.cloudinary.com/dgz9xfu1f/...`
- Database stores publicId

## Troubleshooting

### Upload Fails with 401 Unauthorized
- Check `CLOUDINARY_API_SECRET` in `.env`
- Verify credentials at https://console.cloudinary.com/settings/api-keys

### Upload Fails with "Invalid signature"
- Restart server after changing `.env`
- Verify all three credentials are correct

### Files Not Appearing in Cloudinary
- Check `STORAGE_TYPE=cloudinary` in `.env`
- Verify folder name in Cloudinary dashboard

### URLs Not Working
- Check response - should have full Cloudinary URL
- Verify `storageType: "cloudinary"` in response

## Cleanup

After testing, delete test files:

1. **From Database:**
```bash
# List all test media
curl http://localhost:5000/api/test/cloudinary/list

# Delete each one
curl -X DELETE http://localhost:5000/api/test/cloudinary/delete/1
curl -X DELETE http://localhost:5000/api/test/cloudinary/delete/2
```

2. **From Cloudinary Dashboard:**
- Visit Media Library
- Navigate to `eclassify_app/test/`
- Delete test folder

3. **Remove Test Routes (Production):**
Delete these files before deploying:
- `src/controllers/testCloudinaryController.js`
- `src/routes/testCloudinaryRoutes.js`
- Remove import from `src/routes/index.js`

## Success Criteria

✅ Configuration endpoint returns correct settings
✅ Upload endpoint successfully uploads to Cloudinary
✅ Cloudinary dashboard shows uploaded files
✅ List endpoint returns Cloudinary URLs
✅ Delete endpoint removes files from Cloudinary
✅ Database records created and deleted correctly

If all tests pass, your Cloudinary setup is working perfectly!
