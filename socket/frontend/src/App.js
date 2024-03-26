import "./App.css";
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import HandShakeForm from "./createTransmit";
import Transmit from "./Transmit.js";
import {BrowserRouter , Route,  Routes} from "react-router-dom";
import BackendDebugger from "./de_bug";


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

      const Home = () => <div className="App">Home Page</div>;
  const TransmitForm = () => (
    <div className="App">
      <HandShakeForm signer={signer} provider={provider} />
    </div>
  );

    const Debug = () => (
    <div className="Test">
      <BackendDebugger signer={signer} provider={provider} />
    </div>
  );
    return (
        <>
            <BrowserRouter>


                <Routes>
                       <Route path="/" exact  element={<Home />} />
                <Route path="/form" element={<TransmitForm />} />
                <Route path="/transmit" element={<Transmit />} />
                    <Route path="/debug" element={<Debug/>}/>
                </Routes>
                </BrowserRouter>
        </>

    );
}

export default App;