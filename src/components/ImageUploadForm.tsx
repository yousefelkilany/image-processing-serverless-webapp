import { useState } from "react";
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
                className="hidden mt-4 flex flex-col items-center"
            >
                <img
                    id="imagePreview"
                    src="#"
                    alt="Image Preview"
                    className="max-w-full h-auto max-h-64 rounded-md shadow-md"
                />
                <button
                    type="button"
                    id="clearImageButton"
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
        </form>
    );
}