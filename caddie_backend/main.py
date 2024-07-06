from typing import Union

from fastapi import FastAPI

import asyncio
from naptha_sdk.client.naptha import Naptha
from naptha_sdk.client.node import Node
from naptha_sdk.task import Task
from naptha_sdk.flow import Flow
from naptha_sdk.user import generate_user
import os


app = FastAPI()

@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}


@app.get("/votes")
async def vote_results(daoCode: str, proposalId: str, walletAddress: str):
    naptha = await Naptha(
          user=generate_user()[0],
          hub_username=os.getenv("HUB_USER"), 
          hub_password=os.getenv("HUB_PASS"), 
          hub_url="ws://node.naptha.ai:3001/rpc",
          node_url="http://node.naptha.ai:7001",
      )
    flow_inputs = {"dao_code": daoCode, "proposal_id": proposalId, "wallet_address": walletAddress"}
    flow = Flow(name="caddie_module", user_id=naptha.user["id"], worker_nodes=worker_nodes, module_params=flow_inputs)task1 = Task(name="caddieGPT_vote", fn="caddie_module", worker_node=worker_nodes[0], orchestrator_node=naptha.node, flow_run=flow.flow_run)
    response = await task1(dao_code=flow_inputs['dao_code'], proposal_id=flow_inputs['proposal_id'], wallet_address=flow_inputs['wallet_address'])
    return response
    



    