/* eslint-disable react/prop-types */

import { FiGithub } from "react-icons/fi";
import { FiInstagram } from "react-icons/fi";
import { FiFacebook } from "react-icons/fi";
// eslint-disable-next-line react/prop-types
export function LinkIcon({ link, icon }) {
  return <div onClick={() => window.open(link, "_blank")}>{icon}</div>;
}
// eslint-disable-next-line react/prop-types
function ProfileCard({ imgURL, user }) {
  return (
    <div className="bg-white rounded-md p-8 flex flex-col gap-4 justify-center items-center">
      <img src={imgURL} alt="" className="w-44 h-44 rounded-full " />
      <div className="font-semibold text-neutral-800 text-center">
        {user.name}
      </div>
      <hr className="h-3 w-40"></hr>
      <div className="flex justify-around text-neutral-400 gap-4">
        {user.github && (
          <LinkIcon link={user.github} icon={<FiGithub />}></LinkIcon>
        )}
        {user.instagram && (
          <LinkIcon link={user.instagram} icon={<FiInstagram />}></LinkIcon>
        )}
        {user.socialLink && (
          <LinkIcon link={user.socialLink} icon={<FiFacebook />}></LinkIcon>
        )}
      </div>
    </div>
  );
}

export default ProfileCard;
