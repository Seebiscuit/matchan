'use client';

import React from 'react';
import { Form, Input, DatePicker, Select, Button, Card, message } from 'antd';
import { useCreateSingle } from '@/hooks/singles/use-create-single';
import type { CreateSingleDto } from '@/types/singles';
import { CameraInput } from '@/components/camera-input';
import dayjs from 'dayjs';
import { phoneNumberUtils } from '@/lib/utils/phone-number'
import { errorFormatting } from '@/lib/utils/error-formatting';

type ApiError = {
  message: string;
  code?: string;
  details?: {
    fields?: string[];
    issues?: Array<{
      path: (string | number)[];
      message: string;
    }>;
  };
};

export default function NewSinglePage() {
  const { mutate: createSingle, isPending } = useCreateSingle();
  const [form] = Form.useForm();
  const [fieldErrors, setFieldErrors] = React.useState<Record<string, string>>({});

  const maxDate = dayjs().subtract(18, 'year');

  const handleError = (error: any) => {
    const apiError: ApiError = error.cause || {
      message: error.message || 'Failed to create single'
    };

    message.error(apiError.message);
    const newFieldErrors: Record<string, string> = {};

    // Handle validation errors
    if (apiError.code === 'VALIDATION_ERROR' && apiError.details?.issues) {
      apiError.details.issues.forEach(issue => {
        const field = issue.path.join('.');
        newFieldErrors[field] = errorFormatting.formatValidationError(field, issue.message);
      });
    }

    // Handle unique constraint violations
    if (apiError.code === 'UNIQUE_CONSTRAINT_VIOLATION' && apiError.details?.fields) {
      apiError.details.fields.forEach(field => {
        newFieldErrors[field] = errorFormatting.formatUniqueError(field);
      });
    }

    setFieldErrors(newFieldErrors);
  };

  const onFinish = (values: any) => {
    setFieldErrors({});
    const data: CreateSingleDto = {
      ...values,
      dateOfBirth: values.dateOfBirth.toISOString(),
    };

    createSingle(data, {
      onSuccess: () => {
        message.success('Single created successfully');
        form.resetFields();
      },
      onError: handleError
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
            validateStatus={fieldErrors.firstName ? 'error' : undefined}
            help={fieldErrors.firstName}
            rules={[
              { required: true, message: 'Please input first name' },
              { min: 2, message: 'First name must be at least 2 characters' }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Last Name"
            name="lastName"
            validateStatus={fieldErrors.lastName ? 'error' : undefined}
            help={fieldErrors.lastName}
            rules={[
              { required: true, message: 'Please input last name' },
              { min: 2, message: 'Last name must be at least 2 characters' }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Phone Number"
            name="phoneNumber"
            validateStatus={fieldErrors.phoneNumber ? 'error' : undefined}
            help={fieldErrors.phoneNumber || "Enter a US phone number"}
            rules={[
              { required: true, message: 'Please input phone number' },
              { validator: (_, value) => 
                phoneNumberUtils.validate(value) 
                  ? Promise.resolve()
                  : Promise.reject('Please enter a valid phone number')
              }
            ]}
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
            validateStatus={fieldErrors.email ? 'error' : undefined}
            help={fieldErrors.email}
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