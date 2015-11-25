// QR code component
Components.QR = Vue.extend({
    template: '#generate-qr',
    
    data: function() {
        return {
            view: Shared.view,
            data: Shared.data,
            qrInput: Shared.data.currentTab.url
        };
    },

    computed: {
        qrImageUrl: function() {
            return qr.toDataURL({ 
                mime: 'image/png', 
                level: 'M',
                size: 10,
                value: this.qrInput
            });
        }
    },
    
    route: {
        data: function() {
            this.view.title = 'Generate QR Code';
            this.view.canGoBack = true;
            this.view.showAboutBtn = false;
        }
    },
    
    methods: {
        downloadQRCode: function() {
            var fileContents = this.qrImageUrl.replace(/^data:image\/[^;]/, 'data:application/octet-stream');
            Helper.downloadFile('qr-code.png', fileContents);
        }
    }
});
