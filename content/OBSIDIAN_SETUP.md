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
   - **Banner**: See "Adding Banner Images" section below
   - **Tags**: Relevant tags in array format

### Automatic Deployment

Once configured:
1. ✍️ **Write your fieldnote** in Obsidian
2. 💾 **Save the file** (Ctrl/Cmd + S)
3. 🤖 **Git plugin automatically commits** after 10 minutes
4. 🚀 **GitHub webhook triggers Vercel deployment**
5. 🌐 **Your fieldnote appears live** on your website!

## Step 6: Adding Images

### Adding Images to Your Fieldnotes
1. **Drag any image** directly into your Obsidian note
2. **Obsidian automatically saves** it to `/public/fieldnotes/`
3. **Use images in content** normally with the generated markdown links

### Adding Banner Images (Super Simple!)
1. **Drag your banner image** into the note (saves to `/public/fieldnotes/`)
2. **Copy just the filename** (e.g., `my-banner.jpg`)
3. **Paste in banner field**: `banner: "my-banner.jpg"`
4. **Done!** The system automatically adds `/fieldnotes/` path

### Banner Examples
```yaml
banner: "my-image.jpg"           # Image from /public/fieldnotes/ (auto-path)
banner: "/tensorforest.png"      # Existing project image (full path)
banner: "/apoimages/selfie.png"  # Existing apo image (full path)
banner: ""                      # No banner
```

## Step 7: Test the Setup

1. Create a test fieldnote using the template
2. Save it
3. Wait for the Git plugin to auto-commit (check status bar)
4. Verify it appears on your website

## Pro Tips

- 📁 Use **Daily Notes** plugin to quickly capture thoughts
- 🔗 Link between fieldnotes using `[[double brackets]]`
- 🏷️ Use consistent **tags** for better organization
- 📸 **Drag images** into Obsidian (auto-saves to `/public/fieldnotes/`)
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

### Files Not Showing on Website
- Both `.md` and `.mdx` files are supported
- Ensure frontmatter is properly formatted
- Check that `draft: false` is set
- Verify the file is in the correct folder (`fieldnotes/` or `writings/`)

---

**Need help?** Check the individual plugin documentation or reach out! 

### Editing Your Philosophy Page

Your philosophy page is editable directly in Obsidian:
1. **Open** `philosophy.md` in the content root
2. **Edit** your thoughts, quotes, and beliefs
3. **Save** - it automatically updates your website!
4. **Use the template** from `templates/philosophy-template.md` if starting fresh


