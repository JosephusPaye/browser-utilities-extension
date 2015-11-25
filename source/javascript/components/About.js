// About component
Components.About = Vue.extend({
    template: '#about',
    
    data: function() {
        return {
            view: Shared.view,
            data: Shared.data,
            about: {
                version: '2.0'
            }
        };
    },
    
    route: {
        data: function() {
            this.view.title = 'About';
            this.view.canGoBack = true;
            this.view.showAboutBtn = false;
        }
    }
});
