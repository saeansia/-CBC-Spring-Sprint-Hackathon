# HealthBridge
Understand your health, one document at a time.

Built at CBC Spring Sprint Hackathon 2026 by Ansia Sae and Michelle Yu, MIT.


## Purpose

68 million Americans receive a medical bill they don't understand every year. Lab results come back full of abbreviations and numbers with no explanation. People don't know whether to go to the ER or wait it out. And those who can't afford a healthcare advocate are left navigating the system alone.

HealthBridge is an AI-powered health literacy tool that puts patients back in control. It translates the opaque language of medicine into plain English and gives people the specific knowledge they need to ask the right questions, dispute unfair charges, and find the right care.

## How It Works

HealthBridge has three tools, each powered by Claude's vision API. You upload a document or describe your symptoms, and Claude analyzes it and returns a structured, plain-language breakdown. No data is stored — everything is processed in memory and discarded.

## Features

### Medical Bill Analyzer
Upload a photo or PDF of any medical bill. HealthBridge reads every line item, explains what each charge means, and flags anything suspicious — duplicate charges, unusual fees, or items worth questioning. It also generates a ready-to-use script for calling your billing department and a list of questions to bring to the conversation.

Output includes:
- Bill summary (provider, date, total)
- Line-by-line charge explanations
- Red flags and duplicate charge detection
- Actionable next steps
- Questions to ask your billing department

### Lab Report Explainer
Upload blood work, pathology reports, or any lab results. HealthBridge identifies every metric, compares it against normal ranges, and gives each one a plain-English explanation with a status — normal, borderline, or abnormal. It also recommends specific lifestyle changes based on your results and tells you when and how urgently to follow up with your doctor.

Output includes:
- Plain-language summary of the full report
- Per-metric breakdowns with normal range comparisons
- Normal / borderline / abnormal status for each metric
- Specific lifestyle recommendations (diet, exercise, sleep)
- Follow-up guidance

### Care Finder
Not sure where to go or what you're dealing with? Describe your symptoms in plain language and optionally add your location. HealthBridge assesses urgency, identifies the right type of provider, and walks you through how to find care near you. It also gives you a short script you can read aloud at your appointment so you don't have to figure out how to explain it.

Output includes:
- Plain-language overview of what your symptoms could be consistent with
- Urgency level: ER now / see a doctor soon / schedule an appointment / home care
- Type of provider to see
- Step-by-step instructions for finding care
- Home care tips if urgency allows
- A script to read to your doctor

---

## Getting Started

### Prerequisites
- Node.js 18+
- An Anthropic API key — [get one here](https://console.anthropic.com)

### Installation

1. Clone the repository

```bash
git clone https://github.com/saeansia/-CBC-Spring-Sprint-Hackathon.git
cd healthbridge
```

2. Install dependencies

```bash
npm install
```

3. Create a `.env.local` file in the root directory
4. Run the development server

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Tech Stack

| Layer | Technology |
|---|---|
| AI | Claude claude-sonnet-4-20250514 via Anthropic SDK |
| Framework | Next.js 14 (App Router) with TypeScript |
| Styling | Tailwind CSS, DM Sans + Playfair Display (Google Fonts) |
| File Handling | Multipart form data, base64 encoding for Claude vision API |
| Deployment | Vercel |

---

## Deployment

1. Push the repository to GitHub
2. Import into [Vercel](https://vercel.com/new) and connect your repo
3. Add `ANTHROPIC_API_KEY` as an environment variable in your Vercel project settings
4. Deploy

---

## Team

| Name | School |
|---|---|
| Ansia Sae | MIT |
| Michelle Yu | MIT |

---

## Disclaimer

HealthBridge is for educational purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment. Always consult a licensed healthcare professional. In an emergency, call 911.
