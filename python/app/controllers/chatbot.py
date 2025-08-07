import os
from dotenv import load_dotenv
from typing import TypedDict, Annotated

load_dotenv()

from langchain_groq import ChatGroq
from langchain_deepseek import ChatDeepSeek
from langgraph.graph.message import add_messages
from langgraph.graph import StateGraph, START, END
from langgraph.checkpoint.memory import InMemorySaver
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage, BaseMessage

LLMS = {}

LLMS["gemini"] = ChatGoogleGenerativeAI(
    api_key=os.getenv("GOOGLE_API_KEY"), model="gemini-1.5-flash"
)

LLMS["deepseek"] = ChatDeepSeek(
    api_key=os.getenv("OPENROUTER_API_KEY"),
    api_base=os.getenv("OPENROUTER_BASE_URL"),
    model="deepseek/deepseek-chat-v3-0324:free",
)

LLMS["moonshotai"] = ChatGroq(
    api_key=os.getenv("GROQ_API_KEY"), model="moonshotai/kimi-k2-instruct"
)

llm: ChatDeepSeek = LLMS["moonshotai"]


class ChatState(TypedDict):
    messages: Annotated[list[BaseMessage], add_messages]


def chat_node(state: ChatState):
    messages = state["messages"]
    result = llm.invoke(messages)
    state["messages"] = [result.content]

    return state


graph = StateGraph(ChatState)

graph.add_node("chat_node", chat_node)

graph.add_edge(START, "chat_node")
graph.add_edge("chat_node", END)

checkpointer = InMemorySaver()

chatbot = graph.compile(checkpointer=checkpointer)

thread_id = 1
config = {"configurable": {"thread_id": thread_id}}


def getResponse(user_msg: str):
    initial_state = {"messages": [HumanMessage(content=user_msg)]}
    for message_chunk, metadata in chatbot.stream(
        initial_state, config=config, stream_mode="messages"
    ):
        if message_chunk.content:
            yield message_chunk.content
