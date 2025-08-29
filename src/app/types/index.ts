export type DecodedJWT = {
  header: object;
  payload: object;
  signature?: string;
};
