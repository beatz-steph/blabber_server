const express = require('express');
const router = express.Router({ mergeParams: true });

const {
	createNews,
	deleteNews,
	createDrugRequest,
	cancelDrugRequest,
	confirmDrugRequest,
	createEmergencyRequest,
	cancelEmergencyRequest,
	confirmEmergencyRequest,
	getAllPatients,
} = require('../helpers/doctor.handlers');

router.post('/news', createNews);
router.delete('/news/:newsId', deleteNews);

router.post('/drugrequest/:patientId', createDrugRequest);
router.post('/drugrequest/:drugId/confirm', confirmDrugRequest);
router.post('/drugrequest/:drugId/cancel', cancelDrugRequest);

router.post('/emergency/:patientId', createEmergencyRequest);
router.post('/emergency/:drugId/cancel', cancelEmergencyRequest);
router.post('/emergency/:drugId/confirm', confirmEmergencyRequest);

router.get('/patients', getAllPatients);

module.exports = router;
