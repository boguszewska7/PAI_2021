app.controller('showContractsCtrl', [ '$http', '$uibModalInstance', 'options', '$filter','$controller', function($http, $uibModalInstance, options, $filter, $controller) {
    
  $controller('ContractsCtrl')
  let ctrl = this
    ctrl.options = options
    ctrl.contracts = []

 let c = 0;


    ctrl.submit = function(answer) { $uibModalInstance.close(answer) }
    ctrl.cancel = function() { $uibModalInstance.dismiss(null) }


    if(!ctrl.options.history){
       $http
        .get("/contract" )
          .then(
            function (res) {
              ctrl.contracts = res.data;         
            },
            function (err) {}
          );
      }
    else{
 $http
      .get("/contractHistory?_id="+ ctrl.options.idProject)
        .then(
          function (res) {
            for(let i=0; i<res.data.length; i++){
              if(!res.data[i].finish){
                c++;
              }
            }
            ctrl.notfinish = c;
            ctrl.contracts = res.data;         
          },
          function (err) {}
        );
    }
   
 //   ctrl.contracts = $filter('filter')(ctrl.allcontracts, {project: ctrl.options.idProject})
  

}])