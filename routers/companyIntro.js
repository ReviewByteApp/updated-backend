const asyncMiddleware = require("../middleware/async");
const express = require("express");
const bcrypt = require("bcrypt");

const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Admin = require("../models/Admin");
const router = express.Router();

const upload = multer({ dest: "uploads/" });
router.use(express.json());

router.use("/uploads", express.static(path.join(__dirname, "../uploads")));

/**
 * @api {put} /companyIntro/:id update company introd
 * @apiName UpdateCompanyIntro
 * @apiGroup CompanyIntro
*
* @apiParam {objectId} id companyIntro unique ID.
*

* @apiBody {String} companyIntro.images  images of the company.
 * @apiBody {String} companyIntro.video  video of the company.
 * @apiSuccess {string} message company intro updated


 */

router.put(
  "/:id",
  upload.fields([{ name: "images" }, { name: "video" }]),
  asyncMiddleware(async (req, res) => {
    const { id } = req.params;

    let images = [];
    let video;

    // Handle image file upload
    if (req.files && req.files.images) {
      req.files.images.forEach((file) => {
        const { originalname, path } = file;
        const parts = originalname.split(".");
        const ext = parts[parts.length - 1];
        const newPath = path + "." + ext;
        fs.renameSync(path, newPath);
        images.push(newPath);
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

    const companyIntro = await Admin.findByIdAndUpdate(
      id,
      {
        images,
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
