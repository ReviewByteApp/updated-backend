const asyncMiddleware = require("../middleware/async");
const express = require("express");

const Admin = require("../models/Admin");

const router = express.Router();
router.use(express.json());

/**
 * @api {get} /admin/adminContact get company contact
 * @apiName GetAdminContact
 * @apiGroup Admin

 * @apiSuccess {Object[]} adminContact adminContactObject
 * @apiSuccess {String} adminContact.phoneNumber  phoneNumber of the company.
 *@apiSuccess {String} adminContact.city  city of the company.
  * @apiSuccess {String} adminContact.country country of the company.
  * @apiSuccess {String} adminContact.map  map of the company.



 */

router.get(
  "/adminContact",
  asyncMiddleware(async (req, res) => {
    const adminContact = await Admin.find({});

    res.status(200).send(adminContact);
  })
);

/**
* @api {put} /admin/adminContact/:id update company contact
 * @apiName UpdateAdminContact
 * @apiGroup Admin
 * 
 * @apiParam {objectId} id admin unique Id


 * @apiBody {String} adminContact.phoneNumber  phoneNumber of the company.

  * @apiBody {String} adminContact.map  map of the company.
  * @apiBody {String} adminContact.country country of the company.
  * @apiBody {String} adminContact.city city of the company.
  * 
  * @apiSuccess {String} message admin contact updated successfully

 */

router.put(
  "/:id",

  asyncMiddleware(async (req, res) => {
    const { phoneNumber, map, city, country } = req.body;
    const { id } = req.params;

    let adminContact = await Admin.findByIdAndUpdate(
      id,
      { phoneNumber, map, city, country },
      {
        new: true,
      }
    );

    if (!adminContact)
      return res.status(404).send("Company not found with this id");

    res.status(200).send(adminContact);
  })
);

module.exports = router;
