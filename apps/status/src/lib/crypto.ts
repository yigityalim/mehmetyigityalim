import { createId } from "@paralleldrive/cuid2";

export const createChiper = async () => {
    const id = createId();
    return id;
}