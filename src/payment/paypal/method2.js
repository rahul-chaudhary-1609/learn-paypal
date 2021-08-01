import React, { useEffect} from "react";

function Method2() {

    useEffect(() => {
        window.paypal.Button.render({
            env: 'sandbox', // Or 'production'
            // Set up the payment:
            // 1. Add a payment callback
            payment: function (data, actions) {
                // 2. Make a request to your server
                return actions.request.post('http://localhost:1203/api/v1/employer/createPaymentMethod2')
                    .then(function (res) {
                        // 3. Return res.id from the response
                        console.log("Data", data);
                        console.log("res", res);
                        return res.id;
                    });
            },
            // Execute the payment:
            // 1. Add an onAuthorize callback
            onAuthorize: function (data, actions) {
                // 2. Make a request to your server
                return actions.request.post('http://localhost:1203/api/v1/employer/executePayment', {
                    paymentID: data.paymentID,
                    payerID: data.payerID
                })
                    .then(function (res) {
                        console.log("Data", data);
                        console.log("res", res);
                        // 3. Show the buyer a confirmation message.
                    });
                    
            }
        }, '#paypal-button')    ;
    },[])
    return (
        <>
            

            <div id="paypal-button"></div>
                
        </>
    )
}

export default Method2;