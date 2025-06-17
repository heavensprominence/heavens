import { BugReportForm } from "@/components/bug-report-form"

export default function BugReportPage() {
  return (
    <div className="min-h-screen bg-black py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">Report a Bug</h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Help us improve Heavenslive by reporting any issues you encounter. Your feedback is valuable and helps us
            provide a better experience for everyone.
          </p>
        </div>

        <BugReportForm />
      </div>
    </div>
  )
}
