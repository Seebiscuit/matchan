'use client';

import { Table, Avatar, Tag, Space, Button, Popconfirm, message, Drawer } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { ColumnsType } from 'antd/es/table';
import { useSingles, SingleWithTags, useDeleteSingle } from '@/hooks/singles/use-singles';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { phoneNumberUtils } from '@/lib/utils/phone-number';
import SingleDetails from '@/components/singles/SingleDetails';

export default function SinglesPage() {
  const { data: singles, isLoading } = useSingles();
  const deleteMutation = useDeleteSingle();
  const [selectedSingle, setSelectedSingle] = useState<SingleWithTags | null>(null);

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      message.success('Single deleted successfully');
    } catch (error) {
      message.error('Failed to delete single');
    }
  };

  const getimageId = (imageId: string) => {
    return `/api/assets/singles/${imageId}`;
  };

  const columns: ColumnsType<SingleWithTags> = [
    {
      title: 'Photo',
      key: 'photo',
      width: 80,
      responsive: ['md'],
      render: (_, record) => {
        if (!record.imageId) return null;
        return (
          <Avatar
            src={getimageId(record.imageId)}
            size={64}
            shape="square"
          />
        );
      },
    },
    {
      title: 'Name',
      key: 'name',
      fixed: 'left',
      render: (_, record) => `${record.firstName} ${record.lastName}`,
      sorter: (a, b) => a.firstName.localeCompare(b.firstName),
    },
    {
      title: 'Phone',
      key: 'phoneNumber',
      responsive: ['sm'],
      render: (_, record) => phoneNumberUtils.format(record.phoneNumber),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      responsive: ['lg'],
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender',
      responsive: ['md'],
      filters: [
        { text: 'Male', value: 'MALE' },
        { text: 'Female', value: 'FEMALE' },
      ],
      onFilter: (value, record) => record.gender === value,
    },
    {
      title: 'Age',
      key: 'age',
      responsive: ['sm'],
      render: (_, record) => {
        const age = dayjs().diff(dayjs(record.dateOfBirth), 'year');
        return age;
      },
      sorter: (a, b) => 
        dayjs(a.dateOfBirth).unix() - dayjs(b.dateOfBirth).unix(),
    },
    {
      title: 'Tags',
      key: 'tags',
      responsive: ['lg'],
      render: (_, record) => (
        <Space size={[0, 8]} wrap>
          {record.tags.map((tag) => (
            <Tag key={tag.id}>{tag.name}</Tag>
          ))}
        </Space>
      ),
    },
    {
      title: 'Created By',
      key: 'createdById',
      responsive: ['lg'],
      render: (_, record) => record.createdById || 'System',
    },
    {
      title: 'Created At',
      key: 'createdAt',
      responsive: ['xl'],
      render: (_, record) => dayjs(record.createdAt).format('YYYY-MM-DD HH:mm'),
      sorter: (a, b) => 
        dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      width: 70,
      render: (_, record) => (
        <Popconfirm
          title="Delete Single"
          description="Are you sure you want to delete this single?"
          onConfirm={() => handleDelete(record.id)}
          okText="Yes"
          cancelText="No"
          okButtonProps={{ danger: true }}
        >
          <Button 
            type="text" 
            danger 
            icon={<DeleteOutlined />}
            loading={deleteMutation.isPending}
          />
        </Popconfirm>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <h1 className="text-2xl font-bold mb-6">Singles Management</h1>
      <Table
        columns={columns}
        dataSource={singles}
        loading={isLoading}
        rowKey="id"
        scroll={{ x: 800 }}
        onRow={(record) => ({
          onClick: () => setSelectedSingle(record),
          style: { cursor: 'pointer' }
        })}
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} singles`,
        }}
      />
      <Drawer
        title="Single Details"
        placement="right"
        width={640}
        onClose={() => setSelectedSingle(null)}
        open={!!selectedSingle}
      >
        {selectedSingle && <SingleDetails single={selectedSingle} />}
      </Drawer>
    </div>
  );
} 