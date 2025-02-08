import { WifiOff } from 'lucide-react'

export const OfflinePage = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-[#0D0B21]">
      <div className="flex flex-col items-center text-center">
        <div className="relative mb-8">
          <div className="absolute -inset-10 rounded-full bg-[#4E4BDE]/20 blur-2xl opacity-50 animate-pulse" />
          <div className="relative flex size-24 items-center justify-center rounded-2xl bg-[#17172A] shadow-lg shadow-[#4E4BDE]/30">
            <WifiOff className="size-12 text-[#6D6BEB]" />
          </div>
        </div>
        <h1 className="mb-4 text-4xl font-extrabold bg-gradient-to-r from-[#6D6BEB] to-[#4E4BDE] bg-clip-text text-transparent">
          Connection Lost in Space...
        </h1>
        <p className="max-w-md text-lg text-gray-400">
          Our cosmic signals can't reach your device! Check your internet lifeline to continue exploring the crypto
          universe.
        </p>
        <div className="mt-6 h-1.5 w-32 rounded-full bg-[#17172A] overflow-hidden">
          <div className="h-full animate-[pulse_1.5s_infinite] rounded-full bg-gradient-to-r from-[#4E4BDE] to-[#6D6BEB]" />
        </div>
      </div>
    </div>
  )
}
