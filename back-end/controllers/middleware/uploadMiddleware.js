
import exp from "constants";
import multer from "multer";
import path from "path";


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folderName = "";
    if (req.body.E_ID) {
      folderName = "Users";
    } else if (req.body.C_ID) {
      folderName = "Customers";
    } else if (req.body.S_ID) {
      folderName = "Suppliers";
    } else if (req.body.P_ID) {
      folderName = "Products";
    }

    const destinationPath = path.join("../Frontend/public", folderName);
    cb(null, destinationPath);
  },
  filename: (req, file, cb) => {
    let photoname = "";
    if (req.body.E_ID) {
      photoname = req.body.E_ID;
    } else if (req.body.C_ID) {
      photoname = req.body.C_ID;
    } else if (req.body.S_ID) {
      photoname = req.body.S_ID;
    } else if (req.body.P_ID) {
      photoname = req.body.P_ID;
    }

    const ext = path.extname(file.originalname);
    cb(null, `${photoname}${ext}`);
  },
});

const upload = multer({ storage });

export default upload;