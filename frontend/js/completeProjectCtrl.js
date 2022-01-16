app.controller('completeProjectCtrl', [ '$http', '$uibModalInstance', 'options', function($http, $uibModalInstance, options) {
    let ctrl = this
    ctrl.options = options
    ctrl.contracts = []


    ctrl.submit = function(answer) { $uibModalInstance.close(answer) }
    ctrl.cancel = function() { $uibModalInstance.dismiss(null) }


}])