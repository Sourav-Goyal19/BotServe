import { z } from "zod";
import { cn } from "../lib/utils";
import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "react-router-dom";

type MessageType = {
  role: "user" | "ai";
  content: string;
};

const Chat = () => {
  const { id } = useParams();
  const [messages, setMessages] = useState<MessageType[]>([
    {
      role: "ai",
      content: id || "",
    },
  ]);
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

  const messageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const onSubmit = async (values: FormType) => {
    reset();
    try {
      setMessages((prev) => [...prev, { role: "user", content: values.input }]);
      const res = await fetch("http://localhost:8000/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: values.input }),
      });

      const stream = res.body?.getReader();
      let result = "";
      const decoder = new TextDecoder();
      setMessages((prev) => [...prev, { role: "ai", content: "" }]);

      while (true) {
        // @ts-ignore
        const { done, value } = await stream?.read();
        if (done) {
          break;
        }

        const content = decoder.decode(value, { stream: true });
        result += content;

        setMessages((prev) => {
          const all = [...prev];
          all[all.length - 1].content = result;
          return all;
        });
      }
    } catch (error) {
      console.error(error);
      messages.pop();
      setMessages(messages);
      reset({
        input: values.input,
      });
    }
  };
  return (
    <main className="flex flex-col flex-1">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, idx) => (
          <div
            key={idx}
            className={cn(
              "flex",
              message.role === "user" ? "justify-end" : "justify-start"
            )}
          >
            <div
              className={cn(
                "max-w-[85%] lg:max-w-[70%] rounded-lg px-4 py-3 text-foreground",
                message.role === "user"
                  ? "bg-gradient-to-br from-blue-500 to-blue-700 text-primary-foreground"
                  : "bg-card text-accent-foreground"
              )}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>
        ))}
        <div ref={messageRef} />
      </div>

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

export default Chat;
