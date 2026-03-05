'use client';

import { signIn } from 'next-auth/react';

interface SignInScreenProps {
  productName: string;
}

export function SignInScreen({ productName }: SignInScreenProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#060606]">
      <div className="text-center max-w-[440px] px-6">
        <div className="w-16 h-16 mx-auto mb-8 rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/10 to-amber-500/5 flex items-center justify-center text-3xl">
          ⚡
        </div>

        <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">
          {productName}
        </h1>

        <p className="text-sm text-gray-500 mb-12 leading-relaxed">
          Multiple AIs. One answer. No mercy.
        </p>

        <button
          onClick={() => signIn('google')}
          className="w-full py-3.5 px-5 flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-gray-900 font-semibold text-[15px] rounded-xl transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
            <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.859-3.048.859-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853"/>
            <path d="M3.964 10.705A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.705V4.963H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.037l3.007-2.332z" fill="#FBBC05"/>
            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.963L3.964 7.295C4.672 5.169 6.656 3.58 9 3.58z" fill="#EA4335"/>
          </svg>
          Sign in with Google
        </button>

        <p className="text-xs text-gray-700 mt-12">
          Early access — One Percent Playbook community only
        </p>
      </div>
    </div>
  );
}
