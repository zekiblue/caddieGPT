from pydantic import BaseModel
from enum import Enum


class Model(str, Enum):
    OPENAI = 'openai'
    MISTRAL = 'mistral'
    GEMMA = 'gemma'
    QWEN = 'qwen'
    PHI = 'phi'


class InputSchema(BaseModel):
    wallet_address: str
    dao_code: str = 'snapshot.dcl.eth'
    proposal_id: str
    model: Model = Model.OPENAI
