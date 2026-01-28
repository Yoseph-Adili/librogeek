import {Link, useParams} from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import {API_URL, STATIC_URL} from "../config/api.js";
import {UserContext} from "../App.jsx";
import "./editUser.css"
import alert from "../config/utils.js";


const EditUser = () => {
    const {userId} = useParams();
    const token = localStorage.getItem("token") || null;
    const [userImage, setUserImage] = useState(STATIC_URL + "/profile/unknown.jpg");
    const [user, setUser] = useState([])
    const {loginUser} = useContext(UserContext);
    const [allAddresses, setAllAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    useEffect(() => {

        if (!loginUser || loginUser.role !== "ADMIN") return;
        fetch(`${API_URL}/users/editUser/${userId}`, {
            method: "GET",
            headers: {Authorization: `Bearer ${token}`, "Content-Type": "application/json"},
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setUser(data.data);
                    if (data.data.profile_photo) {
                        setUserImage(STATIC_URL + "/" + data.data.profile_photo)
                    }

                }
            });

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

    }, [loginUser]);

    function handleChange(e) {
        const {name, value} = e.target;
        setUser(prev => ({...prev, [name]: value}));
    }
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
    return (
        <div className={"edit-user-page-container"}>

            <div className="user-info-container">
                <div className="profile-photo">
                    <img src={userImage} alt="profile"/>
                </div>
                <form className="user-info" id={"edit-user-form"}>
                    <p>Name</p>
                    <input type={"text"} name={"name"} value={user.name} id={"editUserName"} onChange={handleChange}/>
                    <p>Username</p>
                    <span>@</span><input type={"text"} name={"username"} value={user.username} id={"editUserUsername"}/>
                    {/*<p>@{user.username}</p>*/}
                    <p>Email</p>
                    <input type="email" name="email" value={user.email} id="editUserUsername"/>

                    <button className={"save-user-info-btn"}>Save</button>
                </form>
            </div>
            <p className={"address-label"}>Address</p>
            <div className={"addresses-container"}>
                {allAddresses.map((address) => (
                    <div key={address.shippingInfoId}
                         className={`address-item ${selectedAddressId == address.shippingInfoId ? "active" : ""}`}
                         onClick={() => {
                             setSelectedAddressId(address.shippingInfoId)
                         }}>
                        <input
                            type="radio"
                            id={`address-${address.shippingInfoId}`}
                            name="address"
                            value={address.shippingInfoId}
                            checked={selectedAddressId === address.shippingInfoId}
                            onChange={() => setSelectedAddressId(address.shippingInfoId)}
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
    );
}
export default EditUser;