app.controller('ContractsCtrl', [ '$http','$route', 'common', function($http, $route, common) {
    let ctrl = this

    ctrl.contractMake = {};

    ctrl.all = [];

    ctrl.contractsHistory = [];
    ctrl.contractSet = [];
    ctrl.refreshData = function () {
        $http
        .get("/contract")
          .then(
            function (res) {
              console.log(res.data[1].finish)
              for(let i=0; i < res.data.length; i++ ){
                if(res.data[i].finish){ 
                  ctrl.contractSet.push(res.data[i]);
                }
                else{
                  ctrl.contractsHistory.push(res.data[i]);
                }
              }

            },
            function (err) {})
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
              ctrl.contractMake.finish = false
                $http.post('/contract', ctrl.contractMake).then(
                    function(res) {
                        $http.get('/contractor?_id=' + ctrl.contractMake.contractor).then(
                            function(res) {
                                common.alert.show('Umowa z ' + res.data.firstName + ' ' + res.data.lastName)
                              
                            },
                            function(err) {}
                        )
                    },
                    function(err) {
                        common.alert.show('Umowa nieudana', 'alert-danger')
                    }
                )
            }ctrl.reloadRoute();
            ctrl.refreshData();
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

                },
                function (err) {
                  console.log("Blad z zmienianiem danych" +options.data);
                }
              );
            }
            ctrl.reloadRoute();
            ctrl.refreshData();
          } 
     )};

    ctrl.reloadRoute = function() {
 
      // Reload only the route which will re-instantiate
      $route.reload();
  };

    ctrl.settlementContract = function(index){
      let options = { 
        title: 'Czy na pewno chcesz rozliczyć umowę?',
        ok: true,
        cancel: true,
        data: ctrl.contractsHistory[index],
        idContract : ctrl.contractsHistory[index]._id,
    }
    common.dialog(
      "settlementContract.html",
      "settlementContractCtrl",
      options,
      function (answer) {
         if(answer =="ok"){
          delete options.data.contractorData
          delete options.dataprojectData
          options.data.finish = true

              $http.put("/contract?_id="+ options.idContract, options.data).then(
                function (res) {
                  for(let i=0; i < res.data.length; i++ ){
                if(res.data[i].finish){ 
                  ctrl.contractSet.push(res.data[i]);
                }
                else{
                  ctrl.contractsHistory.push(res.data[i]);
                }
              }
                  common.alert.show("Umowa została rozliczona");
                  
                },
                function (err) {
                  console.log("Blad z zmienianiem danych" + options.data);
                }
              );
                ctrl.reloadRoute();
                ctrl.refreshData();
            }
          } 
     )
    };

          


},
]);