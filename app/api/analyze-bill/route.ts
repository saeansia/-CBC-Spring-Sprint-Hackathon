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
      system: `You are a medical billing expert helping patients understand their bills.
Analyze the uploaded medical bill and respond ONLY with a valid JSON object (no markdown, no backticks) with this exact structure:
{
  "summary": { "total": string, "provider": string, "serviceDate": string },
  "lineItems": [{ "charge": string, "amount": string, "explanation": string }],
  "redFlags": [string],
  "nextSteps": [string],
  "questionsToAsk": [string]
}
Be specific, accurate, and compassionate. If a value cannot be determined, use "Not found".`,
      messages: [
        {
          role: 'user',
          content: [
            isPdf
              ? { type: 'document', source: { type: 'base64', media_type: 'application/pdf', data: base64 } }
              : { type: 'image', source: { type: 'base64', media_type: file.type as 'image/jpeg' | 'image/png', data: base64 } },
            { type: 'text', text: 'Please analyze this medical bill.' },
          ],
        },
      ],
    })

    const text = message.content[0].type === 'text' ? message.content[0].text : ''
    const parsed = JSON.parse(text)
    return NextResponse.json(parsed)
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[analyze-bill]', message)
    if (message.includes('auth') || message.includes('API key') || message.includes('401')) {
      return NextResponse.json({ error: 'Invalid API key. Please check your ANTHROPIC_API_KEY in .env.local.' })
    }
    return NextResponse.json({ error: 'We had trouble reading that document. Please try a clearer photo or copy-paste the text manually.' })
  }
}
