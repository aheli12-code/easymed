from fastapi import APIRouter

from app.schemas import DiseaseRiskInput, DiseaseRiskOutput

router = APIRouter()

MODEL_VERSION = "0.0.0-stub"


def _stub_risk_score(payload: DiseaseRiskInput) -> float:
    """
    Placeholder scoring function. Replace with a loaded, versioned
    scikit-learn/XGBoost model artifact (see Week 4: Model Inference).
    """
    score = 0.0
    score += 0.15 if payload.age > 50 else 0.0
    score += 0.15 if payload.bmi > 30 else 0.0
    score += 0.2 if payload.blood_pressure > 140 else 0.0
    score += 0.2 if payload.glucose > 126 else 0.0
    score += 0.15 if payload.smoker else 0.0
    score += 0.15 if payload.family_history else 0.0
    return min(score, 1.0)


@router.post("/disease-risk", response_model=DiseaseRiskOutput)
def predict_disease_risk(payload: DiseaseRiskInput):
    score = _stub_risk_score(payload)
    band = "high" if score >= 0.6 else "moderate" if score >= 0.3 else "low"
    return DiseaseRiskOutput(risk_score=score, risk_band=band, model_version=MODEL_VERSION)
