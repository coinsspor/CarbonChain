# 📊 Carbon Credit Data Management Guide

## 🎯 Data Overview

CarbonChain contains **10,800+ real carbon credit projects** with the following statistics:

### Statistics
- **Total Projects:** 10,800+
- **Credits Issued:** 2.5 Billion tCO2
- **Credits Retired:** 1.1 Billion tCO2
- **Available Credits:** 1.5 Billion tCO2

### Registries Included
| Registry | Projects |
|----------|----------|
| Verra | 2,900+ |
| Unknown | 2,400+ |
| Climate Action Reserve | 702 |
| ART Trees | 25 |
| Berkeley | 6 |
| CarbonPlan | 1 |

---

## 📁 Data Files

### Location
```
backend/data/
├── projects.json    (~80-100 MB)
└── credits.json     (~50-80 MB)
```

### File Sizes
- **Total:** ~150MB combined
- **Too large for GitHub:** Files exceed GitHub's 100MB limit

---

## ⚠️ Why Data Files Are Not in GitHub

### Problem
- GitHub has a **100MB file size limit**
- Combined data files are **~150MB**
- Direct push would fail

### Solution Options

#### Option 1: Git LFS (Recommended)
Use Git Large File Storage for big files.

```bash
# Install Git LFS
git lfs install

# Track large files
git lfs track "backend/data/*.json"

# Add .gitattributes
git add .gitattributes

# Commit and push
git add backend/data/
git commit -m "Add carbon credit data via LFS"
git push
```

**Pros:**
- ✅ Files in repository
- ✅ Version control
- ✅ Easy to clone

**Cons:**
- ⚠️ Requires Git LFS setup
- ⚠️ GitHub LFS has bandwidth limits

---

#### Option 2: External Hosting
Host data files externally and provide download links.

**Services:**
- Google Drive
- Dropbox
- Amazon S3
- GitHub Releases

**Steps:**
1. Upload `projects.json` and `credits.json` to cloud storage
2. Make files publicly accessible
3. Add download links to README

Example README section:
```markdown
## 📊 Data Files

Due to size constraints, data files are hosted externally:

- [Download projects.json](https://drive.google.com/file/d/YOUR_FILE_ID)
- [Download credits.json](https://drive.google.com/file/d/YOUR_FILE_ID)

**Setup:**
1. Download both files
2. Place them in `backend/data/`
3. Run `npm start`
```

---

#### Option 3: Data Generation Script
Provide a script that downloads/generates data.

Create `backend/scripts/download-data.js`:
```javascript
import { writeFileSync } from 'fs';
import axios from 'axios';

const DATA_URLS = {
  projects: 'https://your-cdn.com/projects.json',
  credits: 'https://your-cdn.com/credits.json'
};

async function downloadData() {
  console.log('📥 Downloading carbon credit data...');
  
  for (const [name, url] of Object.entries(DATA_URLS)) {
    const response = await axios.get(url);
    writeFileSync(`./data/${name}.json`, JSON.stringify(response.data));
    console.log(`✅ ${name}.json downloaded`);
  }
}

downloadData();
```

Add to `package.json`:
```json
{
  "scripts": {
    "download-data": "node scripts/download-data.js"
  }
}
```

---

## 🔧 Local Development Setup

### With Existing Data Files

If you have the data files locally:

```bash
# 1. Navigate to backend
cd backend

# 2. Ensure data directory exists
mkdir -p data

# 3. Copy your data files
cp /path/to/projects.json data/
cp /path/to/credits.json data/

# 4. Verify files
ls -lh data/
# Should show:
# projects.json  (~80-100 MB)
# credits.json   (~50-80 MB)

# 5. Start server
npm start
```

### Without Data Files

The backend will still run, but with empty data:

```bash
npm start
# Output:
# ❌ Error loading carbon data: ENOENT
# 🚀 CarbonChain Backend: http://localhost:7000
# ⚠️  No projects loaded
```

---

## 📊 Data Structure

### projects.json

