'use client';
import { userType } from '@/types/types';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';

function getUserData(): userType | null {
  const [user, setUser] = useState<userType | null>(null);
  useEffect(() => {
    const jwtToken = Cookies.get('token');
    const userId = Cookies.get('_id');
    axios
      .get<userType | null>(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            'Content-Type': 'application/json',
          },
        }
      )
      .then((response) => {
        if (response.status === 200) {
          setUser(response.data);
        }
      })
      .catch((error) => {
        toast.error(error.message);
      });
  }, []);
  return user;
}

const CoverUpload = () => {
  const userData: userType | null = getUserData();
  const [jwtToken, setJwtToken] = useState<string | undefined>(
    Cookies.get('token')
  );
  const [image, setImage] = useState<File | undefined | string>(
    userData?.banner
  );
  const [createObjectURL, setCreateObjectURL] = useState<string | undefined>(
    userData?.banner
  );

  const [isHovering, setIsHovering] = useState<boolean>(false);

  useEffect(() => {
    setJwtToken(Cookies.get('token'));
  }, []);

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
      body.append('file', image);
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/uploads/file`,
          body,
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        if (response.status === 200) {
          return;
        }
      } catch (error: any) {
        if (error.response.status === 400 || error.response.status === 500) {
          toast.error('invalid file type');
          setCreateObjectURL(undefined);
          console.clear();
        } else {
          toast.error(error.message);
          setCreateObjectURL(undefined);
          console.clear();
        }
      }
    }
  };

  const handleUploadToServer = () => {
    uploadInputRef.current?.click();
  };

  useEffect(() => {
    if (image) uploadToServer();
  }, [image]);

  const uploadInputRef = React.createRef<HTMLInputElement>();

  return (
    <section className="rounded-[20px]">
      <div
        className="relative flex flex-col justify-center items-center h-[333px]  w-full cursor-pointer 
          transition banner"
        onClick={handleUploadToServer}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {isHovering && (
          <div className="absolute bg-[#161F1E] bg-opacity-80 w-full h-full rounded-[20px] top-0 left-0 transition">
            <span
              className="h-full w-full text-[#D9D9D9] text-[1em] font-normal 
            flex justify-center mt-10 text-center "
            >
              Clicke to update your cover photo!
              <br />
              Image size should be less than 5MB.
              <br />
              Prefrred dimensions is 330x1200.
            </span>
          </div>
        )}
        {createObjectURL ? (
          <img
            src={createObjectURL}
            alt="Uploaded File"
            className="w-full h-full rounded-[20px] border-transparent"
          />
        ) : (
          userData?.banner && (
            <img
              src={userData?.banner}
              alt="Uploaded File"
              className="w-full h-full rounded-[20px] border-transparent"
            />
          )
        )}
        <input
          type="file"
          name="Image"
          onChange={uploadToClient}
          ref={uploadInputRef}
          style={{ display: 'none' }}
        />
      </div>
    </section>
  );
};

export default CoverUpload;
