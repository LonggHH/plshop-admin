import { storage } from "../../configs/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export const uploadImage = async (file) => {
    if (!file) return;

    const storageRef = ref(storage, `images/${file.name}`);
    try {
        const imageRef = await uploadBytes(storageRef, file, { metadata: { generateName: true, } });
        const url = await getDownloadURL(imageRef.ref);
        return url;
    } catch (error) {
        console.log("Lỗi upload file !!!");
        return null;
    }
}