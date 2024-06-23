import { createThirdwebClient } from "thirdweb";
import environment from "./environment.mjs";

const secretKey = environment.THIRDWEB_SECRET_KEY;

export const thirdwebClient = createThirdwebClient({ secretKey });
