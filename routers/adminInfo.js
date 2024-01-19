const asyncMiddleware = require("../middleware/async");
const express = require("express");
const AdminInfo = require("../models/AdminInfo");
const Admin = require("../models/Admin");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const router = express.Router();

const upload = multer({ dest: "uploads/" });
router.use(express.json());

router.use("/uploads", express.static(path.join(__dirname, "../uploads")));

/**
 * @api {get} /adminInfo get adminInfo
 * @apiName GetAdminInfo
 * @apiGroup AdminInfo

 * @apiSuccess {Object[]} adminInfo adminInfoObject
* @apiSuccess {Array} adminInfo.services  services of the admin.
 * @apiSuccess {String} adminInfo.website  website of the admin.
  * @apiSuccess {String} adminInfo.description  description of the admin.
  *  @apiSuccess {String} adminInfo.website  website of the admin.
  *   @apiSuccess {String} adminInfo.logo  logo of the admin.
 * @apiSuccess {ObjectId} adminInfo.adminId admin ID associated with the admin.


 */

router.get(
  "/",
  asyncMiddleware(async (req, res) => {
    const adminInfo = await AdminInfo.find({});
    res.status(200).send(adminInfo);
  })
);

/**
 * @api {post} /adminInfo create adminInfO
 * @apiName CreateAdminInfo
 * @apiGroup AdminInfo

 * @apiSuccess {Object[]} adminInfo adminInfoObject
* @apiSuccess {Array} adminInfo.services  services of the admin.
 * @apiSuccess {String} adminInfo.website  website of the admin.
  * @apiSuccess {String} adminInfo.description  description of the admin.
  *  @apiSuccess {String} adminInfo.website  website of the admin.
  *   @apiSuccess {String} adminInfo.logo  logo of the admin.
 * @apiSuccess {ObjectId} adminInfo.adminId admin ID associated with the admin.


 */

router.post(
  "/",
  upload.single("logo"),
  asyncMiddleware(async (req, res) => {
    const { website, description, services, adminId } = req.body;

    const admin = await Admin.findOne({ _id: adminId });
    if (!admin) return res.status(404).send("Admin not found");

    let logo;
    if (req.file) {
      const { originalname, path } = req.file;
      const parts = originalname.split(".");
      const ext = parts[parts.length - 1];
      const newPath = path + "." + ext;
      fs.renameSync(path, newPath);
      logo = newPath;
    }

    const adminInfo = new AdminInfo({
      description,
      services,
      website,
      adminId,
      logo,
    });
    await adminInfo.save();

    res.status(200).send(adminInfo);
  })
);

/**
 * @api {put} /adminInfo/:id update admin info
 * @apiName UpdateAdminInfo
 * @apiGroup AdminInfo
 *
 *@apiParam {objectId} id adminInfo unique ID.
 * @apiSuccess {String} adminInfo.name  name of the admin.
 * @apiSuccess {String} adminInfo.website  website of the cadmin.
 * @apiSuccess {ObjectId} adminInfo.adminId admin ID associated with the admin.
 * */

router.put(
  "/:id",

  asyncMiddleware(async (req, res) => {
    const { id } = req.params;
    const { services, website, description } = req.body;

    let admin = await AdminInfo.findByIdAndUpdate(
      id,
      { services, website, description },
      { new: true }
    );

    if (!admin) return res.status(404).send("Admin not found with this id");

    res.status(200).send(admin);
  })
);

/**
 * @api {put} /adminInfo/logo/:id update admin logo
 * @apiName UpdateAdminLogo
 * @apiGroup AdminInfo
 *
 *@apiParam {objectId} id adminInfo unique ID.
 * @apiSuccess {String} adminInfo.logo  logo of the admin.

 * */

router.put(
  "/:id",
  upload.single("logo"),
  asyncMiddleware(async (req, res) => {
    const { id } = req.params;

    let logo;
    if (req.file) {
      const { originalname, path } = req.file;
      const parts = originalname.split(".");
      const ext = parts[parts.length - 1];
      const newPath = path + "." + ext;
      fs.renameSync(path, newPath);
      logo = newPath;
    }

    let admin = await AdminInfo.findByIdAndUpdate(id, { logo }, { new: true });

    if (!admin) return res.status(404).send("Admin not found with this id");

    res.status(200).send(admin);
  })
);

module.exports = router;
