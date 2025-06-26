import { useState, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import assets from "../assets/assets";

const Profile = () => {
  interface ProfileData {
    name: string;
    bio: string;
    image: File | null;
  }

  const [profileData, setProfileData] = useState<ProfileData>({
    name: "Martin Johnson",
    bio: "Hi Everyone, I am using QuickChat",
    image: null,
  });

  const navigate = useNavigate();

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, files, type } = e.target as HTMLInputElement;

    if (type === "file" && files && files[0]) {
      const file = files[0];

      setProfileData((prev: ProfileData) => ({
        ...prev,
        image: file,
      }));
    } else {
      setProfileData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

   const onSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
   navigate('/')
  };

  return (
    <div className="min-h-screen bg-center bg-no-repeat flex items-center justify-center">
      <div className="w-5/6 max-w-2xl backdrop-blur-2xl text-gray-300 border-2 border-gray-600 flex items-center justify-between max-sm:flex-col-reverse rounded-lg">
        <form onSubmit={onSubmitHandler} className="flex flex-col gap-5 p-10 flex-1">
          <h3 className="text-lg">Profile details</h3>
          <label
            htmlFor="avatar"
            className="flex items-center gap-3 cursor-pointer"
          >
            <input
              onChange={handleChange}
              type="file"
              id="avatar"
              accept=".png, .jpg, .jpeg"
              hidden
            />
            <img
              src={
                profileData?.image
                  ? URL.createObjectURL(profileData?.image)
                  : assets.avatar_icon
              }
              alt=""
              className={`w-12 h-12 ${profileData?.image && "rounded-full"}`}
            />
            upload profile image
          </label>
          <input
            type="text"
            name="name"
            required
            placeholder="You name"
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
            value={profileData.name}
            onChange={handleChange}
          />
          <textarea
            name="bio"
            placeholder="Write profile bio"
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
            rows={4}
            value={profileData?.bio}
            onChange={handleChange}
          ></textarea>
          <button
            type="submit"
            className="bg-gradient-to-r from-purple-400 to-violet-600 text-white p-2 rounded-full text-lg cursor-pointer"
          >
            Save
          </button>
        </form>
          <img src={assets.logo_icon} alt="" className="max-w-44 aspect-square rounded-full mx-10 max-sm:mt-10" />
      </div>
    </div>
  );
};

export default Profile;
