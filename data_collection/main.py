import json
from typing import List
import requests


def query_snapshot_proposals(protocols: List[str], first: int, skip: int, flagged: bool):
    cookies = {
        '_ga_SY7Q8KPWK9': 'GS1.1.1710485060.30.1.1710485171.0.0.0',
        '_ga': 'GA1.2.1981012043.1698306350',
        '_gid': 'GA1.2.1774315651.1710485171',
    }

    headers = {
        'accept': '*/*',
        'accept-language': 'en-US,en;q=0.9',
        'content-type': 'application/json',
        'origin': 'https://snapshot.org',
        'priority': 'u=1, i',
        'referer': 'https://snapshot.org/',
        'sec-ch-ua': '"Opera";v="111", "Chromium";v="125", "Not.A/Brand";v="24"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-site',
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36 OPR/111.0.0.0',
    }

    json_data = {
        'operationName': 'Proposals',
        'variables': {
            'first': first,
            'skip': skip,
            "flagged": flagged,
            "space_in": protocols,
            "state": "all",
            "title_contains": ""
        },
        'query': '''query Proposals($first: Int!, $skip: Int!, $state: String!, $space: String, $space_in: [String], $author_in: [String], $title_contains: String, $space_verified: Boolean, $flagged: Boolean) {
  proposals(
    first: $first
    skip: $skip
    where: {space: $space, state: $state, space_in: $space_in, author_in: $author_in, title_contains: $title_contains, space_verified: $space_verified, flagged: $flagged}
  ) {
    id
    ipfs
    title
    body
    start
    end
    state
    author
    created
    choices
    space {
      id
      name
      members
      avatar
      symbol
      verified
      turbo
      plugins
    }
    scores_state
    scores_total
    scores
    votes
    quorum
    quorumType
    symbol
    flagged
  }
}''',
    }

    response = requests.post('https://hub.snapshot.org/graphql', headers=headers, json=json_data)
    return response.json()


def query_snapshot_space(protocol: str):
    json_data = {
        'operationName': 'Space',
        'variables': {
            'id': protocol,
        },
        'query': '''query Space($id: String!) {
  space(id: $id) {
    id
    name
    about
    network
    symbol
    network
    terms
    skin
    avatar
    twitter
    website
    github
    coingecko
    private
    domain
    admins
    moderators
    members
    categories
    plugins
    followersCount
    template
    guidelines
    verified
    turbo
    flagged
    hibernated
    parent {
      id
      name
      avatar
      followersCount
      children {
        id
      }
    }
    children {
      id
      name
      avatar
      followersCount
      parent {
        id
      }
    }
    voting {
      delay
      period
      type
      quorum
      quorumType
      privacy
      hideAbstain
    }
    strategies {
      name
      network
      params
    }
    validation {
      name
      params
    }
    voteValidation {
      name
      params
    }
    filters {
      minScore
      onlyMembers
    }
    delegationPortal {
      delegationType
      delegationContract
      delegationApi
    }
    treasuries {
      name
      address
      network
    }
    boost {
      enabled
      bribeEnabled
    }
  }
}''',
    }
    response = requests.post('https://hub.snapshot.org/graphql', json=json_data)
    return response.json()


def query_snapshot_follow(user_address: str, protocols: List[str]):
    json_data = {
        'operationName': 'Follows',
        'variables': {
            'space_in': protocols,
            'follower_in': user_address,
        },
        'query': '''query Follows($space_in: [String], $follower_in: [String]) {
  follows(where: {space_in: $space_in, follower_in: $follower_in}, first: 500) {
    id
    follower
    space {
      id
    }
  }
}'''
    }
    response = requests.post('https://hub.snapshot.org/graphql', json=json_data)
    return response.json()


def query_snapshot_subscription(user_address: str, protocol: str):
    json_data = {
        'operationName': 'Subscriptions',
        'variables': {
            'space': protocol,
            'address': user_address,
        },
        'query': '''query Subscriptions($space: String, $address: String) {
  subscriptions(where: {space: $space, address: $address}) {
    id
    address
    space {
      id
    }
  }
}'''
    }
    response = requests.post('https://hub.snapshot.org/graphql', json=json_data)
    return response.json()


def query_snapshot_users(user_addresses: List[str], first: int, skip: int):
    json_data = {
        'operationName': 'Users',
        'variables': {
            'first': first,
            'skip': skip,
            'addresses': user_addresses,
        },
        'query': '''query Users($addresses: [String]!, $first: Int, $skip: Int) {
  users(first: $first, skip: $skip, where: {id_in: $addresses}) {
    id
    name
    about
    avatar
    created
  }
}'''
    }
    response = requests.post('https://hub.snapshot.org/graphql', json=json_data)
    return response.json()


