import jwt from "jsonwebtoken";

const authUser = (req, res, next) => {
  try {
    const { token } = req.headers;
    if (!token) {
      return res.status(401).json({ success: false, message: "Not authorized, login again" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;  

    next();
  } catch (error) {
    console.error("Auth User Error:", error);
    res.status(401).json({ success: false, message: error.message });
  }
};

export default authUser;
