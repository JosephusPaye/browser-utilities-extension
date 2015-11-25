// Home Component
Components.Home = Vue.extend({
    template: '#home',
    
    data: function() {
        return {
            view: Shared.view,
            data: Shared.data
        };
    },
    
    route: {
        data: function() {
            this.view.title = 'Browser Utilities';
            this.view.canGoBack = false;
            this.view.showAboutBtn = true;
        }
    }
});