def query_snapshot_votes(proposals: List[str], voter: str):
    json_data = {
        'operationName': 'Votes',
        'variables': {
            'proposals': proposals,
            'voter': voter,
        },
        'query': '''query Votes($voter: String!, $proposals: [String]!) {
  votes(first: 1000, where: {voter: $voter, proposal_in: $proposals}) {
    proposal {
      id
    }
  }
}'''
    }
    response = requests.post('https://hub.snapshot.org/graphql', json=json_data)
    return response.json()


def query_snapshot_rankings(first: int, skip: int):
    json_data = {
        'operationName': 'Ranking',
        'variables': {
            'first': first,
            'skip': skip,
        },
        'query': '''query Ranking($first: Int, $skip: Int, $search: String, $network: String, $category: String) {
  ranking(
    first: $first
    skip: $skip
    where: {search: $search, network: $network, category: $category}
  ) {
    metrics {
      total
      categories
    }
    items {
      id
      name
      avatar
      private
      verified
      turbo
      categories
      rank
      activeProposals
      proposalsCount
      proposalsCount7d
      followersCount
      followersCount7d
      votesCount
      votesCount7d
      terms
    }
  }
}'''
    }
    response = requests.post('https://hub.snapshot.org/graphql', json=json_data)
    return response.json()


def filter_rankings(rankings: List[dict]):
    filtered_items = [item for item in rankings if item['activeProposals'] > 1 and item['proposalsCount'] > 500]
    return filtered_items


def get_all_proposals(snapshot_space: str):
    proposals = []
    skip = 0
    while True:
        resp = query_snapshot_proposals([snapshot_space], 1000, skip, False)
        skip += 1000
        print('-' * 50)
        print(resp)
        print('-' * 50)
        if resp['data']['proposals'] is None:
            break
        proposals.extend(resp['data']['proposals'])
        if len(resp['data']['proposals']) < 1000:
            break
    return proposals


def query_discourse_decentraland_proposals(first: int, skip: int):
    params = {
        "limit": first,
        "offset": skip,
    }
    url = "https://governance.decentraland.org/api/proposals"

    response = requests.get(url, params=params)
    return response.json()

def query_discourse_decentraland_comments(q_id: str):
    # "https://governance.decentraland.org/api/proposals/d7a3fbcf-5231-4f8c-b0dd-305f3f8c6ada/comments"
    url = f"https://governance.decentraland.org/api/proposals/{q_id}/comments"
    response = requests.get(url)
    return response.json()


if __name__ == '__main__':
    # resp = query_snapshot(['uniswapgovernance.eth'], 3, 0, False)
    # print('-' * 50)
    # print(resp['data']['proposals'][0])
    # print('-' * 50)

    # resp = query_snapshot_space('devdao.eth')
    # print('-' * 50)
    # print(resp)
    # print('-' * 50)

    # resp = query_snapshot_follow('0x1a9c8182c09f50c8318d769245bea52c32be35bc', ['uniswapgovernance.eth'])
    # print('-' * 50)
    # print(resp)
    # print('-' * 50)

    # resp = query_snapshot_subscription('0x1a9c8182c09f50c8318d769245bea52c32be35bc', 'uniswapgovernance.eth')
    # print('-' * 50)
    # print(resp)
    # print('-' * 50)

    # resp = query_snapshot_users(['0x1a9c8182c09f50c8318d769245bea52c32be35bc', '0x1a9c8182c09f50c8318d769245bea52c32be35bc'], 3, 0)
    # print('-' * 50)
    # print(resp)
    # print('-' * 50)

    # resp = query_snapshot_votes(['0xb34f7d7eddb60a3d93389c162f761411b08c2d221198b0fa41409a07a0d2fac8',
    #                              '0x4da40fe622a913da4ab25c8bf78551445c2fb5a940af8978874179a386d55698'],
    #                             '0x1a9c8182c09f50c8318d769245bea52c32be35bc')
    # print('-' * 50)
    # print(resp)
    # print('-' * 50)

    # resp = query_snapshot_rankings(10, 0)
    # print('-' * 50)
    # print(resp)
    # print(resp['data']['ranking']['items'])
    # print(json.dumps(resp['data']['ranking']['items'], indent=4))
    # json.dump(resp['data']['ranking']['items'], open('ranking.json', 'w'), indent=4)
    # print('-' * 50)

    # resp = query_snapshot_rankings(20,20)
    # print('-' * 50)
    # print(resp)
    # print('-' * 50)
    # filtered_items = filter_rankings(resp['data']['ranking']['items'])
    # json.dump(filtered_items, open('ranking_filtered2.json', 'w'), indent=4)

    # decentraland_proposals = get_all_proposals('snapshot.dcl.eth')
    # json.dump(decentraland_proposals, open('decentraland_proposals.json', 'w'), indent=4)

    resp = query_discourse_decentraland_proposals(10, 0)
    print('-' * 50)
    print(resp)
    json.dump(resp, open('decentraland_proposals_discourse.json', 'w'), indent=4)
    print('-' * 50)
