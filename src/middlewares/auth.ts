import { Request, Response, NextFunction } from "express";
import { Token } from "../models";
import { AccessLevel } from "../types/enums";

const authRead = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  const authHeader: string | undefined = req.headers.authorization;
  const token: string | undefined = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const tokenRecord = await Token.findOne({ where: { token } });
    if (!tokenRecord) {
      return res.status(401).json({ message: "Invalid token" });
    }

    if (tokenRecord.used) {
      return res.status(403).json({ message: "Token already used" });
    }

    // Set token as used
    tokenRecord.used = true;
    await tokenRecord.save();
    next();
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const authReadWrite = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader: string | undefined = req.headers.authorization;
  const token: string | undefined = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const tokenRecord = await Token.findOne({ where: { token } });
    if (!tokenRecord) {
      return res.status(401).json({ message: "Invalid token" });
    }

    if (tokenRecord.used) {
      return res.status(403).json({ message: "Token already used" });
    }

    if (tokenRecord.access_level === AccessLevel.READ_WRITE) {
      // Set token as used
      tokenRecord.used = true;
      await tokenRecord.save();
      next();
    } else {
      res.status(403).json({ message: "Insufficient access level" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export { authRead, authReadWrite };
