import React, { useState } from "react";
import { Button, useToast, Heading, Input, FormControl, FormLabel, FormHelperText } from "@chakra-ui/react";
import { sendInput, inspect } from "./util"; // Import sendInput and inspect functions from util
import {ethers , getAddress} from "ethers";

function HandShakeForm({ signer }) {
    const toast = useToast();
    const [formData, setFormData] = useState({
        adminWallet: signer ? signer.getAddress() : '',
        userLocation: '',
        adminLocation: '',
        qrKeyId: '',
        userWallet: '',
        package: '',
        packageNature: ''

    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    async function handleSubmit(event) {
        event.preventDefault();
        try {
            await handShake(); // Call handShake function
        } catch (error) {
            console.error("Error submitting form:", error);
            // Handle error - display toast message or other UI feedback
            toast({
                title: "Error",
                description: "Failed to submit form. Please try again later.",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    }

    async function handShake() {
        try {
            // Ensure signer has getAddress method before calling it
            if (typeof signer.getAddress !== 'function') {
                throw new Error("Signer object does not have getAddress method");
            }

            const signerAddress = await signer.getAddress(); // Retrieve signer's address
            console.log("Signer address:", signerAddress);

            await sendInput(
                JSON.stringify({
                    method: "log_transmit",
                    transmit: formData,
                }),
                signer,
                toast
            )
            await sendInput(
                JSON.stringify({
                    method: "edit_package_status",
                    transmit: {
                        "key_id" : 0,
                        "Qr_confirmation":"36tt754y237y583uy8"


                    },
                }),
                signer,
                toast
            )

            let results = await inspect({ method: "get_challenges" });
            console.log(results);
            // Handle success - display toast message or other UI feedback
            toast({
                title: "Success",
                description: "Form submitted successfully.",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
        } catch (error) {
            console.error("Error creating challenge:", error);
            // Handle error - display toast message or other UI feedback
            toast({
                title: "Error",
                description: "Failed to create challenge. Please try again later.",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    }

    return  (
        <div>
            <Heading as="h2" size="lg">HandShake Form</Heading>
            <form onSubmit={handleSubmit}>
                <FormControl id="userLocation" mb={4}>
                    <FormLabel>User Location</FormLabel>
                    <Input type="text" name="userLocation" value={formData.userLocation} onChange={handleChange} />
                </FormControl>
                <FormControl id="adminLocation" mb={4}>
                    <FormLabel>Admin Location</FormLabel>
                    <Input type="text" name="adminLocation" value={formData.adminLocation} onChange={handleChange} />
                </FormControl>
                <FormControl id="qrKeyId" mb={4}>
                    <FormLabel>QR Key ID</FormLabel>
                    <Input type="text" name="qrKeyId" value={formData.qrKeyId} onChange={handleChange} />
                </FormControl>
                <FormControl id="userWallet" mb={4}>
                    <FormLabel>User Wallet Address</FormLabel>
                    <Input type="text" name="userWallet" value={formData.userWallet} onChange={handleChange} />
                </FormControl>
                <FormControl id="package" mb={4}>
                    <FormLabel>Package</FormLabel>
                    <Input type="text" name="package" value={formData.package} onChange={handleChange} />
                </FormControl>
                <FormControl id="packageNature" mb={4}>
                    <FormLabel>Package Nature</FormLabel>
                    <Input type="text" name="packageNature" value={formData.packageNature} onChange={handleChange} />
                </FormControl>
                <Button type="submit" colorScheme="blue">Submit</Button>
            </form>
        </div>
    );

}

export default HandShakeForm;
