// import db from "../db.js";
// import jwt from "jsonwebtoken"

// export const getPosts = (req, res) => {
//   const q = req.query.cat
//     ? `SELECT * FROM posts WHERE cat=$1`
//     : `SELECT * FROM posts`;

//     db.query(q, [req.query.cat], (err, data) => {
//         if (err) return res.status(500).send(err)
        
//         return res.status(200).json(data)
//     })
// };

// export const getPost = (req, res) => {
//   const q = `SELECT p.id, "username", "title", "desc", p.img, u.img AS userImg, "cat", "date" FROM users u JOIN posts p ON u.id = p.uid WHERE p.id = $1`

//   // note the id from router.get("/:id", getPost) (routes/posts.js)
//   db.query(q, [req.params.id], (err, data) => {
//     if (err) return res.status(500).json(err);
//     console.log(data);
//     return res.status(200).json(data[0])
//   })  
// };

// export const addPost = (req, res) => {
//   const token = req.cookies.access_token;
//   if (!token) return res.status(401).json("Not authenticated!");

//   jwt.verify(token, process.env.JWT_KEY, (err, userInfo) => {
//     if (err) return res.status(403).json("Token is not valid");

//     const q = `INSERT INTO posts("title", "desc", "img", "cat", "date", "uid") VALUES ($1, $2, $3, $4, $5, $6)`

//     const values = [
//       req.body.title,
//       req.body.desc,
//       req.body.img,
//       req.body.cat,
//       req.body.date,
//       userInfo.id
//     ]

//     db.query(q, values, (err, data) => {
//       if (err) return res.status(500).json(err)
//       return res.json("Post has been created.")
//     });
//   });
// };

// export const deletePost = (req, res) => {
//   const token = req.cookies.access_token
//   if(!token) return res.status(401).json("Not authenticated!")

//   // When we log in we send thisuser infomation({ id: data[0].id }) which is our user id
//   jwt.verify(token, process.env.JWT_KEY, (err, userInfo) => {
//     if(err) return res.status(403).json("Token is not valid!")

//     const postId = req.params.id;
//     const q = `DELETE FROM posts WHERE "id" = $1 AND "uid" = $2`
//     // userInfo.id = id: data[0].id
//     db.query(q, [postId, userInfo.id], (err, data) => {
//         if (err) return res.status(403).json("You can delete only your post!")

//         return res.json("Post has been deleted!")
//     })
//   })
// };

// export const updatePost = (req, res) => {
//   const token = req.cookies.access_token;
//   if (!token) return res.status(401).json("Not authenticated!");

//   jwt.verify(token, process.env.JWT_KEY, (err, userInfo) => {
//     if (err) return res.status(403).json("Token is not valid");

//     const postId = req.params.id;

//     const q = `UPDATE posts SET "title"=$1, "desc"=$2, "img"=$3, "cat"=$4 WHERE "id" = $5 AND "uid" = $6`

//     const values = [
//       req.body.title,
//       req.body.desc,
//       req.body.img,
//       req.body.cat
//     ]

//     db.query(q, [...values, postId, userInfo.id], (err, data) => {
//       if (err) return res.status(500).json(err)
//       return res.json("Post has been updated.")
//     })
//   })
// };
import db from "../db.js";
import jwt from "jsonwebtoken";

export const getPosts = async (req, res) => {
  try {
    const q = req.query.cat
      ? 'SELECT * FROM posts WHERE cat = $1'
      : 'SELECT * FROM posts';

    const data = await db.query(q, [req.query.cat]);

    return res.status(200).json(data.rows);
  } catch (error) {
    console.error("Error getting posts:", error);
    return res.status(500).json("Internal server error");
  }
};

export const getPost = async (req, res) => {
  try {
    const q = `SELECT p.id, "username", "title", "desc", p.img, u.img AS userImg, "cat", "date" FROM users u JOIN posts p ON u.id = p.uid WHERE p.id = $1`;
    const data = await db.query(q, [req.params.id]);

    if (data.rowCount === 0) {
      return res.status(404).json("Post not found!");
    }

    return res.status(200).json(data.rows[0]);
  } catch (error) {
    console.error("Error getting post:", error);
    return res.status(500).json("Internal server error");
  }
};

export const addPost = async (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");

  try {
    const userInfo = jwt.verify(token, process.env.JWT_KEY);

    const q = `INSERT INTO posts("title", "desc", "img", "cat", "date", "uid") VALUES ($1, $2, $3, $4, $5, $6)`;
    const values = [
      req.body.title,
      req.body.desc,
      req.body.img,
      req.body.cat,
      req.body.date,
      userInfo.id,
    ];

    await db.query(q, values);

    return res.json("Post has been created.");
  } catch (error) {
    console.error("Error adding post:", error);
    return res.status(500).json("Internal server error");
  }
};

export const deletePost = async (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");

  try {
    const userInfo = jwt.verify(token, process.env.JWT_KEY);

    const postId = req.params.id;
    const q = `DELETE FROM posts WHERE "id" = $1 AND "uid" = $2`;

    const result = await db.query(q, [postId, userInfo.id]);

    if (result.rowCount === 0) {
      return res.status(403).json("You can delete only your post!");
    }

    return res.json("Post has been deleted!");
  } catch (error) {
    console.error("Error deleting post:", error);
    return res.status(500).json("Internal server error");
  }
};

export const updatePost = async (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");

  try {
    const userInfo = jwt.verify(token, process.env.JWT_KEY);

    const postId = req.params.id;
    const q = `UPDATE posts SET "title"=$1, "desc"=$2, "img"=$3, "cat"=$4 WHERE "id" = $5 AND "uid" = $6`;

    const values = [
      req.body.title,
      req.body.desc,
      req.body.img,
      req.body.cat,
      postId,
      userInfo.id,
    ];

    await db.query(q, values);

    return res.json("Post has been updated.");
  } catch (error) {
    console.error("Error updating post:", error);
    return res.status(500).json("Internal server error");
  }
};
