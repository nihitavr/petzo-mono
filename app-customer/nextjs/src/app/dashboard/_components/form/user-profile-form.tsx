"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@petzo/ui/components/form";
import { Input } from "@petzo/ui/components/input";
import { toast } from "@petzo/ui/components/toast";

import { api } from "~/trpc/react";
import FormSaveButton from "../form-save-button";
import UserProfileLoading from "../loading/user-profile-loading";

const userProfileFormSchema = z.object({
  name: z.string().min(1, {
    message: "Pet name must be at least 1 characters.",
  }),
  email: z.string().email("Email must be a valid."),
  phoneNumber: z.string().regex(/^[56789]\d{9}$/, {
    message:
      "Invalid Phone Number. Please provide a valid 10 digits number eg. (9999999999)",
  }),
});

export function UserProfileForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // const { toast } = useToast();

  const form = useForm<z.infer<typeof userProfileFormSchema>>({
    resolver: zodResolver(userProfileFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
    },
  });

  const { data: userData, isLoading } =
    api.user.getProtectedUserProfile.useQuery();

  const updateUser = api.user.updateUserProfile.useMutation();

  useEffect(() => {
    if (!isLoading && userData) {
      // 4. Set the data to the form.
      form.reset({
        name: userData.name!,
        email: userData.email,
        phoneNumber: userData.phoneNumber!,
      });
    }
  }, [isLoading, userData]);

  const onSubmit = async (values: z.infer<typeof userProfileFormSchema>) => {
    const data = {
      name: values.name,
      email: values.email,
      phoneNumber: values.phoneNumber,
    };

    setIsSubmitting(true);
    await updateUser.mutateAsync(data, {
      onSuccess: (userData) => {
        if (userData) {
          form.reset({
            name: userData.name!,
            email: userData.email,
            phoneNumber: userData.phoneNumber!,
          });

          toast.success("Owner Profile updated successfully!");
        }

        return;
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
    setIsSubmitting(false);
  };

  if (isLoading) {
    return <UserProfileLoading />;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 pb-16">
        <div>
          <h1 className="text-xl font-semibold">Owner Profile</h1>
        </div>

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Owner Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input disabled {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input
                  className="placeholder:text-secondary-foreground/40"
                  placeholder="Phone Number - 10 digits eg. (9999999999)"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormSaveButton
          disabled={Object.keys(form.formState.dirtyFields).length == 0}
          isSubmitting={isSubmitting}
        />
      </form>
    </Form>
  );
}
