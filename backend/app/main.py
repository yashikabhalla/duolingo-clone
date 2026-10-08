from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from . import models  # noqa: F401  (importing registers the tables)
from .database import Base, engine
from .routers import course, debug, leaderboard, lessons, user

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Duolingo Clone API")

# Allow the Next.js frontend (port 3000) to call this backend (port 8000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user.router)
app.include_router(course.router)
app.include_router(lessons.router)
app.include_router(leaderboard.router)
app.include_router(debug.router)


@app.get("/api/health")
def health():
    return {"status": "ok"}