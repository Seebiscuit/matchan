'use client';

import React from 'react';
import { Card, Typography } from "antd";

export default function PendingApproval() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-96">
        <Typography.Title level={2} className="text-center">
          Approval Pending
        </Typography.Title>
        <Typography.Paragraph>
          Your account is currently pending approval from an administrator. 
          You will be notified via email once your account has been approved.
        </Typography.Paragraph>
      </Card>
    </div>
  );
} 