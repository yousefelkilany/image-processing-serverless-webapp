const API_ENDPOINT = 'https://2y5mxadw47.execute-api.us-east-1.amazonaws.com/v1/upload-image';

export const prerender = false; // Not needed in 'server' mode
import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
    const data = await request.formData();

    const image = data.get("image");
    console.log(`data = ${JSON.stringify(data)}`)
    console.log(data);

    // Validate image - you'll probably want to do more than this
    if (!image) return new Response(
        JSON.stringify({
            message: "Missing required fields",
        }),
        { status: 400 }
    );

    // Do something with the data, then return a success response
    const imageURLReponse = await uploadImage(image);
    if (!imageURLReponse?.url) {
        // statusP.textContent = `Could not get upload URL: ${presignedData.error}`;
        return new Response(
            JSON.stringify({
                message: imageURLReponse?.error ?? imageURLReponse?.message,
            }),
            { status: 400 }
        );
    }


    return new Response(
        JSON.stringify({
            message: "Success!"
        }),
        { status: 200 }
    );
};

async function uploadImage(image: any) {
    // 1. Get the pre-signed URL from our API

    // statusP.textContent = 'fetching new upload URL...';
    const APIresponse = await fetch(API_ENDPOINT, {
        method: 'POST',
        // headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            filename: image.name,
            // width: 400, // Or get from user input
            // height: 400
        })
    });
    // console.log(`APIresponse = ${JSON.stringify(APIresponse)}`)
    // console.log(APIresponse)

    const response = await APIresponse.json();
    // console.log(`response = ${JSON.stringify(response)}`)
    // console.log(response)

    if (response.error)
        // statusP.textContent = `Could not get upload URL: ${response.error}`;
        return response;

    if (response.url) {
        // statusP.textContent = 'Uploading image...';

        // 2. Upload the image directly to S3 using the pre-signed data
        const formData = new FormData();
        // Append all the fields from the pre-signed post response
        Object.keys(response.fields).forEach(key => {
            formData.append(key, response.fields[key]);
        });
        // The image MUST be the last field appended
        formData.append('file', image);
        console.log(`formData = ${JSON.stringify(formData)}`)
        console.log(formData)

        console.log(`response.url = ${JSON.stringify(response.url)}`)
        console.log(response.url)
        
        const APIuploadResponse = await fetch(response.url, {
            method: 'POST',
            body: formData,
        });
        console.log(`APIuploadResponse = ${JSON.stringify(APIuploadResponse)}`)
        console.log(APIuploadResponse)

        const uploadResponse = await APIuploadResponse.text();
        console.log(`uploadResponse = ${JSON.stringify(uploadResponse)}`)
        console.log(uploadResponse)

        // if (uploadResponse.ok) {
        //     // statusP.textContent = 'Upload successful! Processing has been triggered.';
        // } else {
        //     // statusP.textContent = 'Upload failed.';
        // }
    } else {
        // statusP.textContent = `Could not get upload URL: ${presignedData.error}`;
    }
}
