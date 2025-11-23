'use client';

import { Table, Avatar, Tag, Space, Button, Popconfirm, message, Drawer, DatePicker, InputNumber, Card, Row, Col } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { ColumnsType } from 'antd/es/table';
import { useSingles, SingleWithTags, useDeleteSingle, SinglesFilters } from '@/hooks/singles/use-singles';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { phoneNumberUtils } from '@/lib/utils/phone-number';

const { RangePicker } = DatePicker;
import SingleDetails from '@/components/singles/SingleDetails';

export default function SinglesPage() {
  const [filters, setFilters] = useState<SinglesFilters>({});
  const { data: singles, isLoading, refetch } = useSingles(filters);
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

  const handleDrawerClose = () => {
    setSelectedSingle(null);
  };

  const handleDateRangeChange = (dates: any) => {
    if (dates && dates.length === 2) {
      setFilters(prev => ({
        ...prev,
        createdAfter: dates[0].startOf('day').toISOString(),
        createdBefore: dates[1].endOf('day').toISOString(),
      }));
    } else {
      setFilters(prev => {
        const { createdAfter, createdBefore, ...rest } = prev;
        return rest;
      });
    }
  };

  const handleMinAgeChange = (value: number | null) => {
    setFilters(prev => ({
      ...prev,
      minAge: value || undefined,
    }));
  };

  const handleMaxAgeChange = (value: number | null) => {
    setFilters(prev => ({
      ...prev,
      maxAge: value || undefined,
    }));
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
      title: 'Registered On',
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
      
      <Card title="Filters" style={{ marginBottom: '16px' }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={24} md={12} lg={10} xl={8}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                Registration Date Range
              </label>
              <RangePicker
                style={{ width: '100%' }}
                onChange={handleDateRangeChange}
                placeholder={['Start Date', 'End Date']}
              />
            </div>
          </Col>
          <Col xs={24} sm={12} md={6} lg={7} xl={8}>
            <Row gutter={[8, 16]}>
              <Col xs={12} sm={24} md={12} lg={12} xl={12}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                    Min Age
                  </label>
                  <InputNumber
                    style={{ width: '100%' }}
                    min={18}
                    max={100}
                    placeholder="Min"
                    value={filters.minAge}
                    onChange={handleMinAgeChange}
                  />
                </div>
              </Col>
              <Col xs={12} sm={24} md={12} lg={12} xl={12}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                    Max Age
                  </label>
                  <InputNumber
                    style={{ width: '100%' }}
                    min={18}
                    max={100}
                    placeholder="Max"
                    value={filters.maxAge}
                    onChange={handleMaxAgeChange}
                  />
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </Card>

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
        size={640}
        onClose={handleDrawerClose}
        open={!!selectedSingle}
        afterOpenChange={(open) => {
          if (open) {
            refetch();
          }
        }}
      >
        {selectedSingle && (
          <SingleDetails 
            single={selectedSingle} 
            onUpdate={() => {
              refetch();
            }}
          />
        )}
      </Drawer>
    </div>
  );
} 