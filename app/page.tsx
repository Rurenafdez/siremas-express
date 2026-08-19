import { SiremasApp } from "@/components/siremas/siremas-app"

export default function Page() {
  return (
    <main className="flex min-h-dvh w-full items-center justify-center bg-sirena-navy-deep p-0 sm:p-4 md:p-6">
      {/* Mobile: 100% full screen fluid. Desktop/Tablet: Centered phone-like app frame */}
      <div className="relative flex h-dvh w-full max-w-full flex-col overflow-hidden bg-background shadow-2xl sm:h-[860px] sm:max-h-[94vh] sm:max-w-md sm:rounded-[2.5rem] sm:border-[8px] sm:border-sirena-navy">
        <div className="relative flex-1 overflow-hidden h-full">
          <SiremasApp />
        </div>
      </div>
    </main>
  )
}
