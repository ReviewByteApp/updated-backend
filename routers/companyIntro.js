const asyncMiddleware = require("../middleware/async");
const express = require("express");
const bcrypt = require("bcrypt");

const CompanyIntro = require("../models/CompanyIntro");

const multer = require("multer");
const path = require("path");
const fs = require("fs");
const router = express.Router();

const upload = multer({ dest: "uploads/" });
router.use(express.json());

router.use("/uploads", express.static(path.join(__dirname, "../uploads")));

/**
 * @api {get} /companyIntro get company intro
 * @apiName GetompanyIntro
 * @apiGroup CompanyIntro

 * @apiSuccess {Object[]} adminIntro adminIntroObject
* @apiSuccess {String} adminIntro.image  image of the company.
 * @apiSuccess {String} adminIntro.video  video of the company.
 * @apiSuccess {ObjectId} adminIntro.adminId admin ID associated with the admin.


 */

router.get(
  "/",
  asyncMiddleware(async (req, res) => {
    const companyIntro = await CompanyIntro.find({});

    res.status(200).send(companyIntro);
  })
);

/**
 * @api {post} /companyIntro create company intro
 * @apiName CreateCompanyIntro
 * @apiGroup CompanyIntro

 * @apiSuccess {Object[]} companyIntro companyIntroObject
* @apiSuccess {String} companyIntro.image  image of the company.
 * @apiSuccess {String} companyIntro.video  video of the company.
 * @apiSuccess {ObjectId} companyIntro.adminId admin ID associated with the admin.


 */

router.post(
  "/",
  upload.fields([{ name: "image" }, { name: "video" }]),
  asyncMiddleware(async (req, res) => {
    const { adminId } = req.body;
    let image;
    let video;

    if (req.files && req.files.images) {
      req.files.images.forEach((file) => {
        const { originalname, path } = file;
        const parts = originalname.split(".");
        const ext = parts[parts.length - 1];
        const newPath = path + "." + ext;
        fs.renameSync(path, newPath);
        image = newPath;
      });
    }

    // Handle video file upload
    if (req.files && req.files.video) {
      const { originalname, path } = req.files.video[0];
      const parts = originalname.split(".");
      const ext = parts[parts.length - 1];
      const newPath = path + "." + ext;
      fs.renameSync(path, newPath);
      video = newPath;
    }

    const companyIntro = new CompanyIntro({
      adminId,
      image,
      video,
    });

    await companyIntro.save();

    res.status(200).send(companyIntro);
  })
);

/**
 * @api {put} /companyIntro/:id update company introd
 * @apiName UpdateCompanyIntro
 * @apiGroup CompanyIntro
*
* @apiParam {objectId} id companyIntro unique ID.
*
 * @apiSuccess {Object[]} companyIntro companyIntroObject
* @apiSuccess {String} companyIntro.image  image of the company.
 * @apiSuccess {String} companyIntro.video  video of the company.


 */

router.put(
  "/:id",
  upload.fields([{ name: "image" }, { name: "video" }]),
  asyncMiddleware(async (req, res) => {
    const { id } = req.params;

    let image;
    let video;

    if (req.files && req.files.images) {
      req.files.images.forEach((file) => {
        const { originalname, path } = file;
        const parts = originalname.split(".");
        const ext = parts[parts.length - 1];
        const newPath = path + "." + ext;
        fs.renameSync(path, newPath);
        image = newPath;
      });
    }

    // Handle video file upload
    if (req.files && req.files.video) {
      const { originalname, path } = req.files.video[0];
      const parts = originalname.split(".");
      const ext = parts[parts.length - 1];
      const newPath = path + "." + ext;
      fs.renameSync(path, newPath);
      video = newPath;
    }

    const companyIntro = await CompanyIntro.findByIdAndUpdate(
      id,
      {
        image,
        video,
      },
      { new: true }
    );

    if (!companyIntro)
      return res.status(404).send("companyIntro not found with this id");

    res.status(200).send(companyIntro);
  })
);

module.exports = router;
