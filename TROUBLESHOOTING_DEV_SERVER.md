# Troubleshooting: Dev Server Stuck on "Starting"

## Quick Fixes

### 1. Port Already in Use (Most Common)
If port 3000 is already in use:

**Windows:**
```bash
# Find what's using port 3000
netstat -ano | findstr :3000

# Kill the process (replace PID with the number from above)
taskkill /F /PID <PID>

# Or use a different port
npm run dev -- -p 3001
```

**Mac/Linux:**
```bash
# Find what's using port 3000
lsof -ti:3000

# Kill the process
kill -9 $(lsof -ti:3000)

# Or use a different port
npm run dev -- -p 3001
```

### 2. Clear Next.js Cache
```bash
# Delete .next folder
rm -rf .next
# Windows: rmdir /s .next

# Then restart
npm run dev
```

### 3. Check for TypeScript/Compilation Errors
```bash
# Check for TypeScript errors
npx tsc --noEmit

# Check for linting errors
npm run lint
```

### 4. Check Environment Variables
Make sure `.env.local` exists and has valid Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
SUPABASE_SERVICE_ROLE_KEY=your_key
```

### 5. Reinstall Dependencies
```bash
# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json
# Windows: rmdir /s node_modules & del package-lock.json

# Reinstall
npm install

# Then start dev server
npm run dev
```

### 6. Use Different Port
If port 3000 keeps having issues:
```bash
npm run dev -- -p 3001
```

Then access at: http://localhost:3001

### 7. Check for Infinite Loops in Code
- Check `useEffect` hooks for missing dependencies
- Check for circular imports
- Check middleware for infinite redirects

### 8. Increase Node Memory (if needed)
```bash
# Windows (PowerShell)
$env:NODE_OPTIONS="--max-old-space-size=4096"
npm run dev

# Mac/Linux
NODE_OPTIONS="--max-old-space-size=4096" npm run dev
```

## Still Stuck?

1. **Check the terminal output** - Look for any error messages
2. **Check browser console** - Open DevTools (F12) and check for errors
3. **Try building instead of dev mode:**
   ```bash
   npm run build
   npm start
   ```
4. **Check Next.js version compatibility:**
   ```bash
   npm list next
   ```
