import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";


const YandexDiskUploader: React.FC = () => {
    const [uploading, setUploading] = useState<boolean>(false);
    const [accessToken, setAccessToken] = useState<string | null>(null);

    const getUploadURL = async (accessToken: string, fileName: string) => {
        const UPLOAD_URL = "https://cloud-api.yandex.net/v1/disk/resources/upload/";

        try {
            const response = await axios.get(
                UPLOAD_URL,
                {
                    headers: {
                        Authorization: `OAuth ${accessToken}`,
                    },
                    params: {
                        path: `/${fileName}`,
                        overwrite: true,
                    },
                }
            );

            const uploadUrl = response.data.href;
            if (!uploadUrl) {
                console.error("Failed to get upload URL");
                throw new Error("Failed to get upload URL");
            }
            return uploadUrl;
        } catch (error: any) {
            console.error("Error getting upload URL:", error);
            throw new Error("Failed to get upload URL");
        }
    };

    const handleUpload = async (files: File[], token: string) => {
        try {
            setUploading(true);

            for (const file of files) {
                const uploadUrl = await getUploadURL(token, file.name);
                if (!uploadUrl) {
                    return;
                }

                const formData = new FormData();
                formData.append("file", file);

                await axios.put(uploadUrl, formData);
            }

            alert("Upload successful!");
        } catch (error) {
            console.error("Error uploading files:", error);
            alert("Upload failed!");
        } finally {
            setUploading(false);
        }
    };

    const onDrop = (acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0 && acceptedFiles.length <= 100) {
            if (accessToken) {
                handleUpload(acceptedFiles, accessToken);
            } else {
                alert("Access token not available. Please authenticate first.");
            }
        } else {
            alert("Please upload 1 to 100 files at a time.");
        }
    };

    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.hash.substring(1));
        const token = urlParams.get("access_token");
        if (token) {
            setAccessToken(token);
            window.history.pushState({}, document.title, window.location.pathname);
        }
    }, []);

    const redirectToYandexAuth = () => {
        window.location.href =
            "https://oauth.yandex.com/authorize?response_type=token&client_id=49e54117834a4a06836d04df9e1c0d23";
    };

    const dropzoneStyles: React.CSSProperties = {
        border: "2px dashed #cccccc",
        borderRadius: "4px",
        padding: "20px",
        textAlign: "center",
        cursor: "pointer",
    };

    return (
        <div>
            {!accessToken ? (
                <button onClick={redirectToYandexAuth}>Войдите с помощью Яндекса</button>
            ) : (
                <div>
                    <div {...getRootProps()} style={dropzoneStyles}>
                        <input {...getInputProps()} />
                        <p>Загрузите сюда ваши файлы (от 1 до 100 файлов)</p>
                    </div>
                    {uploading && <p>Загрузка...</p>}
                </div>
            )}
        </div>
    );
};

export default YandexDiskUploader;
