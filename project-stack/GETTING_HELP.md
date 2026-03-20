# Getting Help - Career Mentor AI

Having trouble? This guide will help you find solutions quickly.

## Quick Troubleshooting

### The app won't start
```bash
# Check Node.js version
node --version  # Should be 18+

# Check if ports are free
lsof -i :3000   # app port
lsof -i :8000   # Hindsight port

# Clear cache and reinstall
rm -rf node_modules .next
pnpm install
pnpm dev
```

### Hindsight won't connect
```bash
# Check if Docker is running
docker ps

# Check if container is up
docker-compose ps

# View logs
docker-compose logs hindsight

# Restart
docker-compose restart hindsight

# Test health
curl http://localhost:8000/health
```

### Gemini API errors
```bash
# Verify API key is set
echo $GEMINI_API_KEY

# If empty, add to .env.local
GEMINI_API_KEY=your_actual_key_here

# Restart development server
# Stop current: Ctrl+C
# Restart: pnpm dev
```

### Dependencies won't install
```bash
# Check Node/npm versions
node --version  # 18+
npm --version   # 9+

# Try clearing cache
pnpm store prune

# Reinstall
rm -rf node_modules
pnpm install

# If still issues
pnpm install --force
```

---

## Error Messages & Solutions

### "GEMINI_API_KEY is not set"

**Problem**: Environment variable not configured

**Solutions**:
1. Create `.env.local` file
   ```bash
   cp .env.example .env.local
   ```

2. Add your API key
   ```
   GEMINI_API_KEY=sk-abc123...
   ```

3. Restart dev server
   ```bash
   pnpm dev
   ```

**Verify**:
```bash
echo $GEMINI_API_KEY  # Should show key, not empty
```

---

### "Cannot connect to Hindsight"

**Problem**: Backend not responding

**Solutions**:
1. Check if Docker is installed
   ```bash
   docker --version
   ```

2. Check if Hindsight is running
   ```bash
   docker-compose ps
   ```

3. If not running, start it
   ```bash
   docker-compose up -d
   ```

4. Verify health
   ```bash
   curl http://localhost:8000/health
   ```

**Still failing?**:
```bash
# View detailed logs
docker-compose logs -f hindsight

# Restart container
docker-compose down
docker-compose up -d

# Check disk space
docker system df
```

---

### "Port 3000 is already in use"

**Problem**: Another app is running on port 3000

**Solutions**:
```bash
# Find what's using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or use a different port
pnpm dev -- -p 3001
```

---

### "Port 8000 is already in use"

**Problem**: Another app is running on port 8000

**Solutions**:
```bash
# Check what's using it
lsof -i :8000

# Option 1: Kill the process
kill -9 <PID>

# Option 2: Use different port
# Edit docker-compose.yml
# Change: ports: - "8000:8000"
# To:     ports: - "8001:8000"
# Then: docker-compose restart
```

---

### "Build fails with TypeScript errors"

**Problem**: Type checking found issues

**Solutions**:
```bash
# Check the error message carefully
# Fix the issue in the code

# Clear build cache
rm -rf .next

# Rebuild
pnpm dev
```

**Common fixes**:
- Missing imports
- Type mismatches
- Undefined variables

---

### "Page shows blank or errors"

**Problem**: React component crashed

**Solutions**:
1. Check browser console (F12 → Console tab)
2. Look for red error messages
3. Check Vercel deployment logs if in production
4. Restart dev server:
   ```bash
   Ctrl+C
   pnpm dev
   ```

---

## Getting More Help

### By Issue Type

#### Setup & Installation Issues
- Read: [QUICKSTART.md](./QUICKSTART.md)
- Try: Following setup step-by-step
- If stuck: Check [HINDSIGHT_SETUP.md](./HINDSIGHT_SETUP.md)

#### API & Integration Issues
- Read: [HINDSIGHT_EXAMPLES.md](./HINDSIGHT_EXAMPLES.md)
- Check: Your API keys are correct
- Verify: Hindsight is running
- Test: Using curl commands

#### Architecture & Code Issues
- Read: [BUILD_SUMMARY.md](./BUILD_SUMMARY.md)
- Check: File structure
- Review: Component examples
- Run: Locally first

#### Deployment Issues
- Read: [DEPLOYMENT.md](./DEPLOYMENT.md)
- Check: Environment variables
- Verify: API keys are set
- Test: Each component separately

---

## Debugging Tips

### 1. Enable Verbose Logging

Edit `lib/gemini.ts`:
```typescript
// Add this at the top
console.log('[v0] Gemini request:', { userMessage, context });
```

Then check browser console for debug output.

### 2. Check Network Requests

Open DevTools (F12 → Network tab):
- Look for red ❌ requests (failures)
- Check response status codes
- Look at error messages

### 3. Test Hindsight Directly

```bash
# Test if it's running
curl http://localhost:8000/health

# Create a test memory
curl -X POST http://localhost:8000/memories \
  -H "Content-Type: application/json" \
  -d {
    "userId": "test-user",
    "type": "experience",
    "content": "test memory",
    "metadata": {}
  }
```

### 4. Test Gemini API

```bash
# Check if API key works
curl -X POST "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{"contents":[{"parts":[{"text":"hello"}]}]}'
```

