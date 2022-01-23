app.controller('settlementContractCtrl', [ '$http','$uibModalInstance', 'options', function($http,$uibModalInstance, options) {
    let ctrl = this
    ctrl.options = options

    ctrl.submit = function(answer) { $uibModalInstance.close(answer) }
    ctrl.cancel = function() { $uibModalInstance.dismiss(null) }

}])