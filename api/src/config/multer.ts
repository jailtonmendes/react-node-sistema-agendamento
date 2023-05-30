import multer from "multer";

const upload = multer({
    storage: multer.memoryStorage(), //Colocar infors no buffer
    limits: {fileSize: 2 * 1024 * 1024}, //limitando tamanho da imagem para o upload: 2mega
});

export { upload }