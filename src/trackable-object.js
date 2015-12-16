import * as Helpers from './helpers'

export class TrackableObject {
  constructor(o, addStateDefinition) {
    if (Helpers.isTrackable(o)) {
      throw new Error('Trackers do not like to be tracked.');
    }

    if (!Helpers.isObject(o)) {
      throw new Error('Only an Object can learn how to track.');
    }

    Helpers.createTrackableContainer(this);

    Object.defineProperty(this._trackable.configuration, 'addStateDefinition', {
      enumerable: false,
      writable: true,
      configurable: false,
      value: { 'Version': null }
    });

    if (addStateDefinition) {
      this._trackable.configuration.addStateDefinition = addStateDefinition;
    }

    this.newTrackingWorkspace();
  }

  state() {
    let workspace = this._trackable.workspaces[0];

    switch (workspace.currentState) {
      case 'a': return 'added';
      case 'u': return 'updated';
      case 'd': return 'deleted';
      case 'n': return 'none';
      default:  throw new Error('Trackable object has an unknown state.');
    }
  }

  newTrackingWorkspace() {
    let workspace = {
      changes: [],
      state: {
        current: undefined,
        original: undefined
      }
    };

    this._trackable.workspaces.unshift(workspace);

    Helpers.evaluateState();

    workspace.state.original = workspace.state.current;
  }

  hasChanges() {
    let workspace = this._trackable.workspaces[0];
    return workspace.changes.length > 0 || workspace.state.current !== workspace.state.original;
  }

  hasChangesAcrossWorkspaces() {
    let w = this._trackable.workspaces.length;

    while (w--) {
      let workspace = this._trackable.workspaces[w];
      if (workspace.changes.length > 0 || workspace.state.current !== workspace.state.original) {
        return true;
      }
    }

    return false;
  }

  undoChanges() {
  }

  undoChangesAcrossWorkspaces() {
  }

  asNonTrackable() {
  }
}
