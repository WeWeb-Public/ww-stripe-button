<template>
    <div>
        <!-- to remove -->
        <button style="pointer-events: all;" id="customButton">Purchase</button>
        <wwObject :wwObject="wwObject.data.stripeButton" id="customButton"></wwObject>
    </div>
</template>


<script>
export default {
    name: "ww-stripe-button",
    props: {
        wwObjectCtrl: Object
        // sectionCtrl: Object
    },
    data() {
        return {
            publicKey: '',
            stripeButtonInfo: {},
            apiUrl: 'http://localhost:3120/api/v1'
        };
    },
    computed: {
        wwObject() {
            // return this.sectionCtrl.get();
            return this.wwObjectCtrl.get();
        }
    },
    methods: {
        // front
        async charge(data) {
            try {
                data.buttonId = this.wwObject.id
                await axios.post(`${this.apiUrl}/front/design/${wwLib.$store.state.websiteData.design.info.id}/stripe/charge`, data)
            } catch (err) {
                console.error(err)
            }
        },
        async getPublicKey() {
            try {
                const response = await axios.get(`${this.apiUrl}/front/design/${wwLib.$store.state.websiteData.design.info.id}/stripe/public_key`)
                this.publicKey = response.data.publicKey
                console.log('Public Key :', this.publicKey)
            } catch (err) {
                console.error(err)
            }
        },
        async getStripeButtonInfo() {
            try {
                await this.createStripeButton() // to remove
                const response = await axios.get(`${this.apiUrl}/front/design/${wwLib.$store.state.websiteData.design.info.id}/stripe/buttons/${this.wwObject.id}`)
                this.stripeButtonInfo = response.data.button
                console.log('Stripe button info :', this.stripeButtonInfo)
            } catch (err) {
                console.error(err)
            }
        },
        // manager
        async updateStripeButtonInfo(data) {
            try {
                const response = await axios.put(`${this.apiUrl}/manager/design/${wwLib.$store.state.websiteData.design.info.id}/stripe/buttons/${this.wwObject.id}`, data)
                this.stripeButtonInfo = response.data.button
            } catch (err) {
                console.error(err)
            }
        },
        async createStripeButton() {
            try {
                const data = {
                    buttonId: this.wwObject.id,
                    amount: 500,
                    description: 'La description de mon payement',
                    currency: 'eur'
                }

                const route = `${this.apiUrl}/manager/design/${wwLib.$store.state.websiteData.design.info.id}/stripe/buttons`
                this.stripeButtonInfo = await axios.post(route, data)
            } catch (err) {
                console.error(err)
            }
        },
        async removeStripeButton() {
            try {
                await axios.delete(`${this.apiUrl}/manager/design/${wwLib.$store.state.websiteData.design.info.id}/stripe/buttons/${this.wwObject.id}`)
            } catch (err) {
                console.error(err)
            }
        },
        initStripeButton () {
            const self = this
            let handler = StripeCheckout.configure({
                key: self.publicKey,
                image: 'https://stripe.com/img/documentation/checkout/marketplace.png',
                locale: 'auto',
                token: async function(token) {
                    // You can access the token ID with `token.id`.
                    // Get the token ID to your server-side code for use.
                    await self.charge(token)
                }
            })

            document.getElementById('customButton').addEventListener('click', function(e) {
                // Open Checkout with further options:
                handler.open({
                    name: wwLib.$store.state.websiteData.design.info.title || 'Mon Titre',
                    description: self.stripeButtonInfo.description || 'Ma description',
                    zipCode: self.stripeButtonInfo.zipCode || true,
                    currency: self.stripeButtonInfo.currency || 'eur',
                    amount: self.stripeButtonInfo.amount || 20
                })
                e.preventDefault()
            })

            // Close Checkout on page navigation:
            window.addEventListener('popstate', function() {
                handler.close()
            })
        }
    },
    mounted: async function () {
        await this.getPublicKey()
        await this.getStripeButtonInfo()

        if (!this.wwObject.data.stripeButton)
            this.wwObject.data.stripeButton = wwLib.wwObject.getDefaultContent('ww-button')

        this.initStripeButton()
        
        this.$emit('ww-stripe-button', this)
    }
};
</script>
