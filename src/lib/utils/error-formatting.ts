type FieldMapping = {
  [key: string]: string;
};

const fieldLabels: FieldMapping = {
  firstName: 'first name',
  lastName: 'last name',
  phoneNumber: 'phone number',
  dateOfBirth: 'date of birth',
  email: 'email address',
  gender: 'gender',
};

export const errorFormatting = {
  getFieldLabel: (field: string): string => {
    return fieldLabels[field] || field;
  },

  formatUniqueError: (field: string): string => {
    const label = fieldLabels[field] || field;
    return `This ${label} is already registered`;
  },

  formatValidationError: (field: string, message: string): string => {
    // If message already contains the field name, return as is
    if (message.toLowerCase().includes(field.toLowerCase())) {
      return message;
    }
    
    const label = fieldLabels[field] || field;
    return `${message} for ${label}`;
  },

  formatUniqueConstraintMessage: (fields: string[]): string => {
    const labels = fields.map(field => fieldLabels[field] || field);
    
    if (labels.length === 1) {
      return `A single with this ${labels[0]} already exists`;
    }
    
    const lastLabel = labels.pop()!;
    return `A single with ${labels.join(', ')} and ${lastLabel} already exists`;
  }
}; 