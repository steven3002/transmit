import time
import json
from data_p import Delay


class Key:
    def __init__(self, address, longitude, latitude, package, manufacturer_address=None):
        self.address = address
        self.longitude = longitude
        self.latitude = latitude
        self.package = package
        self.manufacturer_address = manufacturer_address
        self.handshakes = []

    def add_handshake(self, handshake):
        self.handshakes.append(handshake)

    def get_handshakes(self):
        return self.handshakes


class HandShake:
    def __init__(self,means_of_transportation, admin_Wallet_address, user_location, admin_Location, Qr_key_id,
                 user_wallet_address, package="", package_nature="" ):
        # getting the Qr_comfirmation will be the last thing we will have to do
        # getting the Qr_Id will serve as the confirmation of the item location
        self.admin = admin_Wallet_address
        self.user = user_wallet_address
        self.user_gotten_package = False
        self.user_receiving_time = ""
        self.package = package
        self.nature_of_package = package_nature
        self.admin_location = admin_Location
        self.user_location = user_location
        self.checkpoint = {
        }
        self.Qr_key_id = Qr_key_id
        self.means_of_transportation=means_of_transportation
        self.created_at = time.time()
        # self.delay_unit= Delay()
    def add_checkpoint(self, checkpoint_position, check_point_wallet_address, check_point_address):
        # check point position shows the position of transmit is first to check the item or third before user
        self.checkpoint[checkpoint_position] = {
            "point_address": check_point_wallet_address,
            "point_location": check_point_address,
            "point_confirmation": False,
            "receiving_time": ""
        }

    def Qr_confirmation(self, Qr_code):
        # this will the code that will confirm the Qr_scanning confirmation
        try:
            if str(Qr_code) != str(self.Qr_key_id):
                return f"The Qr code presented is invalid"
            elif str(Qr_code) == str(self.Qr_key_id):

                return True


        except:
            return "An error has occurred"

    def gotten_to_point(self, wallet_address, Qr_confirmation, point_id=0):

        if point_id == 0:
            if wallet_address == self.user:
                self.user_gotten_package = self.Qr_confirmation(Qr_confirmation)
                self.user_receiving_time = time.time()
                return "confirmation"
            else:
                return " invalid parameters presented 11"
        else:
            if wallet_address == self.checkpoint[point_id]["point_address"]:
                self.checkpoint[point_id]["point_confirmation"] = self.Qr_confirmation(Qr_confirmation)
                self.checkpoint[point_id]["receiving_time"] = time.time()
                return "confirmation"
            else:
                return " invalid parameters presented 12"
    def to_dict(self):
        return {
            'admin': self.admin,
            'user': self.user,
            'user_gotten_package': self.user_gotten_package,
            'user_receiving_time': self.user_receiving_time,
            'package': self.package,
            'nature_of_package': self.nature_of_package,
            'admin_location': self.admin_location,
            'user_location': self.user_location,
            'checkpoint': self.checkpoint,
            'Qr_key_id': self.Qr_key_id,
            'created_at': self.created_at
        }

    # def esay_scan(self, Qr_id, signer):
    #     # this is for easy scanning of the item:
