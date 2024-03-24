import "./App.css";
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import HandShakeForm from "./createTransmit";


function App() {
    const [signer, setSigner] = useState(null);
    const [provider, setProvider] = useState(null);

    useEffect(() => {
        async function initializeEthers() {
            if (window.ethereum == null) {
                // If MetaMask is not installed, use the default provider
                console.log("MetaMask not installed; using read-only defaults")
                setProvider(ethers.getDefaultProvider());
            } else {
                try {
                    // Connect to MetaMask EIP-1193 object
                    const browserProvider = new ethers.BrowserProvider(window.ethereum);
                    setProvider(browserProvider);

                    // Request access to write operations
                    const signer = await browserProvider.getSigner();
                    setSigner(signer);

                    console.log(signer.getAddress())
                } catch (error) {
                    console.error("Error connecting to MetaMask:", error);
                    alert('Connection to MetaMask failed');
                }
            }
        }

        initializeEthers();
    }, []);

    return (
        <div className="App">
            <HandShakeForm signer={signer} provider={provider} />
        </div>
    );
}

export default App;
