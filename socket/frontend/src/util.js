import {NONCE_KEY, MOVE_KEY, INPUTBOX_ADDRESS, DAPP_ADDRESS, DEFAULT_URL} from "./constant";
import {InputBox__factory} from "@cartesi/rollups"
import {ethers} from "ethers";



export async function generateHash(input){
    const encoder = new TextEncoder()
    const data = encoder.encode(input)
    const hashBuffer = await  crypto.subtle.digest("SHA-256", data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex= hashArray.map((b)=>b.toString(16).padStart(2, "0"))
    return hashHex.join('');
}

export const sendInput =async(value, signer, toast)=>{
    const inputBox = InputBox__factory.connect(INPUTBOX_ADDRESS, signer)
    const inputBytes = ethers.isBytesLike(value)

        ? value
        : ethers.toUtf8Bytes(value)
    const tx = await inputBox.addInput(DAPP_ADDRESS, inputBytes)
    return await waitForTransaction(tx, toast)
}

export const waitForTransaction = async (tx, toast)=>{
    toast({
        title:"Transaction sent",
        description: "waiting for confirmation",
        status: "success",
        duration: 9000,
        isClosable: true,
        position: "top-left",
    })
    const receipt = await tx.wait(1)
    let event = receipt.events?.find((e)=>e.event === "InputAdded")
        toast({
        title:"confirmed",
        description: ``,
        status: "success",
        duration: 9000,
        isClosable: true,
        position: "top-left",
    })

    return receipt
}


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
        console.error('An error occurred:', error);
        return null;
    }
}

export const hex2str = (hex) => {
    try {
        return ethers.toUtf8String(hex);
    } catch (e) {
        return hex;
    }
}
