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
 * @apiSuccess {Object[]} admin adminObject
 * @apiSuccess {String} admin.name  name of the admin.
 * @apiSuccess {String} admin.password  password of the admin.
 * @apiSuccess {String} admin.email  email of the admin.
 * @apiSuccess {ObjectId} admin.category Category ID associated with the Admin.
 * @apiSuccess {ObjectId} admin.subcategory Subcategory ID associated with the Admin.
 * @apiSuccess {Number} admin.reviewCount Number of reviews for the Admin.
 * @apiSuccess {Number} admin.reviewScore Review score for the Admin.
 * @apiSuccess {Date} admin.createdAt Timestamp when the Admin was created.
 * @apiSuccess {Date} admin.updatedAt Timestamp when the Admin was last updated (default is null for initial creation).
 * @apiSuccess {String} admin.video  video of the admin.
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
 *
 * @apiSuccess {Object[]} admin adminObject
 * @apiSuccess {String} admin.name  name of the admin.
 * @apiSuccess {String} admin.password  password of the admin.
 * @apiSuccess {String} admin.email  email of the admin.
 * @apiSuccess {String} admin.country  country of the admin.
 * @apiSuccess {String} admin.city  city of the admin.
 * @apiSuccess {ObjectId} admin.category Category ID associated with the Admin.
 * @apiSuccess {ObjectId} admin.subcategory Subcategory ID associated with the Admin.
 * @apiSuccess {Number} admin.reviewCount Number of reviews for the Admin.
 * @apiSuccess {Number} admin.reviewScore Review score for the Admin.
 * @apiSuccess {Date} admin.createdAt Timestamp when the Admin was created.
 * @apiSuccess {Date} admin.updatedAt Timestamp when the Admin was last updated (default is null for initial creation).

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

      reviewCount,
      reviewScore,
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

      reviewCount,
      reviewScore,
    });

    await admin.save();

    admin = await Admin.findById(admin._id);

    res.status(200).send(admin);
  })
);

/**
 * @api {put} /admin/:id update admin
 * @apiName UpdateAdmin
 * @apiGroup Admin
 *
 *@apiParam {objectId} id admin unique ID.
 *
 * @apiSuccess {Object[]} admin adminObject
 * @apiSuccess {String} admin.name  name of the admin.
 * @apiSuccess {String} admin.password  password of the admin.
 * @apiSuccess {String} admin.email  email of the admin.
 * @apiSuccess {String} admin.country  country of the admin.
 * @apiSuccess {String} admin.city  city of the admin.

 */

router.put(
  "/:id",

  asyncMiddleware(async (req, res) => {
    const { id } = req.params;
    const { name, category, country, city, subCategory } = req.body;

    let admin = await Admin.findByIdAndUpdate(
      id,
      { name, category, country, city, subCategory },
      { new: true }
    );

    if (!admin) return res.status(404).send("Admin not found with this id");

    res.status(200).send(admin);
  })
);

/**
 * @api {put} /admin/security/:id update admin passwords
 * @apiName UpdatePassword
 * @apiGroup Admin
 *
 *@apiParam {objectId} id admin unique ID.
 *
 * @apiSuccess {Object[]} admin adminObject
 * @apiSuccess {String} admin.password  password of the admin.
 * @apiSuccess {String} admin.email  email of the admin.
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
