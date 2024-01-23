const asyncMiddleware = require("../middleware/async");
const express = require("express");

const Admin = require("../models/Admin");

const router = express.Router();
router.use(express.json());

/**
* @api {put} /admin/adminDesc/:id create company Description
 * @apiName CreateAdminDecription
 * @apiGroup Admin
 * 
 * @apiParam {objectId} id admin unique Id


 * @apiBody {String} adminDesc.category  category of the company.

  * @apiBody {String} adminDesc.subCategory  subCategory of the company.
  * @apiBody {String} adminDesc.description description of the company.
  * @apiBody {String} adminDesc.services services of the company.
  * @apiSuccess {string} message the admin description updated successfully

 */

router.put(
  "/:id",
  asyncMiddleware(async (req, res) => {
    const { category, subCategory, description, services } = req.body;

    const { id } = req.params;

    let adminDesc = await Admin.findByIdAndUpdate(
      id,
      { category, subCategory, description, services },
      {
        new: true,
      }
    );

    if (!adminDesc)
      return res.status(404).send("Company not found with this id");

    res.status(200).send(adminDesc);
  })
);

module.exports = router;
