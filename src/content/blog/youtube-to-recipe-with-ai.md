---
title: "From YouTube Videos to Recipes with AI"
description: "How I built a script that extracts recipes from YouTube cooking videos using Deepgram and ChatGPT, and why I had to open-source it."
pubDate: 2025-01-23
heroImage: "/img/youtube-to-recipe-with-ai.png"
categories:
  - AI
  - open-source
  - side-projects
metaDescription: "Build an AI-powered tool that converts YouTube cooking videos into text recipes using Deepgram for transcription and ChatGPT for generation."
keywords:
  - youtube to recipe
  - ai recipe generator
  - deepgram
  - chatgpt
  - encore.ts
  - open source
  - audio transcription
  - cooking videos
contentType: "project-showcase"
faqs:
  - question: "Can I use this tool to extract recipes from any YouTube video?"
    answer: "Yes, as long as the video contains spoken recipe instructions. The tool uses Deepgram to transcribe the audio and ChatGPT to extract and format the recipe."
  - question: "Why doesn't this work as a web service?"
    answer: "YouTube blocks requests from server IPs to prevent scraping. The tool works locally because it runs from your personal IP address, but deploying it as a public web service isn't feasible."
  - question: "What technologies does this project use?"
    answer: "The project uses Encore.ts for the backend framework, Deepgram for audio transcription, and OpenAI's ChatGPT for recipe extraction and formatting."
---

## The Problem with Video Recipes

Reading a recipe is infinitely better than watching one. You can scan ingredients at a glance, check steps without rewinding, and take your phone to the grocery store without pausing a 20-minute video. Yet most cooking content lives on YouTube.

## Building the Solution

Almost a year ago, I built a script that solves this problem. The workflow is simple:

1. Paste a YouTube video URL
2. Deepgram transcribes the audio
3. ChatGPT extracts and formats the recipe

I built the first version in an hour, and it worked beautifully. It helped me several times when I wanted a recipe as text instead of constantly rewinding a video every time I forgot a step or an ingredient.

## From Script to Web Service

Recently, I decided to turn this script into a proper web application using Claude Code and Codex. The goal was to make it available for anyone to use.

The development went smoothly. The API was ready, unit tests passed, and the frontend looked exactly how I wanted. Using Encore, I deployed the entire stack—API Gateway, PostgreSQL database, and infrastructure—in under a minute by pushing to main.

Then I hit a wall.

## The YouTube Roadblock

YouTube blocks requests from server IPs. My local script worked fine because it ran from my home IP, but the deployed service couldn't access YouTube at all. I tried using authentication cookies, but that didn't work either.

It was disappointing. I was genuinely excited about the project.

## Open Source Instead

Rather than let the project die, I decided to publish it on GitHub. Anyone can download it and run it locally for free.

**Repository**: https://github.com/baezor/video-to-recipe-ai

The repository includes complete setup instructions.

## Recommended Tools

If you're building something similar, I highly recommend:

- **Encore.ts** (https://encore.dev) — TypeScript-first backend framework with built-in infrastructure
- **Deepgram** (https://deepgram.com) — Fast, accurate audio transcription API

## A Note on AI Progress

YouTube now lets Gemini answer questions about videos directly, including extracting recipes and ingredients. The landscape changes fast. Still, building this was a useful exercise in rapid prototyping and understanding platform limitations.
