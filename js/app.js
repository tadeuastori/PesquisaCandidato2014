var app = angular.module('lstCandidatoApp', ['ui.router']);

app.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('main', {
            abstract: true,
            templateUrl: 'index.html',
            controller: 'MainController'
        })
        .state('main.Principal', {
            url: '/',
            parent: 'main',
            templateUrl: 'template/principal.html',
            controller: 'PrincipalController'
        })    
        .state('main.presidente', {
                url: '/presidente',
                parent: 'main',
                templateUrl: 'template/presidente.html',
                controller: 'PresidenteController'
            })
        .state('main.outros', {
                url: '/outros',
                parent: 'main',
                templateUrl: 'template/outros.html',
                controller: 'OutrosController'
            })    
        .state('main.lista', {
            url: '/Lista/:Nome/:Uf',
            parent: 'main',
            templateUrl: 'template/lista.html',
            controller: 'ListaController'
        })
        .state('main.candidato', {
            url: '/Candidato/:Id',
            parent: 'main',
            templateUrl: 'template/candidato.html',
            controller: 'CandidatoController'
        })
        ;

    $urlRouterProvider.otherwise('/');
})

.controller('MainController', ['$scope', '$state', function ($scope, $state) {
    $scope.goInicio = function () {
        $state.go('main.Principal',{});}; 
}])

.controller('PrincipalController', ['$scope', '$state', '$http', function($scope, $state, $http){
    
    $scope.goOutros = function () {
        $state.go('main.outros',{});
    }; 
    
    $scope.goPresidente = function () {
        $state.go('main.presidente',{});
    };
}])

.controller('OutrosController', ['$scope', '$state', '$http', function($scope, $state, $http){
    
    $scope.estados = [
                        { name: 'AC', value: 'ac' },
                        { name: 'AL', value: 'al' },
                        { name: 'AP', value: 'ap' },
                        { name: 'AM', value: 'am' },
                        { name: 'BA', value: 'ba' },
                        { name: 'CE', value: 'ce' },
                        { name: 'DF', value: 'df' },
                        { name: 'ES', value: 'es' },
                        { name: 'GO', value: 'go' },
                        { name: 'MA', value: 'ma' },
                        { name: 'MT', value: 'mt' },
                        { name: 'MS', value: 'ms' },
                        { name: 'MG', value: 'mg' },
                        { name: 'PA', value: 'pa' },
                        { name: 'PB', value: 'pb' },
                        { name: 'PR', value: 'pr' },
                        { name: 'PE', value: 'pe' },
                        { name: 'PI', value: 'pi' },
                        { name: 'RJ', value: 'rj' },
                        { name: 'RN', value: 'rn' },
                        { name: 'RS', value: 'rs' },
                        { name: 'RO', value: 'ro' },
                        { name: 'RR', value: 'rr' },
                        { name: 'SC', value: 'sc' },
                        { name: 'SP', value: 'sp' },
                        { name: 'SE', value: 'se' },
                        { name: 'TO', value: 'to' }
                     ];    
    
    $scope.goLista = function () {
        $state.go('main.lista',{        
            'Nome': $scope.nomeCandidato,
            'Uf': $scope.estadoCandidato
        });
    };
}])

.controller('PresidenteController', ['$scope', '$state', '$http', function($scope, $state, $http){  
    
    $scope.goLista = function () {
        $state.go('main.lista',{        
            'Nome': $scope.nomeCandidato,
            'Uf': 'br'
        });
    };
}])

.controller('ListaController', ['$scope', '$state', '$http', function($scope, $state, $http){
    
    var url = 'http://apitreinamento.autoglass.com.br/api/'; 
    
    $scope.RespostaSim = false;
    $scope.RespostaNao = false;
    $scope.RespostaAguarde = true;    
    
    $http.get(url + "canditados/?Uf=" + $state.params.Uf + "&Nome=" + $state.params.Nome)
        .success(function (resultado) {
                        
            if($state.params.Uf == 'br'){
                
                var novoResultado = [];
                                
                for (var item in resultado){
                    
                   if(resultado[item].Cargo == "PRESIDENTE"){
                                              
                       novoResultado.push(resultado[item]);
                       
                    }
                   
                }
                
                $scope.lista = novoResultado;
                
            } else {        
                $scope.lista = resultado;
            }
        
            $scope.RespostaSim = true;
            $scope.RespostaNao = false;
            $scope.RespostaAguarde = false;
        })
        .error(function (resultado) {
            $scope.RespostaSim = false;
            $scope.RespostaNao = true;
            $scope.RespostaAguarde = false;
        });  
    
    $scope.goCandidato = function (id) {
        $state.go('main.candidato',{
            'Id': id
        });};    
}])

.controller('CandidatoController', ['$scope', '$state', '$http', function ($scope, $state, $http) {
        
     var url = 'http://apitreinamento.autoglass.com.br/api/';    
    
    $scope.tabEstiloDadosPessoais = 'current';    
    
    console.log($state.params.Id);
    
    $http.get(url + "candidatos/" + $state.params.Id)
        .success(function (resultado) {
            $scope.candidato = resultado;    
        });  
    
    
    $http.get(url + "candidatos/" + $state.params.Id + "/bens")
        .success(function (resultado) {
            $scope.BensCandidato = resultado;    
        });    
    
}]);
;
