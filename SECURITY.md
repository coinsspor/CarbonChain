# 🔒 Security Guidelines

## Sensitive Files - DO NOT COMMIT

The following files contain sensitive information and must **NEVER** be committed to the repository:

### Backend
- ✅ `.env` - Contains AIR Kit credentials and API keys
- ✅ `keys/private.key` - RSA private key for JWT signing
- ✅ `keys/public.key` - RSA public key (can be public, but keep out of repo)
- ✅ `keys/jwks.json` - JSON Web Key Set
- ✅ `backend.log` - May contain sensitive runtime data
- ✅ `node_modules/` - Dependencies (always excluded)

### Frontend
- ✅ `.env` - Contains AIR Kit credentials and backend URL
- ✅ `frontend.log` - May contain user data
- ✅ `node_modules/` - Dependencies (always excluded)
- ✅ `dist/` - Build artifacts

## What to Check Before Pushing to GitHub

### 1. Environment Variables
Always use `.env.example` files for reference, never commit actual `.env` files.

**Backend `.env` contains:**
- `AIR_PARTNER_ID` - Your AIR Kit Partner ID
- `AIR_ISSUER_DID` - Your AIR Issuer DID
- `AIR_VERIFIER_DID` - Your AIR Verifier DID
- `SCHEMA_ID` - Carbon Credit Schema ID
- `ISSUANCE_PROGRAM_ID` - Issuance Program ID
- `VERIFICATION_PROGRAM_ID` - Verification Program ID

**Frontend `.env` contains:**
- `VITE_BACKEND_URL` - Your backend URL (may reveal production URL)
- `VITE_AIR_PARTNER_ID` - Your AIR Kit Partner ID
- `VITE_AIR_ISSUER_DID` - Your AIR Issuer DID
- `VITE_SCHEMA_ID` - Schema ID
- `VITE_ISSUANCE_PROGRAM_ID` - Issuance Program ID
- `VITE_VERIFICATION_PROGRAM_ID` - Verification Program ID

### 2. Private Keys
**Never commit RSA keys:**
```
backend/keys/private.key   # ❌ PRIVATE - NEVER COMMIT
backend/keys/public.key    # ⚠️  Can be public but keep out of repo
backend/keys/jwks.json     # ⚠️  Can be public but keep out of repo
```

### 3. Log Files
Log files may contain:
- User information
- API responses
- Error traces with sensitive data
- Runtime environment details

### 4. Database Credentials
When you add a database, ensure connection strings are in `.env`:
```
DATABASE_URL=mongodb://username:password@host:port/database  # ❌ NEVER COMMIT
```

## Security Best Practices

### For Development

1. **Use `.env.example` files**
   ```bash
   cp .env.example .env
   # Edit .env with your actual values
   ```

2. **Generate new keys locally**
   ```bash
   cd backend
   npm run keys
   ```

3. **Never share your `.env` file**
   - Not in screenshots
   - Not in Discord messages
   - Not in pull requests

### For Production

1. **Use environment-specific configurations**
   - Separate `.env.development` and `.env.production`
   - Never commit either file

2. **Use secrets management**
   - GitHub Secrets for CI/CD
   - AWS Secrets Manager
   - HashiCorp Vault
   - Or your hosting provider's secret management

3. **Rotate credentials regularly**
   - Change API keys periodically
   - Generate new RSA keys for production

4. **Enable HTTPS**
   - Never send credentials over HTTP
   - Use TLS/SSL certificates

5. **Implement rate limiting**
   - Prevent brute force attacks
   - Use packages like `express-rate-limit`

## Checking Your Commits

Before pushing to GitHub, run these checks:

```bash
# Check for accidentally committed secrets
git diff --cached

# Search for potential secrets
grep -r "AIR_PARTNER_ID" .
grep -r "private.key" .
grep -r "password" .
grep -r "api_key" .

# Ensure .gitignore is working
git status
```

## If You Accidentally Commit Secrets

1. **Immediately rotate the compromised credentials**
   - Generate new AIR Kit credentials
   - Generate new RSA keys
   - Update your production environment

2. **Remove from Git history**
   ```bash
   # Use git-filter-repo (recommended)
   pip install git-filter-repo
   git filter-repo --path .env --invert-paths

   # Or use BFG Repo-Cleaner
   java -jar bfg.jar --delete-files .env
   ```

3. **Force push (CAUTION)**
   ```bash
   git push origin main --force
   ```

4. **Notify your team**

## Reporting Security Issues

If you discover a security vulnerability, please email:
- **Do not** open a public GitHub issue
- Send details to: [your-security-email@example.com]

We will respond within 48 hours.

## Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [GitHub Security Best Practices](https://docs.github.com/en/code-security)
- [AIR Kit Security Docs](https://docs.air3.com)

---

**Last Updated:** November 2025
