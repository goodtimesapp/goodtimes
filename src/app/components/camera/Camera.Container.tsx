import { connect } from 'react-redux';
import { State } from './../../reduxStore/index';
import {   
  createLocationActions
} from './../../reduxStore/locations/index';
import Camera from '../../components/camera/Camera'

const mapStateToProps: any = (state: State) => ({
  
})

const mapDispatchToProps = {
  createLocation: createLocationActions
}

export default connect<any, any, any>(mapStateToProps, mapDispatchToProps)(Camera)