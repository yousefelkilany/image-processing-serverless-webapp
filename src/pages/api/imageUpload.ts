const API_ENDPOINT = 'https://2y5mxadw47.execute-api.us-east-1.amazonaws.com/v1/upload-image';

export const prerender = false; // Not needed in 'server' mode
import type { APIRoute } from "astro";

const mockUploadImage = async (_image: any) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
        object_key: "856c9053-ece5-4d85-a97f-e7de78d80732-gpt2_124M_loss.png",
        error: "mock error",
        message: "mock message"
    };
}

export const POST: APIRoute = async ({ request }) => {
    const data = await request.formData();
    const image = data.get("image");

    // Validate image - you'll probably want to do more than this
    if (!image) return new Response(
        JSON.stringify({
            message: "Missing required fields",
        }),
        { status: 400 }
    );

    // Do something with the data, then return a success response
    // const imageURLReponse = await mockUploadImage(image);
    const imageURLReponse = await uploadImage(image);
    if (!imageURLReponse?.object_key)
        return new Response(
            JSON.stringify({
                message: imageURLReponse?.error ?? imageURLReponse?.message,
            }),
            { status: 400 }
        );


    return new Response(
        JSON.stringify({
            ...imageURLReponse,
            message: "Success!"
        }),
        { status: 200 }
    );
};

async function uploadImage(image: any) {
    // 1. Get the pre-signed URL from our API
    const APIresponse = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            filename: image.name,
        })
    });

    const response = await APIresponse.json();
    console.log("response = ", JSON.stringify(response));
    console.log(response);
    if (!response || response.error || !response?.url)
        return response;

    // 2. Upload the image directly to S3 using the pre-signed data
    const formData = new FormData();
    // Append all the fields from the pre-signed post response
    Object.keys(response.fields).forEach(key =>
        formData.append(key, response.fields[key])
    );
    // The image MUST be the last field appended
    formData.append('file', image);
    const APIuploadResponse = await fetch(response.url, {
        method: 'POST',
        body: formData,
    });
    const uploadResponse = await APIuploadResponse.text();
    return {
        object_key: response.fields.key
    }
}
