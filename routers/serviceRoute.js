const express = require('express')
const router = express.Router()

const authMiddleware = require('../middlewares/authMiddleware')

const serviceController =
require('../controllers/serviceController')

router.post(
  '/services',
  authMiddleware,
  serviceController.createService
)

router.get(
  '/services',
  authMiddleware,
  serviceController.getServices
)

router.get(
  '/services/:id',
  authMiddleware,
  serviceController.getService
)

router.put(
  '/services/:id',
  authMiddleware,
  serviceController.updateService
)

router.delete(
  '/services/:id',
  authMiddleware,
  serviceController.deleteService
)

module.exports = router