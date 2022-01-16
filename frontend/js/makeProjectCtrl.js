app.controller('MakeProjectCtrl', [ '$http', '$uibModalInstance', 'options', function($http, $uibModalInstance, options) {
    let ctrl = this
    ctrl.options = options
    ctrl.menagers = []

    ctrl.submit = function(answer) { $uibModalInstance.close(answer) }
    ctrl.cancel = function() { $uibModalInstance.dismiss(null) }

    $http.get('/menager').then(
        function(res) {
            ctrl.menagers = res.data
            console.log(ctrl.menagers[0].firstName)
        },
        function(err) {
            console.log("problem get allMenager")
        }
    )    
}])