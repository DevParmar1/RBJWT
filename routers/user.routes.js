const express = require("express");
const router = express.Router();

const { auth } = require("../middleware");
const controller = require("../controllers/user.controller");


  router.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  router.get("/api/test/all", controller.allAccess);

  router.get(
    "/api/test/user",
    [auth.verifyToken],
    controller.userBoard
  );

  router.get(
    "/api/test/mod",
    [auth.verifyToken, auth.isModerator],
    controller.moderatorBoard
  );

  router.get(
    "/api/test/admin",
    [auth.verifyToken, auth.isAdmin],
    controller.adminBoard
  );


  module.exports = router;