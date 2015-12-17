import * as Helpers from './helpers'

export class TrackableArray {
  constructor(o) {
    if (Helpers.isTrackable(o)) {
      throw new Error('Trackers do not like to be tracked.');
    }

    if (!Helpers.isArray(o)) {
      throw new Error('Only an Array can learn how to track.');
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

    this.newUnitOfWork();
  }

  newUnitOfWork() {
    let workspace = {
      changes: [],
      id: Helpers.stringId()
    };

    this._trackable.workspaces.unshift(workspace);
  }

  hasChanges() {
  }

  hasPendingChanges() {
  }

  acceptUnitOfWorkChanges() {
  }

  rejectUnitOfWorkChanges() {
  }

  undoChanges() {
  }

  asNonTrackable() {
  }
}
