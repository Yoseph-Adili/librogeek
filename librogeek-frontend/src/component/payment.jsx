import CustomizeTitle from "./cuntomizeTitle.jsx";
import {useContext, useEffect, useState} from "react";
import {UserContext} from "../App.jsx";
import {API_URL} from "../config/api.js";
import alert from "../config/utils.js";

const Payment = () => {
    const [shoppingInfo, setShoppingInfo] = useState(true)
    const [paymentOption, setPaymentOption] = useState("")
    const [cart, setCart] = useState(() => {
        const stored = JSON.parse(localStorage.getItem("cart"));
        return Array.isArray(stored) ? stored : [];
    });
    const hasPhysicalBook = cart.some(item => item.book_type === "PHYSICAL");
    const [allAddresses, setAllAddresses] = useState([]);
    const {loginUser} = useContext(UserContext);
    const token = localStorage.getItem("token");
    const [selectedAddressId, setSelectedAddressId] = useState(null);

    useEffect(() => {

        if (!loginUser) return;
        fetch(`${API_URL}/shipping/getUserShippingInfo`, {
            headers: {"Authorization": "Bearer " + token}
        })
            .then(res => res.json())
            .then(data => {

                if (data.data.success) {
                    setAllAddresses(data.data.data);
                }
            })
            .catch(err => {
                console.error(err);
            });

    }, []);

    function addShoppingInfo(e) {
        e.preventDefault();
        if (!loginUser) return alert("Please login to add shopping info");

        const payload = {
            fullName: e.target.fullName.value,
            phoneNumber: e.target.telephone.value,
            addressLine1: e.target.addressLine1.value,
            addressLine2: e.target.addressLine2.value,
            city: e.target.city.value,
            country: e.target.country.value,
            postcode: e.target.postCode.value
        };

        console.log("Payload to send:", payload);

        fetch(`${API_URL}/shipping/addShippingRequest`, {
            method: "POST", headers: {
                "Authorization": "Bearer " + token, "Content-Type": "application/json"
            }, body: JSON.stringify(payload)
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    alert("Shipping info added successfully");
                    window.location.reload();
                } else {
                    alert("Failed to add shipping info: " + data.message);
                }
            })
            .catch(err => {
                alert("Internal server error: " + err.message);
            });
    }
    function addPayment(e) {
        e.preventDefault();
        if (!loginUser) return alert("Please login to add shopping info");

        const payload = {
          books: cart,
          shippingInfoId: selectedAddressId,
          paymentMethod: paymentOption.toUpperCase().trim()
        };



        fetch(`${API_URL}/shipping/addPayment`, {
            method: "POST", headers: {
                "Authorization": "Bearer " + token, "Content-Type": "application/json"
            }, body: JSON.stringify(payload)
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    alert("Shipping info added successfully");
                    window.location.reload();
                } else {
                    alert("Failed to add shipping info: " + data.message);
                }
            })
            .catch(err => {
                alert("Internal server error: " + err.message);
            });
    }

    console.log(allAddresses);
    return (

        <div className="payment-container">
            <CustomizeTitle title={"Payment"}></CustomizeTitle>
            {shoppingInfo ? (<form action="" className={"payment-form"} onSubmit={addPayment}>
                    {hasPhysicalBook ? (<div>
                            <h2>Address</h2>
                            <div className={"addresses-container"}>
                                {allAddresses.map((address) => (
                                    <div key={address.shippingInfoId}
                                         className={`address-item ${selectedAddressId == address.shippingInfoId ? "active" : ""}`}
                                         onClick={() => {
                                             setSelectedAddressId(address.shippingInfoId)
                                         }}><input
                                        type="radio"
                                        id={`address-${address.shippingInfoId}`}
                                        name="address"
                                        value={address.shippingInfoId}
                                        checked={selectedAddressId === address.shippingInfoId}
                                    />

                                        <h3>{address.fullName}</h3>
                                        <p>{address.addressLine1}</p>
                                        <p>{address.addressLine2}</p>
                                        <p>{address.postcode}</p>
                                        <p>
                                            <span>{address.city}</span>
                                            <span>{address.country}</span>
                                        </p>

                                    </div>))}


                                <div className={"add-new-shopping-info-container"} onClick={() => {
                                    setShoppingInfo(false)
                                }}>
                                    <b>+</b>
                                    <span>Add new address</span>
                                </div>
                            </div>
                        </div>
                    ) : null}
                    <h2>Payment method</h2>
                    <select name="payment" id="payment" value={paymentOption}
                            onChange={(e) => setPaymentOption(e.target.value)}>
                        <option value="ideal">iDEAL</option>
                        <option value="paypal">PayPal</option>
                        <option value="stripe">Stripe</option>
                        <option value="credit_card">Credit Card</option>
                    </select>
                    {paymentOption === "credit_card" ? (<div className={"credit-cart-info"}>
                        <div>
                            <label htmlFor="cardOwnerName">Card holder Name</label>
                            <input type="text" id="cardOwnerName" name="cardOwnerName"/>
                        </div>
                        <div>
                            <label htmlFor="cardNumber">Card Number</label>
                            <input type="number" id="cardNumber" name="cardNumber"/>
                        </div>
                        <div id="creadit-date-container">
                            <div>
                                <label htmlFor="expiredDate">Expired date</label>
                                <input type="text" id="expiredDate" name="expiredDate"/>
                            </div>
                            <div>
                                <label htmlFor="cvv">CVV</label>
                                <input type="num" id="cvv" name="cvv"/>
                            </div>
                        </div>
                    </div>) : null}

                    <button>Order</button>
                </form>)
                :
                (<form action="" className={"shipping-info-form"} onSubmit={addShoppingInfo}>
                    <div>
                        <label htmlFor="fullName">Full Name</label>
                        <input type="text" id={"fullName"} name={"fullName"}/>
                    </div>
                    <div>
                        <label htmlFor="telephone">Telephone Number</label>
                        <input type="text" id={"telephone"} name={"telephone"}/>
                    </div>
                    <div>
                        <label htmlFor="addressLine1">Address</label>
                        <input type="text" id={"addressLine1"} name={"addressLine1"}/>
                    </div>
                    <div>
                        <label htmlFor="addressLine2">Extra info</label>
                        <input type="text" id={"addressLine2"} name={"addressLine2"}/>
                    </div>
                    <div id={"city-container"}>
                        <div>
                            <label htmlFor="city">City</label>
                            <input type="text" id={"city"} name={"city"}/>
                        </div>
                        <div>
                            <label htmlFor="postCode">Post Code</label>
                            <input type="text" id={"postCode"} name={"postCode"}/>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="country">Country</label>
                        <input type="text" id={"country"} name={"country"}/>
                    </div>
                    <div id={"address-button-container"}>
                    <span className={"back-to-addresses"} onClick={() => {
                        setShoppingInfo(true)
                    }}>Back to payment options
                    </span>
                        <button>Add Shopping info</button>
                    </div>
                </form>)
            }
        </div>

    )
}
export default Payment