'use client';

import { Avatar, Descriptions, Space, Tag, Button, Select, message } from 'antd';
import { SingleWithTags } from '@/hooks/singles/use-singles';
import { EditOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { phoneNumberUtils } from '@/lib/utils/phone-number';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

interface SingleDetailsProps {
  single: SingleWithTags;
  onUpdate?: () => void;
}

export default function SingleDetails({ single, onUpdate }: SingleDetailsProps) {
  const [isEditingTags, setIsEditingTags] = useState(false);
  const [selectedTags, setSelectedTags] = useState(single.tags.map(t => t.name));
  const [isSaving, setIsSaving] = useState(false);
  const queryClient = useQueryClient();

  const getimageId = (imageId: string) => {
    return `/api/assets/singles/${imageId}`;
  };

  const handleSaveTags = async () => {
    try {
      setIsSaving(true);
      const response = await fetch(`/api/singles/${single.id}/tags`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tags: selectedTags }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update tags');
      }

      await queryClient.invalidateQueries({ queryKey: ['singles'] });
      onUpdate?.();
      message.success('Tags updated successfully');
      setIsEditingTags(false);
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Failed to update tags');
      setSelectedTags(single.tags.map(t => t.name)); // Reset to original tags on error
    } finally {
      setIsSaving(false);
    }
  };

  const renderTags = () => {
    if (isEditingTags) {
      return (
        <Space direction="vertical" style={{ width: '100%' }}>
          <Select
            mode="tags"
            style={{ width: '100%' }}
            placeholder="Add tags"
            value={selectedTags}
            onChange={setSelectedTags}
            tokenSeparators={[',']}
            disabled={isSaving}
          />
          <Space>
            <Button 
              type="primary" 
              icon={<SaveOutlined />} 
              onClick={handleSaveTags}
              loading={isSaving}
            >
              Save
            </Button>
            <Button 
              icon={<CloseOutlined />} 
              onClick={() => {
                setSelectedTags(single.tags.map(t => t.name));
                setIsEditingTags(false);
              }}
              disabled={isSaving}
            >
              Cancel
            </Button>
          </Space>
        </Space>
      );
    }

    return (
      <Space size={[0, 8]} wrap style={{ width: '100%' }}>
        {single.tags.map((tag) => (
          <Tag key={tag.id}>{tag.name}</Tag>
        ))}
        <Button 
          type="link" 
          icon={<EditOutlined />} 
          onClick={() => setIsEditingTags(true)}
        >
          Edit Tags
        </Button>
      </Space>
    );
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
          {renderTags()}
        </Descriptions.Item>
      </Descriptions>
    </div>
  );
} 