app.controller('ContractsCtrl', [ '$http', 'common', function($http, common) {
    let ctrl = this

    ctrl.contractMake = {};

    ctrl.contractsHistory = [];
    ctrl.refreshData = function () {
        $http
        .get("/contract")
          .then(
            function (res) {
              ctrl.contractsHistory = res.data;
            },
            function (err) {}
          );
    };

    ctrl.refreshData();

    ctrl.contract = function() {
      Object.assign(
        ctrl.contractMake
      );
        let options = { 
            title: 'Dane umowy',
            ok: true,
            cancel: true,
            data: ctrl.contractMake
        }
        common.dialog('makeContract.html', 'MakeContractCtrl', options, function(answer) {
            if(answer == 'ok') {
                $http.post('/contract', ctrl.contractMake).then(
                    function(res) {
                        $http.get('/contractor?_id=' + ctrl.contractMake.contractor).then(
                            function(res) {
                                common.alert.show('Umowa z ' + res.data.firstName + ' ' + res.data.lastName)
                                ctrl.refreshData();
                            },
                            function(err) {}
                        )
                    },
                    function(err) {
                        common.alert.show('Umowa nieudana', 'alert-danger')
                    }
                )
            }
        })
    };

 
    ctrl.editContract = function(index){
      let options = {
      title: "Edytuj dane",
      ok: true,
      cancel: true,
      data: ctrl.contractsHistory[index],
      idContract : ctrl.contractsHistory[index]._id,
    }

    common.dialog(
      "editContract.html",
      "EditContractCtrl",
      options,
      function (answer) {
         if(answer =="ok"){
          delete options.data.contractorData
          delete options.dataprojectData
              $http.put("/contract?_id="+ options.idContract, options.data).then(
                function (res) {
                  ctrl.contractsHistory = res.data;
                  common.alert.show("Dane zmienione");
                  ctrl.refreshData();
                },
                function (err) {
                  console.log("Blad z zmienianiem danych" +options.data);
                }
              );
            }
          } 
     )};

          


},
]);