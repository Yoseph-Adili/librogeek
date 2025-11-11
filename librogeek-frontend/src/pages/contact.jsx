import './css/contact.css'
import CustomizeTitle from "../component/cuntomizeTitle.jsx";
const Contact = () => {
    return (
        <div className="contact-container">
           <div className="text-container">
               <CustomizeTitle title={"Contact"}></CustomizeTitle>
               <p>
                   Have a question? We’ll respond within a day.
               </p>
           </div>
            <div className="form-container">
                <form action="">
                    <label htmlFor="name">Name</label>
                    <input type="text" name="name" id="name"/>
                    <label htmlFor="email">Email</label>
                    <input type="email" name="email" id="email"/>
                    <label htmlFor="message">Message</label>
                    <textarea name="message" id="message"></textarea>
                </form>
            </div>
        </div>
    );
};

export default Contact;