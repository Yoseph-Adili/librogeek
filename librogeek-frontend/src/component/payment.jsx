import CustomizeTitle from "./cuntomizeTitle.jsx";
import {useState} from "react";

const Payment = () => {
    const [shoppingInfo, setShoppingInfo] = useState(true)
    const [paymentOption, setPaymentOption] = useState("")
    const [cart, setCart] = useState(() => {
        const stored = JSON.parse(localStorage.getItem("cart"));
        return Array.isArray(stored) ? stored : [];
    });
    console.log(cart)
    const hasPhysicalBook = cart.some(item => item.book_type === "PHYSICAL");




    return (

        <div className="payment-container">
            <CustomizeTitle title={"Payment"}></CustomizeTitle>
            {shoppingInfo ? (
                <form action="" className={"payment-form"}>
                    {hasPhysicalBook ? (
                        <div>
                            <h2>Address</h2>
                            <div className={"addresses-container"}>
                                <input type="radio" id="address-1" name="address" value="1" defaultChecked/>
                                <label htmlFor="address-1">
                                    <h3>full name</h3>
                                    <p>address straaat 55</p>
                                    <p>22</p>
                                    <p>1315vg</p>
                                    <p><span>rijssen</span><span>Nederland</span></p>
                                </label>

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
                    {paymentOption === "credit_card" ? (
                        <div className={"credit-cart-info"}>
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
                        </div>
                    ) : null}

                    <button>Order</button>
                </form>
            ) : (
                <form action="" className={"shipping-info-form"}>
                    <div>
                        <label htmlFor="fullName">Full Name</label>
                        <input type="text" id={"fullName"} name={"fullName"}/>
                    </div>
                    <div>
                        <label htmlFor="telephone">Telephone Number</label>
                        <input type="tel" id={"telephone"} name={"telephone"}/>
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
                    <button>Add Shopping info</button>
                </form>
            )}
        </div>

    )
}
export default Payment