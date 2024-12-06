import { Inter } from 'next/font/google';
import StyledComponentsRegistry from '@/lib/antd-registry';
import AuthProvider from '@/providers/auth-provider';
import QueryProvider from '@/providers/query-provider';
import AntdLayout from '@/components/AntdLayout';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Singles Registry',
  description: 'Registry application for singles',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className} style={{ margin: 0, padding: 0 }}>
        <StyledComponentsRegistry>
          <AuthProvider>
            <QueryProvider>
              <AntdLayout>
                {children}
              </AntdLayout>
            </QueryProvider>
          </AuthProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
} 