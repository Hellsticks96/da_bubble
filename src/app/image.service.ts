
import { Injectable } from "@angular/core";
import { getStorage, ref, uploadBytes } from "firebase/storage";

@Injectable({
    providedIn: "root"
})
export class ImageService {
    storageBucket = "gs://dabubble-2a68b.appspot.com";
    storage = getStorage();
    imageRef = ref(this.storage, "image.jpg");
    directoryRef = ref(this.storage, "images/image.jpg");

    log(){
        console.log(this.storage)
    }
}