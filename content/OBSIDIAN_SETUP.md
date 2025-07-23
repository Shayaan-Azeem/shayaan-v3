# Obsidian Integration Setup Guide

This guide will help you set up Obsidian to work seamlessly with your portfolio's fieldnotes system.

## Step 1: Open Obsidian Vault

1. **Open Obsidian**
2. **Open folder as vault** → Select the `content` directory inside your project
3. **Trust the folder** when prompted

## Step 2: Install Community Plugins

1. Go to **Settings** → **Community plugins**
2. **Turn off Safe mode**
3. **Browse** community plugins and install:
   - **Obsidian Git** (for automatic commits/pushes)
   - **Templates** (should already be a core plugin)

## Step 3: Configure Git Plugin (CRITICAL)

1. Go to **Settings** → **Community plugins** → **Obsidian Git**
2. **Enable the plugin**
3. Key settings to configure:
   - ✅ **Auto backup after file change**: ON
   - ⏱️ **Auto save interval**: 10 minutes (adjust as needed)
   - ✅ **Pull before push**: ON
   - 📝 **Commit message**: "fieldnote: {{date}} {{filename}}"

## Step 4: Configure Templates

1. Go to **Settings** → **Core plugins** → **Templates**
2. **Enable Templates**
3. **Template folder location**: `templates`

## Step 5: Workflow

### Creating a New Fieldnote

1. **Right-click** in the `fieldnotes` folder
2. **New note**
3. **Ctrl/Cmd + P** → "Templates: Insert template"
4. Choose **fieldnote-template**
5. Fill in:
   - **Title**: Your fieldnote title
   - **Slug**: URL-friendly version (lowercase, hyphens)
   - **Summary**: Brief description
   - **Tags**: Relevant tags in array format

### Automatic Deployment

Once configured:
1. ✍️ **Write your fieldnote** in Obsidian
2. 💾 **Save the file** (Ctrl/Cmd + S)
3. 🤖 **Git plugin automatically commits** after 10 minutes
4. 🚀 **GitHub webhook triggers Vercel deployment**
5. 🌐 **Your fieldnote appears live** on your website!

## Step 6: Test the Setup

1. Create a test fieldnote using the template
2. Save it
3. Wait for the Git plugin to auto-commit (check status bar)
4. Verify it appears on your website

## Pro Tips

- 📁 Use **Daily Notes** plugin to quickly capture thoughts
- 🔗 Link between fieldnotes using `[[double brackets]]`
- 🏷️ Use consistent **tags** for better organization
- 📸 Add **banner images** to `/public/` and reference them
- ✅ Set `draft: true` to work on fieldnotes privately

## Troubleshooting

### Git Plugin Issues
- Ensure you have Git configured with your GitHub credentials
- Check that the repo has proper remote origin set
- Verify SSH key is set up for GitHub

### Templates Not Working
- Check template folder path in settings
- Ensure template files have `.md` extension
- Restart Obsidian after configuration changes

---

**Need help?** Check the individual plugin documentation or reach out! 