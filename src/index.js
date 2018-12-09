import wwObject from './wwObjectStripeButton.vue'

const name = "ww-stripe-button";

const addComponent = function () {
    if (window.vm) {

        wwLib.wwObject.register({
            content: {
                type: name,
                data: {}
            },
            upsales: {
                wwAnalytics: {
                    click: false
                }
            },
            /* wwManager:start */
            cmsOptions: {
            }
            /* wwManager:end */
        });

        window.vm.addComponent(name, wwObject);

        // Download script stripe for pop up
        let scriptSrc = 'https://checkout.stripe.com/checkout.js'
        // Add script stripe map to head
        let ckeditor = document.createElement('script');
        ckeditor.setAttribute('src', scriptSrc);
        document.head.appendChild(ckeditor);

        return true;
    }
    return false;
}

if (!addComponent()) {
    const iniInterval = setInterval(function () {
        if (addComponent()) {
            clearInterval(iniInterval);
        }
    }, 10);
}