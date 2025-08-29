import { jwtDecode } from "jwt-decode";


export function decodeJWT(token: string) {
  try {
    const header: any = jwtDecode(token, { header: true });
    const payload: any = jwtDecode(token);

    let isValid = false;
    if (payload?.exp) {
      const now = Date.now() / 1000;
      isValid = payload.exp > now;
    }

    return { header, payload, isValid };
  } catch {
    return null;
  }
}
