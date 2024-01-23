const asyncMiddleware = require("../middleware/async");
const express = require("express");
const bcrypt = require("bcrypt");

const Admin = require("../models/Admin");

const router = express.Router();

router.use(express.json());

/**
 * @api {get} /admin Request Admin information
 * @apiName GetAdmin
 * @apiGroup Admin
 * @apiSuccess {Object[]} admin fetch all admin attribute

 */

router.get(
  "/",
  asyncMiddleware(async (req, res) => {
    const admins = await Admin.find({});
    // .select("-password")
    res.status(200).send(admins);
  })
);

/**
 * @api {post} /admin create new admin
 * @apiName CreateAdmin
 * @apiGroup Admin
 *
 *@apiBody {String} name name of the admin
 *@apiBody {String} password password of the admin
 *@apiBody {String} email email of the admin
 *@apiBody {String} category category of the admin
 *@apiBody {String} country country of the admin
 *@apiBody {String} city city of the admin
 *@apiBody {String} subCategory subCategory of the admin
 *
 * @apiSuccess {String} message successfully admin created.
 */

router.post(
  "/",

  asyncMiddleware(async (req, res) => {
    const {
      name,
      password,
      email,
      category,
      country,
      city,

      subCategory,
    } = req.body;

    let admin = await Admin.findOne({ email });
    if (admin) return res.status(400).send("Email already exist");
    const hashedPassword = await bcrypt.hash(password, 10);
    admin = new Admin({
      password: hashedPassword,
      name,
      email,
      category,
      country,
      city,

      subCategory,
    });

    await admin.save();

    // admin = await Admin.findById(admin._id);

    res.status(200).send("Admin successfully created!");
  })
);

/**
 * @api {put} /admin/security/:id update admin passwords
 * @apiName UpdatePassword
 * @apiGroup Admin
 *
 *@apiParam {objectId} id admin unique ID.
 *@apiBody {String} password password of the admin
 * @apiBody {String} email email of the admin
 * @apiSuccess {String} admin the admin password & email updated
 */

router.put(
  "/security/:id",
  asyncMiddleware(async (req, res) => {
    const { id } = req.params;
    const { password, email } = req.body;

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin && existingAdmin._id.toString() !== id) {
      return res.status(400).send("Email already exists for another Admin");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let admin = await Admin.findByIdAndUpdate(
      id,
      {
        password: hashedPassword,
        email,
      },
      { new: true }
    );

    if (!admin) return res.status(404).send("Admin not found with this id");

    res.status(200).send(admin);
  })
);

/**
 * @api {delete} /admin/:id Delete admin
 * @apiName DeleteAdmin
 * @apiGroup Admin
 *
 * @apiParam {objectId} id admin unique ID.
 *
 * @apiSuccess {Object[]} admin admin deleted successfully
 */

router.delete(
  "/:id",
  asyncMiddleware(async (req, res) => {
    const { id } = req.params;

    const admin = await Admin.findByIdAndDelete(id);
    if (!admin) return res.status(404).send("Admin not found with this id");

    res.status(200).send("Admin deleted successfully");
  })
);

module.exports = router;

// let profilePicture;
// let imagePaths = [];
// let videoPath;

// // Handle image file upload
// if (req.files && req.files.images) {
//   req.files.images.forEach((file) => {
//     const { originalname, path } = file;
//     const parts = originalname.split(".");
//     const ext = parts[parts.length - 1];
//     const newPath = path + "." + ext;
//     fs.renameSync(path, newPath);
//     imagePaths.push(newPath);
//   });
// }
