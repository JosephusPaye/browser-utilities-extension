// Wayback Machine component
Components.WaybackMachine = Vue.extend({
    template: '#wayback-machine',
    
    data: function() {
        return {
            view: Shared.view,
            data: Shared.data,

            inputUrl: Shared.data.currentTab.url,
            
            page: {
                available: false,
                latestSnapshotDate: '',
                openUrl: ''
            },

            loading: true,

            waybackMachineApiUrl: 'http://archive.org/wayback/available?url=',
            waybackMachineUrl: 'https://web.archive.org/web/*/'
        };
    },

    ready: function() {
        this.queryApi();
    },
    
    route: {
        data: function() {
            this.view.title = 'Internet Archive&trade; history';
            this.view.canGoBack = true;
            this.view.showAboutBtn = false;
        }
    },
    
    watch: {
        'inputUrl': function (val, oldVal) {
            this.queryApi();
        }
    },

    methods: {
        /**
         * Send a request to the Wayback Machine API
         */
        queryApi: function() {
            this.loading = true;
            
            var requestUrl = this.waybackMachineApiUrl + this.inputUrl;
    
            axios.get(requestUrl)
                .then(this.processApiResponse)
                .catch(function(error) {
                    this.page.available = false;
                    this.loading = false;
                }.bind(this));
        },
    
        /**
         * Process the response from the Wayback Machine API
         * 
         * @param  Object   response
         */
        processApiResponse: function(response) {
            var data = response.data.archived_snapshots.closest;
                    
            // Check if returned data is empty
            if (! Object.keys(data).length ) {
                this.page.available = false;
                this.loading = false;

                return;
            }
            
            // Set date and url to open
            this.page.latestSnapshotDate = this.formatDate(data.timestamp);                
            this.page.openUrl = data.url;
            
            // Hide the spinner and show data
            this.loading = false;
            this.page.available = true;
        },

        /**
         * Convert the returned timestamp to a human-readable format
         * 
         * @param  String   timestamp
         * @return String
         */
        formatDate: function(timestamp) {
            var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

            var date = {
                year: timestamp.substring(0, 4),
                month: timestamp.substring(4, 6),
                day: timestamp.substring(6, 8)
            };

            return months[(date.month - 1)] + ' ' + date.day + ', ' + date.year;
        }
    }
});
