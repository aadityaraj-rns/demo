const axios = require("axios");
const { SMS_AUTH_KEY, SMS_AUTH_TOKEN, SMS_SENDERID } = require("../config");

const sendSMS = async (mobileNumber, message) => {
  try {
    const authKey = SMS_AUTH_KEY;
    const authToken = SMS_AUTH_TOKEN;

    const authHeader =
      "Basic " + Buffer.from(`${authKey}:${authToken}`).toString("base64");

    const senderId = SMS_SENDERID;
    const apiUrl = `https://restapi.smscountry.com/v0.1/Accounts/${authKey}/SMSes/`;

    const jsonPayload = {
      Text: message,
      Number: mobileNumber,
      SenderId: senderId,
      DRNotifyUrl: "https://www.domainname.com/notifyurl",
      DRNotifyHttpMethod: "POST",
      Tool: "API",
    };

    const response = await axios.post(apiUrl, jsonPayload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
    });

    if (response.data && response.status === 200) {
      console.log("SMS sent successfully!");
    } else {
      console.error("Failed to send SMS:", response.data);
    }
  } catch (error) {
    console.error(
      "Error while sending SMS:",
      error.response ? error.response.data : error.message
    );
  }
};

module.exports = sendSMS;
