'use client';

import { Avatar, Descriptions, Space, Tag } from 'antd';
import { SingleWithTags } from '@/hooks/singles/use-singles';
import dayjs from 'dayjs';
import { phoneNumberUtils } from '@/lib/utils/phone-number';

interface SingleDetailsProps {
  single: SingleWithTags;
}

export default function SingleDetails({ single }: SingleDetailsProps) {
  const getimageId = (imageId: string) => {
    return `/api/assets/singles/${imageId}`;
  };

  return (
    <div>
      <div style={{ marginBottom: 24, textAlign: 'center' }}>
        {single.imageId && (
          <Avatar
            src={getimageId(single.imageId)}
            size={200}
            shape="square"
            style={{ marginBottom: 16 }}
          />
        )}
      </div>
      <Descriptions layout="vertical" column={2} bordered>
        <Descriptions.Item label="First Name">{single.firstName}</Descriptions.Item>
        <Descriptions.Item label="Last Name">{single.lastName}</Descriptions.Item>
        <Descriptions.Item label="Phone">{phoneNumberUtils.format(single.phoneNumber)}</Descriptions.Item>
        <Descriptions.Item label="Email">{single.email}</Descriptions.Item>
        <Descriptions.Item label="Gender">{single.gender}</Descriptions.Item>
        <Descriptions.Item label="Age">
          {dayjs().diff(dayjs(single.dateOfBirth), 'year')}
        </Descriptions.Item>
        <Descriptions.Item label="Date of Birth">
          {dayjs(single.dateOfBirth).format('YYYY-MM-DD')}
        </Descriptions.Item>
        <Descriptions.Item label="Created At">
          {dayjs(single.createdAt).format('YYYY-MM-DD HH:mm')}
        </Descriptions.Item>
        <Descriptions.Item label="Created By" span={2}>
          {single.createdById || 'System'}
        </Descriptions.Item>
        <Descriptions.Item label="Tags" span={2}>
          <Space size={[0, 8]} wrap>
            {single.tags.map((tag) => (
              <Tag key={tag.id}>{tag.name}</Tag>
            ))}
          </Space>
        </Descriptions.Item>
      </Descriptions>
    </div>
  );
} 