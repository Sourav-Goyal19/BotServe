import { z } from "zod";
import { useState } from "react";
import toast from "react-hot-toast";
import { axiosIns } from "@/lib/axios";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormItem,
  FormLabel,
  FormField,
  FormMessage,
  FormControl,
} from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

const SignUp = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const formSchema = z.object({
    name: z.string().min(1, "Name is Required"),
    email: z.email("Invalid Email").min(1, "Email is Required"),
    password: z.string().min(6, "Password must be atleast 6 characters long"),
  });

  type FormType = z.infer<typeof formSchema>;

  const form = useForm<FormType>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    resolver: zodResolver(formSchema),
  });

  const signUpMutation = useMutation({
    mutationFn: async (values: FormType) => {
      const res = await axiosIns.post("/api/user/signup", {
        ...values,
      });

      return res;
    },
  });

  const onSubmit = (values: FormType) => {
    setIsLoading(true);
    console.log(values);
    try {
      signUpMutation.mutate(values, {
        onSuccess: (res) => {
          console.log(res.data);
          toast.success("Signup Successful");
          navigate("/sign-in");
        },
        onError: (err) => {
          console.error(err);
          toast.error(err.message || "Something goes wrong usually.");
        },
      });
    } catch (error) {
      console.error(error);
      toast.error("Something happened wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-background min-h-screen flex flex-col w-full items-center justify-center">
      <h1 className="text-3xl font-bold text-foreground text-center">
        Create Your Account
      </h1>
      <div className="border rounded-lg p-7 mt-5 max-w-[550px] mx-3 shadow-xl w-full">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Enter Your Name"
                      {...field}
                    />
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
                    <Input
                      disabled={isLoading}
                      placeholder="Enter Your Email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      type="password"
                      placeholder="Enter Your Password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full disabled:opacity-80"
            >
              Sign Up
            </Button>
          </form>
        </Form>
        <div className="mt-4">
          <p className="text-center">
            Already Have An Account?{" "}
            <Link to={"/sign-in"} className="font-medium underline">
              Login Here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
