import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Form } from 'app/form';
import { signIn } from 'app/auth';
import { SubmitButton } from 'app/submit-button';
import Header from '@/components/layout/Header';

export default function Login() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/50 to-purple-50/50 px-4 py-12">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-primary-200/20 blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-accent-200/20 blur-3xl"></div>
        </div>

        <div className="relative z-10 w-full max-w-md">
          <div className="rounded-2xl border border-gray-200 bg-white shadow-xl">
            {/* Header */}
            <div className="border-b border-gray-100 px-8 py-8 text-center">
              <div className="mb-4 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 text-3xl shadow-lg shadow-primary-500/20">
                  🔐
                </div>
              </div>
              <h1 className="mb-2 text-3xl font-bold text-gray-900">로그인</h1>
              <p className="text-sm text-gray-600">
                이메일과 비밀번호로 로그인하세요
              </p>
            </div>

            {/* Form */}
            <div className="p-8">
              <Form
                action={async (formData: FormData) => {
                  'use server';
                  const email = formData.get('email') as string;
                  const password = formData.get('password') as string;

                  const result = await signIn('credentials', {
                    redirectTo: '/dashboard',
                    email,
                    password,
                  });

                  // If signIn doesn't redirect, redirect manually
                  if (!result?.error) {
                    redirect('/dashboard');
                  }
                }}
              >
                <SubmitButton>로그인</SubmitButton>
                <p className="mt-6 text-center text-sm text-gray-600">
                  계정이 없으신가요?{' '}
                  <Link
                    href="/register"
                    className="font-semibold text-primary-600 hover:text-primary-700 transition-colors"
                  >
                    회원가입
                  </Link>
                </p>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
