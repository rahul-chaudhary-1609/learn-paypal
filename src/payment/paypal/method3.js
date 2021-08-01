import React, {useEffect} from "react";


function Method3() {

    useEffect(() => {
        window.paypal.Buttons({
            createOrder: function() {
                    return fetch('http://localhost:1203/api/v1/employer/createPaymentMethod1', {
                    method: 'post',
                    headers: {
                    'content-type': 'application/json'
                    }
                }).then(function(res) {
                    return res.json();
                }).then(function(data) {
                    return data.orderID; // Use the key sent by your server's response, ex. 'id' or 'token'
                });
            },
            onApprove: function(data) {
                fetch('http://localhost:1203/api/v1/employer/capturePayment', {
                    method: 'post',
                    headers: {
                    'content-type': 'application/json'
                    },
                    body: JSON.stringify({
                    orderID: data.orderID
                    })
                }).then(function (res) {
                    return res.json();
                }).then(function (details) {
                    console.log("Details",details);
                    alert('Transaction funds captured from ' + details.payer_given_name);
                })

                return fetch('http://localhost:1203/api/v1/employer/getPaymentDetails', {
                    method: 'post',
                    headers: {
                    'content-type': 'application/json'
                    },
                    body: JSON.stringify({
                    orderID: data.orderID
                    })
                }).then(function (res) {
                    return res.json();
                }).then(function (details) {
                    console.log("Details",details);
                    alert('Transaction funds captured from ' + details.payer_given_name);
                })
            }
        }).render('#paypal-button-container');
    },[])

   
    return (
        <>
            <div id="paypal-button-container"></div>
        </>
    )
}

export default Method3;