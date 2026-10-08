from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware



from .database import engine, Base
from . import models  # noqa: F401  (importing registers the tables)
app = FastAPI(title="Duolingo Clone API")

Base.metadata.create_all(bind=engine)

# Allow the Next.js frontend (port 3000) to call this backend (port 8000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
def health():
    return {"status": "ok"}