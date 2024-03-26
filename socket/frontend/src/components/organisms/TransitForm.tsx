import React, { useEffect } from "react";
import { DropdownField, FormField } from "./InputField.tsx";
import { Scanner } from "@yudiel/react-qr-scanner";
import Button from "./Button.tsx";
import { Provider, Signer } from "ethers";
import Overlay from "./Overlay.tsx";
import { CloseButton } from "./CloseButton.tsx";

export default function TransitForm() {
    const [showForm, setShowForm] = React.useState(false);

    const toggleForm = () => {
        setShowForm(!showForm);
    };

    return (
        <div className="flex flex-col mx-8 my-4 items-end">
            <CreateTransmitButton onClick={toggleForm} />
            <Overlay isOpen={showForm}>
                <FormContent closeForm={toggleForm} />
            </Overlay>
        </div>
    );
}

function FormContent({ closeForm }: { closeForm: () => void }) {
    const [signer, setSigner] = React.useState<Signer>();
    const [provider, setProvider] = React.useState<Provider>();

    const [userLocation, setUserLocation] = React.useState("");
    const [adminLocation, setAdminLocation] = React.useState("");
    const [qrCode, setQrCode] = React.useState("");
    const [userWallet, setUserWallet] = React.useState("");
    const [packageValue, setPackageValue] = React.useState("");
    const [packageNature, setPackageNature] = React.useState("");
    const [checkPointLocation, setCheckpointLocation] = React.useState("");
    const [checkPointWallet, setCheckpointWallet] = React.useState("");
    const [transportationMode, setTransportationMode] = React.useState("");

    const [showQrCode, setShowQrCode] = React.useState(false);

    useEffect(() => {
        // initializeEthers(setProvider, setSigner);
    }, []);

    const toggleQrCode = () => {
        setShowQrCode(!showQrCode);
    };

    return (
        <div
            id="transit-form"
            className="bg-neutral-0 h-[80vh] md:w-[60vw] w-full overflow-y-auto rounded-lg shadow-lg px-4"
        >
            <div className="flex flex-row justify-between my-4">
                <h1 className="text-2xl font-bold">Transmit Form</h1>
                <CloseButton close={closeForm} />
            </div>
            <form
                className="flex flex-col gap-4 my-4"
            >
                <FormField
                    label="User Location"
                    placeholder="38, Ogunlana Drive, Surulere, Lagos"
                    value={userLocation}
                    onChange={setUserLocation}
                />

                <FormField
                    label="Admin Location"
                    placeholder="38, Ogunlana Drive, Surulere, Lagos"
                    value={adminLocation}
                    onChange={setAdminLocation}
                />

                {showQrCode ?
                    <QrScanner
                        onError={(error) => console.log(error?.message)}
                        onResult={setQrCode}
                        onDismiss={toggleQrCode}
                    /> :
                    <FormField
                        label="Qr Code"
                        value={qrCode}
                        onChange={setQrCode}
                        onClick={toggleQrCode}
                        readOnly
                    />
                }

                <FormField
                    label="User Wallet"
                    placeholder="0x1234567890"
                    value={userWallet}
                    onChange={setUserWallet}
                />

                <FormField
                    label="Package"
                    placeholder="Box, Envelope, etc."
                    value={packageValue}
                    onChange={setPackageValue}
                />

                <FormField
                    label="Package Nature"
                    placeholder="Box, Envelope, etc."
                    value={packageNature}
                    onChange={setPackageNature}
                />


                <FormField
                    label="Checkpoint Location"
                    placeholder="38, Ogunlana Drive, Surulere, Lagos"
                    value={checkPointLocation}
                    onChange={setCheckpointLocation}
                />

                <FormField
                    label="Checkpoint Wallet"
                    placeholder="0x1234567890"
                    value={checkPointWallet}
                    onChange={setCheckpointWallet}
                />

                <DropdownField
                    value={transportationMode}
                    label="Mode of Transportation"
                    options={TransportationModes}
                    onChange={setTransportationMode}
                />

                <Button type="submit" variant="primary">
                    Submit
                </Button>
            </form>
        </div>
    );
}

function CreateTransmitButton({ onClick }: { onClick: () => void }) {
    return (
        <Button type="submit" variant="primary" onClick={onClick} className="w-[40%]">
            + Create Transmit
        </Button>
    );
}

function QrScanner(
    { onResult, onError, onDismiss }: {
        onResult: (result: string) => void,
        onError: (error: Error) => void,
        onDismiss: () => void
    }
) {
    return (
        <div className="flex flex-col gap-2 items-end">
            <CloseButton close={onDismiss} />
            <Scanner
                onResult={onResult}
                onError={onError}
            />
        </div>
    );
}


const TransportationModes = [
    "Bike",
    "Car",
    "Truck",
    "Van",
    "Boat",
    "Plane",
    "Train",
    "Bus",
    "Motorcycle",
    "Foot"
];