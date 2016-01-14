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

    this.newWorkspace();
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

  newWorkspace() {
    let workspace = {
      changes: [],
      id: Helpers.stringId()
    };
    this._trackable.workspaces.unshift(workspace);
  }

  hasChanges() {
    return !!this._trackable.workspaces[0].changes.length;
  }

  hasPendingChanges() {
    for (let i = 1; i < this._trackable.workspaces.length; i++) {
      if (this._trackable.workspaces[i].changes.length) {
        return true;
      }
    }
  }

  acceptChanges() {
  }

  rejectChanges() {
  }

  acceptAllChanges() {
  }

  rejectAllChanges() {
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
