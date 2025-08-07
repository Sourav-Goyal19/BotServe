import logging
from fastapi import FastAPI, status
from pydantic import BaseModel, Field
from fastapi.responses import JSONResponse, StreamingResponse
from app.controllers.chatbot import getResponse
from fastapi.middleware.cors import CORSMiddleware

logger = logging.getLogger(__name__)


app = FastAPI()

origins = [
    "*",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return JSONResponse(
        content={"Message": "Hello World! FastAPI is working."},
        status_code=status.HTTP_200_OK,
    )


class QueryState(BaseModel):
    query: str = Field(description="Query of the user")


@app.post("/query")
def handle_query(req: QueryState):
    query = req.query
    try:
        return StreamingResponse(
            getResponse(query), status_code=status.HTTP_200_OK, media_type="text/plain"
        )
    except Exception as e:
        logger.error(f"Error: {e}")
        return JSONResponse(
            content={"error": str(e)}, status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
