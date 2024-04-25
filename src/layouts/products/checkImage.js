export const checkImage = (url) => {
    const PAT = '4903f4bb71024fbda98dbf7f0195c924';
    const USER_ID = 'clarifai';
    const APP_ID = 'main';
    const MODEL_ID = 'general-image-recognition';
    const MODEL_VERSION_ID = 'aa7f35c01e0642fda5cf400f543e7c40';

    const IMAGE_URL = url;

    const raw = JSON.stringify({
        "user_app_id": {
            "user_id": USER_ID,
            "app_id": APP_ID
        },
        "inputs": [
            {
                "data": {
                    "image": {
                        "url": IMAGE_URL
                    }
                }
            }
        ]
    });

    const requestOptions = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Key ' + PAT
        },
        body: raw
    };

    fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/versions/" + MODEL_VERSION_ID + "/outputs", requestOptions)
        .then(response => response.text())
        .then(result => {
            const data = JSON.parse(result).outputs[0].data.concepts.map(item => { return { name: item.name, value: item.value } })
            console.log(data);
        })
        .catch(error => console.log('error', error));
}

