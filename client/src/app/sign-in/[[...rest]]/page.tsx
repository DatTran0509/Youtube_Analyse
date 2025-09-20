import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-purple-900 flex items-center justify-center p-4">
      <SignIn 
        appearance={{
          elements: {
            formButtonPrimary: "bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800",
            card: "bg-gray-900/50 backdrop-blur-sm border border-purple-500/30 shadow-xl",
            headerTitle: "text-white",
            headerSubtitle: "text-purple-300",
            socialButtonsBlockButton: "border-purple-500/30 text-white hover:bg-purple-700/20",
            formFieldLabel: "text-purple-300",
            formFieldInput: "bg-gray-800/50 border-purple-500/30 text-white",
            footerActionLink: "text-purple-400 hover:text-purple-300"
          }
        }}
      />
    </div>
  )
}