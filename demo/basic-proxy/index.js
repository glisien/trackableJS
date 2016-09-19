(function () {
  'use strict';

  window.Person = function () {
    this.firstname = null;
    this.lastname = null;
    this.age = 55;
    this.dob = null;
    this.address = null;
    this.suits = []
  }

  window.PersonAddress = function () {
    this.street = null;
    this.states = [];
  }

  window.p = new Person();
  p.firstname = 'Tony';
  p.lastname = 'Stark';
  p.age = 55;
  p.dob = new Date();

  p.address = new PersonAddress();
  p.address.street = '10880 Mailbu Point'
  p.address.states = ['NY', 'CA']

  p.suits = [
    'CAVESUIT',
    { id: 'mark1' },
    { id: 'mark2' },
    42
  ];

  window.t1 = new Tracker();
  window.tp1 = t1.asTrackable(p);

  //window.t2 = new Tracker();
  //window.tp2 = t2.asTrackable(p);
})();
