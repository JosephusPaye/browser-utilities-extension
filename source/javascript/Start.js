// Enable Vue debug mode
// Vue.config.debug = true;

var Components = {};

// Shared view state and data
var Shared = {
    view: {
        title: 'Browser Utilities',
        canGoBack: false,
        showAboutBtn: true
    },

    data: {
        currentTab: {
	        url: '',
	        id: null
	    }
    }
};

// Get current tab url and id
chrome.tabs.query({
    'active': true,
    'windowId': chrome.windows.WINDOW_ID_CURRENT
}, function(tabs) {
    Shared.data.currentTab.url = tabs[0].url;
    Shared.data.currentTab.id = tabs[0].id;
});
