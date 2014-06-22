beforeEach(function() {
  window.localStorage.removeItem('userInputPhrase');
});

beforeEach(module(function($provide) {
  $provide.service('data', function($q) {
    this.heartbeat = jasmine.createSpy('heartbeat.data').andReturn($q.when(123));
    this.loadCoordinates = jasmine.createSpy('heartbeat.data').andReturn($q.when([{long: 123, lat: 234}, {long: 1, lat: 342}]));
  });
}));
