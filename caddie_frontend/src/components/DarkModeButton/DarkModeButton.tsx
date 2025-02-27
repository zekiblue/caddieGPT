import { type FC, useEffect } from "react";

// import { SunIcon, MoonIcon } from "@chakra-ui/icons";
import {
  // Button,
  useColorMode } from "@chakra-ui/react";

const DarkModeButton: FC = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  useEffect(() => {
    if (colorMode === "light") {
      toggleColorMode();
    }
  }, [colorMode]);

  return (
    <></>
    // <Button w={"40px"} h={"40px"} onClick={toggleColorMode} className="custom-button">
    //   {colorMode === "light" ? <SunIcon fontSize={20} /> : <MoonIcon fontSize={17} />}
    // </Button>
  );
};

export default DarkModeButton;
