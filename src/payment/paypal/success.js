import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

export default function Success({match}) {
    let param = useParams();
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());   
    useEffect(() => {
        
        console.log("Success Params",params);
       //return fetch("http://localhost:1203/api/v1/employer/payment") 
    });
    return (
        <>
            We are validating your payment...
        </>
    )
}