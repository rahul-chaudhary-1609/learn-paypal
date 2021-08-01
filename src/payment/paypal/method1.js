import React, {useRef} from "react";

function Method1() {

  let amountRef = useRef();

  async function handlePay(e) {
    e.preventDefault();
    console.log("amount:", amountRef, amountRef.current.value)
    let amount = amountRef.current.value;
    return fetch("http://localhost:1203/api/v1/employer/payment",
      {
        method: "POST",
        headers: {
          "Content-Type":"application/json"
        },
        body: JSON.stringify({amount})
      }).then((res) => {
        console.log("res",res)        
        return res.json();
      }).then((data) => {
        console.log("Data", data);
        //window.location.href = data.body.data.href;
      }).catch((e) => {
        console.log("e", e);
      });
  }
  return (
    <div >
      <h1>PayPal-Payment</h1>
      <input ref={amountRef} type="text" name/>
      <button onClick={handlePay}>Pay</button>


      <form action="">

      </form>
      
    </div>
  );
}

export default Method1;
