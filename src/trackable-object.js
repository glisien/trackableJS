import * as GenericHelpers from './generic-helpers'
import * as TrackableHelpers from './trackable-helpers'

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

  createSnapshot(snapshotId) {
    if (!GenericHelpers.isString(snapshotId)) {
      throw new Error('I only like strings as snapshot identifiers.');
    }
    this.__trackable__.audit.snapshots[snapshotId] = this.__trackable__.audit.pointer;
    return this;
  }

  applySnapshot(snapshotId) {
    if (this.__trackable__.audit.snapshots.hasOwnProperty(snapshotId)) {
      let snapshotPointer = this.__trackable__.audit.snapshots[snapshotId];
      if (snapshotPointer < this.__trackable__.audit.pointer) {
        while (this.__trackable__.audit.pointer > snapshotPointer) {
          this.undo();
        }
      } else if (snapshotPointer > this.__trackable__.audit.pointer) {
        while (this.__trackable__.audit.pointer < snapshotPointer) {
          this.redo();
        }
      }
    }
    return this;
  }

  hasChanges() {
    return this.hasLocalChanges() || this.hasChildChanges();
  }

  hasLocalChanges() {
    return !!this.__trackable__.audit.events.length;
  }

  hasChildChanges() {
    for (let propertyName in this) {
      if (this.hasOwnProperty(propertyName)) {
        if (GenericHelpers.isTrackable(this.__trackable__.fields[propertyName])) {
          if (this.__trackable__.fields[propertyName].hasChanges()) {
            return true;
          }
        }
      }
    }
    return false;
  }

  hasChangesAfterSnapshot(snapshotId) {
    if (this.__trackable__.audit.snapshots.hasOwnProperty(snapshotId)) {
      let snapshotPointer = this.__trackable__.audit.snapshots[snapshotId];
      if (this.__trackable__.audit.events.length > snapshotPointer) {
        return true;
      }
    }
    return false;
  }

  undo() {
    let change = this.__trackable__.audit.events[this.__trackable__.audit.pointer - 1];
    if (change) {
      if (GenericHelpers.isObject(change.oldValue)) {
        this.__trackable__.fields[change.property] = new TrackableObject(change.oldValue);
      } else if (GenericHelpers.isArray(change.oldValue)) {
        this.__trackable__.fields[change.property] = new TrackableArray(change.oldValue);
      } else {
        this.__trackable__.fields[change.property] = change.oldValue;
      }
      this.__trackable__.audit.pointer -= 1;
    }
    return this;
  }

  undoAll() {
    while (this.__trackable__.audit.pointer > 0) {
      this.undo();
    }
    return this;
  }

  redo() {
    let change = this.__trackable__.audit.events[this.__trackable__.audit.pointer];
    if (change) {
      if (GenericHelpers.isObject(change.newValue)) {
        this.__trackable__.fields[change.property] = new TrackableObject(change.newValue);
      } else if (GenericHelpers.isArray(change.newValue)) {
        this.__trackable__.fields[change.property] = new TrackableArray(change.newValue);
      } else {
        this.__trackable__.fields[change.property] = change.newValue;
      }
      this.__trackable__.audit.pointer += 1;
    }
    return this;
  }

  redoAll() {
    while (this.__trackable__.audit.pointer < this.__trackable__.audit.events.length) {
      this.redo();
    }
    return this;
  }

  /*

  state() {
    switch (this.__trackable__.state.current) {
      case 'p': return 'pristine';
      case 'a': return 'added';
      case 'u': return 'updated';
      case 'd': return 'deleted';
      default:  throw new Error('Trackable Object has an unknown state.');
    }
  }

  isPristine() {
    return this.__trackable__.state.current === 'p';
  }

  isAdded() {
    return this.__trackable__.state.current === 'a';
  }

  isUpdated() {
    return this.__trackable__.state.current === 'u';
  }

  isDeleted() {
    return this.__trackable__.state.current === 'd';
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
