const QRCode = require('qrcode');

const generateQRCode = async (assetId, city, plant, building) => {
    // const assetInfo = {
    //   id: assetId,
    //   location: location
    // };
  
    // const qrData = JSON.stringify(assetInfo);
    const qrData = `Asset ID: ${assetId}, Location: ${building}, ${plant}, ${city}`;
    try {
      const qrCodeUrl = await QRCode.toDataURL(qrData);
      return qrCodeUrl; // This can be stored in your database or used as needed
    } catch (err) {
      console.error('Error generating QR code', err);
    }
  };

module.exports = { generateQRCode };