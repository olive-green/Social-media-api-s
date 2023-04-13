import Post from "../models/PostModel.js";
import Comment from "../models/CommentModel.js";


export const getAllPosts = async (req, res) => {

    const { user } = req;
    try {
        const posts = await Post.find({
            createdBy: user.id,
        })
            .sort({ createdAt: -1 })
            .populate({
                path: "comments",
                populate: {
                    path: "createdBy",
                    select: ["username", "email"],
                },
                select: ["comment", "createdAt", "createdBy"],
            })
            .exec();
        return res.status(200).json({
            error: false,
            message: "Post found",
            posts,
        });
    } catch (error) {
        return res.status(404).json({
            error: true,
            message: "Post Not Available.",
        });
    }
}




// GetSinglePost Controller
export const getSinglePost = async (req, res) => {

    const { postId } = req.params;
    try {
        let post = await Post.findOne({ _id: postId })
            .populate({
                path: "comments",
                populate: {
                    path: "createdBy",
                    select: ["username", "email"],
                },
                select: ["comment", "createdAt", "createdBy"],
            })
            .populate({ path: "createdBy", select: ["username", "email"] })
            .exec();
        return res.status(200).json({
            error: false,
            message: "Post found",
            post,
        });
    } catch (error) {
        return res.status(404).json({
            error: true,
            message: "Post Not Found.",
        });
    }
}



// CreatePost Controller
export const createPost = async (req, res) => {
    const { user } = req;
    const { title, description } = req.body;

    if (!title || !description) {
        return res.status(404).json({
            error: true,
            message: "Required field can not be empty.",
        });
    }
    const payload = {
        title: title.trim(),
        description: description.trim(),
        createdBy: user.id,
    };

    try {
        const post = await (await Post.create(payload)).save();
        return res.status(200).json({
            error: false,
            message: "Post Created.",
            payload: {
                postId: post._id,
                title: post.title,
                description: post.description,
                createdAt: post.createdAt,
            },
        });
    } catch (error) {
        return res.status(404).json({
            error: true,
            message: "Something went wrong.",
        });
    }
}


//Delete Post Controller
export const deletePost = async (req, res) => {
    const { user } = req;
    const { id: postId } = req.params;
    const post = await Post.findById(postId);
    if (post && user.id.toString() === post.createdBy.toString()) {
      try {
        await Post.findByIdAndDelete(post._id);
        return res.status(200).json({
          error: false,
          message: "Post deleted",
        });
      } catch (error) {
        return res.status(404).json({
          error: true,
          message: "Something went wrong.",
        });
      }
    }
    return res.status(401).json({
      error: true,
      message: "You are not authorized to delete this post.",
    });
  }

// LikePost Controller
export const likePost = async (req, res) => {

    const { id: postId } = req.params;
    const { user } = req;

    try {
        await Post.findByIdAndUpdate(
            { _id: postId },
            {
                $addToSet: {
                    likes: user.id,
                },
            },
            { new: true }
        );
        res.status(200).json({
            error: false,
            message: "Message Liked.",
        });
    } catch (error) {
        console.log(error);
        res.status(404).json({
            error: true,
            message: "Something went wrong",
        });
    }
}



// UnlikePost Controller
export const unlikePost = async (req, res) => {
    const { id: postId } = req.params;
    const { user } = req;

    try {
        await Post.findByIdAndUpdate(
            { _id: postId },
            {
                $pull: {
                    likes: user.id,
                },
            },
            { new: true }
        );
        res.status(200).json({
            error: false,
            message: "Message Unliked.",
        });
    } catch (error) {
        console.log(error);
        res.status(404).json({
            error: true,
            message: "Something went wrong",
        });
    }
}


// CommentPost Controller
export const commentPost = async (req, res) => {
    const { id: postId } = req.params;
  const { user } = req;
  try {
    await Post.findOne({ _id: postId });
  } catch (error) {
    console.log(error.message);
    return res.status(404).json({
      error: true,
      message: "Post Not Found!",
    });
  }

  const { comment: commentBody } = req.body;
  const comment = commentBody.trim();
  if (!comment) {
    return res.status(404).json({
      error: true,
      message: "Comment body can not be empty.",
    });
  }

  try {
    // Save Comments
    const createComment = await (
      await Comment.create({
        comment: comment,
        parent: postId,
        createdBy: user.id,
      })
    ).save();
    // update comment on post
    const { comments } = await Post.findByIdAndUpdate(
      { _id: postId },
      {
        $addToSet: {
          comments: createComment._id,
        },
      },
      { new: true }
    );
    return res.status(200).json({
      error: false,
      message: "Commented on post",
      payload: {
        commentId: createComment._id,
        allComments: comments,
      },
    });
  } catch (error) {
    console.log(error.message);
    res.status(404).json({
      error: true,
      message: "Something went wrong!",
    });
  }
};
