import { verify } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

interface Ipayload {
  sub: string;
}

export function ensureAuthenticate(request: Request, response: Response, next: NextFunction) {

  const authToken = request.headers.authorization;

  if (!authToken) {
    return response.status(401).end();
  }

  const [, token] = authToken.split(" ")

  try {
    const { sub } = verify(token, "26ea83fd842c68ba5eed0a9e40d54f5f") as Ipayload;

    request.user_id = sub

    return next();
  } catch (err) {
    return response.status(401).end();
  }
}