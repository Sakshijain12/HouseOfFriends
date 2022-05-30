const express = require('express');
const router = express.Router();

const houseController = require('./house.controller');
const { verifyJwtToken } = require('../../middleware/jwt');

router.post('/createHouse', verifyJwtToken, houseController.createHouse);

router.get('/invitation_link', houseController.getInvite);

// router.post('/invite/:token',houseController.addMember);

// router.delete('/delete',houseController.deleteMember);

module.exports = router;