```json
[
  {
    "id": "VCS1234",
    "name": "Amazon Rainforest Conservation",
    "registry": "verra",
    "country": "Brazil",
    "category": "REDD+",
    "methodology": "VM0015",
    "issued": 1000000,
    "retired": 500000,
    "vintage": 2024,
    "latitude": -3.4653,
    "longitude": -62.2159,
    "description": "Project description...",
    "verifier": "SCS Global Services",
    "projectType": "Avoidance",
    "status": "Active"
  }
]
```

### credits.json

```json
[
  {
    "creditId": "VCS-1234-2024-001",
    "projectId": "VCS1234",
    "serialNumber": "1234-123456789-123456789-VCU-123-VER-BR-1-1234-01012024-31122024-0",
    "vintage": 2024,
    "quantity": 1000,
    "status": "Active",
    "issuanceDate": "2024-01-01",
    "retirementDate": null,
    "price": 15.50,
    "registry": "verra"
  }
]
```

---

## 🔄 Updating Data

### Manual Update

1. Get updated data from registries
2. Replace files in `backend/data/`
3. Restart server

```bash
# Backup old data
cp backend/data/projects.json backend/data/projects.backup.json

# Replace with new data
cp /path/to/new/projects.json backend/data/

# Restart
npm restart
```

### Automated Sync (Future Enhancement)

Create a cron job or scheduled task:

```javascript
// backend/scripts/sync-registries.js
import axios from 'axios';
import { writeFileSync } from 'fs';

async function syncVerra() {
  const response = await axios.get('https://registry.verra.org/api/v1/projects');
  // Process and save
}

async function syncGoldStandard() {
  // Similar implementation
}

// Run daily
setInterval(async () => {
  await syncVerra();
  await syncGoldStandard();
}, 24 * 60 * 60 * 1000);
```

---

## 🚀 Deployment Considerations

### Production Deployment

For production, consider:

1. **Database Migration**
   - Move from JSON files to MongoDB/PostgreSQL
   - Better query performance
   - Real-time updates

2. **CDN Hosting**
   - Host JSON files on CDN
   - Reduce server load
   - Faster access

3. **API Integration**
   - Direct integration with Verra/Gold Standard APIs
   - Real-time data synchronization
   - No manual updates needed

---

## 📝 Data Sources

Original data compiled from:

- **Verra Registry:** https://registry.verra.org/
- **Gold Standard:** https://registry.goldstandard.org/
- **Climate Action Reserve:** https://thereserve2.apx.com/
- **Architecture for REDD+ Transactions (ART):** https://www.arttrees.org/
- **Berkeley Carbon Trading Project:** https://gspp.berkeley.edu/
- **CarbonPlan:** https://carbonplan.org/

---

## ⚠️ Important Notes

### File Integrity

Always verify data file integrity:

```bash
# Check file size
ls -lh backend/data/

# Validate JSON
node -e "JSON.parse(require('fs').readFileSync('backend/data/projects.json'))"

# Count projects
node -e "console.log(JSON.parse(require('fs').readFileSync('backend/data/projects.json')).length)"
```

### Security

- ✅ Data files contain **public registry information**
- ✅ No sensitive credentials
- ✅ No personal information
- ✅ Safe to share/backup

### Licensing

- Carbon credit data is **publicly available** from registries
- Attribution to source registries is recommended
- Check individual registry terms of service

---

## 🆘 Troubleshooting

### "Cannot find module ./data/projects.json"

**Solution:**
```bash
# Ensure data directory exists
mkdir -p backend/data

# Ensure files are present
ls backend/data/
# Should show: projects.json, credits.json
```

### "Unexpected end of JSON input"

**Solution:**
```bash
# Validate JSON syntax
node -e "JSON.parse(require('fs').readFileSync('backend/data/projects.json'))"

# Re-download or restore from backup
```

### "ENOENT: no such file or directory"

**Solution:**
```bash
# Check current directory
pwd
# Should be in: /path/to/carbonchain/backend

# Check if data folder exists
ls -la | grep data
```

---

## 📞 Support

For data-related issues:
1. Check this guide first
2. Verify file integrity
3. Check backend logs
4. Raise GitHub issue with error details

---

**Last Updated:** November 2025
