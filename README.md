# Google Chat Notification Action 🚀

Send automated pipeline status notifications from GitHub Actions to Google Chat rooms seamlessly.

![GitHub](https://img.shields.io/github/license/adprajwal/ChimeOps)
![GitHub release (latest by date)](https://img.shields.io/github/v/release/adprajwal/ChimeOps)

## Overview

This GitHub Action allows you to send detailed pipeline status notifications directly to your Google Chat rooms via webhooks. Whether you want to track successful deployments, catch failures early, or keep your team informed about ongoing processes, this action streamlines your notification workflow.

## Features

- 🔔 **Real-time notifications** in Google Chat
- 🎨 **Clean and informative message formatting**  
- 🛠️ **Easy integration** with existing workflows
- 📝 **Support for custom messages**
- 🔄 **Status-based notifications** (success/failure/cancelled)

## Usage

Add the following step to your GitHub Actions workflow:

```yaml
- name: Send Google Chat Notification
  uses: adprajwal/google-chat-notifier@v1
  with:
    name: "Deploy to Production"
    url: ${{ secrets.GOOGLE_CHAT_WEBHOOK }}
    status: ${{ job.status }}
    custom_text: "Optional custom message here"
```

## Configuration

### Required Inputs

| Input | Description |
|-------|-------------|
| `name` | Name of the workflow job/step being executed |
| `url` | Google Chat Webhook URL for the target chat room |
| `status` | Current status of the job (success/failure/in-progress) |

### Optional Inputs

| Input | Description |
|-------|-------------|
| `custom_text` | Additional message to include in the notification |

## Setup Guide

### 1. Create a Google Chat Webhook

1. Open your Google Chat room.
2. Click the room name to open room settings.
3. Select **"Manage webhooks"**.
4. Click **"Add webhook"**.
5. Provide a name and optional avatar.
6. Copy the generated webhook URL.

### 2. Add a Repository Secret

1. Navigate to your GitHub repository.
2. Go to **Settings > Secrets and Variables > Actions**.
3. Click **"New repository secret"**.
4. **Name:** `GOOGLE_CHAT_WEBHOOK`
5. **Value:** Your webhook URL from Step 1.
6. Click **"Add secret"**.

## Example Workflows

### Basic Usage

```yaml
name: Build and Deploy
on: [push]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Build
        run: echo "Building..."
        
      - name: Send Notification
        uses: adprajwal/ChimeOps@v1
        if: always()
        with:
          name: "Build Status"
          url: ${{ secrets.GOOGLE_CHAT_WEBHOOK }}
          status: ${{ job.status }}
```

This ensures your team stays informed about workflow statuses in real-time, helping you maintain efficiency and transparency!

Made with ❤️ by Prajwal Adhikari