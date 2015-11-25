// Main app component
var App = Vue.extend({
    data: function() {
        return {
            view: Shared.view
        };
    },
    
    ready: function() {
        // Intialize stuff here
    },
    
    methods: {
        goBack: function() {
            if (this.view.canGoBack) {
                history.back();
            }
        }
    }
});

// Create router instance
var router = new VueRouter();

// Define routes (each route maps to a component)
router.map({
    '/home': {
        component: Components.Home,
        name: 'home'
    },
    
    '/about': {
        component: Components.About,
        name: 'about'
    },
    
    '/qr-code': {
        component: Components.QR,
        name: 'generate-qr'
    },

    '/wayback-machine': {
        component: Components.WaybackMachine,
        name: 'wayback-machine'
    },

    '/short-link': {
        component: Components.ShortLink,
        name: 'short-link'
    }
});

// Redirect to the home by default
router.redirect({
    '*': '/home'
});

// Start the app
router.start(App, 'body');
