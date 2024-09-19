import SignOutComponent from "../components/SignOut";


const LoggedInHomePage = () => {

    return (
        <div>
            <SignOutComponent/>

            <div>
                <h1>Hello, username</h1>
            </div>
        </div>
    );
};

export default LoggedInHomePage;