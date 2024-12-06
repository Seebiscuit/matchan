"use client";

import { signIn } from "next-auth/react";
import { Button, Card, Typography, Space } from "antd";
import { GoogleOutlined, UserOutlined } from "@ant-design/icons";
import { devUsers } from "@/lib/auth/dev-auth";
import { isDevLoginEnabled } from "@/lib/auth/dev-auth";

export default function SignIn() {
  const showDevLogin = isDevLoginEnabled();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-96">
        <div className="text-center mb-8">
          <Typography.Title level={2}>
            Registry
          </Typography.Title>
          <Typography.Text>
            Sign in to access the Registry
          </Typography.Text>
        </div>
        
        <Space direction="vertical" style={{ width: '100%' }}>
          {!showDevLogin && (
            <Button
              icon={<GoogleOutlined />}
              block
              size="large"
              onClick={() => signIn("google", { callbackUrl: "/" })}
            >
              Sign in with Google
            </Button>
          )}

          {showDevLogin && devUsers.map(user => (
            <Button
              key={user.id}
              icon={<UserOutlined />}
              block
              size="large"
              onClick={() => signIn("dev-login", { 
                email: user.email,
                callbackUrl: "/"
              })}
            >
              Login as {user.name}
            </Button>
          ))}
        </Space>
      </Card>
    </div>
  );
} 