const express = require('express');
const router = express.Router();

const houseController = require('./house.controller');
const { verifyJwtToken } = require('../../middleware/jwt');

router.post('/createHouse', verifyJwtToken, houseController.createHouse);

router.get('/invitation_link', verifyJwtToken, houseController.getInvite);

router.post('/create-channel', verifyJwtToken, houseController.createChannel);

router.get('/get-all-channel', verifyJwtToken, houseController.getAlChannel)

router.post('/create-chat', verifyJwtToken, houseController.createChat)

router.post('/get-all-chat-based-on-channel-id', verifyJwtToken, houseController.getChannelChat)

// router.post('/invite/:token',houseController.addMember);

// router.delete('/delete',houseController.deleteMember);

module.exports = router;
