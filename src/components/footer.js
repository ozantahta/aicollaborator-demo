/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/alt-text */
import "../css/footer.css"
import React from "react";
import logo from "../images/AIC_logo.png";

export default function Footer(){
    const currentYear = new Date().getFullYear()
    return(
        <div class="footer__container">
        <div class="social__media">
            <div class="social__media--wrap">
                <div class="footer__logo">
                    <a href="/"><img src={logo} className="AIC__logo"/></a>
                </div>
                <p class="website__right">© {currentYear} - AI Collaborator, Inc. - All rights reserved.</p>
                <div class="social__icons">
                    <a href="https://twitter.com/AiCollaborator" class="social__icon--link">
                        <i class="fab fa-twitter"></i>
                    </a>
                    <a href="https://www.linkedin.com/company/aicollaborator/" class="social__icon--link">
                        <i class="fab fa-linkedin"></i>
                    </a>
                </div>
            </div>
        </div>
    </div>
    )
} 
// <footer>
// <p>Copyright ⓒ {currentYear}</p>
// </footer>