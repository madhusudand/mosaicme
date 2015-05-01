var mosaicmeApp = angular.module('mosaicmeApp', ['ui.bootstrap', 'ngRoute', 'angularMoment', 'cgBusy']).config(function ($httpProvider) {

    $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

});

mosaicmeApp
    .config(function ($routeProvider) {
        $routeProvider

            // route for the home page
            .when('/', {
                templateUrl: 'static/partials/main.html',
                controller: 'MainCtrl'
            })
            .when('/mosaic/:mosaicId', {
                templateUrl: 'static/partials/mosaic-detail.html',
                controller: 'MosaicDetailsCtrl'
            })
            .when('/learn-more', {
                templateUrl: 'static/partials/learn-more.html'
            })
            .otherwise({
                redirectTo: '/'
            });
    })
    .directive('onLastRepeat', function () {
        return function (scope, element, attrs) {
            if (scope.$last) setTimeout(function () {
                scope.$emit('onRepeatLast', element, attrs);
            }, 1);
        };
    })
    .directive('imageOnLoad', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                element.bind('load', function () {
                    $("#mosaic-img").elevateZoom({
                        zoomType: "lens",
                        lensShape: "round",
                        lensSize: 200,
                        scrollZoom : true
                    });
                });
            }
        };
    })
    .controller('HeaderCtrl', ['$scope', '$location',
        function ($scope, $location) {

            $scope.isActive = function (viewLocation) {
                return viewLocation === $location.path();
        };
    }])
    .controller('MainCtrl', ['$scope', '$http', '$log', '$modal', function ($scope, $http, $log, $modal) {

        $scope.carouselInterval = 3000;

        $scope.pageChanged = function () {
            $log.log('Page changed to: ' + $scope.currentPage);

            var start = ($scope.currentPage - 1) * $scope.itemsPerPage;
            $scope.displayImages = $scope.allImages.slice(start, start + $scope.itemsPerPage);

        };

        $scope.currentPage = 1;
        $scope.itemsPerPage = 8;

        $scope.loadPromise = $http.get('/mosaic').
            success(function (data, status, headers, config) {
                $scope.allImages = data['mosaics'];
                $scope.latestImages = $scope.allImages.slice(0, 5);
                $scope.totalItems = data['size'];

                $scope.loaded = true;
                $scope.pageChanged();
            }).
            error(function (data, status, headers, config) {
                alert('Error getting images!');
            });


        $scope.openMosaic = function (image) {

            var modalInstance = $modal.open({
              templateUrl: '/static/partials/test-dialog.html',
              controller: 'MosaicDetailsCtrl',
              size: 'lg',
              resolve: {
                mosaic: function () {
                   $log.info(image);
                   return image;
                },
                  testit: function() {return 'asd';}
              }
            });

            modalInstance.result.then(function () {
            }, function () {
              $log.info('Modal dismissed at: ' + new Date());
            });
        };

    }])
    .controller('MosaicDetailsCtrl',
        function ($scope, $http, $log, $modalInstance, mosaic, testit) {

            $log.info("Mosaic: " + mosaic);
            $log.info("Mosaic: " + testit);
            $scope.mosaic = mosaic;

            $scope.closeModal = function () {
                $('#mosaic-img').remove();
                $modalInstance.close();
              };




        });
