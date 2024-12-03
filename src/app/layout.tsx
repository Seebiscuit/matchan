import { Inter } from 'next/font/google';
import { ConfigProvider } from 'antd';
import StyledComponentsRegistry from '@/lib/antd-registry';
import AuthProvider from '@/providers/auth-provider';

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
            <ConfigProvider>
              {children}
            </ConfigProvider>
          </AuthProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
} 