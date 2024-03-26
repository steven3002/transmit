import React, { useState } from 'react';
import { sendInput, inspect } from "./util"; // Import sendInput and inspect functions from util
import { Button, useToast, Heading, Input, FormControl, FormLabel, FormHelperText } from "@chakra-ui/react";
import { ethers } from "ethers";

const BackendDebugger = ({ signer }) => {
    const toast = useToast();
    const [method, setMethod] = useState('');
    const [payload, setPayload] = useState('');
    const [advanceDisplay, setAdvanceDisplay] = useState('');
    const [inspectDisplay, setInspectDisplay] = useState('');

    async function fetchData(event) {
        event.preventDefault();
        try {
            await handShake();
        } catch (error) {
            console.error("Error fetching data:", error);
            toast({
                title: "Error",
                description: "Failed to fetch data. Please try again later.",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    }

    async function handShake() {
        try {
            const signerAddress = await signer.getAddress();
            console.log("Signer address:", signerAddress);

            await sendInput(
                JSON.stringify({
                    method: method,
                    transmit: payload,
                }),
                signer,
                toast
            );
        } catch (error) {
            console.error("Error in handShake:", error);
            toast({
                title: "Error",
                description: "Failed to fetch data. Please try again later.",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    }

    return (
        <div className="container mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Method</label>
                <input
                    type="text"
                    className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="GET / POST / PUT / DELETE"
                    value={method}
                    onChange={(e) => setMethod(e.target.value)}
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Payload</label>
                <textarea
                    className="resize-none border rounded w-full h-32 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Enter payload..."
                    value={payload}
                    onChange={(e) => setPayload(e.target.value)}
                />
            </div>
            <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={fetchData}
            >
                Fetch Data
            </button>
            <div className="mt-6">
                <h2 className="text-lg font-bold mb-2">Advance Display</h2>
                <pre className="overflow-auto bg-white rounded-lg p-4 border border-gray-300">{advanceDisplay}</pre>
            </div>
            <div className="mt-6">
                <h2 className="text-lg font-bold mb-2">Inspect Display</h2>
                <pre className="overflow-auto bg-white rounded-lg p-4 border border-gray-300">{inspectDisplay}</pre>
            </div>
        </div>
    );
};

export default BackendDebugger;
