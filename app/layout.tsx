import './globals.css';

import { GeistSans } from 'geist/font/sans';

let title = 'Party - 파티 커뮤니티';
let description =
  '다양한 파티를 찾고 참여하며 새로운 사람들과 만나보세요. 함께 즐거운 시간을 만들어요!';

export const metadata = {
  title,
  description,
  twitter: {
    card: 'summary_large_image',
    title,
    description,
  },
  metadataBase: new URL('https://party-app.vercel.app'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className="scroll-smooth">
      <body className={`${GeistSans.variable} font-sans`}>{children}</body>
    </html>
  );
}
