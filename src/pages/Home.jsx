import React from "react";
import PostSide from "../components/PostSide/PostSide";
import ProfileSide from "../components/profileSide/ProfileSide";
import RightSide from "../components/RightSide/RightSide";
import "./Home.css";
const Home = () => {
  return (
    <div className="Home">
      <div className="profile_side">
      <ProfileSide/>
      </div>
      <div className="post_side">
      <PostSide />
      </div>
      <div className="right_side">
      <RightSide />
      </div>
    </div>
  );
};

export default Home;
