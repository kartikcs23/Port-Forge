import React from 'react';
import { SignIn } from '@clerk/clerk-react';
import { Navbar } from '../components/Navbar';

export const Login = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col selection:bg-accent selection:text-white border-t-0">
      <Navbar />

      <div className="flex-1 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background Decorative Element */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border-[40px] border-ink/5 rounded-full z-0 pointer-events-none hidden md:block"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border-[40px] border-ink/5 rounded-full z-0 pointer-events-none hidden md:block"></div>

        <div className="text-center mb-8 relative z-10">
          <h2 className="text-5xl font-black text-ink uppercase tracking-tighter mb-2">ACCESS HUB</h2>
          <p className="text-muted font-sans font-bold uppercase tracking-widest text-sm">SECURE AUTHENTICATION</p>
        </div>

        <div className="relative z-10 glass-card-override shadow-brutal border-2 border-ink p-1 bg-surface">
          <SignIn 
            routing="path" 
            path="/login" 
            signUpUrl="/register" 
            fallbackRedirectUrl="/dashboard"
            appearance={{
              elements: {
                card: "shadow-none border-none",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                formButtonPrimary: "bg-accent border-2 border-ink text-white hover:bg-ink rounded-none shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all font-bold uppercase tracking-widest",
                socialButtonsBlockButton: "border-2 border-ink rounded-none shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] hover:bg-background transition-all font-bold",
                formFieldInput: "border-2 border-ink rounded-none bg-background focus:ring-0 focus:border-accent font-sans",
                formFieldLabel: "font-bold text-ink uppercase text-xs tracking-widest font-sans",
                footerActionLink: "text-accent hover:text-ink font-bold",
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};