const db = require("./db");
const lib = require("./lib");

const menager = (module.exports = {
  handle: function (env) {
    const validate = function (menager) {
      let result = {
        firstName: menager.firstName,
        lastName: menager.lastName,
      };
      return result.firstName && result.lastName
        ? result
        : null;
    };

    let _id, menager;
    let q = env.urlParsed.query.q ? env.urlParsed.query.q : "";
    let skip = env.urlParsed.query.skip
      ? parseInt(env.urlParsed.query.skip)
      : 0;
    skip = isNaN(skip) || skip < 0 ? 0 : skip;
    let limit = env.urlParsed.query.limit
      ? parseInt(env.urlParsed.query.limit)
      : 0;
    limit = isNaN(limit) || limit <= 0 ? 999999 : limit;

    const sendAllMenagers = function (q = "") {
      db.users.find({}).toArray(function (err, menagers) {
          if (!err) {
            lib.sendJson(env.res, menagers);
          } else {
            lib.sendError(env.res, 400, "menagers.aggregate() failed " + err);
          }
        });
    };

    const sendThisMenager = function (idMenager) {
      db.users.find(idMenager).toArray(function (err, menagers) {
          if (!err) {
            lib.sendJson(env.res, menagers);
          } else {
            lib.sendError(env.res, 400, "menagers.aggregate() failed " + err);
          }
        });
    };



    switch (env.req.method) {
      case "GET":
        let rola = lib.sessions[env.session].roles;
        let id = lib.sessions[env.session].id; 
        _id = db.ObjectId(env.urlParsed.query._id);
        if (_id) {
          db.users.findOne({ _id }, function (err, result) {
            lib.sendJson(env.res, result);
          });
        } else 
        {
          if(rola == "user"){
            sendThisMenager(id);
           }
           else{
             sendAllMenagers(q);
           }
        }
        break;
      default:
        lib.sendError(env.res, 405, "method not implemented");
    }
  },
});
