---
title: "From YouTube Videos to Recipes with AI"
description: "How I built a CLI tool that extracts recipes from YouTube cooking videos using Deepgram and ChatGPT."
pubDate: 2026-01-23
heroImage: "../../assets/youtube-to-recipe-with-ai.png"
categories:
  - AI
  - open-source
  - side-projects
metaDescription: "Build an AI-powered CLI tool that converts YouTube cooking videos into text recipes using Deepgram for transcription and ChatGPT for generation."
keywords:
  - youtube to recipe
  - ai recipe generator
  - deepgram
  - chatgpt
  - cli tool
  - open source
  - audio transcription
  - cooking videos
  - typescript
  - node.js
contentType: "project-showcase"
faqs:
  - question: "Can I use this tool to extract recipes from any YouTube video?"
    answer: "Yes, as long as the video contains spoken recipe instructions. The tool uses Deepgram to transcribe the audio and ChatGPT to extract and format the recipe."
  - question: "Does this tool work with local video files?"
    answer: "Yes, the CLI accepts both YouTube URLs and local video or audio files as input."
  - question: "What technologies does this project use?"
    answer: "The CLI is built with TypeScript and Node.js, uses Deepgram for audio transcription, OpenAI's ChatGPT for recipe extraction, and yt-dlp with ffmpeg for video processing."
---

## The Problem with Video Recipes

Reading a recipe is infinitely better than watching one. You can scan ingredients at a glance, check steps without rewinding, and take your phone to the grocery store without pausing a 20-minute video. Yet most cooking content lives on YouTube.

## Building the Solution

Almost a year ago, I built a CLI tool that solves this problem. The workflow is simple:

1. Paste a YouTube video URL (or provide a local video file)
2. Deepgram transcribes the audio
3. ChatGPT extracts and formats the recipe

I built the first version in an hour, and it worked beautifully. It helped me several times when I wanted a recipe as text instead of constantly rewinding a video every time I forgot a step or an ingredient.

## How It Works

The CLI provides a modular workflow with separate commands for each step:

```bash
# Complete workflow - from URL to recipe
v2r generate https://youtube.com/watch?v=...

# Or run each step separately
v2r download <url>        # Fetch the video
v2r transcribe <path>     # Generate transcript
v2r recipe <path>         # Create recipe from transcript
```

It also includes built-in SQLite caching (enabled by default) so repeated requests for the same video don't burn through API credits. You can copy the generated recipe directly to your clipboard or manage the cache with the `v2r cache` commands.

## Why a CLI?

I originally considered building a web service, but YouTube blocks requests from server IPs to prevent scraping. A CLI tool running on your local machine works around this limitation since it uses your personal IP address.

The CLI approach has other advantages too: it's faster to develop, easier to maintain, and gives users full control over their API keys and data.

## Open Source

The tool is available on GitHub for anyone to download and run locally for free.

**Repository**: https://github.com/baezor/video-to-recipe-ai

The repository includes complete setup instructions. You'll need Node.js 20+, yt-dlp, ffmpeg, and API keys for Deepgram and OpenAI.

## Recommended Tools

If you're building something similar, I highly recommend:

- **Deepgram** (https://deepgram.com) — Fast, accurate audio transcription API
- **yt-dlp** (https://github.com/yt-dlp/yt-dlp) — Feature-rich command-line video downloader

## A Note on AI Progress

YouTube now lets Gemini answer questions about videos directly, including extracting recipes and ingredients. The landscape changes fast. Still, building this was a useful exercise in rapid prototyping and understanding platform limitations.
