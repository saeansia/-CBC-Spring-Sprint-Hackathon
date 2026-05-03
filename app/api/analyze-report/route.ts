import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic()

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    if (!file) return NextResponse.json({ error: 'No file provided.' })

    const arrayBuffer = await file.arrayBuffer()
    const base64 = Buffer.from(arrayBuffer).toString('base64')
    const isPdf = file.type === 'application/pdf'

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2048,
      system: `You are a medical educator helping patients understand lab results.
Analyze the uploaded report and respond ONLY with a valid JSON object (no markdown, no backticks):
{
  "summary": string,
  "metrics": [{
    "name": string,
    "value": string,
    "unit": string,
    "normalRange": string,
    "status": "normal" | "borderline" | "abnormal",
    "explanation": string
  }],
  "recommendations": [string],
  "followUp": string
}
If a field cannot be determined, use "Not found" or an empty array.`,
      messages: [
        {
          role: 'user',
          content: [
            isPdf
              ? { type: 'document', source: { type: 'base64', media_type: 'application/pdf', data: base64 } }
              : { type: 'image', source: { type: 'base64', media_type: file.type as 'image/jpeg' | 'image/png', data: base64 } },
            { type: 'text', text: 'Please analyze this medical report.' },
          ],
        },
      ],
    })

    const text = message.content[0].type === 'text' ? message.content[0].text : ''
    const parsed = JSON.parse(text)
    return NextResponse.json(parsed)
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[analyze-report]', message)
    if (message.includes('auth') || message.includes('API key') || message.includes('401')) {
      return NextResponse.json({ error: 'Invalid API key. Please check your ANTHROPIC_API_KEY in .env.local.' })
    }
    return NextResponse.json({ error: 'We had trouble reading that document. Please try a clearer photo or copy-paste the text manually.' })
  }
}
