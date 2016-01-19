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

    this._trackable.audit.snapshots.push({
      id: snapshotId,
      pointer: this._trackable.audit.pointer
    });

    return this;
  }

  applySnapshot(snapshotId) {
    let snapshot = GenericHelpers.find(this._trackable.audit.snapshots, { id: snapshotId });
    if (snapshot) {
      if (snapshot.pointer < this._trackable.audit.pointer) {
        while (this._trackable.audit.pointer > snapshot.pointer) {
          this.undo();
        }
      } else if (snapshot.pointer > this._trackable.audit.pointer) {
        while (this._trackable.audit.pointer < snapshot.pointer) {
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
    return !!this._trackable.audit.events.length;
  }

  hasChildChanges() {
    for (let propertyName in this) {
      if (this.hasOwnProperty(propertyName)) {
        if (GenericHelpers.isTrackable(this._trackable.fields[propertyName])) {
          if (this._trackable.fields[propertyName].hasChanges()) {
            return true;
          }
        }
      }
    }
    return false;
  }

  hasChangesAfterSnapshot(snapshotId) {
    let snapshot = GenericHelpers.find(this._trackable.audit.snapshots, { id: snapshotId });
    if (snapshot) {
      if (this._trackable.audit.events.length > snapshot.pointer) {
        return true;
      }
    }
    return false;
  }

  undo() {
    let change = this._trackable.audit.events[this._trackable.audit.pointer - 1];
    if (change) {
      this._trackable.fields[change.property] = change.oldValue;
      this._trackable.audit.pointer -= 1;
    }
    return this;
  }

  undoAll() {
    while (this._trackable.audit.pointer > 0) {
      this.undo();
    }
    return this;
  }

  redo() {
    let change = this._trackable.audit.events[this._trackable.audit.pointer];
    if (change) {
      this._trackable.fields[change.property] = change.newValue;
      this._trackable.audit.pointer += 1;
    }
    return this;
  }

  redoAll() {
    while (this._trackable.audit.pointer < this._trackable.audit.events.length) {
      this.redo();
    }
    return this;
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
