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

    ctrl.submit = function(answer) { $uibModalInstance.close(answer) }
    ctrl.cancel = function() { $uibModalInstance.dismiss(null) }

}])