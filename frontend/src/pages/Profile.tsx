import { useState, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import assets from "../assets/assets";
import { useAuth } from "../context/Auth/useAuth";

const Profile = () => {
  interface ProfileData {
    fullName: string;
    bio: string;
    profilePic: File | null | string;
  }

  const { authUser, updateProfile } = useAuth();

  const [profileData, setProfileData] = useState<ProfileData>({
    fullName: authUser?.fullName || "",
    bio: authUser?.bio || "",
    profilePic: authUser?.profileImage || null,
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
        profilePic: file,
      }));
    } else {
      setProfileData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      typeof profileData?.profilePic === "string" ||
      !profileData?.profilePic
    ) {
      await updateProfile({
        fullName: profileData.fullName,
        bio: profileData.bio,
      });
      navigate("/");
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(profileData.profilePic);
    reader.onload = async () => {
      const base64String = reader.result as string;
      await updateProfile({
        fullName: profileData.fullName,
        bio: profileData.bio,
        profilePic: base64String,
      });
    };
  };

  return (
    <div className="min-h-screen bg-center bg-no-repeat flex items-center justify-center">
      <div className="w-5/6 max-w-2xl backdrop-blur-2xl text-gray-300 border-2 border-gray-600 flex items-center justify-between max-sm:flex-col-reverse rounded-lg">
        <form
          onSubmit={onSubmitHandler}
          className="flex flex-col gap-5 p-10 flex-1"
        >
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
                profileData.profilePic
                  ? typeof profileData.profilePic === "string"
                    ? profileData.profilePic
                    : URL.createObjectURL(profileData.profilePic)
                  : assets.avatar_icon
              }
              alt=""
              className={`w-12 h-12 ${
                profileData?.profilePic && "rounded-full"
              }`}
            />
            upload profile image
          </label>
          <input
            type="text"
            name="name"
            required
            placeholder="You name"
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
            value={profileData.fullName}
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
        <img
          src={
            typeof authUser?.profileImage === "string"
              ? authUser.profileImage
              : assets.logo_icon
          }
          alt=""
          className={`max-w-44 aspect-square rounded-full mx-10 max-sm:mt-10 ${
            profileData.profilePic && "rounded-full"
          }`}
        />
      </div>
    </div>
  );
};

export default Profile;