---

## Performance Issues

### Slow to add skills?
- Check network tab (F12)
- Check if API is responding
- Try creating fewer memories at once

### Slow resume feedback?
- Gemini API takes 3-10 seconds
- Check API quota at makersuite.google.com
- Look for API errors in logs

### Slow internship recommendations?
- Requires querying many memories
- First time might be slow
- Subsequent requests faster (cached)

---

## Common Mistakes

❌ **Mistake**: Running `pnpm dev` without starting Hindsight
✅ **Fix**: Start Docker first: `docker-compose up -d`

❌ **Mistake**: Pushing `.env.local` to GitHub
✅ **Fix**: Add to `.gitignore`, use `.env.example` instead

❌ **Mistake**: Using old API key
✅ **Fix**: Get new key from Google AI Studio

❌ **Mistake**: Forgetting to set NODE_ENV in production
✅ **Fix**: Set env vars in Vercel/production platform

❌ **Mistake**: Running Hindsight on 0.0.0.0:8000 without SSL
✅ **Fix**: Use reverse proxy with SSL (nginx, Caddy)

---

## Getting Help From The Community

### Hindsight Issues
- **GitHub Issues**: https://github.com/vectorize-io/hindsight/issues
- **Documentation**: https://hindsight.vectorize.io/docs
- **Cookbook**: https://github.com/vectorize-io/hindsight-cookbook

### Gemini API Issues
- **Google AI Studio**: https://makersuite.google.com
- **Documentation**: https://ai.google.dev/docs
- **Troubleshooting**: https://ai.google.dev/tutorials/troubleshooting

### Next.js Issues
- **GitHub Discussions**: https://github.com/vercel/next.js/discussions
- **Documentation**: https://nextjs.org/docs
- **Stack Overflow**: Tag with `next.js`

### Docker Issues
- **Documentation**: https://docs.docker.com
- **Stack Overflow**: Tag with `docker`
- **Docker Hub**: https://hub.docker.com

---

## Submitting Bug Reports

When reporting issues, include:

1. **What you were doing**
   ```
   "Trying to add a new skill"
   ```

2. **What went wrong**
   ```
   "Error: Cannot read property 'skills' of undefined"
   ```

3. **Error message** (copy-paste from console)
   ```
   TypeError: Cannot read property 'skills' of undefined
       at addSkill (components/skills-tracker.tsx:45)
   ```

4. **Steps to reproduce**
   ```
   1. Open app
   2. Click "Add Skills"
   3. Enter "React" and click Add
   4. Error appears
   ```

5. **Environment**
   ```
   OS: macOS 13.2
   Node: v18.14.0
   npm: 9.3.1
   Docker: 20.10.12
   ```

---

## Getting Help with Specific Features

### "How do I customize the AI mentor?"
See: `lib/gemini.ts` - Edit prompts here

### "How do I add more memory types?"
See: `lib/hindsight.ts` - Add new memory types

### "How do I store more data?"
See: [DEPLOYMENT.md](./DEPLOYMENT.md) - Scaling section

### "How do I track more metrics?"
Edit: Components or add to `lib/types.ts`

### "How do I integrate with X service?"
See: [BUILD_SUMMARY.md](./BUILD_SUMMARY.md) - Future enhancements

---

## Still Stuck?

### Last Resort Checklist

- [ ] Restart dev server: `Ctrl+C` then `pnpm dev`
- [ ] Restart Docker: `docker-compose restart`
- [ ] Clear cache: `rm -rf .next node_modules`
- [ ] Start fresh: `pnpm install && pnpm dev`
- [ ] Check all env vars: `.env.local` exists and correct
- [ ] Verify all services running: `docker-compose ps`
- [ ] Test locally first, don't deploy yet
- [ ] Read docs again (often find answers there)
- [ ] Ask for help with full error message

### Where to Ask for Help

1. **For Hindsight**: GitHub Issues
2. **For Gemini**: Google AI Studio support
3. **For Next.js**: Next.js Discussions
4. **For this app**: Check BUILD_SUMMARY.md for what was built

---

## Resources Quick Links

| Topic | Link |
|-------|------|
| Get Gemini API Key | https://makersuite.google.com/app/apikey |
| Hindsight Docs | https://hindsight.vectorize.io |
| Hindsight GitHub | https://github.com/vectorize-io/hindsight |
| Next.js Docs | https://nextjs.org/docs |
| Tailwind CSS | https://tailwindcss.com |
| Docker Docs | https://docs.docker.com |
| Vercel Docs | https://vercel.com/docs |

---

## Before You Contact Support

1. **Check this document** - Most issues covered here
2. **Check relevant docs** - QUICKSTART, HINDSIGHT_SETUP, etc.
3. **Check error messages** - Often says what's wrong
4. **Try the fixes** - Most issues have quick solutions
5. **Test locally** - Reproduce on your machine
6. **Look at logs** - `docker-compose logs` often reveals issues

---

## Success! 🎉

If you got your issue fixed:
- ✅ Bookmark this page
- ✅ Share with others
- ✅ Consider contributing improvements
- ✅ Give feedback to help us improve

---

**Remember**: Most issues have been solved before. Check the docs and try the debugging steps above first!

Happy coding! 🚀
