import { connect } from 'react-redux';
import { State } from './../../reduxStore/index';
import { 
  getLocationsSelector, 
  getLocationsAction,
  createLocationActions
} from './../../reduxStore/locations/index';
import LocationList from '../../components/location/LocationsList.Component'

const mapStateToProps: any = (state: State) => ({
  locations: getLocationsSelector(state)
})

const mapDispatchToProps = {
  getLocations:  getLocationsAction,
  createLocation: createLocationActions
}

export default connect<any, any, any>(mapStateToProps, mapDispatchToProps)(LocationList)