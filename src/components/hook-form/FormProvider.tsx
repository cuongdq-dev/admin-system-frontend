import { ReactNode } from 'react';
import { FormProvider as Form, UseFormReturn } from 'react-hook-form';

interface FormProviderProps {
    children: ReactNode;
    methods: UseFormReturn<any>; // Replace `any` with a specific type if you know the shape of your form data
    onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void;
}

export const FormProvider = ({ children, onSubmit, methods }: FormProviderProps) =>
(
    <Form {...methods}>
        <form onSubmit={onSubmit}>{children}</form>
    </Form>
)

