
const uploadImageHandler = (uri, update, name) => {
  const timestamp = (Date.now() / 1000 || 0).toString();
  const apiKey = 792179287924717;
  const cloud = 'pratian-technologies';
  const uploadUrl = `https://api.cloudinary.com/v1_1/${cloud}/image/upload`;
  const uploadPreset = 'trtxfujm';
  const folder = `Zul-Profile-Image/${name}`;
  let array = {};
  const publicId = `${timestamp}`;
  // let api_secret = 'npOpvXMcKTse5XVqbUxMhA-8wko'
  // let hash_string = 'timestamp=' + timestamp + api_secret
  // let signature = ('timestamp=' + timestamp).toString();

  const xhr = new XMLHttpRequest();
  xhr.open('POST', uploadUrl);
  xhr.onload = async () => {
    array = JSON.parse(xhr._response);
    const imageDetails = {
      secure_url: array.secure_url,
      public_id: array.public_id,
      created_at: array.created_at
    };
    update(imageDetails);
  };
  const formdata = new FormData();
  formdata.append('file', { uri, type: 'image/png', name: 'upload.png' });
  formdata.append('timestamp', timestamp);
  formdata.append('api_key', apiKey);
  formdata.append('upload_preset', uploadPreset);
  formdata.append('folder', folder);
  formdata.append('public_id', publicId);
  // formdata.append('signature', signature);

  xhr.send(formdata);
};
export default uploadImageHandler;
