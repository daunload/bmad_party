import Link from 'next/link';
import { Form } from 'app/form';
import { redirect } from 'next/navigation';
import { createUser, getUser } from 'app/db';
import { SubmitButton } from 'app/submit-button';
import { validateEmail, validatePassword } from '@/lib/validations/auth';

export default function Register() {
  async function register(formData: FormData) {
    'use server';
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    // Validate email
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      throw new Error(emailValidation.error);
    }

    // Validate password
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      throw new Error(passwordValidation.error);
    }

    // Check if user already exists
    const existingUser = await getUser(email);
    if (existingUser.length > 0) {
      throw new Error('이미 존재하는 이메일입니다.');
    }

    // Create user
    await createUser(email, password);
    redirect('/login?registered=true');
  }

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
          <div className="relative overflow-hidden bg-gradient-to-br from-accent-500 via-accent-600 to-primary-600 px-6 py-8 text-center">
            <div className="relative z-10">
              <div className="mb-4 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm text-3xl">
                  ✨
                </div>
              </div>
              <h3 className="mb-2 text-2xl font-bold text-white">회원가입</h3>
              <p className="text-sm text-accent-100">
                이메일과 비밀번호로 계정을 만드세요
              </p>
            </div>
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
            <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
          </div>

          {/* Form */}
          <div className="p-6 sm:p-8">
            <Form action={register}>
              <SubmitButton>회원가입</SubmitButton>
              <p className="mt-6 text-center text-sm text-gray-600">
                이미 계정이 있으신가요?{' '}
                <Link href="/login" className="font-semibold text-accent-600 hover:text-accent-700 transition-colors">
                  로그인
                </Link>
              </p>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
