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
    logger.info("Adding report" +" ==> "+ output)
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
    return handler(json.loads(payload_content), sender)


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
    signer= payload["signer"]
    key_id=payload["key_id"]
    sender = data
    logger.info(data)
    logger.info(f"Recevied inspect request data{payload}")
    handler = inspect_data_handlers.get(peal)
    if not handler:
        add_report("Invalid method.")
        return "reject"
    return handler(key_id, signer)
#   {"userLocation":"new hall, unilag, nigeria","adminLocation":"redemption camp, ogun state, nigeria","qrKeyId":"2311133335","userWallet":"0xBcd4042DE499D14e55001CcbB24a551F3b954096", "package":"","packageNature":"","transportation":"walking", "check_point":[{"point_address":"0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", "point_location":"ikeja, lagos, nigeria"}]}

def log_transmit(payload, signer):
    global key_value

    try:
        payload_content = (payload)
        admin_wallet = signer
        user_location = payload_content["userLocation"].lower(),
        admin_location = payload_content["adminLocation"].lower()
        qr_key_id = payload_content["qrKeyId"].lower()
        user_wallet = payload_content["userWallet"].lower()
        package = payload_content["package"].lower()
        package_nature = payload_content["packageNature"].lower()
        means_of_transportation = payload_content["transportation"].lower()
        commitment = HandShake(admin_Wallet_address=admin_wallet, user_location=user_location,
                               admin_Location=admin_location, Qr_key_id=qr_key_id, user_wallet_address=user_wallet,
                               package=package,
                               package_nature=package_nature, means_of_transportation=means_of_transportation)
        try:
            check_point = payload_content["check_point"]
            point_id = 1
            # check_point should come as a list
            for item in check_point:
                checkpoint_position = point_id
                point_address = item["point_address"].lower()
                point_location = item["point_location"].lower()
                commitment.add_checkpoint(checkpoint_position, point_address, point_location)
                point_id += 1
        except:
            pass
        keys[key_value] = {
            "handshakes": commitment
        }

        key_value += 1
        add_report("successfully filled form")
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
    # {"key_id":1,"Qr_confirmation":"2311133335"}

    try:
        payload_key = int(payload_content["key_id"])

        wallet_address = signer
        point_id = 0
        Qr_confirmation = payload_content["Qr_confirmation"]
        add_report(f"{keys}")
        hand_shake_environment = keys[payload_key]
        hand_shake = hand_shake_environment["handshakes"]
        add_report(f"step 4 {hand_shake.to_dict()}")
        if hand_shake.user_gotten_package == False:
            if signer == hand_shake.user:
                point_id = 0
            else:

                try:

                    for checkpoint_position, checkpoint_data in hand_shake.checkpoint.items():

                        if checkpoint_data['point_address'] == signer:
                            point_id = checkpoint_position

                except KeyError as e:
                    logger.info(f"you do not have assess to this transmit   ===> ,{e}")
                    return "reject"

            confirmation = hand_shake.gotten_to_point(wallet_address=wallet_address,Qr_confirmation= Qr_confirmation,point_id= point_id)
            if confirmation == "confirmation":
                add_notice(confirmation)
                return "accept"
            else:
                add_report(confirmation)
                return "reject"
        else:
            add_report("This transmit has been concluded")
            return "reject"

    except KeyError as e:
        logger.info(f"editing of package status has failed {e}")
        return "reject"


def quick_scan(payload, signer):
    payload_data = payload
    try:
        for key_S, value in keys.items():
            handshake = value["handshakes"]
            if handshake.Qr_key_id == payload_data["qrKeyId"]:
                if not handshake.user_gotten_package:
                    if handshake.user == signer:
                        handshake.gotten_to_point(signer, payload_data["qrKeyId"])
                        return "accept"
                    else:
                        for info_key, info_value in handshake.checkpoint.items():
                            if info_value["point_address"] == signer:
                                if not info_value["point_confirmation"]:
                                    handshake.gotten_to_point(signer, payload_data["qrKeyId"], int(info_key))
                                    return "accept"
                                else:
                                    add_report("Package has been confirmed by you")
                                    return "accept"
                    add_report("You do not have access to this transmit")
                    return "reject"
                else:
                    add_report("This transmit has been concluded")
                    return "reject"

        add_report("This item was not registered")
        return "reject"


    except:
        add_report("Major error")
        return ''


def my_keys(payload, signer):
    item = []
    try:
        for key, values in keys.items():
            add_report(values["handshakes"].admin)
            if values["handshakes"].admin.lower() == signer.lower():
                item.append({key: values["handshakes"].to_dict()})
        my_key_data = json.dumps({"my_keys": item})
        add_report(my_key_data)
    except KeyError as e:
        logger.info(f"Missing key in payload: {e}")
        return "reject"
    return "accept"


def search(payload, signer):

    try:
        search_find = keys[int(payload)]

        item = json.dumps({"search": search_find["handshakes"].to_dict()})
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
            logger.info(f"{value['handshakes']}")
            if value["handshakes"].user == signer.lower():
                item.append({key: value})
        my_key_data = json.dumps({"my_keys": item})
        add_report(my_key_data)
    except KeyError as e:
        add_report(f"Missing key in payload: {e}")
        return "reject"
    return "accept"


handlers = {
    "advance_state": handle_advance,
    "inspect_state": handle_inspect
}
advance_data_handlers = {
    "log_transmit": log_transmit,
    "edit_package_status": edit_package_status,
    "quick_scan": quick_scan

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


# log_transmit({"userLocation":"new hall, unilag, nigeria","adminLocation":"redemption camp, ogun state, nigeria","qrKeyId":"2311133335","userWallet":"0xBcd4042DE499D14e55001CcbB24a551F3b954096", "package":"","packageNature":"","transportation":"walking", "check_point":[{"point_address":"0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", "point_location":"ikeja, lagos, nigeria"}]},'0x976EA74026E726554dB657fA54763abd0C3a0aa9')
# log_transmit({"userLocation":"new hall, unilag, nigeria","adminLocation":"redemption camp, ogun state, nigeria","qrKeyId":"2311133335","userWallet":"0xBcd4042DE499D14e55001CcbB24a551F3b954096", "package":"","packageNature":"","transportation":"walking", "check_point":[{"point_address":"0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", "point_location":"ikeja, lagos, nigeria"}]},'0x976EA74026E726554dB657fA54763abd0C3a0aa9')
# log_transmit({"userLocation":"new hall, unilag, nigeria","adminLocation":"redemption camp, ogun state, nigeria","qrKeyId":"2311133335","userWallet":"0xBcd4042DE499D14e55001CcbB24a551F3b954096", "package":"","packageNature":"","transportation":"walking", "check_point":[{"point_address":"0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", "point_location":"ikeja, lagos, nigeria"}]},'0x976EA74026E726554dB657fA54763abd0C3a0aa9')
# log_transmit({"userLocation":"new hall, unilag, nigeria","adminLocation":"redemption camp, ogun state, nigeria","qrKeyId":"2311133335","userWallet":"0xBcd4042DE499D14e55001CcbB24a551F3b954096", "package":"","packageNature":"","transportation":"walking", "check_point":[{"point_address":"0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", "point_location":"ikeja, lagos, nigeria"}]},'0x976EA74026E726554dB657fA54763abd0C3a0aa9')



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

