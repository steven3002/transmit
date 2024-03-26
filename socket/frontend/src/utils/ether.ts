import { ethers, Signer } from "ethers";
import { InputBox__factory } from "@cartesi/rollups";

declare global {
    interface Window {
        ethereum: any;
    }
}

export function initializeEthers(
    setProvider?: (provider: ethers.Provider) => void,
    setSigner?: (signer: ethers.Signer) => void
) {
    if (window.ethereum == null) {
        // If MetaMask is not installed, use the default provider
        console.log("MetaMask not installed; using read-only defaults");
        setProvider && setProvider(ethers.getDefaultProvider());
        return;
    }

    const onError = (error: any) => {
        console.error("Error connecting to MetaMask:", error);
        alert("Connection to MetaMask failed");
    };

    try {
        // Connect to MetaMask EIP-1193 object
        const browserProvider = new ethers.BrowserProvider(window.ethereum);
        setProvider && setProvider(browserProvider);

        // Request access to write operations
        browserProvider.getSigner().then((signer) => {
            setSigner && setSigner(signer);
            console.log(signer.getAddress());
        }).catch(onError);
    } catch (error) {
        onError(error);
    }
}

async function handShake(
    signer: ethers.Signer
) {
    const showError = (error: any) => {
        console.error("Error creating challenge:", error);
        // Handle error - display toast message or other UI feedback
        toast({
            title: "Error",
            description: "Failed to create challenge. Please try again later.",
            status: "error",
            duration: 3000,
            isClosable: true
        });
    };

    try {
        // Ensure signer has getAddress method before calling it
        if (typeof signer.getAddress !== "function") {
            showError("Signer object does not have getAddress method");
            return;
        }

        const signerAddress = await signer.getAddress(); // Retrieve signer's address
        console.log("Signer address:", signerAddress);

        await sendInput(
            JSON.stringify({
                method: "log_transmit",
                transmit: formData
            }),
            signer,
            toast
        );
        await sendInput(
            JSON.stringify({
                method: "edit_package_status",
                transmit: {
                    "key_id": 0,
                    "Qr_confirmation": "36tt754y237y583uy8"


                }
            }),
            signer,
            toast
        );

        let results = await inspect({ method: "get_challenges" });
        console.log(results);
        // Handle success - display toast message or other UI feedback
        toast({
            title: "Success",
            description: "Form submitted successfully.",
            status: "success",
            duration: 3000,
            isClosable: true
        });
    } catch (error) {
        showError(error);
    }
}

export async function generateHash(input: string) {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0"));
    return hashHex.join("");
}

export const sendInput = async (value: any, signer: Signer, toast) => {
    const inputBox = InputBox__factory.connect(INPUTBOX_ADDRESS, signer);
    const inputBytes = ethers.isBytesLike(value)
        ? value
        : ethers.toUtf8Bytes(value);
    const tx = await inputBox.addInput(DAPP_ADDRESS, inputBytes);
    return await waitForTransaction(tx, toast);
};

export const waitForTransaction = async (tx, toast) => {
    toast({
        title: "Transaction sent",
        description: "waiting for confirmation",
        status: "success",
        duration: 9000,
        isClosable: true,
        position: "top-left"
    });
    const receipt = await tx.wait(1);
    let event = receipt.events?.find((e) => e.event === "InputAdded");
    toast({
        title: "confirmed",
        description: ``,
        status: "success",
        duration: 9000,
        isClosable: true,
        position: "top-left"
    });

    return receipt;
};


export const inspect = async (payload) => {
    try {
        const url = `${DEFAULT_URL}/${encodeURIComponent(JSON.stringify(payload))}`;
        const response = await fetch(url);

        if (response.ok) {
            const result = await response.json();
            console.log(result);
            return result.report;
        } else {
            console.error(`Failed to fetch data. Status: ${response.status}`);
            // Handle other status codes if needed
            return null;
        }
    } catch (error) {
        console.error("An error occurred:", error);
        return null;
    }
};

export const hex2str = (hex) => {
    try {
        return ethers.toUtf8String(hex);
    } catch (e) {
        return hex;
    }
};

export const NONCE_KEY = "nonce";
export const MOVE_KEY = "move";
export const DAPP_ADDRESS = "0x70ac08179605AF2D9e75782b8DEcDD3c22aA4D0C";
export const DEFAULT_URL = "http://localhost:5005/inspect";
export const INPUTBOX_ADDRESS = "0x59b22D57D4f067708AB0c00552767405926dc768";