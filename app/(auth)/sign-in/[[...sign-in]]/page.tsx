import { SignIn } from "@clerk/nextjs";
import { dark} from "@clerk/themes";

export default function Page() {
  return (
    <div className="min-h-screen relative overflow-hidden text-white flex flex-col bg-black">
      
      <div className="relative z-10 w-full max-w-[1080px] mx-auto flex flex-col min-h-screen px-6">
      <main className="flex-1 flex items-center justify-center flex-col text-center bg-black text-white">
      <SignIn
        appearance={{
          baseTheme: dark,
          elements: {
            card: "bg-gray-900 text-white shadow-lg",
            headerTitle: "text-white",
            headerSubtitle: "text-gray-400",
            socialButtonsBlockButton: "bg-gray-800 hover:bg-gray-700 text-white",
            formFieldInput: "bg-gray-800 border-gray-700 text-white",
            formButtonPrimary: "bg-indigo-600 hover:bg-indigo-500 text-white",
          },
        }}
      />
    </main>
      </div>
    </div>
  );
}