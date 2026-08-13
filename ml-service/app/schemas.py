from pydantic import BaseModel, Field


class DiseaseRiskInput(BaseModel):
    age: int = Field(..., ge=0, le=120)
    bmi: float = Field(..., ge=10, le=80)
    blood_pressure: float = Field(..., ge=50, le=250)
    glucose: float = Field(..., ge=30, le=500)
    smoker: bool = False
    family_history: bool = False


class DiseaseRiskOutput(BaseModel):
    risk_score: float = Field(..., description="Probability of high risk, 0-1")
    risk_band: str = Field(..., description="low | moderate | high")
    model_version: str
