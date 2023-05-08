import { rest } from "msw";

const baseURL = "https://challenge-apimk3.herokuapp.com/";

export const handlers = [
  rest.get(`${baseURL}dj-rest-auth/user/`, (req, res, ctx) => {
    return res(
      ctx.json({
        pk: 4,
        username: "Harrold",
        email: "",
        first_name: "",
        last_name: "",
        profile_id: 4,
        profile_image:
          "https://res.cloudinary.com/dv6ln64zb/image/upload/v1/media/images/download_mmpslf",
      })
    );
  }),
  rest.post(`${baseURL}dj-rest-auth/logout/`, (req, res, ctx) => {
    return res(ctx.status(200));
  }),
];
