import { getLocations as getLocationsSelector } from './selectors/select.locations';
import { getLocations as getLocationsAction } from './actions/get.locations';
import { createLocation as createLocationActions } from './actions/create.location'
import { reducer as reduceLocations } from './reducers/reduce.locations';

export {
    getLocationsAction,
    createLocationActions,
    getLocationsSelector,
    reduceLocations
}