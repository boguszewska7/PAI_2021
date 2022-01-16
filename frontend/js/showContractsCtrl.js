app.controller('showContractsCtrl', [ '$http', '$uibModalInstance', 'options', '$filter','$controller', function($http, $uibModalInstance, options, $filter, $controller) {
    
  $controller('ContractsCtrl')
  let ctrl = this
    ctrl.options = options
    ctrl.acontracts = []


    ctrl.submit = function(answer) { $uibModalInstance.close(answer) }
    ctrl.cancel = function() { $uibModalInstance.dismiss(null) }
    console.log(ctrl.options.history)
    if(!ctrl.options.history){
       $http
        .get("/contract")
          .then(
            function (res) {
              ctrl.contracts = res.data;         
            },
            function (err) {}
          );
    }
    else{
      $http
      .get("/contractHistory")
        .then(
          function (res) {
            ctrl.contracts = res.data;         
          },
          function (err) {}
        );
    }
   
 //   ctrl.contracts = $filter('filter')(ctrl.allcontracts, {project: ctrl.options.idProject})
  

}])