import type { ReactNode } from 'react';
import type { UseFormReturn } from 'react-hook-form';

import { FormProvider as Form } from 'react-hook-form';

interface FormProviderProps {
  children: ReactNode;
  methods: UseFormReturn<any>; // Replace `any` with a specific type if you know the shape of your form data
  onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void;
}

export const FormProvider = ({ children, onSubmit, methods }: FormProviderProps) => {
  return (
    <Form {...methods}>
      <form onSubmit={onSubmit}>{children}</form>
    </Form>
  );
};
