import json
from os import environ
import logging
import requests
from utili import str2hex, hex2str
from transmit import HandShake


logging.basicConfig(level="INFO")
logger = logging.getLogger(__name__)

rollup_server = environ["ROLLUP_HTTP_SERVER_URL"]
logger.info(f"HTTP rollup_server url is {rollup_server}")
# holds the data of the transmit for each key created

key_value = 0
keys = {
}


def add_report(output=""):
    logger.info("Adding report" + output)
    report = {"payload": str2hex(output)}
    response = requests.post(rollup_server + "/report", json=report)
    logger.info(f"Received report status {response.status_code}")


def add_notice(data):
    logger.info(f"Adding notice {data}")
    notice = {"payload": str2hex(data)}
    response = requests.post(rollup_server + "/notice", json=notice)
    logger.info(f"Received notice status {response.status_code}")


def handle_advance(data):
    logger.info(f"Received advance data {data}")
    notice = {"payload": data["payload"]}
    onions = (notice['payload'])
    try:
        payload = json.loads(hex2str(onions))
    except:
        return "reject"
    peal = payload["method"]

    sender = data['metadata']['msg_sender']
    logger.info(sender)
    logger.info(f"Received advanced request data{payload}")
    handler = advance_data_handlers.get(peal)
    payload_content = payload["transmit"]
    if not handler:
        add_report("Invalid method.")
        return "reject"
    return handler(payload_content, sender)


def handle_inspect(data):
    logger.info(f"Received inspect request data {data}")
    logger.info("Adding report")
    notice = {"payload": data["payload"]}
    onions = (notice['payload'])
    try:
        payload = json.loads(hex2str(onions))
    except:
        return "reject"
    peal = payload["method"]
    sender = data
    logger.info(f"Recevied inspect request data{payload}")
    handler = inspect_data_handlers.get(peal)
    if not handler:
        add_report("Invalid method.")
        return "reject"
    return handler(payload, sender)


def log_transmit(payload, signer):
    global key_value
    try:
        payload_content = (payload)
        admin_wallet = signer
        user_location = payload_content["userLocation"],
        admin_location = payload_content["adminLocation"]
        qr_key_id = payload_content["qrKeyId"]
        user_wallet = payload_content["userWallet"]
        package = payload_content["package"]
        package_nature = payload_content["packageNature"]
        means_of_transportation= payload_content["transportation"]
        commitment = HandShake(admin_wallet, user_location, admin_location, qr_key_id, user_wallet, package,
                               package_nature, means_of_transportation)
        try:
            check_point = payload_content["check_point"]
            point_id = 1
            # check_point should come as a list
            for item in check_point:
                checkpoint_position = point_id
                point_address = item["point_address"]
                point_location = item["point_location"]
                commitment.add_checkpoint(checkpoint_position, point_address, point_location)
                point_id += 1
        except:
            pass
        keys[key_value] = {
            "handshakes": commitment
        }

        key_value += 1
        return "accept"
    except KeyError as e:
        add_report(f"Missing key in payload: {e}")
        return "reject"
    except json.JSONDecodeError:
        add_report("Invalid JSON payload")
        return "reject"


def edit_package_status(payload, signer):
    payload_content = (payload)
    # this is going to bring out the key from the user in the front end
    try:
        payload_key = payload_content["key_id"]
        wallet_address = signer
        point_id = 0
        Qr_confirmation = payload_content["Qr_confirmation"]

        hand_shake_environment = keys[payload_key]
        hand_shake = hand_shake_environment["handshakes"]
        if hand_shake.user_gotten_package == False:
            if signer == hand_shake.user:
                point_id = 0
            else:
                try:
                    for checkpoint_position, checkpoint_data in hand_shake.checkpoint.items():
                        if checkpoint_data["point_address"] == signer:
                            point_id = int(checkpoint_position)
                except:
                    add_notice("you do not have assess to this transmit")
                    return "reject"

            confirmation = hand_shake.gotten_to_point(wallet_address, Qr_confirmation, point_id)
            if confirmation == "confirmation":
                add_notice(confirmation)
                return "accept"
            else:
                add_report(confirmation)
                return "reject"
        else:
            return "reject"

    except:
        add_report("editing of package status has failed")
        return "reject"


def my_keys(payload, signer):
    item = []
    try:
        for key, value in keys.items():
            if value["handshakes"].admin == signer:
                item.append({key: value["handshakes"].to_dict()})
        my_key_data = json.dumps({"my_keys": item})
        add_report(my_key_data)
    except KeyError as e:
        add_report(f"Missing key in payload: {e}")
        return "reject"
    return "accept"


def search(payload, signer):
    payload_content = (payload)
    payload_key = payload_content["key_id"]
    try:
        search_find = keys[int(payload_key)]
        item = json.dumps({"search":search_find["handshakes"].to_dict()})
        add_report(item)
        return "accept"
    except:
        no_item = json.dumps({"search": {}})
        add_report(no_item)
        return "accept"


def guest_key(payload, signer):
    item = []
    try:
        for key, value in keys.items():
            if value["handshakes"].user == signer:
                item.append({key: value})
        my_key_data = json.dumps({"my_keys": item})
        add_report(my_key_data)
    except KeyError as e:
        add_report(f"Missing key in payload: {e}")
        return "reject"
    return "accept"


handlers = {
    "advance_state": handle_advance,
    "inspect_state": handle_inspect,
}
advance_data_handlers = {
    "log_transmit": log_transmit,
    "edit_package_status": edit_package_status,

}
inspect_data_handlers = {
    # this will return the keys created by the wallet address
    "my_keys": my_keys,
    # this will return the search of the current user
    "search": search,
    # this will return the key for the ones the user is part of but did not create
    "guest_key": guest_key

}

finish = {"status": "accept"}

while True:
    logger.info("Sending finish aaaaaa")
    response = requests.post(rollup_server + "/finish", json=finish)
    logger.info(f"Received finish status"
                f" {response.status_code}")
    if response.status_code == 202:
        logger.info("No pending rollup request, trying again")
    else:
        rollup_request = response.json()
        data = rollup_request["data"]

        handler = handlers[rollup_request["request_type"]]
        finish["status"] = handler(rollup_request["data"])
