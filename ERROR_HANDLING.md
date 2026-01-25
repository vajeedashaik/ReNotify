# Error Handling & Diagnostics

This document describes the comprehensive error handling and diagnostics system added to help identify and debug issues.

## Components Added

### 1. ErrorBoundary (`components/ErrorBoundary.tsx`)
- Catches React component errors and displays a user-friendly error page
- Logs detailed error information to the console
- Provides options to reload the page or go home
- Wraps the entire application in `app/layout.tsx`

### 2. SafeDithering (`components/landing/SafeDithering.tsx`)
- Wraps the shader component with error handling
- Checks for WebGL support before rendering
- Falls back to a gradient background if shader fails
- Logs all shader-related errors to console

### 3. Diagnostics (`components/Diagnostics.tsx`)
- Runs on page load to check system status
- Logs browser information, WebGL support, screen info
- Checks for missing environment variables
- Reports performance metrics

### 4. Enhanced AppProviders (`components/providers/AppProviders.tsx`)
- Adds global error handlers for unhandled errors
- Catches promise rejections
- Logs all errors with timestamps

## Console Logging

All components now log detailed information to the browser console with emoji prefixes for easy identification:

- 🚨 = Errors
- ⚠️ = Warnings
- ✅ = Success
- 🔍 = Diagnostics
- 🎨 = Shader/Graphics related
- ⏳ = Loading states
- 🔧 = Initialization
- 🌐 = Browser/Environment
- 📱 = Screen/Device info
- 🔐 = Environment variables
- ⚛️ = React related
- ⏱️ = Performance

## How to Debug

1. **Open Browser Console** (F12 or Right-click → Inspect → Console)
2. **Look for error messages** starting with 🚨
3. **Check diagnostics** - Look for the "DIAGNOSTICS START" section
4. **Check for warnings** - Look for ⚠️ symbols
5. **Review component logs** - Each component logs its initialization

## Common Issues to Check

### Shader/WebGL Issues
- Look for: `⚠️ WebGL is not supported` or `❌ Dithering component error`
- Solution: The page will still work with a fallback gradient

### Environment Variable Issues
- Look for: `❌ Missing` next to environment variables
- Solution: Check your `.env.local` file

### Component Loading Issues
- Look for: `❌ Failed to load` messages
- Solution: Check network tab for failed requests

### Provider Initialization Issues
- Look for: `🚨 AppProviders: Error initializing providers`
- Solution: Check Supabase configuration

## Error Recovery

The application is designed to gracefully handle errors:

1. **Shader failures** → Falls back to gradient background
2. **Component errors** → Error boundary shows friendly message
3. **Provider failures** → App continues without providers
4. **Network errors** → Logged but don't crash the app

## Testing Error Handling

To test if error handling is working:

1. Open browser console
2. Navigate to the landing page
3. You should see diagnostic logs
4. If there are errors, they'll be clearly marked with 🚨

## Next Steps if Website Won't Open

1. Check browser console for errors
2. Look for the diagnostics section
3. Check for missing environment variables
4. Verify WebGL support (for shader effects)
5. Check network tab for failed API requests
6. Review the error boundary message if one appears
