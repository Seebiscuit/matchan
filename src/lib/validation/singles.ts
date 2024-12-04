import { z } from 'zod';
import { phoneNumberUtils } from '@/lib/utils/phone-number';
import type { Rule } from 'antd/es/form';
import { errorFormatting } from '@/lib/utils/error-formatting';

export const singleValidation = {
  firstName: z.string()
    .min(2, 'First name must be at least 2 characters'),
  
  lastName: z.string()
    .min(2, 'Last name must be at least 2 characters'),
  
  phoneNumber: z.string()
    .min(1, 'Phone number is required')
    .refine(phoneNumberUtils.validate, 'Invalid phone number')
    .transform(phoneNumberUtils.normalize),
  
  email: z.string()
    .email('Invalid email address')
    .optional(),
  
  gender: z.enum(['MALE', 'FEMALE']),
  
  dateOfBirth: z.string()
    .datetime(),

  image: z.string()
    .optional(),
  
  tags: z.array(z.string())
    .optional()
} as const;

export const createSingleSchema = z.object(singleValidation)
  .transform(data => ({
    ...data,
    tags: data.tags || [],
  }));

// Convert Zod validation to Antd form rules
export const getFormRules = (field: keyof typeof singleValidation): Rule[] => {
  const schema = singleValidation[field];
  const label = errorFormatting.getFieldLabel(field);
  
  switch (field) {
    case 'firstName':
    case 'lastName':
      return [
        { required: true, message: `Please input ${label}` },
        { min: 2, message: `${label} must be at least 2 characters` }
      ];
    
    case 'phoneNumber':
      return [
        { required: true, message: `Please input ${label}` },
        { 
          validator: (_, value) => 
            phoneNumberUtils.validate(value) 
              ? Promise.resolve()
              : Promise.reject(`Please enter a valid ${label}`)
        }
      ];
    
    case 'email':
      return [
        { type: 'email', message: `Please enter a valid ${label}` }
      ];
    
    case 'gender':
      return [
        { required: true, message: `Please select ${label}` }
      ];
    
    case 'dateOfBirth':
      return [
        { required: true, message: `Please select ${label}` }
      ];
    
    default:
      return [];
  }
};