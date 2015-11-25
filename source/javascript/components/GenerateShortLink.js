// Wayback Machine component
Components.ShortLink = Vue.extend({
    template: '#generate-short-link',
    
    data: function() {
        return {
            view: Shared.view,
            data: Shared.data,

            inputUrl: Shared.data.currentTab.url,
            
            generatedLink: {
                url: '',
                longUrl: ''
            },

            loading: true,
            requestError: false,
            copySuccess: false,

            googleApiUrl: 'https://www.googleapis.com/urlshortener/v1/url',
            googleApiKey: 'AIzaSyB8HniKlQA1XjO47XoY0bKaWcFrYw8-rto'
        };
    },

    ready: function() {
        this.queryApi();
    },
    
    route: {
        data: function() {
            this.view.title = 'Generate short link';
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
         * Copy text to the clipboard
         */
        copyLink: function(e) {
            var clipboardSpot = document.getElementById('clipboard-spot');

            clipboardSpot.innerText = this.generatedLink.url;
            clipboardSpot.select();

            var success = document.execCommand('copy');

            if (success) {
                this.copySuccess = true;

                setTimeout(function() {
                    this.copySuccess = false;
                }.bind(this), 3000);
            }
        },

        /**
         * Send a request to the Wayback Machine API
         */
        queryApi: function() {
            this.loading = true;
            
            var requestUrl = this.googleApiUrl + '?key=' + this.googleApiKey;

            axios.post(requestUrl, { 'longUrl': this.inputUrl })
                .then(this.processApiResponse)
                .catch(function() {
                    this.requestError = true;
                    this.loading = false;
                }.bind(this));
        },
    
        /**
         * Process the response from the Google Short URL API
         * 
         * @param  Object   response
         */
        processApiResponse: function(response) {
            var data = response.data;
    
            // Set the generated URL
            this.generatedLink.url = data.id;
            this.generatedLink.longUrl = data.longUrl;

            this.requestError = false;
            this.loading = false;
        }
    }
});
