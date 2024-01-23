const asyncMiddleware = require("../middleware/async");
const express = require("express");

const Admin = require("../models/Admin");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const router = express.Router();

const upload = multer({ dest: "uploads/" });
router.use(express.json());

router.use("/uploads", express.static(path.join(__dirname, "../uploads")));

/**
 * @api {put} /admin/adminInfo/:id update admin info
 * @apiName UpdateAdminInfo
 * @apiGroup Admin
 *
 *@apiParam {objectId} id admin unique ID.
 * @apiBody {String} adminInfo.name  name of the admin.
 * @apiBody {String} adminInfo.website  website of the cadmin.
 * @apiBody {String} adminInfo.logo logo of the cadmin.
 * @apiSuccess {String} message admin information updated successfully
 * */

router.put(
  "/:id",
  upload.single("logo"),

  asyncMiddleware(async (req, res) => {
    const { id } = req.params;
    const { name, website } = req.body;

    let logo;
    if (req.file) {
      const { originalname, path } = req.file;
      const parts = originalname.split(".");
      const ext = parts[parts.length - 1];
      const newPath = path + "." + ext;
      fs.renameSync(path, newPath);
      logo = newPath;
    }

    let admin = await Admin.findByIdAndUpdate(
      id,
      { name, website, logo },
      { new: true }
    );

    if (!admin) return res.status(404).send("Admin not found with this id");

    res.status(200).send(admin);
  })
);

module.exports = router;
