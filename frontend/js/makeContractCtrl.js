app.controller('MakeContractCtrl', [ '$http', '$uibModalInstance', 'options', function($http, $uibModalInstance, options) {
    let ctrl = this
    ctrl.options = options
    ctrl.contractors = []
    ctrl.projects = [] 


    ctrl.submit = function(answer) { $uibModalInstance.close(answer) }
    ctrl.cancel = function() { $uibModalInstance.dismiss(null) }

    $http.get('/contractor').then(
        function(res) {
            ctrl.contractors = res.data
        },
        function(err) {
            console.log("problem get contractor")
        }
    )  
    
    $http
        .get("/project")
          .then(
            function (res) {
              ctrl.projects = res.data;
              console.log(ctrl.projects)
            },
            function (err) {}
          );
}]);

app.filter('dateFormat1', function($filter){
 return function(input)
 {
  if(input == null){ return ""; } 
 
  var _date = $filter('date')(new Date(input), 'dd-MM-yyyy');
 
  return _date.toUpperCase();

 };
});