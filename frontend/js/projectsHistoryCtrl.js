app.controller('ProjectsHistoryCtrl', [ '$http', 'common',  function($http, common) {
    let ctrl = this

    ctrl.projectMake = {};

    ctrl.projectsHistory = [];
    ctrl.refreshData = function () {
        $http
        .get("/projectsHistory")
          .then(
            function (res) {
              ctrl.projectsHistory = res.data;
            },
            function (err) {}
          );
    };

    ctrl.refreshData();


      
    ctrl.getContracts = function(index){
        let options = { 
            title: 'Zawarte umowy',
            cancel: true,
            data: ctrl.projectsHistory[index],
            idProject: ctrl.projectsHistory[index].oldId,
            history: true
        }
        common.dialog(
            "showContracts.html",
            "showContractsCtrl",
            options,
            function(){}
   )}
       
}]);