import type { Control } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@shared/ui/components/ui/form";
import { Input } from "@shared/ui/components/ui/input";
import type { z } from "zod";
import type { registerFormSchema } from "@/schemas/register-schema";

interface RegisterFormFieldsProps {
  control: Control<z.infer<typeof registerFormSchema>>;
  isDisabled?: boolean;
}

export function RegisterFormFields({
  control,
  isDisabled = false,
}: RegisterFormFieldsProps): JSX.Element {
  return (
    <div className="grid gap-2">
      <FormField
        control={control}
        name="username"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Username</FormLabel>
            <FormControl>
              <Input
                placeholder="johndoe"
                {...field}
                disabled={isDisabled}
                autoComplete="username"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input
                placeholder="name@example.com"
                {...field}
                disabled={isDisabled}
                autoComplete="email"
                type="email"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Password</FormLabel>
            <FormControl>
              <Input
                placeholder="••••••••"
                type="password"
                {...field}
                disabled={isDisabled}
                autoComplete="new-password"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="confirmPassword"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Confirm Password</FormLabel>
            <FormControl>
              <Input
                placeholder="••••••••"
                type="password"
                {...field}
                disabled={isDisabled}
                autoComplete="new-password"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
