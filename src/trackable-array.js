import * as Helpers from './helpers'

export class TrackableArray {
  constructor(o) {
    if (Helpers.isTrackable(o)) {
      throw new Error('Trackers do not like to be tracked.');
    }

    if (!Helpers.isArray(o)) {
      throw new Error('Only an Array can learn how to track.');
    }

    Helpers.createTrackableContainer(this);
  }

  state() {
  }

  hasChanges() {
  }

  undoChanges() {
  }

  asNonTrackable() {
  }
}
