#!/usr/bin/env python
from naptha_sdk.utils import get_logger, load_yaml
from caddie.schemas import InputSchema
from litellm import completion
import yaml
import json
import requests

logger = get_logger(__name__)


def llm_call(messages, cfg):
    response = completion(
        model=cfg["models"]["ollama"]["model"],
        messages=messages,
        temperature=cfg["models"]["ollama"]["temperature"],
        max_tokens=cfg["models"]["ollama"]["max_tokens"],
        api_base=cfg["models"]["ollama"]["api_base"],
    )
    return response


def get_positive_proposal_summaries(dao_code, wallet_address):
    summaries = json.load(open(f"caddie/datas/{dao_code}.json"))
    summaries = [f"Title: {s['title']}, Description Summary: {s['summary']}" for s in summaries if
                 wallet_address in s["wallet_addresses"]]
    return "\n\n\n".join(summaries)


def get_negative_proposal_summaries(dao_code, wallet_address):
    summaries = json.load(open(f"caddie/datas/{dao_code}.json"))
    summaries = [f"Title: {s['title']}, Description Summary: {s['summary']}" for s in summaries if
                 wallet_address not in s['wallet_addresses']]
    return "\n\n\n".join(summaries)


def get_proposal_detail(dao_code, proposal_id):
    result = {}
    if dao_code == "snapshot.dcl.eth":
        json_data = {
            'operationName': 'Proposal',
            'variables': {
                'id': proposal_id,
            },
            'query': '''query Proposal($id: String!) {
              proposal(id: $id) {
                id
                ipfs
                title
                body
                discussion
                choices
                start
                end
                snapshot
                state
                author
                created
                plugins
                network
                type
                quorum
                quorumType
                symbol
                privacy
                validation {
                  name
                  params
                }
                strategies {
                  name
                  network
                  params
                }
                space {
                  id
                  name
                }
                scores_state
                scores
                scores_by_strategy
                scores_total
                votes
                flagged
              }
            }''',
        }
        response = requests.post('https://hub.snapshot.org/graphql', json=json_data)
        response = response.json()
        response = response['data']['proposal']


        result["title"] = response["title"]
        result["summary"] = response["body"]
        result["author"] = response["author"]
    return result


def run(inputs: InputSchema, worker_nodes=None, orchestrator_node=None, flow_run=None, cfg: dict = None):
    logger.info(
        f"Running with inputs address: {inputs.wallet_address}, code: {inputs.dao_code}, proposal: {inputs.proposal_id}")

    past_positive_proposals = get_positive_proposal_summaries(inputs.dao_code, inputs.wallet_address)
    past_negative_proposals = get_negative_proposal_summaries(inputs.dao_code, inputs.wallet_address)

    user_prompt = cfg["inputs"]["user_message_template"].replace("{{past_positive_proposals}}", past_positive_proposals)
    user_prompt = user_prompt.replace("{{past_negative_proposals}}", past_negative_proposals)

    proposal_detail = get_proposal_detail(inputs.dao_code, inputs.proposal_id)
    user_prompt = user_prompt.replace("{{title}}", proposal_detail["title"])
    user_prompt = user_prompt.replace("{{description}}", proposal_detail["summary"])
    user_prompt = user_prompt.replace("{{author}}", proposal_detail["author"])

    messages = [
        {"role": "system", "content": cfg["inputs"]["system_message"]},
        {"role": "user", "content": user_prompt}
    ]

    response = llm_call(messages, cfg)

    logger.info(f"Result: {response}")

    return response.model_dump_json()


if __name__ == "__main__":
    with open("caddie/component.yaml", "r") as f:
        cfg = yaml.safe_load(f)

    inputs = InputSchema(wallet_address="0x47EE523d873Fc9375a507F970ad2601f720A16Bc",
                         proposal_id="0xfab4a2ad457ee70d80100a9460db2a48bb3390d9002e562fe9cc8ce0ed913721")
    r = run(inputs, cfg=cfg)
    logger.info(f"Result: {type(r)}")
