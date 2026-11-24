const fetch = require('node-fetch');
const sharp = require('sharp');
const FormData = require('form-data');

async function blurAndGetURL(imageUrl,username, blurAmount = 20) {
  try {
    // 1. Download and process image
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    if (!arrayBuffer || arrayBuffer.byteLength === 0) {
      throw new Error("Fetched image is empty");
    }

    const buffer = await sharp(arrayBuffer)
      .blur(Number(blurAmount))
      .jpeg()
      .toBuffer();

    let signature, expire, token;
    if (process.env.BACKEND_URL) {
      const authResponse = await fetch(`${process.env.BACKEND_URL}/image-kit-auth`);
      const authData = await authResponse.json();
      signature = authData.signature;
      expire = authData.expire;
      token = authData.token;
    } else if (process.env.IMAGEKIT_PRIVATE_KEY) {
      const ImageKit = require('imagekit');
      const ik = new ImageKit({
        publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
        privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
        urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
      });
      const authData = ik.getAuthenticationParameters();
      signature = authData.signature;
      expire = authData.expire;
      token = authData.token;
    } else {
      throw new Error('ImageKit credentials not configured and BACKEND_URL not set');
    }

   // 3. Create FormData for ImageKit
    const formData = new FormData();
    formData.append('file', buffer, { filename: `${username}.jpg`, contentType: 'image/jpeg' });
    formData.append('fileName', `${username}.jpg`); // must have extension
    formData.append('publicKey', process.env.IMAGEKIT_PUBLIC_KEY);
    formData.append('signature', signature);
    formData.append('expire', expire);
    formData.append('token', token);
    formData.append('folder', '/blurred-profile-images');


    // 3. Upload to imagekit
    const uploadResponse = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
      method: 'POST',
      body: formData,
      headers: formData.getHeaders()
    });

      const result = await uploadResponse.json();

    if (!uploadResponse.ok) {
      throw new Error(result.message || 'Image upload failed');
    }

    return result.url;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

module.exports = { blurAndGetURL };