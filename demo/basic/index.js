(function () {
  'use strict';

  window.t = new Tracker();

  window.o1 = {
    a: 'hello-o1',
    b: 1,
    c: false,
    d: [1,2,3],
    e: null,
    f: 0,
    g: null
  }

  window.o2 = {
    a: 'hello-o2',
    b: 1,
    c: false,
    d: [1,2,3],
    e: null,
    f: 0,
    g: null
  }

  window.o3 = {
    a: null
  }
  o3.a = o3;

  o1.e = o2;
  o1.f = o2;
  o1.g = o3;

  o2.e = o1;

  window.to1 = t.asTrackable(o1);
  window.to2 = t.asTrackable(o2);
  window.to3 = t.asTrackable(o3);

  // t.iterate(o3, function(obj, prop, val, recurring) {
  //   console.log('iterate() result: ')
  //   console.log('        object: ', obj);
  //   console.log('      property: ', prop);
  //   console.log('         value: ', val);
  //   console.log('     recurring: ', recurring);
  //   console.log('_________________________________');
  // });
})();
