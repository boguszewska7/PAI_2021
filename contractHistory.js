const db = require('./db')
const lib = require('./lib')

const contractHistory = module.exports = {

    handle: function(env) {
       let contractData = {};

        const sendAllContractsHistory = function (_idProject) {
            db.contracts
            .aggregate(
                [{
                    $lookup: {
                        from: "contractors",
                        localField: "contractor",
                        foreignField: "_id",
                        as: "contractorData",
                    }
                }, {
                    $unwind: {
                        path: "$contractorData"
                    }
                },{
                  $lookup: {
                      from: "projectsHistory",
                      localField: "project",
                      foreignField: "oldId",
                      as: "projectData",
                  }
              }, {
                  $unwind: {
                      path: "$projectData"
                  }
              },{
                $project: {
                    projectData: {
                        "when": 0,
                        "_id": 0
                }
            }},
            {
                $match: {
                "projectData.oldId" : _idProject
                }
            }
              ])
            .toArray(function (err, contracts) {
              if (!err) {
                lib.sendJson(env.res, contracts);
              } else {
                lib.sendError(env.res, 400, "contracts failed " + err);
              }
            });
          };

        const sendManagerContractsHistory = function(idMenager, _idProject){
            db.contracts
            .aggregate(
                [{
                    $lookup: {
                        from: "contractors",
                        localField: "contractor",
                        foreignField: "_id",
                        as: "contractorData",
                    }
                }, {
                    $unwind: {
                        path: "$contractorData"
                    }
                },{
                    $lookup: {
                        from: "projectsHistory",
                        localField: "project",
                        foreignField: "oldId",
                        as: "projectData",
                    }
              }, {
                  $unwind: {
                      path: "$projectData"
                  }
              },{
                $project: {
                    contractorData: {
                        "_id":0 
                    }
                }
            },{
                $project: {
                    projectData: {
                        "when": 0,
                        "_id": 0
                    },
                    
                }
            },{
                $match: {
                    "projectData.menager" : idMenager
                }
            },
            {
                $match: {
                    "projectData.oldId" : _idProject
                }
            }
              ]
            )
            .toArray(function (err, contracts) {
              if (!err) {
                lib.sendJson(env.res, contracts);
              } else {
                lib.sendError(env.res, 400, "contracts failed " + err);
              }
            });
          };
             
        switch(env.req.method) {
        case "GET":
            let rolaaa = lib.sessions[env.session].roles;
            let iddd = lib.sessions[env.session].id;
            _idProject = db.ObjectId(env.urlParsed.query._id);

            if(rolaaa == "user"){
                sendManagerContractsHistory(iddd, _idProject);
            }
            else if(rolaaa == "admin") {
                sendAllContractsHistory(_idProject);
            }
          
        break;
            default:
                lib.sendError(env.res, 405, 'method not implemented')
        }
    }
}