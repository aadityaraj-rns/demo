import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import SmallLogoLight from "/src/assets/images/logos/firedesk_logo1.png"
import SmallLogoDark from "/src/assets/images/logos/firedesk_logo2.png"
import ExpandedLogoDark from "/src/assets/images/logos/firedesk_orange_logo.png";
import ExpandedLogoLight from "/src/assets/images/logos/firedesk_orange_logo.png";
import LogoDarkRTL from "/src/assets/images/logos/logo.png";
import LogoLightRTL from "/src/assets/images/logos/logo.png";
import { styled } from "@mui/material";
import { useEffect, useRef, useState } from "react";

const Logo = () => {
  const customizer = useSelector((state) => state.customizer);
  const LinkStyled = styled(Link)(() => ({
    height: customizer.TopbarHeight,
    width: customizer.isCollapse ? "40px" : "180px",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }));

  const getLogoSrc = () => {
    if (customizer.activeDir === "ltr") {
      return customizer.activeMode === "dark" ? { SmallLogo: SmallLogoLight, ExpandedLogo:  ExpandedLogoLight} : { SmallLogo: SmallLogoDark, ExpandedLogo:  ExpandedLogoDark};
    } else {
      return customizer.activeMode === "dark" ? LogoDarkRTL : LogoLightRTL;
    }
  };

  const linkRef = useRef(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (linkRef.current) {
      setWidth(linkRef.current.offsetWidth);
    }
  }, [customizer.isCollapse, customizer.TopbarHeight]); // Adding dependencies to re-calculate width on changes

  return (
    <LinkStyled to="/" ref={linkRef}>
      {width <= 83 ? <img src={getLogoSrc().SmallLogo} alt="Logo" style={{ height: "50%" }} /> : <img src={getLogoSrc().ExpandedLogo} alt="Logo" style={{ height: "60%" }} />}
    </LinkStyled>
  );
};

export default Logo;
