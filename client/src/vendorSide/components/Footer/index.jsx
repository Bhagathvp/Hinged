import React from "react"
import FooterTop from "../Footer-top/FooterTop";
import FooterMiddle from "../Footer-middle/FooterMiddle";
import FooterCredits from "../Footer-credits/FooterCredits";


const Footer = () => {
  return (
    <>
      <footer className='container md:max-w-screen-md  mx-auto '>
        <FooterTop/>
        <FooterMiddle/>
      </footer>
      <FooterCredits/>
    </>
  );
};


export {Footer};
