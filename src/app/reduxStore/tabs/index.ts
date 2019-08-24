import { getTabs as getTabsSelectors } from './selectors/select.tabs.selectors';
import { getTabs as getTabsActions } from './actions/get.tabs.actions';
import { createTabs as createTabsActions } from './actions/create.tabs.actions'
import { reducer as reduceTabs } from './reducers/reduce.tabs.reducers';

export {
    getTabsActions,
    createTabsActions,
    getTabsSelectors,
    reduceTabs
}