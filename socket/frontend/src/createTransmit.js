import React, { useState } from "react";
import { Button, useToast, Heading, Input, FormControl, FormLabel, FormHelperText } from "@chakra-ui/react";
import { sendInput, inspect } from "./util"; // Import sendInput and inspect functions from util


function HandShakeForm({ signer }) {
    const toast = useToast();
   const [formData, setFormData] = useState({
    payloadContent: '',
    adminWallet: '',
    userLocation: '',
    adminLocation: '',
    qrKeyId: '',
    userWallet: '',
    package: '',
    packageNature: '',
    meansOfTransportation: 'walking', // Default value for means of transportation
    checkpoints: [],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckpointChange = (index, field, value) => {
    const updatedCheckpoints = [...formData.checkpoints];
    updatedCheckpoints[index][field] = value;
    setFormData({ ...formData, checkpoints: updatedCheckpoints });
  };

  const handleAddCheckpoint = () => {
    setFormData({
      ...formData,
      checkpoints: [
        ...formData.checkpoints,
        { checkpointPosition: '', pointAddress: '', pointLocation: '' },
      ],
    });
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   // Process form data or pass it to a parent component for processing
  //   console.log(formData);
  // };
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

    return (
    <div className="payload-form-container">
      <h2>Enter Payload Information</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="payloadContent">Payload Content:</label><br />
        <textarea
          id="payloadContent"
          name="payloadContent"
          value={formData.payloadContent}
          onChange={handleInputChange}
          rows="4"
          cols="50"
        ></textarea><br />

        {/* Other input fields */}
        {/* Admin Wallet */}
        <label htmlFor="adminWallet">Admin Wallet:</label><br />
        <input
          type="text"
          id="adminWallet"
          name="adminWallet"
          value={formData.adminWallet}
          onChange={handleInputChange}
        /><br />

        {/* User Location */}
        <label htmlFor="userLocation">User Location:</label><br />
        <input
          type="text"
          id="userLocation"
          name="userLocation"
          value={formData.userLocation}
          onChange={handleInputChange}
        /><br />

        {/* Admin Location */}
        <label htmlFor="adminLocation">Admin Location:</label><br />
        <input
          type="text"
          id="adminLocation"
          name="adminLocation"
          value={formData.adminLocation}
          onChange={handleInputChange}
        /><br />

        {/* QR Key ID */}
        <label htmlFor="qrKeyId">QR Key ID:</label><br />
        <input
          type="text"
          id="qrKeyId"
          name="qrKeyId"
          value={formData.qrKeyId}
          onChange={handleInputChange}
        /><br />

        {/* User Wallet */}
        <label htmlFor="userWallet">User Wallet:</label><br />
        <input
          type="text"
          id="userWallet"
          name="userWallet"
          value={formData.userWallet}
          onChange={handleInputChange}
        /><br />

        {/* Package */}
        <label htmlFor="package">Package:</label><br />
        <input
          type="text"
          id="package"
          name="package"
          value={formData.package}
          onChange={handleInputChange}
        /><br />

        {/* Package Nature */}
        <label htmlFor="packageNature">Package Nature:</label><br />
        <input
          type="text"
          id="packageNature"
          name="packageNature"
          value={formData.packageNature}
          onChange={handleInputChange}
        /><br />

        {/* Means of Transportation */}
        <label htmlFor="meansOfTransportation">Means of Transportation:</label><br />
        <select
          id="meansOfTransportation"
          name="meansOfTransportation"
          value={formData.meansOfTransportation}
          onChange={handleInputChange}
        >
          <option value="walking">Walking</option>
          <option value="bicycle">Bicycle</option>
          <option value="car">Car</option>
          <option value="drone">Drone</option>
        </select><br />

        {/* Checkpoint Information (Optional) */}
        <h3>Checkpoint Information (Optional)</h3>
        <div id="checkpointContainer">
          {formData.checkpoints.map((checkpoint, index) => (
            <div key={index}>
              <label htmlFor={`checkpointPosition_${index}`}>Checkpoint Position:</label>
              <input
                type="number"
                id={`checkpointPosition_${index}`}
                name={`checkpointPosition_${index}`}
                value={checkpoint.checkpointPosition}
                onChange={(e) => handleCheckpointChange(index, 'checkpointPosition', e.target.value)}
                required
              /><br />
              <label htmlFor={`pointAddress_${index}`}>Point Address:</label>
              <input
                type="text"
                id={`pointAddress_${index}`}
                name={`pointAddress_${index}`}
                value={checkpoint.pointAddress}
                onChange={(e) => handleCheckpointChange(index, 'pointAddress', e.target.value)}
                required
              /><br />
              <label htmlFor={`pointLocation_${index}`}>Point Location:</label>
              <input
                type="text"
                id={`pointLocation_${index}`}
                name={`pointLocation_${index}`}
                value={checkpoint.pointLocation}
                onChange={(e) => handleCheckpointChange(index, 'pointLocation', e.target.value)}
                required
              /><br /><br />
            </div>
          ))}
        </div>
        <button type="button" onClick={handleAddCheckpoint}>Add Checkpoint</button><br /><br />

        <button type="submit">Submit</button>
      </form>
    </div>
  );

}

export default HandShakeForm;
