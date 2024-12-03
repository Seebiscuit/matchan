'use client';

import { Table, Avatar, Tag, Space } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useSingles, SingleWithTags } from '@/hooks/singles/use-singles';
import dayjs from 'dayjs';
import React from 'react';

export default function SinglesPage() {
  const { data: singles, isLoading } = useSingles();

  const columns: ColumnsType<SingleWithTags> = [
    {
      title: 'Photo',
      key: 'photo',
      width: 80,
      render: (_, record) => {
        if (!record.image) return null;
        return (
          <Avatar
            src={`data:image/jpeg;base64,${record.image.toString('base64')}`}
            size={64}
            shape="square"
          />
        );
      },
    },
    {
      title: 'Name',
      key: 'name',
      render: (_, record) => `${record.firstName} ${record.lastName}`,
      sorter: (a, b) => a.firstName.localeCompare(b.firstName),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender',
      filters: [
        { text: 'Male', value: 'MALE' },
        { text: 'Female', value: 'FEMALE' },
      ],
      onFilter: (value, record) => record.gender === value,
    },
    {
      title: 'Age',
      key: 'age',
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
      render: (_, record) => (
        <Space size={[0, 8]} wrap>
          {record.tags.map((tag) => (
            <Tag key={tag.id}>{tag.name}</Tag>
          ))}
        </Space>
      ),
    },
    {
      title: 'Created At',
      key: 'createdAt',
      render: (_, record) => dayjs(record.createdAt).format('YYYY-MM-DD HH:mm'),
      sorter: (a, b) => 
        dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Singles Management</h1>
      <Table
        columns={columns}
        dataSource={singles}
        loading={isLoading}
        rowKey="id"
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} singles`,
        }}
      />
    </div>
  );
} 