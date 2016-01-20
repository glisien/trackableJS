import * as GenericHelpers from './generic-helpers'

export class TrackableArray {
  constructor(o) {
    if (GenericHelpers.isTrackable(o)) {
      throw new Error('Trackers do not like to be tracked.');
    }

    if (!GenericHelpers.isArray(o)) {
      throw new Error('Only an Array can learn how to track.');
    }
  }

  createSnapshot(snapshotId) {
    // TODO
  }

  applySnapshot(snapshotId) {
    // TODO
  }

  hasChanges() {
    // TODO
  }

  hasLocalChanges() {
    // TODO
  }

  hasChildChanges() {
    // TODO
  }

  hasChangesAfterSnapshot(snapshotId) {
    // TODO
  }

  undo() {
    // TODO
  }

  undoAll() {
    // TODO
  }

  redo() {
    // TODO
  }

  redoAll() {
    // TODO
  }

  asNonTrackable() {
  }
}
