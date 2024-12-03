import { Inter } from 'next/font/google';
import { ConfigProvider } from 'antd';
import StyledComponentsRegistry from '@/lib/antd-registry';
import AuthProvider from '@/providers/auth-provider';
import QueryProvider from '@/providers/query-provider';

// Import Ant Design styles
import 'antd/dist/reset.css';

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
      <body className={inter.className}>
        <StyledComponentsRegistry>
          <AuthProvider>
            <QueryProvider>
              <ConfigProvider>
                {children}
              </ConfigProvider>
            </QueryProvider>
          </AuthProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
} 