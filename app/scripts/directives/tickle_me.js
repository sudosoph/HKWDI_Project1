angular.module('tickeyApp')
	.directive("tickleMe", function() {
		return {
			restrict: 'A',
			link: function(scope, element, attrs) {
				element.bind('click', function() {
					alert("Don't tickle me ~ ");
				});
			}
		}
	})

	