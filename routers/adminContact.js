const asyncMiddleware = require("../middleware/async");
const express = require("express");
const AdminContact = require("../models/AdminContact");

const router = express.Router();
router.use(express.json());

/**
 * @api {get} /adminContact get company conatct
 * @apiName GetAdminContact
 * @apiGroup adminContact

 * @apiSuccess {Object[]} adminContact adminContactObject
 * @apiSuccess {String} adminContact.phoneNumber  phoneNumber of the company.

  * @apiSuccess {String} adminContact.map  map of the company.
 * @apiSuccess {ObjectId} adminContact.adminId admin ID associated with the admin.


 */

router.get(
  "/",
  asyncMiddleware(async (req, res) => {
    const adminContact = await AdminContact.find({});

    res.status(200).send(adminContact);
  })
);

/**
 * @api {post} /adminContact create company conatct
 * @apiName CreateAdminContact
 * @apiGroup adminContact

 * @apiSuccess {Object[]} adminContact adminContactObject
 * @apiSuccess {String} adminContact.phoneNumber  phoneNumber of the company.

  * @apiSuccess {String} adminContact.map  map of the company.
 * @apiSuccess {ObjectId} adminContact.adminId admin ID associated with the admin.


 */

router.post(
  "/",
  asyncMiddleware(async (req, res) => {
    const { phoneNumber, map, adminId } = req.body;

    const adminContact = new AdminContact({
      phoneNumber,

      map,
      adminId,
    });
    await adminContact.save();

    res.status(200).send(adminContact);
  })
);

/**
 * @api {put} /adminContact update company contact
 * @apiName UpdateAdminContact
 * @apiGroup adminContact

 * @apiSuccess {Object[]} adminContact adminContactObject
 * @apiSuccess {String} adminContact.phoneNumber  phoneNumber of the company.

  * @apiSuccess {String} adminContact.map  map of the company.



 */

router.put(
  "/:id",

  asyncMiddleware(async (req, res) => {
    const { phoneNumber, map } = req.body;
    const { id } = req.params;

    let adminContact = await AdminContact.findByIdAndUpdate(
      id,
      { phoneNumber, map },
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
