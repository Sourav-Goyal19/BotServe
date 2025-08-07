import { z } from "zod";
import { Input } from "./ui/input";
import { Send } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { Button } from "./ui/button";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryStore } from "@/zustand/store";

const HomeChat = () => {
  const { setQuery } = useQueryStore();
  const navigate = useNavigate();
  const formSchema = z.object({
    input: z.string().min(2),
  });

  type FormType = z.infer<typeof formSchema>;

  const { register, handleSubmit, reset } = useForm<FormType>({
    defaultValues: {
      input: "",
    },
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (values: FormType) => {
    const id = uuidv4();
    setQuery(values.input);
    navigate(`/chat/${id}`);
    reset();
  };

  return (
    <main className="flex flex-col flex-1">
      <div className="flex-1 overflow-y-auto p-4 space-y-4"></div>

      <div className="border-t border-border/50 p-4 bg-card/20 backdrop-blur-sm">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex gap-2 justify-between items-center"
        >
          <Input
            className="h-12"
            placeholder="Type your message here..."
            {...register("input")}
            autoComplete="off"
          />
          <Button type="submit" className="h-12">
            <Send className="size-4 mr-2" />
            Send
          </Button>
        </form>
      </div>
    </main>
  );
};

export default HomeChat;
