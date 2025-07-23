# Content Management System

This directory contains MDX files for the blog-like content on the site.

## Structure

- `/fieldnotes/` - Shorter thoughts, observations, and learnings
- `/writings/` - Longer-form essays and reflections

## Frontmatter Format

Each `.mdx` or `.md` file should include frontmatter with these fields:

```yaml
---
title: "Your Title Here"
slug: "url-friendly-slug"
date: "YYYY-MM-DD"
summary: "Brief description of the content"
banner: "image.jpg" # Optional - just filename, images auto-save to /public/fieldnotes/
tags: ["tag1", "tag2", "tag3"] # Array of strings
draft: false # Set to true to hide from site
---
```

## Writing Workflow

1. Create/edit files in Obsidian pointed at this content directory
2. Use Obsidian Git plugin to commit and push changes
3. GitHub triggers Vercel redeploy automatically
4. Content appears on the live site

## Available Routes

- `/fieldnotes` - Overview of all fieldnotes
- `/fieldnotes/[slug]` - Individual fieldnote pages  
- `/writings` - Overview of all writings
- `/writings/[slug]` - Individual writing pages

## Features

- ✅ Automatic frontmatter parsing
- ✅ Date-based sorting (newest first)
- ✅ Draft support (hidden from public)
- ✅ Tag support
- ✅ Banner image support
- ✅ SEO metadata generation
- ✅ Responsive design
- ✅ Dark/light theme support 