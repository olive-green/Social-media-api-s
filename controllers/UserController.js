import User from "../models/UserModel.js";


//Get a single User Controller
export const getUser = async (req, res) => {
    const { user } = req;

  const currentUser = await User.findOne({ _id: user.id });
  return res.status(200).json({
    error: false,
    message: "User Exist.",
    payload: {
      username: currentUser.username,
      followers: currentUser.followers.length,
      following: currentUser.following.length,
    },
  });
}






// Follow a user Controller
export const followUser = async (req, res) => {
    const { id: followId } = req.params;
  const { user } = req;
  const followerProfile = await User.findOne({ _id: user.id });
  if (followerProfile.id === followId) {
    return res.status(400).json({
      error: true,
      message: "You can not follow yourself.",
    });
  }
  let followingProfile;
  try {
    followingProfile = await User.findOne({ _id: followId });
  } catch (error) {
    return res.status(400).json({
      error: true,
      message: "The profile you requested to follow is not available.",
    });
  }

  // check if already follower
  if (
    followerProfile.following.includes(followingProfile._id) ||
    followingProfile.followers.includes(followerProfile._id)
  ) {
    const { following } = await User.findOne({ _id: followerProfile._id });

    return res.status(400).json({
      error: true,
      message: "Already following this user.",
      payload: {
        following,
      },
    });
  }
  // update follower in followId  profile (followId)
  await User.findByIdAndUpdate(
    { _id: followingProfile._id },
    {
      $addToSet: {
        followers: followerProfile._id,
      },
    },
    { new: true }
  );
  // update following in current profile (id)
  await User.findByIdAndUpdate(
    { _id: followerProfile._id },
    {
      $addToSet: {
        following: followingProfile._id,
      },
    },
    { new: true }
  );
  const { following } = await User.findOne({ _id: followerProfile._id });

  return res.status(200).json({
    error: false,
    message: "following",
    payload: {
      following,
    },
  });
}


// Unfollow a user Controller
export const unFollowUser = async (req, res) => {
    const { id } = req.params;
  const { user } = req;
  const followerProfile = await User.findOne({ _id: user.id });
  let followingProfile;

  try {
    followingProfile = await User.findOne({ _id: id });
  } catch (error) {
    return res.status(400).json({
      error: true,
      message: "The profile you requested to unfollow is not available.",
    });
  }

  // check if already follower
  if (
    !followerProfile.following.includes(followingProfile._id) ||
    !followingProfile.followers.includes(followerProfile._id)
  ) {
    const { following } = await User.findOne({ _id: followerProfile._id });

    return res.status(400).json({
      error: true,
      message: "you are not following this user.",
      payload: {
        following,
      },
    });
  }
  // update follower in followId  profile (followId)
  await User.findByIdAndUpdate(
    { _id: followingProfile._id },
    {
      $pull: {
        followers: followerProfile._id,
      },
    },
    { new: true }
  );
  // update following in current profile (id)
  await User.findByIdAndUpdate(
    { _id: followerProfile._id },
    {
      $pull: {
        following: followingProfile._id,
      },
    },
    { new: true }
  );
  const { following } = await User.findOne({ _id: followerProfile._id });

  return res.status(200).json({
    error: false,
    message: "unfollow user.",
    payload: {
      following,
    },
  });
}





