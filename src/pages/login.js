import Image from "next/image";
import Link from "next/link";
import Logo from "src/core/components/Logo";
import LoginForm from "src/login/components/LoginForm";
import login from "../../public/assets/login.png";
import { useState } from "react";
import LoginSubmitted from "src/login/components/LoginSubmitted";

export default function LoginPage() {
  const [submit, setSubmit] = useState("");
  return (
    <div className="grid-halves h-screen">
      <div className="border-right bg-offwhite">
        <div className="column-padding">
          <div className="tablet-centered">
            <Link href="/" className="logo-container">
              <Logo style={{ width: 150 }} />
            </Link>
            {submit ? (
              <LoginSubmitted submit={submit} />
            ) : (
              <LoginForm setSubmit={setSubmit} />
            )}
          </div>
        </div>
      </div>
      <div className="bg-navy border-right">
        <Image src={login} alt="login" className="callout-image" />
      </div>
    </div>
  );
}
