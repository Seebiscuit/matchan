'use client';

import React from 'react';
import { Form, Input, DatePicker, Select, Button, Card, message } from 'antd';
import { useCreateSingle } from '@/hooks/singles/use-create-single';
import type { CreateSingleDto } from '@/types/singles';
import { CameraInput } from '@/components/camera-input';
import dayjs from 'dayjs';
import { phoneNumberUtils } from '@/lib/utils/phone-number'

export default function NewSinglePage() {
  const { mutate: createSingle, isPending } = useCreateSingle();
  const [form] = Form.useForm();

  const maxDate = dayjs().subtract(18, 'year');

  const onFinish = (values: any) => {
    const data: CreateSingleDto = {
      ...values,
      dateOfBirth: values.dateOfBirth.toISOString(),
    };

    createSingle(data, {
      onSuccess: () => {
        message.success('Single created successfully');
        form.resetFields();
      },
      onError: (error) => {
        message.error(error.message || 'Failed to create single');
      },
    });
  };

  const handleImageCapture = (base64Image: string) => {
    form.setFieldValue('image', base64Image);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card title="Register New Single">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
        <Form.Item
          label="Photo"
          name="image"
          help="Take a photo using your device's camera"
        >
          <CameraInput onChange={handleImageCapture} />
        </Form.Item>
        
          <Form.Item
            label="First Name"
            name="firstName"
            rules={[{ required: true, message: 'Please input first name' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Last Name"
            name="lastName"
            rules={[{ required: true, message: 'Please input last name' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Phone Number"
            name="phoneNumber"
            rules={[
              { required: true, message: 'Please input phone number' },
              { validator: (_, value) => 
                phoneNumberUtils.validate(value) 
                  ? Promise.resolve()
                  : Promise.reject('Please enter a valid phone number')
              }
            ]}
            help="Enter a US phone number"
          >
            <Input 
              onChange={e => {
                const formatted = phoneNumberUtils.format(e.target.value)
                if (formatted !== e.target.value) {
                  form.setFieldsValue({ phoneNumber: formatted })
                }
              }}
            />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[{ type: 'email', message: 'Please enter a valid email' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Gender"
            name="gender"
            rules={[{ required: true, message: 'Please select gender' }]}
          >
            <Select>
              <Select.Option value="MALE">Male</Select.Option>
              <Select.Option value="FEMALE">Female</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Date of Birth"
            name="dateOfBirth"
            rules={[{ required: true, message: 'Please select date of birth' }]}
          >
            <DatePicker 
              className="w-full"
              picker="date"
              placeholder="Select birth date"
              showNow={false}
              disabledDate={date => date?.isAfter(maxDate)}
              defaultPickerValue={dayjs().subtract(25, 'year')}
              format="DD/MM/YYYY"
            />
          </Form.Item>

          <Form.Item
            label="Tags"
            name="tags"
            help="Enter comma-separated tags"
          >
            <Select
              mode="tags"
              tokenSeparators={[',']}
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={isPending} block>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
} 