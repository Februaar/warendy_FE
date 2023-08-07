import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import styles from "./InputForm.module.css";
import { useRecoilState, useSetRecoilState } from "recoil";
import { userTokenState } from "../recoil/atoms";
import { postLogin } from "../pages/services/api";
import InputForm from "./InputForm";
import Modal from "./Modal";

const SigninForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [isValidPassword, setIsValidPassword] = useState(true);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isAppropriate, setIsAppropriate] = useState(true);
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  const router = useRouter();
  const setUserToken = useSetRecoilState(userTokenState);
  const [token, setToken] = useRecoilState(userTokenState);

  const handleLogin = async () => {
    const loginInform = {
      email: email,
      password: password,
    };

    try {
      setIsAppropriate(true);

      if (!isFormValid) {
        setShowErrorMessage(true);
        return;
      }

      const loginResponse = await postLogin(loginInform);
      console.log("Login Response:", loginResponse);

      setToken(loginResponse);

      sessionStorage.setItem("userTokenState", loginResponse);

      router.push("/");
    } catch (error) {
      setIsAppropriate(false);
      console.error("Error fetching data:", error);
      setShowErrorMessage(true);
    }
  };

  useEffect(() => {
    let timer;
    if (!isAppropriate) {
      setShowErrorMessage(true);
      timer = setTimeout(() => {
        setShowErrorMessage(false);
      }, 5000);
    }
    return () => {
      clearTimeout(timer);
    };
  }, [isAppropriate]);

  useEffect(() => {
    setIsFormValid(isValidEmail && isValidPassword);
  }, [isValidEmail, isValidPassword]);

  return (
    <>
      <Image
        src="/images/logo.svg"
        alt="Logo"
        className={styles.logo}
        width={150}
        height={50}
      />
      <div className={styles.contentArea}>
        <InputForm
          type="signin"
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          isValidEmail={isValidEmail}
          setIsValidEmail={setIsValidEmail}
          isValidPassword={isValidPassword}
          setIsValidPassword={setIsValidPassword}
          onSubmit={handleLogin} // Pass handleLogin as onSubmit prop
        />
        {showErrorMessage && <Modal />}
        <Link href="/sign-up" className={styles.btnSignup}>
          이메일 가입
        </Link>
        <button className={`${styles.btnSocial} ${styles.kakao} + " btn "`}>
          <Image
            src="/images/kakao.svg"
            alt="Logo"
            className={styles.social}
            width={30}
            height={30}
          />
          카카오톡으로 로그인
        </button>
      </div>
    </>
  );
};

export default SigninForm;
