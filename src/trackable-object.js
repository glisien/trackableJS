import * as Helpers from './helpers'

export class TrackableObject {
  constructor(o, addStateDefinition) {
    if (Helpers.isTrackable(o)) {
      throw new Error('Trackers do not like to be tracked.');
    }

    if (!Helpers.isObject(o)) {
      throw new Error('Only an Object can learn how to track.');
    }

    Helpers.createTrackableStructure(this);

    for (let propertyName in o) {
      if (o.hasOwnProperty(propertyName)) {
        let propertyDescriptor = Object.getOwnPropertyDescriptor(o, propertyName);
        if (propertyDescriptor.writable && propertyDescriptor.configurable) {
          Helpers.createTrackableObjectField(this, propertyName, propertyDescriptor.value);
        }
      }
    }

    Helpers.evaluateTrackableObjectState(this);
    this._trackable.state.original = this._trackable.state.current;

    this.snapshot();
  }

  state() {
    switch (this._trackable.state.current) {
      case 'p': return 'pristine';
      case 'a': return 'added';
      case 'u': return 'updated';
      case 'd': return 'deleted';
      default:  throw new Error('Trackable Object has an unknown state.');
    }
  }

  isPristine() {
    return this._trackable.state.current === 'p';
  }

  isAdded() {
    return this._trackable.state.current === 'a';
  }

  isUpdated() {
    return this._trackable.state.current === 'u';
  }

  isDeleted() {
    return this._trackable.state.current === 'd';
  }

  snapshot() {
    this.localSnapshot();
    for (let propertyName in this) {
      if (this.hasOwnProperty(propertyName)) {
        if (Helpers.isTrackable(this[propertyName])) {
          this[propertyName].snapshot();
        }
      }
    }
  }

  localSnapshot() {
    if (this._trackable.snapshots[0].events.length) {
      let snapshot = {
        events: [],
        id: Helpers.stringId()
      };
      this._trackable.snapshots.unshift(snapshot);
    }
  }

  hasChanges() {
    // TODO
  }

  hasLocalChanges() {
    for (let propertyName in this) {
      if (this.hasOwnProperty(propertyName)) {
        if (!Helpers.isTrackable(this[propertyName])) {
          continue;
        }
        // TODO
      }
    }
  }

  hasSnapshotChanges() {
    // TODO
  }

  hasLocalSnapshotChanges() {
    for (let propertyName in this) {
      if (this.hasOwnProperty(propertyName)) {
        if (!Helpers.isTrackable(this[propertyName])) {
          continue;
        }
        // TODO
      }
    }
  }

  rejectChanges() {
    // TODO
  }

  rejectLocalChanges() {
    for (let propertyName in this) {
      if (this.hasOwnProperty(propertyName)) {
        if (!Helpers.isTrackable(this[propertyName])) {
          continue;
        }
        // TODO
      }
    }
  }

  rejectSnapshotChanges() {
    // TODO
  }

  rejectLocalSnapshotChanges() {
    for (let propertyName in this) {
      if (this.hasOwnProperty(propertyName)) {
        if (!Helpers.isTrackable(this[propertyName])) {
          continue;
        }
        // TODO
      }
    }
  }

  acceptSnapshotChanges() {
    // TODO
  }

  acceptLocalSnapshotChanges() {
    for (let propertyName in this) {
      if (this.hasOwnProperty(propertyName)) {
        if (!Helpers.isTrackable(this[propertyName])) {
          continue;
        }
        // TODO
      }
    }
  }


  asNonTrackable() {
    let o = {};
    for (let propertyName in this) {
      if (this.hasOwnProperty(propertyName)) {
        if (Helpers.isTrackable(this[propertyName])) {
          o[propertyName] = this[propertyName].asNonTrackable();
        } else {
          o[propertyName] = this[propertyName]
        }
      }
    }
    return o;
  }
}
