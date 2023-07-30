"use client"
import React, { useState } from 'react';

const ImageUpload = () => {
  const [image, setImage] = useState<File | undefined>();
  const [createObjectURL, setCreateObjectURL] = useState<string | undefined>();

  const uploadToClient = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setImage(file);
      setCreateObjectURL(URL.createObjectURL(file));
    }
  };

  const uploadToServer = async () => {
    if (image) {
      const body = new FormData();
      body.append("file", image);
      const response = await fetch("/api/file", {
        method: "POST",
        body,
      });
    }
  };

  const handleDivClick = () => {
    uploadToServer();
    uploadInputRef.current?.click();
  };

  const uploadInputRef = React.createRef<HTMLInputElement>();

  return (
   <section className="rounded-md">
     <div
      className="relative flex flex-col justify-center items-center h-[333px]  w-full cursor-pointer 
          hover:opacity-70 hover:border-2 hover:border-dashed hover:rounded-lg transition banner"
      onClick={handleDivClick}
    >
      {createObjectURL && <img src={createObjectURL} alt="Uploaded File" className="w-full h-full rounded-lg border-transparent" />}
      <input
        type="file"
        name="Image"
        onChange={uploadToClient}
        ref={uploadInputRef}
        style={{ display: "none" }}
      />
    </div>
   </section>
  );
};

export default ImageUpload;
