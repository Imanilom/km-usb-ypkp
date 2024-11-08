import jwt from "jsonwebtoken";

export const auth = (roles = []) => {
    return (req, res, next) => {
        const token = req.cookies.access_token;
        if (!token) return res.status(401).json({ error: "Unauthorized" });

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;

            if (roles.length && !roles.includes(req.user.role)) {
                return res.status(403).json({ error: "Forbidden" });
            }

            next();
        } catch (error) {
            res.status(401).json({ error: "Token is not valid" });
        }
    };
};

export default auth

