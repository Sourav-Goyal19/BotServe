import { z } from "zod";
import { useEffect, useState } from "react";
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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const SignIn = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const formSchema = z.object({
    email: z.email("Invalid Email").min(1, "Email is Required"),
    password: z.string().min(6, "Password must be atleast 6 characters long"),
  });

  useEffect(() => {
    console.log(document.cookie);
  }, []);

  type FormType = z.infer<typeof formSchema>;

  const form = useForm<FormType>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(formSchema),
  });

  const loginMutation = useMutation({
    mutationFn: async (values: FormType) => {
      const res = await axiosIns.post("/api/user/login", {
        ...values,
      });

      return res;
    },
  });

  const onSubmit = (values: FormType) => {
    setIsLoading(true);
    console.log(values);
    try {
      loginMutation.mutate(values, {
        onSuccess: (res) => {
          console.log(res.data);
          toast.success("Login Successful");
          navigate("/");
          setIsLoading(false);
        },
        onError: (err: any) => {
          console.error(err);
          toast.error(
            err?.response.data.error ||
              err?.message ||
              "Something goes wrong usually."
          );
          setIsLoading(false);
        },
      });
    } catch (error) {
      console.error(error);
      toast.error("Something happened wrong.");
    }
  };

  return (
    <div className="bg-background min-h-screen flex flex-col w-full items-center justify-center">
      <h1 className="text-3xl font-bold text-foreground text-center">
        Sign Into Your Account
      </h1>
      <div className="border bg-card rounded-lg p-7 mt-5 max-w-[550px] mx-3 shadow-xl w-full">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
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
              Sign In
            </Button>
          </form>
        </Form>
        <div className="mt-4">
          <p className="text-center">
            New Here?{" "}
            <Link to={"/sign-up"} className="font-medium underline">
              Create An Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
