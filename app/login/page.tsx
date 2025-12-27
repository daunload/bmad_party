import Link from 'next/link';
import { Form } from 'app/form';
import { signIn } from 'app/auth';
import { SubmitButton } from 'app/submit-button';

export default function Login() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-50 via-white to-accent-50 px-4 py-12">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary-200/30 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-accent-200/30 blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="card-gradient overflow-hidden">
          {/* Header */}
          <div className="relative overflow-hidden bg-gradient-to-br from-primary-500 via-primary-600 to-accent-600 px-6 py-8 text-center">
            <div className="relative z-10">
              <div className="mb-4 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm text-3xl">
                  🔐
                </div>
              </div>
              <h3 className="mb-2 text-2xl font-bold text-white">로그인</h3>
              <p className="text-sm text-primary-100">
                이메일과 비밀번호로 로그인하세요
              </p>
            </div>
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
            <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
          </div>

          {/* Form */}
          <div className="p-6 sm:p-8">
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
                <Link href="/register" className="font-semibold text-primary-600 hover:text-primary-700 transition-colors">
                  회원가입
                </Link>
              </p>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
