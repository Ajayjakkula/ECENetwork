import { Router } from "express";
import { getUserandProfile, login, register, updateUserProfile, uploadProfilePicture,sendConnectionRequest,acceptConnections,getMyConnectionRequests,whatAreMyConnections } from "../controllers/user.controller.js";
import multer from "multer";
import { get } from "mongoose";

const router=Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads");  
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname); 
    }
});

const upload = multer({ storage: storage });

router.route("/update_profile_picture")
      .post(upload.single("profile_picture"),uploadProfilePicture);



router.route("/register").post(register);

router.route("/login").post(login);

router.route("/user_update").post(updateUserProfile);

router.route("/get_user_and_profile").get(getUserandProfile);

router.route("/user/send_connection_request").post(sendConnectionRequest);
router.route("/user/getConnectionRequests").get(getMyConnectionRequests);
router.route("/user/user_connection_request").get(whatAreMyConnections);
router.route("/user/accept_connection_request").post(acceptConnections);






export default router;