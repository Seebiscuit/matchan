'use client';

import { ConfigProvider, Layout, Row, Col, theme } from 'antd';
import 'antd/dist/reset.css';

const { Content } = Layout;

export default function AntdLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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