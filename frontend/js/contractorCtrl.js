app.controller("ContractorsCtrl", [
    "$http",
    "common",
    function ($http, common) {
      let ctrl = this;
  
      ctrl.contractors = [];
      ctrl.contractor = {};
      ctrl.q = "";
      ctrl.skip = ctrl.limit = 0;
  
      const contractorDefaults = {
        firstName: "",
        lastName: "",
      };
  
      ctrl.edit = function (index) {
        Object.assign(
          ctrl.contractor,
          index >= 0 ? ctrl.contractors[index] : contractorDefaults
        );

        let options = {
          title: index >= 0 ? "Edytuj dane" : "Nowe dane ",
          ok: true,
          delete: index >= 0,
          cancel: true,
          data: ctrl.contractor,
        };
        common.dialog(
          "editPerson.html",
          "EditPersonCtrl",
          options,
          function (answer) {
            switch (answer) {
              case "ok":
                if (index >= 0) {
                  $http.put("/contractor", ctrl.contractor).then(
                    function (res) {
                      ctrl.contractors = res.data;
                      common.alert.show("Dane zmienione");
                    },
                    function (err) {}
                  );
                } else {
                  delete ctrl.contractor._id;
                  $http.post("/contractor", ctrl.contractor).then(
                    function (res) {
                      ctrl.contractors = res.data;
                      common.alert.show("Dane dodane");
                    },
                    function (err) {}
                  );
                }
                break;
              case "delete":
                let options = {
                  title: "Usunąć obiekt?",
                  body:
                    ctrl.contractors[index].firstName +
                    " " +
                    ctrl.contractors[index].lastName,
                  ok: true,
                  cancel: true,
                };
                common.confirm(options, function (answer) {
                  if (answer == "ok") {
                    $http.delete("/contractor?_id=" + ctrl.contractors[index]._id).then(
                      function (res) {
                        ctrl.contractors = res.data;
                        common.alert.show("Dane usunięte");
                      },
                      function (err) {}
                    );
                  }
                });
                break;
            }
          }
        );
      };
  
      ctrl.refreshData = function () {
        $http
          .get(
            "/contractor?q=" + ctrl.q + "&limit=" + ctrl.limit + "&skip=" + ctrl.skip
          )
          .then(
            function (res) {
              ctrl.contractors = res.data;
            },
            function (err) {}
          );
      };
  
      ctrl.refreshData();
    },
  ]);
  