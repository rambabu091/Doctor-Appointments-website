
import jwt from "jsonwebtoken";

const authDoctor = (req, res, next) => {
  try {
    const { dtoken } = req.headers;
    if (!dtoken) {
      return res.status(401).json({ success: false, message: "Not authorized, login again" });
    }

    const decoded = jwt.verify(dtoken, process.env.JWT_SECRET);
    req.docId = decoded.id;  

    next();
  } catch (error) {
    console.error("Auth User Error:", error);
    res.status(401).json({ success: false, message: error.message });
  }
};

export default authDoctor;