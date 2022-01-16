app.controller('ProjectsCtrl', [ '$http', 'common',  function($http, common) {
    let ctrl = this

    ctrl.projectMake = {};

    ctrl.projectsHistory = [];
    ctrl.refreshData = function () {
        $http
        .get("/project")
          .then(
            function (res) {
              ctrl.projectsHistory = res.data;
            },
            function (err) {}
          );
    };

    ctrl.refreshData();


    //dodawanie projektów tylko dla admina
    ctrl.showAddButton = false;
    ctrl.session = [];
    ctrl.rola ="";
     
    ctrl.chceckRole = function (){

              $http.get('/auth').then(
                      function(res) {
                        ctrl.session = res.data
                        ctrl.rola = ctrl.session.roles
                        console.log(ctrl.rola)
                         if(ctrl.rola == 'user'){
                                ctrl.showAddButton = false;}
                         else if(ctrl.rola == 'admin'){
                                ctrl.showAddButton = true;}
                    },
                    function(err) {
                        console.log("problem get session")}
                    );       
     };

     ctrl.chceckRole();
    
    

    //nowy projekt
    ctrl.project = function() {
      Object.assign(
        ctrl.projectMake
      );
        let options = { 
            title: 'Dane projektu',
            ok: true,
            cancel: true,
            data: ctrl.projectMake
        }
        common.dialog('makeProject.html', 'MakeProjectCtrl', options, function(answer) {
            if(answer == 'ok') {
                $http.post('/project', ctrl.projectMake).then(
                    function(res) {
                        $http.get('/menager?_id=' + ctrl.projectMake.menager).then(
                            function(res) {
                                common.alert.show('Projekt założony kierowany przez ' + res.data.firstName + ' ' + res.data.lastName)
                                ctrl.refreshData();
                            },
                            function(err) {}
                        )
                    },
                    function(err) {
                        common.alert.show('Projekt nieudany', 'alert-danger')
                    }
                )
            }
        })
    },


    ctrl.getContracts = function(index){
        let options = { 
            title: 'Zawarte umowy',
            cancel: true,
            data: ctrl.projectsHistory[index],
            idProject: ctrl.projectsHistory[index]._id,
            history: false
        }
        common.dialog(
            "showContracts.html",
            "showContractsCtrl",
            options,
            function(){}
   )},


    ctrl.completeProject = function(index){
      const projectData = {
        oldId : ctrl.projectsHistory[index]._id,
        menager : ctrl.projectsHistory[index].menager,
        name: ctrl.projectsHistory[index].name,
      };

      ctrl.thisProject = projectData;

      
      let options = { 
        title: 'Czy na pewno chcesz zakończyć projekt?',
        ok: true,
        cancel: true,
        data: ctrl.projectsHistory[index],
        idProject: ctrl.projectsHistory[index]._id,
        thisProject : ctrl.thisProject,
    }
    common.dialog('completeProject.html', 'completeProjectCtrl', options, function(answer) {
      if(answer == 'ok') {
        
     
        $http.post('/projectsHistory', options.thisProject).then(
          function(res) {
             common.alert.show('Projekt przeniesiony do archiwow ')
             ctrl.refreshData();
          },
          function(err) {}
              ),
          
       $http.delete('/project?_id=' + options.idProject).then(
              function(res) {
              common.alert.show('Projekt zakończony:')
              ctrl.refreshData();
              },
              function(err) {
                  common.alert.show('Nieudane zakonczenie projektu', 'alert-danger')
              }
           )
         }
      })
    }
   
}]);