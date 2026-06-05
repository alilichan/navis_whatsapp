interface ParseResult {
  contact: string
  message: string
}

const KEYWORDS = ['tell', 'message', 'text', 'ask', 'remind', 'send', 'call']

export function parseTranscript(transcript: string): ParseResult | null {
  if (!transcript.trim()) return null

  const lower = transcript.toLowerCase().trim()

  for (const keyword of KEYWORDS) {
    if (lower.startsWith(keyword)) {
      const afterKeyword = transcript.substring(keyword.length).trim()
      const words = afterKeyword.split(' ').filter(w => w.length > 0)

      if (words.length === 0) continue

      const contact = words[0]
      const messageWords = words.slice(1)

      // Strip filler words at the start of the message
      while (
        messageWords.length > 0 &&
        ['that', 'to', 'and', 'i'].includes(messageWords[0].toLowerCase())
      ) {
        messageWords.shift()
      }

      const message = messageWords.join(' ').trim()

      if (!contact) continue

      return {
        contact,
        message: message || transcript,
      }
    }
  }

  // Fallback: first word = contact, rest = message
  const words = transcript.trim().split(' ').filter(w => w.length > 0)
  if (words.length >= 2) {
    return {
      contact: words[0],
      message: words.slice(1).join(' '),
    }
  }

  return null
}
