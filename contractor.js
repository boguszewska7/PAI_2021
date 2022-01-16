const db = require("./db");
const lib = require("./lib");

const contractor = (module.exports = {
  handle: function (env) {
    const validate = function (contractor) {
      let result = {
        firstName: contractor.firstName,
        lastName: contractor.lastName,
      };
      return result.firstName && result.lastName
        ? result
        : null;
    };

    let _id, contractor;
    let q = env.urlParsed.query.q ? env.urlParsed.query.q : "";
    let skip = env.urlParsed.query.skip
      ? parseInt(env.urlParsed.query.skip)
      : 0;
    skip = isNaN(skip) || skip < 0 ? 0 : skip;
    let limit = env.urlParsed.query.limit
      ? parseInt(env.urlParsed.query.limit)
      : 0;
    limit = isNaN(limit) || limit <= 0 ? 999999 : limit;

    const sendAllContractors = function (q = "") {
      db.contractors.find({}).toArray(function (err, contractors) {
          if (!err) {
            lib.sendJson(env.res, contractors);
          } else {
            lib.sendError(env.res, 400, "contractors.aggregate() failed " + err);
          }
        });
    };

    if (env.req.method == "POST" || env.req.method == "PUT") {
        contractor = validate(env.payload);
      if (!contractor) {
        lib.sendError(env.res, 400, "invalid payload");
        return;
      }
    }

    switch (env.req.method) {
      case "GET":
        _id = db.ObjectId(env.urlParsed.query._id);
        if (_id) {
          db.contractors.findOne({ _id }, function (err, result) {
            lib.sendJson(env.res, result);
          });
        } else {
          sendAllContractors(q);
        }
        break;
      case "POST":
        db.contractors.insertOne(contractor, function (err, result) {
          if (!err) {
            sendAllContractors(q);
          } else {
            lib.sendError(env.res, 400, "contractors.insertOne() failed");
          }
        });
        break;
      case "DELETE":
        _id = db.ObjectId(env.urlParsed.query._id);
        if (_id) {
          db.contractors.findOneAndDelete({ _id }, function (err, result) {
            if (!err) {
              sendAllContractors(q);
            } else {
              lib.sendError(env.res, 400, "contractors.findOneAndDelete() failed");
            }
          });
        } else {
          lib.sendError(
            env.res,
            400,
            "broken _id for delete " + env.urlParsed.query._id
          );
        }
        break;
      case "PUT":
        _id = db.ObjectId(env.payload._id);
        if (_id) {
          db.contractors.findOneAndUpdate(
            { _id },
            { $set: contractor },
            { returnOriginal: false },
            function (err, result) {
              if (!err) {
                sendAllContractors(q);
              } else {
                lib.sendError(
                  env.res,
                  400,
                  "contractors.findOneAndUpdate() failed"
                );
              }
            }
          );
        } else {
          lib.sendError(
            env.res,
            400,
            "broken _id for update " + env.urlParsed.query._id
          );
        }
        break;
      default:
        lib.sendError(env.res, 405, "method not implemented");
    }
  },
});
