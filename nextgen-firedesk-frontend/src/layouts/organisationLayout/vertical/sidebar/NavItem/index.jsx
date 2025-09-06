// import PropTypes from "prop-types";
// import { NavLink } from "react-router-dom";
// import {
//   ListItemIcon,
//   ListItem,
//   List,
//   styled,
//   ListItemText,
//   Chip,
//   useTheme,
//   Tooltip,
// } from "@mui/material";
// import { useSelector } from "react-redux";
// import { useTranslation } from "react-i18next";

// const NavItem = ({ item, level, pathDirect, onClick, hideMenu }) => {
//   const customizer = useSelector((state) => state.customizer);
//   const Icon = item.icon;
//   const theme = useTheme();
//   const { t } = useTranslation();
//   const itemIcon =
//     level > 1 ? (
//       <Icon stroke={1.5} size="1rem" />
//     ) : (
//       <Icon stroke={1.5} size="1.3rem" />
//     );

//   const ListItemStyled = styled(ListItem)(() => ({
//     whiteSpace: "nowrap",
//     marginBottom: "2px",
//     padding: "5px 10px",
//     borderRadius: `${customizer.borderRadius}px`,
//     backgroundColor: level > 1 ? "transparent !important" : "inherit",
//     color:
//       level > 1 && pathDirect === item.href
//         ? `${theme.palette.primary.main}!important`
//         : theme.palette.text.main,
//     paddingLeft: hideMenu ? "10px" : level > 2 ? `${level * 15}px` : "10px",
//     "&:hover": {
//       backgroundColor: theme.palette.primary.light,
//       color: theme.palette.primary.main,
//     },
//     "&.Mui-selected": {
//       color: "white",
//       backgroundColor: theme.palette.primary.main,
//       "&:hover": {
//         backgroundColor: theme.palette.primary.main,
//         color: "white",
//       },
//     },
//   }));

//   return (
//     <List component="li" disablePadding key={item.id}>
//       <Tooltip
//         title={customizer.isCollapse ? t(`${item.title}`) : ""} // Show title only when collapsed
//         placement="right" // Tooltip appears to the right of the icon
//       >
//         <ListItemStyled
//           button
//           component={item.external ? "a" : NavLink}
//           to={item.href}
//           href={item.external ? item.href : ""}
//           disabled={item.disabled}
//           selected={pathDirect === item.href}
//           target={item.external ? "_blank" : ""}
//           onClick={onClick}
//         >
//           <ListItemIcon
//             sx={{
//               minWidth: "36px",
//               p: "3px 0",
//               color:
//                 level > 1 && pathDirect === item.href
//                   ? `${theme.palette.primary.main}!important`
//                   : "inherit",
//             }}
//           >
//             {itemIcon}
//           </ListItemIcon>
//           <ListItemText>
//             {hideMenu ? "" : <>{t(`${item.title}`)}</>}
//             {/* <br /> */}
//             {/* {item.subtitle ? (
//               <Typography variant="caption">
//                 {hideMenu ? "" : item.subtitle}
//               </Typography>
//             ) : (
//               ""
//             )} */}
//           </ListItemText>

//           {!item.chip || hideMenu ? null : (
//             <Chip
//               color={item.chipColor}
//               variant={item.variant ? item.variant : "filled"}
//               size="small"
//               label={item.chip}
//             />
//           )}
//         </ListItemStyled>
//       </Tooltip>
//     </List>
//   );
// };

// NavItem.propTypes = {
//   item: PropTypes.object,
//   level: PropTypes.number,
//   pathDirect: PropTypes.any,
//   hideMenu: PropTypes.any,
//   onClick: PropTypes.func,
// };

// export default NavItem;

import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import {
  ListItemIcon,
  List,
  styled,
  ListItemText,
  Chip,
  useTheme,
  Tooltip,
  ListItemButton,
} from "@mui/material";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const NavItem = ({ item, level, pathDirect, onClick, hideMenu }) => {
  const customizer = useSelector((state) => state.customizer);
  const Icon = item.icon;
  const theme = useTheme();
  const { t } = useTranslation();

  const itemIcon =
    level > 1 ? (
      <Icon stroke={1.5} size="1rem" />
    ) : (
      <Icon stroke={1.2} size="1.3rem" />
    );

  const ListItemButtonStyled = styled(ListItemButton)(() => ({
    whiteSpace: "nowrap",
    marginBottom: "2px",
    padding: "5px 10px",
    borderRadius: `${customizer.borderRadius}px`,
    backgroundColor: level > 1 ? "transparent !important" : "inherit",
    color:
      level > 1 && pathDirect === item.href
        ? `${theme.palette.primary.main}!important`
        : theme.palette.text.main,
    paddingLeft: hideMenu ? "20px" : level > 2 ? `${level * 15}px` : "20px",
    "&:hover": {
      backgroundColor: theme.palette.primary.light,
      color: theme.palette.primary.main,
    },
    "&.Mui-selected": {
      color: "white",
      backgroundColor: theme.palette.primary.main,
      "&:hover": {
        backgroundColor: theme.palette.primary.main,
        color: "white",
      },
    },
  }));

  return (
    <List component="li" disablePadding key={item.id} sx={{ px: 1 }}>
      <Tooltip
        title={customizer.isCollapse ? t(`${item.title}`) : ""}
        placement="right"
      >
        <ListItemButtonStyled
          component={item.external ? "a" : NavLink}
          to={!item.external ? item.href : undefined}
          href={item.external ? item.href : undefined}
          disabled={item.disabled}
          selected={pathDirect === item.href}
          target={item.external ? "_blank" : undefined}
          onClick={onClick}
        >
          <ListItemIcon
            sx={{
              minWidth: "34px",
              p: "0",
              color:
                level > 1 && pathDirect === item.href
                  ? `${theme.palette.primary.main}!important`
                  : "inherit",
            }}
          >
            {itemIcon}
          </ListItemIcon>
          <ListItemText primaryTypographyProps={{ variant: "body2" }}>
            {hideMenu ? "" : <>{t(`${item.title}`)}</>}
          </ListItemText>
          {!item.chip || hideMenu ? null : (
            <Chip
              color={item.chipColor}
              variant={item.variant || "filled"}
              size="small"
              label={item.chip}
            />
          )}
        </ListItemButtonStyled>
      </Tooltip>
    </List>
  );
};

NavItem.propTypes = {
  item: PropTypes.object,
  level: PropTypes.number,
  pathDirect: PropTypes.any,
  hideMenu: PropTypes.any,
  onClick: PropTypes.func,
};

export default NavItem;