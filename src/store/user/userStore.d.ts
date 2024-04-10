import { JwtPayload } from "jsonwebtoken";

export interface User {
  id: string;
  lastname: string;
  firstname: string;
  email: string;
  country: string;
  group: string;
  group_id: number;
  sendgrid_user: string;
  roles: string[];
  privileges: any;
  token: string;
  refresh_token: string;
}

export interface UserJwtPayload extends JwtPayload {
  user: User;
  exp: number;
}
