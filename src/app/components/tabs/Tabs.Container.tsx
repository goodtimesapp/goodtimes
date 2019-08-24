import { connect } from 'react-redux';
import { State } from './../../reduxStore';
import { 
  getTabsSelectors, 
  getTabsActions,
  createTabsActions
} from './../../reduxStore/tabs/index';
import TabsComponent from './Tabs.Component'

const mapStateToProps: any = (state: State) => ({
 tabs: getTabsSelectors(state)
})

const mapDispatchToProps = {
  getTabs:  getTabsActions,
  createTabs: createTabsActions
}

export default connect<any, any, any>(mapStateToProps, mapDispatchToProps)(TabsComponent)