app.controller('OrganizeController', ['$scope', 'crudService','$routeParams','$http','$q','$interval','uiGridConstants', function($scope, crudService,$routeParams,$http,$q,$interval,uiGridConstants) {
	var vm = $scope;
	window.vm=vm;
	vm.cat=$routeParams && $routeParams.opz || 'organize';
    vm.data = [];
	vm.gridOptions={
		enableFiltering: false,
		enableCellEditOnFocus: true,
		enableRowSelection: true,
		selectionRowHeaderWidth: 35,
		enableSelectAll: false,
		multiSelect:false,
		onRegisterApi:function(gridApi){
			vm.gridApi = gridApi;
			gridApi.rowEdit.on.saveRow(vm, vm.save);
		}		
	}
    vm.populateData = function(response){
        vm.data = response.data && response.data.docs ||[];
		vm.gridOptions.data=vm.data
		
		switch (true){
			case (vm.cat=='persone'):
				vm.gridOptions.columnDefs=[
					{ name: 'cognome'},
					{ name: 'nome' }
				]; 
				break;
			case (vm.cat=='classi'):
				vm.gridOptions.columnDefs=[
					{ name: 'classe'},
					{ name: 'livello',type:'number',width:70},
					{name:'sezione',width:90}
				];
				break;				
			case (vm.cat=='discipline'):
				vm.gridOptions.columnDefs=[
					{ name: 'disciplina'},
					{ name: 'abbr',displayName:'Abbr.',width:90}
				];
				break;
			case (vm.cat=='anniscolastici'):
				vm.gridOptions.columnDefs=[
					{ name: 'annoscolastico',displayName:'Anno Scolastico'},
					{ name: 'dal',type:'date',width:130,cellFilter: 'date:"dd/MM/yyyy"'},
					{ name: 'al',type:'date',width:130,cellFilter: 'date:"dd/MM/yyyy"'}
				];
				break;	
			case (vm.cat=='organize'):
				vm.gridOptions.columnDefs=[
					{ name: 'Cose da fare', headerCellClass: vm.highlightFilteredHeader },
					{ field: 'mixedDate3', displayName: "Incaricato", headerCellClass: vm.highlightFilteredHeader },
					{ field: 'mixedDate2', displayName: "dal", cellFilter: 'date',type:'date', filterCellFiltered:true, width: '15%', },
					{ field: 'mixedDate1', displayName: "al", cellFilter: 'date',type:'date', filterCellFiltered:true, width: '15%', }
					
				];
				break;	
				
		}
		
    };
	vm.highlightFilteredHeader = function( row, rowRenderIndex, col, colRenderIndex ) {
    if( col.filters[0].term ){
      return 'header-filtered';
    } else {
      return '';
    }
};
  
	vm.toggleFiltering = function(){
    vm.gridOptions.enableFiltering = !vm.gridOptions.enableFiltering;
	vm.gridApi.core.notifyDataChange( uiGridConstants.dataChange.COLUMN );
  };
	
	
	vm.create=function(){
		vm.data.push({_id:null})
	};
    vm.read = function(){
		var fnd={"cat":vm.cat};
        crudService.fnd(fnd, vm.populateData);
    };	
    vm.save = function(row){
		var promise = $q.defer();
		vm.gridApi.rowEdit.setSavePromise(row,promise.promise)
		row.cat=vm.cat
        crudService.set(row,function(r){
			promise.resolve(); //promise.reject();
		});
    };
	vm.remove = function(){	
		var d=vm.gridApi.grid.selection.lastSelectedRow.entity
		vm.data.splice(vm.data.indexOf(d),1)
        crudService.del(d,function(r){
			//window.location="#/"+vm.cat+"/"
		});
    };
    vm.init = function(){
        $(function(){
			var gc=$('.ui-grid');
			var po=gc.position();
			var gh=window.innerHeight-po.top-100;
			if (gh<150) gh=150;
			gc.height(gh);
		})
        vm.read();
    };	
	vm.init();
}]);