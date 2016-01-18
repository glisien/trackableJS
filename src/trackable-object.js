import * as GenericHelpers from './generic-helpers'
import * as TrackableHelpers from './trackable-helpers'
import EventTypes from './event-types'

export class TrackableObject {
  constructor(o, addStateDefinition = null) {
    if (GenericHelpers.isTrackable(o)) {
      throw new Error('Trackers do not like to be tracked.');
    }

    if (!GenericHelpers.isObject(o)) {
      throw new Error('Only an Object can learn how to track.');
    }

    TrackableHelpers.createStructure(this);

    for (let propertyName in o) {
      if (o.hasOwnProperty(propertyName)) {
        let propertyDescriptor = Object.getOwnPropertyDescriptor(o, propertyName);
        if (propertyDescriptor.writable && propertyDescriptor.configurable) {
          TrackableHelpers.createField(this, propertyName, propertyDescriptor.value);
        }
      }
    }
  }

  snapshot() {
    // TODO
  }

  hasChanges() {
    // TODO
  }

  hasSnapshotChanges() {
    // TODO
  }

  undoChange() {
    // TODO
  }

  undoSnapshotChanges() {
    // TODO
  }

  redoChange() {
    // TODO
  }

  /*

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
        if (GenericHelpers.isTrackable(this._trackable.fields[propertyName])) {
          this._trackable.fields[propertyName].snapshot();
        }
      }
    }

    return this;
  }

  localSnapshot() {
    if (this._trackable.snapshots[0].events.length) {
      let snapshot = {
        events: [],
        id: GenericHelpers.stringId()
      };
      this._trackable.snapshots.unshift(snapshot);
    }
    return this;
  }

  hasChanges() {
    let hasLocalChanges = this.hasLocalChanges();
    if (hasLocalChanges) {
      return true;
    }

    for (let propertyName in this) {
      if (this.hasOwnProperty(propertyName)) {
        if (GenericHelpers.isTrackable(this._trackable.fields[propertyName])) {
          let hasChanges = this._trackable.fields[propertyName].hasChanges();
          if (hasChanges) {
            return true;
          }
        }
      }
    }

    return false;
  }

  hasSnapshotChanges() {
    let hasLocalSnapshotChanges = this.hasLocalSnapshotChanges();
    if (hasLocalSnapshotChanges) {
      return true;
    }

    for (let propertyName in this) {
      if (this.hasOwnProperty(propertyName)) {
        if (GenericHelpers.isTrackable(this._trackable.fields[propertyName])) {
          let hasSnapshotChanges = this._trackable.fields[propertyName].hasSnapshotChanges();
          if (hasSnapshotChanges) {
            return true;
          }
        }
      }
    }

    return false;
  }

  hasLocalChanges() {
    let s = this._trackable.snapshots.length;
    while (s--) {
      if (this._trackable.snapshots[s].events.length) {
        return true;
      }
    }
    return false;
  }

  hasLocalSnapshotChanges() {
    if (this._trackable.snapshots[0].events.length) {
      return true;
    }
    return false;
  }

  rejectChanges() {
    // TODO
    return this;
  }

  rejectSnapshotChanges() {
    let e = this._trackable.snapshots[0].events.length;
    while (e--) {

    }
    return this;
  }

  rejectLocalChanges() {
    // TODO
    return this;
  }

  rejectLocalSnapshotChanges() {
    // TODO
    return this;
  }

  acceptChanges() {
    // TODO
    return this;
  }

  acceptSnapshotChanges() {
    // TODO
    return this;
  }

  acceptLocalChanges() {
    // TODO
    return this;
  }

  acceptLocalSnapshotChanges() {
    // TODO
    return this;
  }

  */

  asNonTrackable() {
    let o = {};
    for (let propertyName in this) {
      if (this.hasOwnProperty(propertyName)) {
        if (GenericHelpers.isTrackable(this[propertyName])) {
          o[propertyName] = this[propertyName].asNonTrackable();
        } else {
          o[propertyName] = this[propertyName]
        }
      }
    }
    return o;
  }
}
