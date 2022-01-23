const db = require('./db')
const lib = require('./lib')

const contract = module.exports = {

    handle: function(env) {
       let contractData = {};

        const validate = function(contractData) {
            let result = { 
                contractor: db.ObjectId(contractData.contractor),
                project: db.ObjectId(contractData.project),
                dateB: contractData.dateB, 
                dateE: contractData.dateE,
                salary: contractData.salary, 
                finish: contractData.finish,
            }
            return result.contractor && result.dateB <= result.dateE && result.salary > 0 ? result : null
        }
       
        if (env.req.method == "POST" || env.req.method == "PUT") {
           contractData = validate(env.payload)
                    if(!contractData) {
                        lib.sendError(env.res, 400, 'invalid payload')
                        return
                    }
            }

        const sendAllContracts = function (q = "") {
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
                      from: "projects",
                      localField: "project",
                      foreignField: "_id",
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
              ])
            .toArray(function (err, contracts) {
              if (!err) {
                lib.sendJson(env.res, contracts);
              } else {
                lib.sendError(env.res, 400, "contracts failed " + err);
              }
            });
          };

        const sendManagerContracts = function(idMenager){
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
                      from: "projects",
                      localField: "project",
                      foreignField: "_id",
                      as: "projectData",
                  }
              }, {
                  $unwind: {
                      path: "$projectData"
                  }
              },{
                $project: {
                   /* projectData: {
                        "when": 0,
                        "_id": 0
                    },*/
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
            _id = db.ObjectId(env.urlParsed.query._id);
                  if (_id) {
                    db.contracts.findOne({ _id }, function (err, result) {
                    lib.sendJson(env.res, result);
                  });} 
            if(rolaaa == "user"){
                 sendManagerContracts(iddd);
            }
            else if(rolaaa == "admin") {
                 sendAllContracts();
            }
          
        break;
            case 'POST':
                db.contracts.insertOne(contractData, function(err, result) {
                    if(!err) {
                        lib.sendJson(env.res, contractData)
                    } else {
                        lib.sendError(env.res, 400, 'CONTRACT.insertOne() failed')
                    }
                })
                break;
       case "PUT":
            let rolaa = lib.sessions[env.session].roles;
            let idd = lib.sessions[env.session].id;
            _id = db.ObjectId(env.urlParsed.query._id)
              if (_id) {
                  db.contracts.findOneAndUpdate(
                  { _id },
                  { $set: contractData },
                  { returnOriginal: false },
                  function (err, result) {
                      if (!err){ 
                        if(rolaa == "user"){
                            sendManagerContracts(idd);
                       }
                       else if(rolaa == "admin") {
                            sendAllContracts();
                        }
                      } 
                      else {
                      lib.sendError(env.res,400,"contract.findOneAndUpdate() failed");
                      }});
                    } 
            else {lib.sendError(env.res, 400,"broken _id for update " + env.urlParsed.query._id);}
                  break;  
            default:
                lib.sendError(env.res, 405, 'method not implemented')
        }
    }
}