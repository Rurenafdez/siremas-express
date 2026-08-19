import { SiremasApp } from "@/components/siremas/siremas-app"

export default function Page() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-sirena-navy-deep p-0 sm:p-6">
      {/* Phone frame — full screen on mobile, framed device on larger screens */}
      <div className="relative flex h-dvh w-full max-w-[420px] flex-col overflow-hidden bg-background shadow-2xl sm:h-[860px] sm:max-h-[92vh] sm:rounded-[2.75rem] sm:border-[10px] sm:border-sirena-navy-deep">
        <div className="relative flex-1 overflow-hidden">
          <SiremasApp />
        </div>
      </div>
    </main>
  )
}
