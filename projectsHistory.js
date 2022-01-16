const db = require('./db')
const lib = require('./lib')

const projectHistory = module.exports = {

    handle: function(env) {
       let projectHistory = {};

       
       const validate = function(projectHistory) {
        let result = { 
            menager: db.ObjectId(projectHistory.menager),
            name: projectHistory.name,
            oldId: db.ObjectId(projectHistory.oldId)
            }
        return result.menager ? result : null
    }
   
    if (env.req.method == "POST" || env.req.method == "PUT") {
        projectHistory = validate(env.payload)
                if(!projectHistory) {
                    lib.sendError(env.res, 400, 'invalid payload')
                    return
                }
        }


       const sendAllHistoryProject = function (q = "") {
        db.projectsHistory
        .aggregate(
            [{
                $lookup: {
                    from: "users",
                    localField: "menager",
                    foreignField: "_id",
                    as: "menagerData",
                }
            }, {
                $unwind: {
                    path: "$menagerData"
                }
            }]
        )
        .toArray(function (err, projectsHistory) {
          if (!err) {
            lib.sendJson(env.res, projectsHistory);
          } else {
            lib.sendError(env.res, 400, "projects failed " + err);
          }
        });
      };

      const sendManagerHistoryProject = function(idMenager){
        db.projectsHistory
        .aggregate(
            [{
                $lookup: {
                    from: "users",
                    localField: "menager",
                    foreignField: "_id",
                    as: "menagerData",
                }
            }, {
                $unwind: {
                    path: "$menagerData"
                }
            },{
                $match: {
                    menager : idMenager
                }
            },{
                $project: {
                    menagerData: {
                        "login": 0,
                        "password": 0,
                        "roles": 0
                    }}
            }
        ])
        .toArray(function (err, projectsHistory) {
          if (!err) {
            lib.sendJson(env.res, projectsHistory);
          } else {
            lib.sendError(env.res, 400, "projectsHistory failed " + err);
          }
        });

    };
             
        switch(env.req.method) {
        case "GET":
            let rola = lib.sessions[env.session].roles;
            let id = lib.sessions[env.session].id;

            if(rola == "user"){
                 sendManagerHistoryProject(id);
            }
            else if(rola == "admin") {
                sendAllHistoryProject();
            }
          
        break;
            case 'POST':
                db.projectsHistory.insertOne(projectHistory, function(err, result) {
                    if(!err) {
                        lib.sendJson(env.res,projectHistory)
                    } else {
                        lib.sendError(env.res, 400, 'projectHistory.insertOne() failed')
                    }
                })
                break;
            default:
                lib.sendError(env.res, 405, 'method not implemented')
        }
    }
}