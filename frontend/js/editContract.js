app.controller('EditContractCtrl', [ '$http','$uibModalInstance', 'options', function($http,$uibModalInstance, options) {
    let ctrl = this
    ctrl.options = options
    ctrl.contractors = []

   
    $http.get('/contractor').then(
        function(res) {
            ctrl.contractors = res.data
        },
        function(err) {}
    ) 
   /* $http.get('/contract?_id='+ ctrl.options.idContract).then(
        function(res) {
            ctrl.options.data = res.data
        },
        function(err) {
            console.log("problem get contract")
            $uibModalInstance.close()
            lib.sendError(env.res, 400, 'CONTRACT.insertOne() failed')
        }
    ) */

    ctrl.submit = function(answer) { $uibModalInstance.close(answer) }
    ctrl.cancel = function() { $uibModalInstance.dismiss(null) }

}])