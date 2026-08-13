from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import predict

app = FastAPI(
    title="EasyMed ML Inference Service",
    description="Serves the disease-risk classifier and appointment-load forecasting model.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten to the Core API's origin in production
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok", "service": "ml-service"}


app.include_router(predict.router, prefix="/predict", tags=["predict"])
