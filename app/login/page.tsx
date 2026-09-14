import AuthForm from "@/components/auth/AuthForm";

export const metadata = {
  title: "Login | ECSA NMIET",
  description: "Sign in to your ECSA account",
};

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-8">
      <div className="glass p-8 rounded-2xl w-full max-w-md border-t border-t-white/20">
        <h2 className="text-3xl font-heading font-bold mb-2">Welcome Back</h2>
        <p className="text-gray-400 mb-8 text-sm">Sign in to your ECSA account</p>
        
        <AuthForm />
      </div>
    </div>
  );
}
