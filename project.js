const { ReadPreferenceMode } = require('mongodb');
const db = require('./db')
const lib = require('./lib')

const project = module.exports = {

    handle: function(env) {
       let projectData = {};

        const validate = function(projectData) {
            let result = { 
                menager: db.ObjectId(projectData.menager),
                name: projectData.name
                }
            return result.menager ? result : null
        }
       
        if (env.req.method == "POST" || env.req.method == "PUT") {
            projectData = validate(env.payload)
                    if(!projectData) {
                        lib.sendError(env.res, 400, 'invalid payload')
                        return
                    }
            }

        const sendAllProject = function (q = "") {
            db.projects
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
            .toArray(function (err, projects) {
              if (!err) {
                lib.sendJson(env.res, projects);
              } else {
                lib.sendError(env.res, 400, "projects failed " + err);
              }
            });
          };


        const sendManagerProject = function(idMenager){
            db.projects
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
            .toArray(function (err, projects) {
              if (!err) {
                lib.sendJson(env.res, projects);
              } else {
                lib.sendError(env.res, 400, "projects failed " + err);
              }
            });

        };
      
        projectData.when = Date.now()

        
        switch(env.req.method) {
        case "GET":
            let rola = lib.sessions[env.session].roles;
            let id = lib.sessions[env.session].id; 
            _id = db.ObjectId(env.urlParsed.query._id);
            if (_id) {
                db.projects.findOne({ _id }, function (err, result) {
                    lib.sendJson(env.res, result);
                });} 
            else{
                if(rola == "user"){
                 sendManagerProject(id);
                }
                else if(rola == "admin"){
                sendAllProject();}
            }
                   
        break;
            case 'POST':
                db.projects.insertOne(projectData, function(err, result) {
                    if(!err) {
                        lib.sendJson(env.res, projectData)
                    } else {
                        lib.sendError(env.res, 400, 'transactions.insertOne() failed')
                    }
                })
                break;
       case "PUT":
             _id = db.ObjectId(env.payload._id);
              if (_id) {
                  db.projects.findOneAndUpdate(
                  { _id },
                  { $set: projectData },
                  { returnOriginal: false },
                  function (err, result) {
                    if (!err){ 
                        sendAllProject();
                      } 
                      else {
                      lib.sendError(env.res,400,"projects.findOneAndUpdate() failed");
                      }});
                    } 
            else {lib.sendError(env.res, 400,"broken _id for update " + env.urlParsed.query._id);}
                  break;

       case "DELETE":
                    _id = db.ObjectId(env.urlParsed.query._id);
                    if (_id) {
                      db.projects.findOneAndDelete({ _id }, function (err, result) {
                        if (!err) {
                            sendAllProject();
                        } else {
                          lib.sendError(env.res, 400, "projects.findOneAndDelete() failed");
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
            default:
                lib.sendError(env.res, 405, 'method not implemented')
        }
    }
}