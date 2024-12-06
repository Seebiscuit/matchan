'use client';

import { ConfigProvider, Layout, Row, Col, theme, Menu, Button } from 'antd';
import { PlusOutlined, UserOutlined, LoginOutlined, LogoutOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signIn, signOut } from 'next-auth/react';
import 'antd/dist/reset.css';

const { Content, Header } = Layout;

export default function AntdLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const isAdmin = session?.user?.role === 'ADMIN';

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          borderRadius: 8,
          colorBgContainer: '#fff',
          colorBgLayout: '#f0f2f5',
        },
      }}
    >
      <Layout style={{ minHeight: '100vh', background: 'var(--ant-color-bg-layout)' }}>
        <Header style={{ 
          background: 'var(--ant-color-bg-container)',
          borderBottom: '1px solid var(--ant-color-border)',
          padding: '0 24px',
        }}>
          <Row justify="space-between" align="middle" style={{ height: '100%' }}>
            <Col>
              <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>
                <h1 style={{ margin: 0, fontSize: '18px' }}>Matchan</h1>
              </Link>
            </Col>
            <Col>
              <Row gutter={16} align="middle">
                {status === 'authenticated' ? (
                  <>
                    <Col>
                      <Link href="/singles/new">
                        <Button type="primary" icon={<PlusOutlined />}>
                          Add Single
                        </Button>
                      </Link>
                    </Col>
                    {isAdmin && (
                      <Col>
                        <Link href="/singles">
                          <Button 
                            icon={<UserOutlined />}
                            type={pathname === '/singles' ? 'primary' : 'default'}
                          >
                            View Singles
                          </Button>
                        </Link>
                      </Col>
                    )}
                    <Col>
                      <Button 
                        icon={<LogoutOutlined />}
                        onClick={() => signOut()}
                      >
                        Logout
                      </Button>
                    </Col>
                  </>
                ) : (
                  <Col>
                    <Button 
                      type="primary"
                      icon={<LoginOutlined />}
                      onClick={() => signIn()}
                    >
                      Login
                    </Button>
                  </Col>
                )}
              </Row>
            </Col>
          </Row>
        </Header>
        <Content>
          <Row justify="center">
            <Col 
              xs={{ span: 23 }}  // Mobile (<576px): 95.8% width
              sm={{ span: 22 }}  // Tablet (≥576px): 91.7% width
              md={{ span: 20 }}  // Small Desktop (≥768px): 83.3% width
              lg={{ span: 18 }}  // Desktop (≥992px): 75% width
              xl={{ span: 22 }}  // Large Desktop (≥1200px): 75% width
              xxl={{ span: 22 }} // Extra Large (≥1600px): 66.7% width
              style={{ padding: 24 }}
            >
              <div style={{
                background: 'var(--ant-color-bg-container)',
                borderRadius: 'var(--ant-border-radius)',
                padding: '24px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}>
                {children}
              </div>
            </Col>
          </Row>
        </Content>
      </Layout>
    </ConfigProvider>
  );
} 