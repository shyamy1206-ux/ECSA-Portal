"use client";

import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';

export default function AuthForm() {
  const supabase = createClient();
  const [origin, setOrigin] = useState('');

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  if (!origin) return null; // Avoid hydration mismatch

  return (
    <div className="w-full">
      <Auth
        supabaseClient={supabase}
        view="sign_in"
        appearance={{
          theme: ThemeSupa,
          variables: {
            default: {
              colors: {
                brand: '#00f0ff', // Electric Blue
                brandAccent: '#00ffcc', // Electric Cyan
                brandButtonText: '#0f172a', // Navy 900
                defaultButtonBackground: '#111827',
                defaultButtonBackgroundHover: '#1f2937',
                inputBackground: 'transparent',
                inputBorder: 'rgba(255,255,255,0.1)',
                inputBorderHover: '#00f0ff',
                inputBorderFocus: '#00ffcc',
                inputText: '#ffffff',
                messageText: '#00ffcc',
              },
              radii: {
                borderRadiusButton: '8px',
                buttonBorderRadius: '8px',
                inputBorderRadius: '8px',
              },
            },
          },
          className: {
            container: 'ecsa-auth-container',
            button: 'font-semibold transition-colors',
            input: 'bg-navy-800/50 backdrop-blur-sm',
          }
        }}
        theme="dark"
        showLinks={true}
        providers={['google']}
        redirectTo={`${origin}/auth/callback`}
      />
    </div>
  );
}
