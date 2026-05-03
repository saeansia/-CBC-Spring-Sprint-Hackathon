import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic()

export async function POST(req: NextRequest) {
  try {
    const { concern, location } = await req.json()
    if (!concern) return NextResponse.json({ error: 'No concern provided.' })

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: `You are a healthcare navigator helping patients find appropriate care.
Analyze the described concern and respond ONLY with a valid JSON object (no markdown, no backticks):
{
  "overview": string,
  "urgency": "er" | "soon" | "appointment" | "home",
  "urgencyReason": string,
  "providerType": string,
  "howToFind": [string],
  "homeCareTips": [string],
  "scriptForDoctor": string
}
Be compassionate, clear, and always recommend professional care. Never diagnose.`,
      messages: [
        {
          role: 'user',
          content: `Concern: ${concern}${location ? `\nLocation: ${location}` : ''}`,
        },
      ],
    })

    const text = message.content[0].type === 'text' ? message.content[0].text : ''
    const parsed = JSON.parse(text)
    return NextResponse.json(parsed)
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[find-care]', message)
    if (message.includes('auth') || message.includes('API key') || message.includes('401')) {
      return NextResponse.json({ error: 'Invalid API key. Please check your ANTHROPIC_API_KEY in .env.local.' })
    }
    return NextResponse.json({ error: 'We had trouble processing your request. Please try again.' })
  }
}
