import './css/login.css'
import Logo from "../component/logo.jsx";
import {Link} from "react-router-dom";
const SignUp = () => {

    return (

        <main className={"login-main"}>
            <div>
                <Logo className={"logo-tag"}></Logo>
                <span>ibroGeek</span>
            </div>
            <form action="">

                <label htmlFor="name">Name</label>
                <input type="text" name="name" id="name"/>
                <label htmlFor="username">User Name</label>
                <input type="text" name="username" id="username"/>
                <label htmlFor="username">Password</label>
                <input type="text" name="username" id="username"/>
                <label htmlFor="email">Email</label>
                <input type="email" name="email" id="email"/>
                <button>
                    Login
                </button>

            </form>
            <div>
                <Link to={"/"}>Return to home page</Link>
                <Link to={"/login"}>Have account?</Link>
            </div>

        </main>

    );
};

export default SignUp;
