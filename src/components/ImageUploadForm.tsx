import type { FormEvent } from "react";

export default function ImageUploadForm(props: { t: any }) {
    const { t } = props;
    if (!t)
        return (<></>);

    async function submit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        console.log("received");
        const formData = new FormData(e.target as HTMLFormElement);
        const response = await fetch("/api/imageUpload", {
            method: "POST",
            body: formData,
        });
        const data = await response.json();
        console.log(data);
        // if (data.message) {
        //     setResponseMessage(data.message);
        // }
    }

    return (
        <form onSubmit={(e) => { e.preventDefault(); console.log("submitted"); console.log(e); submit(e); }} className="grid gap-4">
            <div>
                <label htmlFor="file"
                    className="flex items-center justify-center w-full h-32 border-2 border-dashed rounded-md cursor-pointer border-gray-300 bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                    <div className="text-center">
                        <svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            stroke="currentColor"
                            fill="none"
                            viewBox="0 0 48 48"
                            aria-hidden="true"
                        >
                            <path
                                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L40 32"
                            ></path>
                        </svg>
                        <p
                            id="imageUploadBtnLabel"
                            className="mt-1 text-sm text-gray-600"
                        >
                            {t("imageUpload.label")}
                        </p>
                        <p
                            id="imageUploadBtnAnotherLabel"
                            className="mt-1 text-sm text-gray-600 hidden"
                        >
                            {t("imageUpload.anotherLabel")}
                        </p>
                    </div>
                    <input
                        type="file"
                        accept=".jpg,.jpeg,.png"
                        // accept="image/*"
                        id="file"
                        name="image"
                        className="sr-only"
                        required
                    />
                </label>
            </div>

            <div
                id="imagePreviewContainer"
                className="hidden mt-4 flex flex-col items-center relative group overflow-hidden rounded-lg cursor-pointer"
            >
                <img
                    id="imagePreview"
                    src="#"
                    alt="Image Preview"
                    className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
                />
            </div>

            <div
                id="clearImageButton"
                className="hidden flex flex-col items-center"
            >
                <button
                    type="button"
                    className="mt-2 px-3 py-1 text-sm text-red-600 bg-red-100 rounded-md hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                >
                    {t("imageUpload.clearImageBtn")}
                </button>
            </div>
            <div
                id="submitButtonContainer"
                className="hidden group w-fit mx-auto"
            >
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                    {t("imageUpload.button")}
                </button>
            </div>


            <div id="pendingStatus" className="mt-4 text-sm">
                <div
                    id="pending"
                    className="hidden flex items-center justify-center"
                    style={{ fontSize: "1.25em" }}
                >
                    <svg
                        className="animate-spin h-5 w-5 text-blue-600 mr-3"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            stroke-width="4"></circle>
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l2-2.647z"
                        ></path>
                    </svg>
                    <span id="pending-msg"> Uploading image... </span>
                </div>

                <div
                    id="success"
                    className="hidden flex items-center justify-center text-green-600"
                    style={{ fontSize: "1.25em" }}
                >
                    <svg
                        className="h-5 w-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                    </svg>
                    Upload successful!
                </div>

                <div
                    id="error"
                    className="hidden flex items-center justify-center text-red-600"
                >
                    <svg
                        className="h-5 w-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                    </svg>
                    Upload failed.
                </div>

                <div
                    id="message"
                    className="hidden text-center text-sm text-gray-600"
                    style={{ fontSize: "1.25em" }}
                >
                </div>
            </div>
        </form>
    );
}