import { Button } from "antd"
import React from "react";

const SignInPage = () => {
    function handleGoggleSignIn() {
        // @ts-ignore
        window.location.href = import.meta.env.VITE_LOGIN_GOGGLE_URL;
    }

    return (
        <Button onClick={handleGoggleSignIn}>Login with goggle</Button>
    )
}

export default SignInPage;