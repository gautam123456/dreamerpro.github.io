angular.module('cultstage')
.directive('topNav', function(){
	return {
		restrict:'E',
		templateUrl:'templates/directives/top-nav.html'
	}
})
.directive('jobSideMenu', function(){
	return {
		restrict:'E',
		templateUrl:'templates/directives/job-side-menu.html'
	}
})
.directive('messageSideMenu', function(){
	return {
		restrict:'E',
		templateUrl:'templates/directives/message-side-menu.html'
	}
})
.directive('profileSideMenu', function(){
	return {
		restrict:'E',
		templateUrl:'templates/directives/profile-side-menu.html'
	}
})
.directive('eventAttendee', function(){
	return {
		restrict:'E',
		templateUrl:'templates/directives/event-attendee.html'
	}
})

.directive('profileCover', function(){
	return {
		restrict:'E',
		templateUrl:'templates/directives/profile-cover.html'
	}
})
.directive('eventCover', function(){
	return {
		restrict:'E',
		templateUrl:'templates/directives/event-cover.html'
	}
})

.directive('signModal', function(){
	return {
		restrict:'E',
		templateUrl:'templates/directives/sign.html'
	}
})

