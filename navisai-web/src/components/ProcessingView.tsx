'use client'

interface Props { transcript: string }

export default function ProcessingView({ transcript }: Props) {
  return (
    <div className="flex flex-col items-center gap-6 animate-fade-in">
      <div className="w-12 h-12 rounded-full border-2 border-[#5B4FCF] border-t-transparent animate-spin-slow" />
      <div className="text-center">
        <p className="text-white/80 font-medium">Understanding your message…</p>
        {transcript && (
          <p className="mt-2 text-sm text-white/40 max-w-xs">
            &ldquo;{transcript}&rdquo;
          </p>
        )}
      </div>
    </div>
  )
}
