import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import LogoDark from "/src/assets/images/logos/logo.png";
import LogoDarkRTL from "/src/assets/images/logos/logo.png";
import LogoLight from "/src/assets/images/logos/logo.png";
import LogoLightRTL from "/src/assets/images/logos/logo.png";
import { styled } from "@mui/material";

const Logo = () => {
  const customizer = useSelector((state) => state.customizer);
  const LinkStyled = styled(Link)(() => ({
    height: customizer.TopbarHeight,
    width: customizer.isCollapse ? "40px" : "180px",
    overflow: "hidden",
    display: "block",
  }));

  const getLogoSrc = () => {
    if (customizer.activeDir === "ltr") {
      return customizer.activeMode === "dark" ? LogoLight : LogoDark;
    } else {
      return customizer.activeMode === "dark" ? LogoDarkRTL : LogoLightRTL;
    }
  };

  return (
    <LinkStyled
      to="/customer"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <img src={getLogoSrc()} alt="Logo" style={{ height: "100%" }} />
    </LinkStyled>
  );
};

export default Logo;
